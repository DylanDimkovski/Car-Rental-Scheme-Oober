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
//	Login.js is the login page for the application where users can access 
//  their accounts and transactions.
//
//-----------------------------------------------------------------------------

import { Component } from 'react'
import { withRouter } from 'react-router'
import Services from '../../Network/Services.js'


const service = new Services()

class Login extends Component {
  
  constructor(props) {
    super(props)
    const user = props.user || {}
    this.state = {
      username: user.username || "",
      usernameReset: user.username || "",
      password: user.password || "",
      error: "",
      isForget: false,
    }

  }

  async componentDidMount() {
    if (localStorage.getItem('username')) {
      
      const result = await service.getUser(localStorage.getItem('username'))

      if (result.error) {
        this.setState({error: "could not automatically relogin please login manually"})
        localStorage.setItem('loggedIn', "");
        localStorage.setItem('username', "");

      } else {

        if (result[0].login) {

          localStorage.setItem('loggedIn', true);
          this.props.history.push("/about")

        } else {
          localStorage.setItem('loggedIn', "");
          localStorage.setItem('username', "");
        }
      }
    }
  }

  async loginUsers() {

    const username = this.state.username
    const password = this.state.password

    const result = await service.login(username, password)

    if (result.error) {
      this.setState({ error: result.message })
    } else {
      localStorage.setItem('loggedIn', true);
      localStorage.setItem('username', username);
      const user = await service.getUser(username)
      if(user[0].admin === 1){
        this.props.history.push("/admin")
        window.location.reload()
      }
      else{this.props.history.push("/profile")}
    }
  } 

  async forgetPassword() {
    const response = await service.passwordReset(this.state.usernameReset)

    if(response.error) {
      this.setState({ error: response.message })
    } else {
      this.setState({isForget: false})
      this.props.history.push("/login")
    }
  }

  switchTab(e) {
    e.preventDefault();
    this.setState({isForget: !this.state.isForget})
  }

  onEmailChange(event) {this.setState({username: event.target.value})}

  onEmailResetChange(event) {this.setState({usernameReset: event.target.value})}

  onPasswordChange(event) {this.setState({password: event.target.value})}
  
  renderLogin() {
    return (
      <div className="container py-3 mt-4 w-50 mb-5">
        <div className="mb-4">
          <h1>Login</h1>
        </div>
        <div>
          {this.state.error !== "" &&
            (<p className="bg-danger rounded p-2 text-white errorMsg">{this.state.error}</p>)
          }
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input type="email" className="form-control" aria-describedby="EmailHelp" pattern="^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$" value={this.state.username} onChange={this.onEmailChange.bind(this)}/>
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input type="password" className="form-control" aria-describedby="PasswordHelp" pattern="[A-Za-z0-9]+" title="Please enter 3 to 8 numbers or letters" value={this.state.password} onChange={this.onPasswordChange.bind(this)}/>
        </div>
        <button className="mt-4 btn btn-success" onClick={this.loginUsers.bind(this)}>Submit</button>
      <p className= "mt-4 link-primary text-decoration-underline forgotPassword" onClick={this.switchTab.bind(this)}>Forgot Password?</p>
    </div>
    )
  }

  renderForgot() {
    return (
      <div className="container py-3 mt-4 w-50 mb-5">
      <div className="mb-4">
        <h1>Forgot Password</h1>
        <p className="mt-4">Send an email to reset your password</p>
      </div>
        <div>
          {this.state.error !== "" &&
            (<p className="bg-danger rounded p-2 text-white errorMsg">{this.state.error}</p>)
          }
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input type="email" className="form-control" aria-describedby="EmailResetHelp" pattern="^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$" value={this.state.usernameReset} onChange={this.onEmailResetChange.bind(this)}/>
        </div>
        <button className="mt-4 btn btn-success forgotsend" onClick={this.forgetPassword.bind(this)}>Send</button>
        <p className="mt-4 link-primary text-decoration-underline" onClick={this.switchTab.bind(this)}>Already have an account?</p>
      </div>
    )
  }

  render() {
    return this.state.isForget ? 
      this.renderForgot() : 
      this.renderLogin()
  }
}

export default withRouter(Login)