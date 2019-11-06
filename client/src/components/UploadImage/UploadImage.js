import React, { Component } from "react";
import classes from "./UploadImage.module.css";
import Dropzone from "react-dropzone";
import image from "../../assets/images/UploadImage.png";
import S3Upload from "./S3/s3Upload";
import { withPreviews } from "./WithPreviews/WithPreviews";

class UploadImage extends Component {
<<<<<<< HEAD
    state = {
        selectedFiles: [],
        uploadFiles: false
    }
    fileSelectHandler = event => {
        console.log(event[0])
        this.setState({selectedFiles: [...this.state.selectedFiles, event[0]]})
    }
    fileUploadHandler = () => {
        this.setState({uploadFiles: true})
    }
    render(){
        return (
            <div>
                {this.state.selectedFiles.length === 0 && <Dropzone onDrop={this.fileSelectHandler}>
                    {({getRootProps, getInputProps}) => (
                        <div className={classes.innerBox} {...getRootProps()}>
                            <input className={classes.input} onChange={this.fileSelectHandler} {...getInputProps()} />
                            <img className={classes.image} src={image} alt="img"/>
                            <p className={classes.p1}>Drag a file here</p>
                            <p className={classes.p2}>OR</p>
                            <p className={classes.p3}>Select a file from your computer</p>
                        </div>
                    )}
                </Dropzone>}
                <div>
                    {this.state.selectedFiles.map((file, index) => (
                        <img data-aos="zoom-out" key={index} className={classes.img} src={file.preview} />
                    ))}
                    {this.state.selectedFiles.length > 0 && <button className={classes.upload} onClick={this.fileUploadHandler}>Upload</button>}

                </div>
                
                {this.state.uploadFiles && <S3Upload filename={this.state.selectedFiles[0].name} file={this.state.selectedFiles[0]} />}
             </div>
        
        )

    }
    
=======
  state = {
    selectedFiles: [],
    uploadFiles: false
  };
  fileSelectHandler = event => {
    this.setState({ selectedFiles: [...this.state.selectedFiles, event[0]] });
  };
  fileUploadHandler = () => {
    this.setState({ uploadFiles: true });
  };
  render() {
    return (
      <div>
        {this.state.selectedFiles.length === 0 && (
          <Dropzone onDrop={withPreviews(this.fileSelectHandler)}>
            {({ getRootProps, getInputProps }) => (
              <div className={classes.innerBox} {...getRootProps()}>
                <input
                  className={classes.input}
                  onChange={this.fileSelectHandler}
                  {...getInputProps()}
                />
                <img className={classes.image} src={image} alt="img" />
                <p className={classes.p1}>Drag a file here</p>
                <p className={classes.p2}>OR</p>
                <p className={classes.p3}>Select a file from your computer</p>
              </div>
            )}
          </Dropzone>
        )}
        <div>
          {this.state.selectedFiles.map((file, index) => (
            <img
              data-aos="zoom-out"
              key={index}
              className={classes.img}
              src={file.preview}
            />
          ))}
          {this.state.selectedFiles.length > 0 && (
            <button className={classes.upload} onClick={this.fileUploadHandler}>
              Upload
            </button>
          )}
        </div>
>>>>>>> fe5fd601f75263197f5ea774410cd014c405bebb

        {this.state.uploadFiles && (
          <S3Upload
            filename={this.state.selectedFiles[0].name}
            file={this.state.selectedFiles[0]}
          />
        )}
      </div>
    );
  }
}
export default UploadImage;
