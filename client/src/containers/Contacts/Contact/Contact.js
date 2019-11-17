import React, {Component} from 'react'
import classes from './Contact.module.css'
import Paper from '@material-ui/core/Paper'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import ContactForm from './ContactForm/ContactForm'
import {CREATE_CONTACT} from '../../../grqphql/mutations'
import { Mutation } from 'react-apollo';

class Contact extends Component {
    state = {
        contactFirstName: this.props.firstName,
        contactLastName: this.props.lastName,
        spouseFirstName: this.props.spouseFirstName,
        spouseLastName: this.props.spouseLastName,
        totalSales: this.props.totalSales,
        email: this.props.email,
        phoneHome: this.props.phoneHome,
        phoneMobile: this.props.phoneMobile,
        phoneOther: this.props.phoneOther,
        website: this.props.website,
        birthday: this.props.birthday,
        company: this.props.company,
        privateNote: this.props.privateNote,
        streetAddress: this.props.streetAddress,
        city: this.props.city,
        state: this.props.state,
        zip: this.props.zip,
        value: 1,
        showSaveChangesBtn: false,
        showChangesSavedMsg: false
    }
    formChangeHandler = event => {
        this.setState({[event.target.name]: event.target.value})
        this.setState({showSaveChangesBtn: true})
    }
    tabChangeHandler = (event, newValue) => {
        this.setState({value: newValue})
    }
    saveChangesHandler = (event) => {
        event.preventDefault()
        let contact = {
            firstName: this.state.contactFirstName,
            lastName: this.state.contactLastName,
            phone_number: this.state.phoneHome,
            email: this.state.email,
            mobile_phone: this.state.phoneMobile,
            spouseFirstName: this.state.spouseFirstName,
            spouseLastName: this.state.spouseLastName,
            other_phone: this.state.phoneOther,
            company: this.state.company,
            birthday: this.state.birthday,
            website: this.state.website,
            privacy_note: this.state.privateNote,
            street_address: this.state.streetAddress,
            city: this.state.city == "Unknown City" ? null: this.state.city,
            state: this.state.state,
            zip: this.state.zip
        }
        const {data} = this.props.client.mutate({
            mutation: CREATE_CONTACT,
            variables: {contactInput: contact}
        })
        .then(res => {
            this.setState({showChangesSavedMsg: true})
            this.setState({showSaveChangesBtn: false})
            console.log(res)
            contact = {
                ...{_id: res.data.createContact._id, 
                    fullName: res.data.createContact.firstName + " " + res.data.createContact.lastName
                }, 
                ...contact
            }
            this.props.saveNewContact(contact)
            {setTimeout(
                function(){
                  this.setState({showChangesSavedMsg: false})
                }.bind(this),8000)
            }

        })
    }
    render(){
        return (
            <div data-aos="slide-up" className={classes.addContact}>
                <button className={classes.goBack} onClick={this.props.showContactForm}>&#8249;</button>
                <div className={classes.profileInfo}>
                    <div>
                        <h3 className={classes.name}>{this.state.contactFirstName} {this.state.contactLastName}</h3>
                        <p className={classes.city}>{this.state.city}</p>  
                    </div>
                    <div>
                        <p>TOTAL SALES</p>
                        <h2 className={classes.totalSales}>${this.state.totalSales}</h2>
                    </div>
                </div>
                <Paper className={classes.paper}>
                    <Tabs
                        value={this.state.value}
                        onChange={this.tabChangeHandler}
                        indicatorColor="primary"
                        textColor="primary"
                        centered>
                        <Tab label="Potential Purchase" />
                        <Tab label="Contact Info" />
                    </Tabs>
                </Paper>
                {this.state.value === 1 && <ContactForm {...this.state} formChangeHandler={this.formChangeHandler}/>}
                {this.state.showSaveChangesBtn && 
                <button 
                    className={classes.saveChangesButton} 
                    data-aos="slide-down"
                    onClick={this.saveChangesHandler}>
                    SAVE CHANGES
                </button>}
                {this.state.showChangesSavedMsg && <button className={classes.changesSavedMsg}>Changes Saved</button>}
            </div>
           
            
        )
    }
}

export default Contact