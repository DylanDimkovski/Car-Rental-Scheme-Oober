//-----------------------------------------------------------------------------
// Copyright (C) 2021 by Oober Car Rentals, RMIT COSC2408 Programming Project 1
// 
// AUTHORS:
//  Arone Susau
//  Dylan Dimkovski
//  Aiden Bitic
//  Konathan Kogan
//  Marcello Belli
//
// DESCRIPTION:
//	Home.js is the home page of the application.
//
//-----------------------------------------------------------------------------

import { Component } from 'react';
import { withRouter } from 'react-router'
import { Link } from "react-router-dom";
import img from '../../Assets/landing.jpg'

var sectionStyle = {
    background: "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), transparent url(" + img + ")", 
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat'
};

class Home extends Component {
    render() {
        return(
            <div className="vh-100" style={ sectionStyle }>
                <div className="container text-end pt-5">
                    <h1 className="display-1 text-light">Oober</h1>
                    <h6 className="display-6 text-light pb-3">Maybe She's Born With It, Maybe It's Oober</h6>
                    {!localStorage.getItem('loggedIn') && <Link className="btn btn-outline-light btn-lg" type="button" to="/register">Sign Up Today</Link>}
                    {localStorage.getItem('loggedIn') && <Link className="btn btn-outline-light btn-lg" type="button" to="/search">Make A Booking</Link>}
                </div>
            </div>
        )
    }
}

export default withRouter(Home)