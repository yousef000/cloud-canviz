import React from 'react';
import classes from './Art.module.css';

const Art = (props) => (
    <div>
        <img data-aos="zoom-in" data-aos-delay="15000"  className={classes.img} src={props.artURL} alt="image"/>
        <div data-aos="zoom-in" className={classes.artInfo}>
            <p className={classes.username}>User Name</p>
            <p className={classes.artname}>Art Name, Date Created</p>
            <p className={classes.desc}>Description</p>
            <p className={classes.dimensions}>Dimensions</p>
        </div>
        
    </div>
)

export default Art;