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
//	App.js configures the main react app and sets up the routing for the
//  application.
//
//-----------------------------------------------------------------------------

import { Component } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import About    from './Components/About/About'
import Booking  from './Components/Booking/Booking'
import Contact  from './Components/Contact/Contact'
import Footer   from './Components/Footer/Footer'
import Header   from './Components/Header/Header'
import Home     from './Components/Home/Home'
import Login    from './Components/Login/Login'
import Profile  from './Components/Profile/Profile'
import Register from './Components/Register/Register'
import Reset    from './Components/Reset/Reset'
import Search   from './Components/Search/Search'
import Admin    from './Components/Admin/Admin'

import './App.css';

class App extends Component {

  render() {
    return (
      <div className="App bg-white">
        <BrowserRouter>
          <Header/>
            <Switch>
              <Route path="/about"    component={About}    />
              <Route path="/booking"  component={Booking}  />
              <Route path="/contact"  component={Contact}  />
              <Route path="/home"     component={Home}     />
              <Route path="/login"    component={Login}    />
              <Route path="/profile"  component={Profile}  />
              <Route path="/register" component={Register} />
              <Route path="/reset"    component={Reset}    />
              <Route path="/search"   component={Search}   />
              <Route path="/admin"   component={Admin}   />

              {/*default path*/}
              <Route path="/" component={Home} />
            </Switch>
          <Footer/>
        </BrowserRouter>
      </div>
    )
  }
}

export default App;
