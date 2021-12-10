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
//	Admin.js is the admin page for all admin functionalities including but not
//  limited to, viewing user bookings, locking accounts and creating vehicles.
//
//-----------------------------------------------------------------------------

import { Component } from 'react';
import { withRouter } from 'react-router'
import Services from '../../Network/Services.js'

const service = new Services()

const generateDay = d => {
    let day = d.day.split("/")
  
    return `${day[1]}-${day[0]}-${day[2]}`
}

const dateTimeCompare = (a, b) => {
    const x = new Date(`${generateDay(a)} ${a.start}`)
    const y = new Date(`${generateDay(b)} ${b.start}`)
  
    return x < y ? 1 : -1
}
  
  const isUpcoming = a => {  
    const x = new Date(`${generateDay(a)} ${a.start}`)
    const y = new Date()
  
    return x.getTime() > y.getTime()
}

class Admin extends Component {
  constructor(props) {
    super(props)
        
    this.state = {
      username: "",
      search: "",
      users: [],
      active: [],
      history: [],
      transactions: [],
      feedbacks: [],
      vehicles: [],
      error: ""
    }
  }
    
  async componentDidMount() {

    const username = localStorage.getItem('username');
    const user = await service.getUser(username)

    if(localStorage.getItem('loggedIn') && user[0].admin === 1){
      const users = await service.getAllUsers();
      const active = await service.getAllBookings()
      const history = await service.getAllHistory()
      const transactions = await service.getAllTransaction()
      const feedbacks = await service.getAllFeedback()
      const vehicles = await service.getAllVehicles()
      this.setState({
        username,
        users,
        active,
        history,
        transactions,
        feedbacks,
        vehicles,
        error: ""
        })
      } 
      else{
        this.props.history.push("/")
    }
  }

  async updateTables(){
    const users = await service.getAllUsers();
    const active = await service.getAllBookings()
    const history = await service.getAllHistory()
    const transactions = await service.getAllTransaction()
    const feedbacks = await service.getAllFeedback()
    const vehicles = await service.getAllVehicles()
      this.setState({
        users,
        active,
        history,
        transactions,
        feedbacks,
        vehicles,
        error: "",
      })      
  }

  updateSerach(e) { 
    this.setState({ search: e.target.value })
    this.updateTables() 
  }

  async lockAccount(name){
    const result = await service.lockAccount(name)      
    if(result.error){
      this.setState({ error: result.message })
    }else{
      this.updateTables()
    }
  }

  async unlockAccount(name){
    const result = await service.unlockAccount(name)
  
      if(result.error){
        this.setState({ error: result.message })
      }else{
        this.updateTables()
      }
  }
    
  activeTable() {
    return (
      <div className="mt-3">
        <h4>In Progress</h4>
        <table className="table table-striped mt-3">
        <thead>
          <tr>
            <th scope="col">Username</th>
            <th scope="col">Vehicle Registration</th>
            <th scope="col">Day</th>
            <th scope="col">Start Time</th>
            <th scope="col">End Time</th>
            <th scope="col">Status</th>
            <th scope="col">Late</th>
          </tr>
        </thead>
          <tbody>
            {this.state.active.filter(b => !isUpcoming(b) && b.username.toLowerCase().includes(`${this.state.search}`)).sort((a, b) => -dateTimeCompare(a, b)).map(booking => (
              <tr key={booking.bid}>
                <td>{booking.username}</td>
                <td>{booking.rego}</td>
                <td>{booking.day}</td>
                <td>{booking.start}</td>
                <td>{booking.end}</td>
                <td>{booking.status}</td>
                <td>{booking.late ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
          <h4 className="mt-5">Upcoming</h4>
          <table className="table table-striped mt-3">
            <thead>
              <tr>
                <th scope="col">Username</th>
                <th scope="col">Vehicle Registration</th>
                <th scope="col">Day</th>
                <th scope="col">Start Time</th>
                <th scope="col">End Time</th>
                <th scope="col">Status</th>
                <th scope="col">Late</th>
              </tr>
            </thead>
            <tbody>
              {this.state.active.filter(b => isUpcoming(b) && b.username.toLowerCase().includes(`${this.state.search}`)).sort((a, b) => -dateTimeCompare(a, b)).map(booking => (
                <tr key={booking.bid}>
                  <td>{booking.username}</td>
                  <td>{booking.rego}</td>
                  <td>{booking.day}</td>
                  <td>{booking.start}</td>
                  <td>{booking.end}</td>
                  <td>{booking.status}</td>
                  <td>{booking.late ? "Yes" : "No"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )
      }
    
    historyTable() {
        return (
          <table className="table table-striped mt-3">
            <thead>
              <tr>
                <th scope="col">Username</th>
                <th scope="col">Booking ID</th>
                <th scope="col">Vehicle Registration</th>
                <th scope="col">Day</th>
                <th scope="col">Start Time</th>
                <th scope="col">End Time</th>
                <th scope="col">Status</th>
                <th scope="col">Late</th>
              </tr>
            </thead>
            <tbody>
              {this.state.history.filter(b => b.username.toLowerCase().includes(`${this.state.search}`)).sort(dateTimeCompare).map(booking => (
                <tr key={booking.bid}>
                  <td>{booking.username}</td>
                  <td>{booking.bid}</td>
                  <td>{booking.rego}</td>
                  <td>{booking.day}</td>
                  <td>{booking.start}</td>
                  <td>{booking.end}</td>
                  <td>{booking.status}</td>
                  <td>{booking.late ? "Yes" : "No"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )
    }

    transactionTable() {
        return (
          <table className="table table-striped mt-3">
            <thead>
              <tr>
                <th scope="col">Username</th>
                <th scope="col">Transaction ID</th>
                <th scope="col">Booking ID</th>
                <th scope="col">Status</th>
                <th scope="col">Amount</th>
                <th scope="col">Late Fee</th>
                <th scope="col">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {this.state.transactions.filter(b => b.username.toLowerCase().includes(`${this.state.search}`)).sort((a, b) => a.timestamp > b.timestamp ? -1 : 1).map(t => (
                <tr key={t.tid}>
                  <td>{t.username}</td>
                  <td>{t.tid}</td>
                  <td>{t.bid}</td>
                  <td>{t.status}</td>
                  <td>${t.amount}</td>
                  <td>${t.late}</td>
                  <td>{new Date(t.timestamp).toLocaleTimeString() + " " + new Date(t.timestamp).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )
    }
    
    userTable(){
        return(
            <table className="table table-striped mt-3">
                <thead>
                    <tr>
                        <th scope="col">Username</th>
                        <th scope="col">Name</th>
                        <th scope="col">License Number</th>
                        <th scope="col"></th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.users.filter(b => b.username.toLowerCase().includes(`${this.state.search}`) && b.username !== "admin").map(user => (
                    <tr key={user.username}>
                        <td>{user.username}</td>
                        <td>{user.fname} {user.lname}</td>
                        <td>{user.license}</td>
                        {user.locked === 1 && <td><button key={user.username} onClick={()=>this.unlockAccount(user.username)} className="btn btn-success w-100">Unlock</button></td>}
                        {user.locked === 0 && <td><button key={user.username} onClick={()=>this.lockAccount(user.username)} className="btn btn-danger w-100">Lock</button></td>}
                    </tr>
                    ))}   
                </tbody>
            </table>
        )
    }

    feedbackTable(){
      return(
          <table className="table table-striped mt-3">
            <thead>
              <tr>
                <th scope="col">Feedback ID</th>
                <th scope="col">Booking ID</th>
                <th scope="col">Username</th>
                <th scope="col">Rating</th>
                <th scope="col">Info</th>
              </tr>
            </thead>
              <tbody>
                {this.state.feedbacks.filter(b => b.username.toLowerCase().includes(`${this.state.search}`) && b.username !== "admin").map(feedback => (
                <tr key={feedback.fid}>
                  <td>{feedback.fid}</td>
                  <td>{feedback.bid}</td>
                  <td>{feedback.username}</td>
                  <td>{feedback.rating}</td>
                  <td>{feedback.info}</td>
                </tr>
                  ))}   
              </tbody>
          </table>
      )
  }

  vehiclesTable(){
    return(
        <table className="table table-striped mt-3">
          <thead>
            <tr>
              <th scope="col">Registration</th>
              <th scope="col">Make</th>
              <th scope="col">Model</th>
              <th scope="col">Location</th>
              <th scope="col">Description</th>
            </tr>
          </thead>
          <tbody>
            {this.state.vehicles.map(vehicle => (
            <tr key={vehicle.rego}>
              <td>{vehicle.rego}</td>
              <td>{vehicle.make}</td>
              <td>{vehicle.model}</td>
              <td>{vehicle.location}</td>
              <td>{vehicle.description}</td>
            </tr>
              ))}   
          </tbody>
        </table>
    )
}

    async doForm(e) {
      e.preventDefault()

      const form = document.getElementById("form")
      const data = new FormData(form)

      const result = await service.uploadCar(data)

      if (result.error) {
        this.setState({ error: result.message })
      } else {
        this.props.history.push("/admin")
      }
    }

    displayError() {
      return (
        <div className="d-flex w-100">
          <p className="p-2 px-4 rounded-pill bg-danger text-white font-bold">
            {this.state.error}
          </p>
        </div>
      );
    }

    /* Car Registration Display */
    carRegistration(){
      return(
        <div className="d-flex flex-column py-3">
          
          <form method="POST" onSubmit={this.doForm.bind(this)} id="form">
            <div className="w-100 d-flex gap-5 mb-3">
              <div className="flex-grow-1 input-group">
                <span className="input-group-text" id="rego1">Registration</span>
                <input  id="rego" name="rego" required type="text" className="form-control" placeholder="ABC123" aria-label="Registration" aria-describedby="basic-addon1" />
              </div>

              <div className="flex-grow-1 input-group">
                <span className="input-group-text" id="make1">Make</span>
                <input id="make" name="make" required type="text" className="form-control" placeholder="Honda" aria-label="Make" aria-describedby="basic-addon1" />
              </div>
            </div> 

            <div className="w-100 d-flex gap-5 mb-3">
              <div className="flex-grow-1 input-group">
                <span className="input-group-text" id="model1">Model</span>
                <input  id="model" name="model" required type="text" className="form-control" placeholder="Civic" aria-label="Model" aria-describedby="basic-addon1" />
              </div>

              <div className="flex-grow-1 input-group">
                <span className="input-group-text" id="type1">Type</span>
                <input  id="type" name="type" required type="text" className="form-control" placeholder="Hatchback" aria-label="Model" aria-describedby="basic-addon1" />
              </div>
            </div>

            <div className="input-group mb-3">
              <span className="input-group-text" id="location1">Location</span>
              <input  id="location" name="location" required type="text" className="form-control"  placeholder="123 Batman Street, Melbourne VIC 1234" aria-label="Model" aria-describedby="basic-addon1" />
            </div>

            <div className="input-group">
              <span className="input-group-text" id="description1">Description</span>
              <textarea  id="description" name="description" required className="form-control" aria-describedby="basic-addon3" rows="3" maxLength="250" style={ {resize: "none"} } placeholder="Lorem Ipsum Dolor Sit Amet..."/>
            </div>
            
            <div className="my-3">
              <p className="fs-6">Vehicle Image</p>
              <input  id="images" required className="form-control" name="file" type="file" accept="image/jpeg"/>
            </div> 

            <div className="mb-3">
              <input type="submit" className="btn btn-success" value="Submit" />
            </div>    
          </form>         
        </div>
      )
    }

    render() {
        return(
          <div className="container py-3 mt-2 w-75 mb-4">
            <div className="border-bottom border-dark d-flex justify-content-between">
              <h1>Hello {this.state.username}</h1>
              <div className="input-group mb-3 w-25">
                  <input onChange={this.updateSerach.bind(this)} type="text" className="form-control mt-2" aria-describedby="basic-addon3" placeholder="Search By Username..."/>
              </div>
            </div>
            <div className="mt-3">
            { this.state.error ? this.displayError() : "" }
            <nav>
              <div className="nav nav-tabs" id="nav-tab" role="tablist">
                <button className="nav-link active" id="nav-home-tab" data-bs-toggle="tab" data-bs-target="#nav-home" type="button" role="tab" aria-controls="nav-home" aria-selected="true">Active Bookings</button>
                <button className="nav-link" id="nav-profile-tab" data-bs-toggle="tab" data-bs-target="#nav-profile" type="button" role="tab" aria-controls="nav-profile" aria-selected="false">History</button>
                <button className="nav-link" id="nav-contact-tab" data-bs-toggle="tab" data-bs-target="#nav-contact" type="button" role="tab" aria-controls="nav-contact" aria-selected="false">Transactions</button>
                <button className="nav-link" id="nav-contact-tab" data-bs-toggle="tab" data-bs-target="#nav-user" type="button" role="tab" aria-controls="nav-user" aria-selected="false">Users</button>
                <button className="nav-link" id="nav-contact-tab" data-bs-toggle="tab" data-bs-target="#nav-feedback" type="button" role="tab" aria-controls="nav-feedback" aria-selected="false">Feedback</button>
                <button className="nav-link" id="nav-contact-tab" data-bs-toggle="tab" data-bs-target="#nav-vehicle" type="button" role="tab" aria-controls="nav-vehicle" aria-selected="false">Vehicles</button>
                <button className="nav-link" id="nav-contact-tab" data-bs-toggle="tab" data-bs-target="#nav-reg" type="button" role="tab" aria-controls="nav-reg" aria-selected="false">Car Registration</button>
              </div>
            </nav>
            <div className="tab-content" id="nav-tabContent">
              <div className="tab-pane fade show active" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab">{this.activeTable()}</div>
              <div className="tab-pane fade" id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab">{this.historyTable()}</div>
              <div className="tab-pane fade" id="nav-contact" role="tabpanel" aria-labelledby="nav-contact-tab">{this.transactionTable()}</div>
              <div className="tab-pane fade" id="nav-user" role="tabpanel" aria-labelledby="nav-user-tab">{this.userTable()}</div>
              <div className="tab-pane fade" id="nav-feedback" role="tabpanel" aria-labelledby="nav-feedback-tab">{this.feedbackTable()}</div>
              <div className="tab-pane fade" id="nav-vehicle" role="tabpanel" aria-labelledby="nav-vehicle-tab">{this.vehiclesTable()}</div>
              <div className="tab-pane fade" id="nav-reg" role="tabpanel" aria-labelledby="nav-reg-tab"><h1>{this.carRegistration()}</h1></div>
            </div>        
          </div>
        </div>
        )
    }
}

export default withRouter(Admin)