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
//	Header.js is the header component of the application shared across pages.
//
//-----------------------------------------------------------------------------

import { Component } from 'react';
import { Link } from "react-router-dom";
import { withRouter } from 'react-router'
import logo from "../../Assets/oober.png";
import Services from '../../Network/Services';
const service = new Services()
class Header extends Component {
    constructor() {
        super();
        this.state = {
            loggedIn: false,
            is_admin: 0,
        };
    }

    async Loggingout() {
        await service.logout(localStorage.getItem('username'))
        localStorage.setItem('loggedIn', "");
        localStorage.setItem('username', "");
        const is_admin = 0
        this.setState({
            is_admin
        })
        this.props.history.push("/")
    }

    async componentDidMount(){
        this._ismounted = true;
        const username = localStorage.getItem('username');
        if(!username){
            const is_admin = 0
            this.setState({
                is_admin
            })
        }
        else{
            const user = await service.getUser(username)
            const is_admin = user[0].admin
            this.setState({
                is_admin
            })
        }
    }
        
    render() {
        return (
            //NavBar Component
            <nav className="navbar navbar-expand-lg navbar-dark" style={{backgroundColor: 'black'}}>
                <div className="container-fluid">
    
                    {/* Logo */}
                    <a className="navbar-brand" aria-current="page" href="/">
                        <img src={logo} alt="" width="160" height="105"></img>
                    </a>
    
                    {/* Main Links */}
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
    
                    <div className="collapse navbar-collapse justify-content-end" id="navbarTogglerDemo02">
                        <ul className="navbar-nav gap-3 p-3">
                            {this.state.is_admin === 0 && <li className="nav-item"><Link className="nav-link" type="button" to="/">Home</Link></li>}
                            {this.state.is_admin === 0 && <li className="nav-item"><Link className="nav-link" type="button" to="/about">About Us</Link></li>}
                            {this.state.is_admin === 0 && <li className="nav-item"><Link className="nav-link" type="button" to="/search">Make A Booking</Link></li>}
                            {this.state.is_admin === 0 && <li className="nav-item"><Link className="nav-link" type="button" to="/contact">Contact</Link></li>}
                            
                            {/* USER LOGGED IN BUTTONS */}
                            {localStorage.getItem('loggedIn') && this.state.is_admin === 0 && <li className="nav-item"><Link className="btn btn-outline-success" type="button" to="/profile">Profile</Link></li>}
                            {localStorage.getItem('loggedIn') && this.state.is_admin === 0 && <li className="nav-item"><button className="btn btn-outline-secondary" type="button" to="/logout" onClick={this.Loggingout.bind(this)}>Logout</button></li>}

                            {/* USER LOGGED OUT BUTTONS */}
                            {!localStorage.getItem('loggedIn') && <li className="nav-item"><Link className="btn btn-outline-success" type="button" to="/login">Login</Link></li>}
                            {!localStorage.getItem('loggedIn') && <li className="nav-item"><Link className="btn btn-outline-secondary" type="button" to="/register">Register</Link></li>}

                            {/* ADMIN BUTTONS */}
                            {localStorage.getItem('loggedIn') && this.state.is_admin === 1 && <li className="nav-item"><Link className="btn btn-outline-success" type="button" to="/admin">Admin</Link></li>}
                            {localStorage.getItem('loggedIn') && this.state.is_admin === 1 && <li className="nav-item"><button className="btn btn-outline-secondary" type="button" to="/logout" onClick={this.Loggingout.bind(this)}>Logout</button></li>}
                        </ul>
                    </div>
                </div>
            </nav>
        )
    }
  }
  export default withRouter(Header);
