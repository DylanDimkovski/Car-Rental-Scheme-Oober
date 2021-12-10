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
//	Reset.js is the reset component page for user password resets.
//
//-----------------------------------------------------------------------------

import { Component } from 'react'
import { withRouter } from 'react-router'
import Services from '../../Network/Services.js'


const service = new Services()

class Reset extends Component {
  constructor(props) {
    super(props)
    this.state = {
      username: "",
      password: "",
      cPassword: "",
      error: "",
      unique: "",
    }
    this.resetPassword.bind(this)
  }
  async resetPassword(){
    const unique = new URLSearchParams(this.props.location.search).get('uid')
    const username = new URLSearchParams(this.props.location.search).get('uname')
    this.setState({username: username})
    this.setState({unique: unique})
    if(this.state.cPassword === this.state.password){
      const result = await service.passwordUpdate(username, this.state.password, unique)
      if(result.error){
        this.setState({ error: result.message })
      }else{
        this.props.history.push("/login")
      }
    }else{
      this.setState({ error: "Passwords do not match!" })
    }
  }
  onEmailChange(event) {this.setState({username: event.target.value})}

  onCPasswordChange(event) {this.setState({cPassword: event.target.value})}

  onPasswordChange(event) {this.setState({password: event.target.value})}

  onSubmit(event) {event.preventDefault()}

  render() {
    return(
      <div className="container py-3 w-50 mb-5">
        <div className="mb-4">
          <h1>Reset Password</h1>
          </div>
            <form onSubmit={this.onSubmit.bind(this)}>
              <div>
                {this.state.error !== "" &&
                  (<p className="bg-danger rounded p-2 text-white errorMsg">{this.state.error}</p>)
                }
              </div>
              <div className="mb-3">
                <label className="form-label">Password</label>
                <input type="password" className="form-control" aria-describedby="PasswordHelp" pattern="[A-Za-z0-9]+" title="Please enter 3 to 8 numbers or letters" value={this.state.password} onChange={this.onPasswordChange.bind(this)}/>
              </div>
              <div className="mb-3">
                <label className="form-label">Confirm Password</label>
                <input type="password" className="form-control" aria-describedby="PasswordHelp" pattern="[A-Za-z0-9]+" title="Please enter 3 to 8 numbers or letters" value={this.state.cPassword} onChange={this.onCPasswordChange.bind(this)}/>
              </div>
              <button className="mt-4 btn btn-success" onClick={this.resetPassword.bind(this)}>Submit</button>
            </form>
            <br/><br/><br/>
        </div>
    )
  }
}

export default withRouter(Reset)