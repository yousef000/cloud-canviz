const { DataSource } = require("apollo-datasource");
const User = require("../models/user");
const ArtWork = require("../models/artWork");
const { getColors } = require("../googleVision/googleVision");

class Art extends DataSource {
  constructor() {
    super();
  }
  // initialize context
  initialize(config) {
    this.context = config.context;
  }
  //getAllArt
  //returns all the art in a users library
  getAllArt(offset, limit) {
    return ArtWork.find()
      .skip(offset)
      .limit(limit)
      .sort("-createdAt")
      .populate("creator")
      .then(artworks => {
        return artworks.map(artwork => {
          return { ...artwork._doc };
        });
      })
      .catch(err => {
        throw err;
      });
  }

  // createArt
  // saves art data
  // adds userId of creator to creator field
  async createArt(args) {
    const user = this.context.user._id;

    // get colors from google cloud vision
    return await getColors(args.artInput.img.url)
      .then(colors => {
        console.log("colors in await", colors);

        // set values for primary, secondary and tertiary colors with response form GCV
        const art = new ArtWork({
          ...args.artInput,
          creator: user,
          primaryColor: colors[0],
          secondaryColor: colors[1],
          tertiaryColor: colors[2],
          colors: colors
        });
        let createdArt;
        return art
          .save()
          .then(result => {
            // Farris I added these console logs so that you could see how to access the current user from the context
            // to get the id you would just need to do this.context.user._id and use that id to find the user by id
            // with User.findById( ) and pass the id in, then you can push the id of result._id onto the users creaetedArt array
            console.log("data returned from createArt", result);

            console.log("user from context", user);

            {
              /* save result to return it later */
            }
            createdArt = { ...result._doc };
            {
              /* creator id is accessed from Art
         Finds the user and pushes the new artwork in createdArtWork array*/
            }
            return User.findById(createdArt.creator._id);
          })
          .then(user => {
            console.log(user);
            user.createdArtWorks.push(art._id);
            return user.save();
          })
          .then(res => {
            return createdArt;
          })
          .catch(err => {
            console.log(err);
            throw err;
          });
      })
      .catch(err => {
        console.log(err);
        throw err;
      });
  }

  // likeArt() -> uses the artID argument to find an artwork object
  //            then pushes the id of the current user onto the likers array of art object
  //            then pushes the ID of the art object onto the users likedArtworks array
  //            then saves and returns the liked artwork
  // inputs: artId (the ID of the artwork the current user wants to save/like)
  // output: the art object the user liked

  // Emerson: changed like art so that the same user can't like an art multiple times
  // if the users id is already the array it will not push
  likeArt(args) {
    const usrID = this.context.user._id;
    return User.findByIdAndUpdate(usrID, {
      $addToSet: { likedArtWorks: args.artId } // $addToSet only pushes to array if entry is unique (isn't already in the array)
    })
      .then(user => {
        return ArtWork.findByIdAndUpdate(args.artId, {
          $addToSet: { likers: user._id }
        });
      })
      .catch(err => {
        console.log(err);
        throw err;
      });
  }
  // Cameron: here is the old function for comparison. You didn't do anything wrong
  //          I just forgot to tell you that the like should only add id if the user has not liked before.
  //          I am leaving the old function so you can compare for next time you implement.

  // likeArt(args) {
  //   const usr = this.context.user._id;
  //   return User.findById(usr)
  //     .exec()
  //     .then(user => {
  //       user.likedArtWorks.push(args.artId);
  //       return user.save();
  //     })
  //     .then(user => {
  //       return ArtWork.findById(args.artId)
  //         .exec()
  //         .then(Art => {
  //           Art.likers.push(user._id);
  //           return Art.save();
  //         });
  //     })
  //     .catch(err => {
  //       console.log(err);
  //       throw err;
  //     });
  // }

  // removeArt() -> uses the artID argument to find an artwork object in the users Created artwork
  //            then filters the id of the art from the created users array
  //            then finds the Artworks likers array using the artID argument and iterates through the loop as it finds
  //            users that liked said artwork
  //            then filters the artwork from the users likedArtWorks array as it iterates through the loop
  // inputs: artId (the ID of the artwork the current user wants to save/like)
  // output: the art object the user liked
  removeArt(artId) {
    const usr = this.context.user._id;
    // 1. Find the user
    return User.findById(usr)
      .exec()
      .then(user => {
        // 2) Delete the artwork from the users createdArtworks list
        user.createdArtWorks = user.createdArtWorks.filter(function(value) {
          return value != artId;
        });
        user.save();
      })
      .then(user => {
        //3) Find all users in the arts likers array and delete this arts id from the array
        return ArtWork.findById(artId)
          .exec()
          .then(art => {
            const len = art.likers.length;
            var i = 0;
            for (; i < len; ) {
              User.findById(art.likers[i])
                .exec()
                .then(user => {
                  user.likedArtWorks = user.likedArtWorks.filter(function(
                    value
                  ) {
                    return value != artId;
                  });
                  user.save();
                });
            }
          });
      })
      .catch(err => {
        console.log(err);
        throw err;
      });
  }
  // TODO removeArt to delete artwork
  // Needs to:
  // 1. Find the user
  // 2. Delete the artwork from the users createdArtworks list
  // 3. Find all users in the arts likers array and delete this arts id from the array
  // 4. Do the same for followers and any other references to this art in other collections
  //  https://stackoverflow.com/questions/46911393/mongoose-remove-document-with-references
  // 4. Find the art by the id given and delete

  // removeArt(artId){
  //   const usr = context.usr._id;
  //   return User.findById(usr)
  //     .exec()
  //     .then(user => {
  //       user.likedArtWorks.pop(artId);
  //       user.createdArtWorks.pop(artId);
  //       return User.save();

  //     })

  // }
}

module.exports = Art;
