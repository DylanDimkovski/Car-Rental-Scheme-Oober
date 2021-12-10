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
//	Contact.js is the contact page for the website.
//
//-----------------------------------------------------------------------------

import { Component } from 'react';
import { withRouter } from 'react-router'


class Contact extends Component {
    render() {
        return(
            <div className="container pt-3 mb-5">
                <h1 className="text-center border-bottom border-dark">Contact Us</h1>
                <div className="d-flex flex-row pt-3">
                    <div className="container">
                        <div className="mb-3 pt-3">
                            <input type="text" className="form-control" placeholder="Name" />
                        </div>
                        <div className="mb-3">
                            <input type="text" className="form-control" placeholder="Address" />
                        </div>
                        <div className="mb-3">
                            <input type="text" className="form-control" pattern="[0-9]{4}" placeholder="Postcode" />
                        </div>
                        <div className="mb-3">
                            <input type="tel" className="form-control" placeholder="Phone" />
                        </div>
                        <div className="mb-3">
                            <input type="email" className="form-control" placeholder="Email" />
                        </div>
                        <div className="mb-3">
                            <textarea className="form-control" placeholder="Extra Details" rows="3" />
                        </div>
                        <button className="btn btn-success view w-100">Submit Ticket</button>
                    </div>
                    <div className="container">
                        <div className="mb-3 pt-3">
                            <h4>Phone:</h4>
                            <h4 className="lead">1234 567 891</h4>
                        </div>
                        <div className="mb-3 pt-3">
                            <h4>Email:</h4>
                            <h4 className="lead">contactus@oober.com</h4>
                        </div>
                        <div className="mb-3 pt-3">
                            <h4>Address:</h4>
                            <h4 className="lead">123 Address Street, State</h4>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Contact)