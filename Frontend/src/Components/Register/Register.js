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
//	Register.js for new user registration and account creation.
//
//-----------------------------------------------------------------------------

import { Component } from 'react'
import { withRouter } from 'react-router'
import User from '../../Network/Model/User.js'
import Services from '../../Network/Services.js'

const service = new Services()

class Register extends Component {
  constructor(props) {
    super(props)

    const user = props.user || {}

    this.state = {
      fname: user.fname || "",
      lname: user.lname || "",
      username: user.username || "",
      password: user.password || "",
      cPassword: user.cPassword || "",
      license: user.license || "",
      error: "",
    }
  }

  async registerUsers() {
    const fname = this.state.fname
    const lname = this.state.lname
    const username = this.state.username
    const password = this.state.password
    const license = this.state.license

    const data = new User({ fname, lname, username, password, license })
    const match = this.state.password === this.state.cPassword

    if(match){
      const result = await service.register(data)

      if(result.error) {
        this.setState({ error: result.message })
      } else {
        this.props.history.push("/login")
      }
    }
    else{
      this.setState({ error: "Passwords do not match!" })
    }
  }

  onFnameChange(event) {this.setState({fname: event.target.value})}

  onLnameChange(event) {this.setState({lname: event.target.value})}

  onEmailChange(event) {this.setState({username: event.target.value})}

  onPasswordChange(event) {this.setState({password: event.target.value})}

  onCPasswordChange(event) {this.setState({cPassword: event.target.value})}
  
  onLiscenceChange(event) {this.setState({license: event.target.value})}

  onSubmit(event) {event.preventDefault()}

  render() {
    return (
      <div className="container mt-3 py-3 w-50 mb-5">
        <div className="mb-4">
          <h1>Register</h1>
        </div>
        <form onSubmit={this.onSubmit.bind(this)}>
          <div>
            {this.state.error !== "" &&
              (<p className="bg-danger rounded p-2 text-white errorMsg">{this.state.error}</p>)
            }
          </div>
          <div className="mb-3">
            <label className="form-label">First Name</label>
            <input type="text" className="form-control" aria-describedby="FirstNameHelp" pattern="[a-zA-Z]+" title="Please enter english letters" value={this.state.fname} onChange={this.onFnameChange.bind(this)}/>
          </div>

          <div className="mb-3">
            <label className="form-label">Last Name</label>
            <input type="text" className="form-control" aria-describedby="LastNameHelp" pattern="[a-zA-Z]+" title="Please enter english letters" value={this.state.lname} onChange={this.onLnameChange.bind(this)}/>
          </div>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input type="email" className="form-control" aria-describedby="EmailHelp" pattern="^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$" value={this.state.username} onChange={this.onEmailChange.bind(this)}/>
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input type="password" className="form-control" aria-describedby="PasswordHelp" pattern="[A-Za-z0-9]+" title="Please enter 3 to 8 numbers or letters" value={this.state.password} onChange={this.onPasswordChange.bind(this)}/>
          </div>
          <div className="mb-3">
            <label className="form-label">Confirm Password</label>
            <input type="password" className="form-control" aria-describedby="PasswordHelp" pattern="[A-Za-z0-9]+" title="Please enter 3 to 8 numbers or letters" value={this.state.cPassword} onChange={this.onCPasswordChange.bind(this)}/>
          </div>
          <div className="mb-3">
            <label className="form-label">License Number</label>
            <input type="text" className="form-control" aria-describedby="LiscenceNumHelp" pattern="[0-9]+" value={this.state.license} onChange={this.onLiscenceChange.bind(this)}/>
          </div>

        <button className="mt-4 btn btn-success" onClick={this.registerUsers.bind(this)}>Submit</button>
        </form>
      </div>
    )
  }
}
export default withRouter(Register)