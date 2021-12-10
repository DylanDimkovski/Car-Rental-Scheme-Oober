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
//	Footer.js is the footer component of the application shared across pages.
//
//-----------------------------------------------------------------------------

import { Component } from 'react';
import { withRouter } from 'react-router'
import { Link } from "react-router-dom";

class Footer extends Component {
    render() {
        return(
            <div className="footer">
                <footer className="text-center text-white bg-dark">
                    <div className="container">
                        <section>
                            <div className="row text-center d-flex justify-content-center pt-4">
                                <div className="col-md-2">
                                    <h6 className="text-uppercase font-weight-bold">
                                        <Link className="nav-link text-decoration-underline text-white" type="button" to="/">Home</Link>
                                    </h6>
                                </div>

                                <div className="col-md-2">
                                    <h6 className="text-uppercase font-weight-bold">
                                        <Link className="nav-link text-decoration-underline text-white" type="button" to="/about">About Us</Link>
                                    </h6>
                                </div>

                                <div className="col-md-2">
                                    <h6 className="text-uppercase font-weight-bold">
                                        <Link className="nav-link text-decoration-underline text-white" type="button" to="/search">Make A Booking</Link>
                                    </h6>
                                </div>

                                <div className="col-md-2">
                                    <h6 className="text-uppercase font-weight-bold">
                                        <Link className="nav-link text-decoration-underline text-white" type="button" to="/contact">Contact</Link>
                                    </h6>
                                </div>
                            </div>
                        </section>

                        <hr/>

                        <section>
                            <div className="row d-flex justify-content-center">
                                <div className="col-lg-8">
                                    <p>
                                    We always strive to bring you the best possible service avaliable! if you'd wish to know more about our service. Get in touch with us via the contact page. Reza Numba 1
                                    </p>
                                </div>
                            </div>
                        </section>
                    </div>
                    <div className="text-center p-3">
                        © 2020 Copyright: Oober
                    </div>
                </footer>
            </div>
        )
    }
}

export default withRouter(Footer)