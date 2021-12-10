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
//	Profile.js is the user profile page where users can view their personal
//  information, booking and transaction history.
//
//-----------------------------------------------------------------------------

import { Component } from 'react'
import { withRouter } from 'react-router'
import Services from '../../Network/Services.js'

import Feedback from '../Feedback/Feedback'

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

const capitalize = (word) => {
  return word.charAt(0).toUpperCase() + word.slice(1)
}

class Profile extends Component {
  
  constructor(props) {
    super(props)
    
    this.state = {
      fname: "",
      lname: "",
      license: "",
      username: "",

      updateFname: "",
      updateLname: "",
      updateLicense: "",
      
      isEditing: false,

      active: [],
      history: [],
      transactions: [],
      extendTime: []
    }
  }

  async componentDidMount() {
    
    this._ismounted = true;

    if (!localStorage.getItem('loggedIn')) {
      this.props.history.push("/")
    } else {
      const username = localStorage.getItem('username')
      const user = await service.getUser(username)
      
      const active       = await service.getBookingByUsername(username)
      const history      = await service.getHistoryByUser(username)
      const transactions = await service.getTransactionByUser(username)

      var cancelModal = new window.bootstrap.Modal(document.getElementById('cancelModal'), {
        keyboard: false
      })

      var extendModal = new window.bootstrap.Modal(document.getElementById('extendModal'), {
        keyboard: false
      })

      this.setState({
        fname: user[0].fname,
        lname: user[0].lname,
        license: user[0].license,

        updateFname: user[0].fname,
        updateLname: user[0].lname,
        updateLicense: user[0].license,

        username: username,
        cancelBID: -1,

        active,
        history,
        transactions,
        cancelModal,
        extendModal,
        showFeedback: false
      })
    }

    this.complete = (value) => {
      this.setState({showFeedback: value});
    }
  }

  async updateTables(bid) {
    const username     = localStorage.getItem('username')
    const active       = await service.getBookingByUsername(username)
    const history      = await service.getHistoryByUser(username)
    const transactions = await service.getTransactionByUser(username)

    this.setState({
      active,
      history,
      transactions,
      cancelBID: 0,
      extendBID: 0,
      extendTime: [],
      end: "",
      feedback: bid ?? 0,
      showFeedback: bid !== undefined
    })
  }

  async returnBooking(bid) {
    const result = await service.returnBooking(bid)

    if (!result.error) {
      this.updateTables(bid)
    } else {
      console.dir(result)
    }
  }

  async openCancelModal(bid) {
    
    this.setState({
      cancelBID: bid
    })

    this.state.cancelModal.toggle()
  }

  async cancelBooking() {
    const result = await service.cancelBooking(this.state.cancelBID)

    if (result.error) {
      console.dir(result)
    } else {
      this.updateTables()
      this.state.cancelModal.toggle()
    }
  }

  async openExtendModal(bid, rego, day, start) {
    const data = await service.getBookingEndTime(rego, day, start)
    
    this.setState({
      extendTime: data,
      extendBID: bid
    })

    this.state.extendModal.toggle()
  }

  async extendBooking() {
    const result = await service.extendBooking(this.state.extendBID, this.state.end)

    if (result.error) {
      console.dir(result)
    } else {
      this.updateTables()
      this.state.extendModal.toggle()
    }
  }

  async onEndTimeChange(event) {
    this.setState({
      end: event.target.value
    })
  }

  activeTable() {
    return (
      <div className="mt-3">
        <h4>In Progress</h4>
        <table className="table table-striped mt-3">
        <thead>
          <tr>
            <th scope="col">Vehicle Registration</th>
            <th scope="col">Day</th>
            <th scope="col">Start Time</th>
            <th scope="col">End Time</th>
            <th scope="col">Status</th>
            <th scope="col">Late</th>
            <th scope="col"></th>
            <th scope="col"></th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          {this.state.active.filter(b => !isUpcoming(b)).sort((a, b) => -dateTimeCompare(a, b)).map(booking => (
            <tr key={booking.bid}>
              <td>{booking.rego}</td>
              <td>{booking.day}</td>
              <td>{booking.start}</td>
              <td>{booking.end}</td>
              <td>{booking.status}</td>
              <td>{booking.late ? "Yes" : "No"}</td>
              <td><button className="btn btn-sm btn-success" onClick={this.returnBooking.bind(this, booking.bid)}>Complete</button></td>
              <td><button className="btn btn-sm btn-primary" onClick={this.openExtendModal.bind(this, booking.bid, booking.rego, booking.day, booking.end)}>Extend</button></td>
              <td><button className="btn btn-sm btn-danger" onClick={this.openCancelModal.bind(this, booking.bid)}>Cancel</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <h4 className="mt-5">Upcoming</h4>
      <table className="table table-striped mt-3">
        <thead>
          <tr>
            <th scope="col">Vehicle Registration</th>
            <th scope="col">Day</th>
            <th scope="col">Start Time</th>
            <th scope="col">End Time</th>
            <th scope="col">Status</th>
            <th scope="col">Late</th>
            <th scope="col"></th>
            <th scope="col"></th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          {this.state.active.filter(isUpcoming).sort((a, b) => -dateTimeCompare(a, b)).map(booking => (
            <tr key={booking.bid}>
              <td>{booking.rego}</td>
              <td>{booking.day}</td>
              <td>{booking.start}</td>
              <td>{booking.end}</td>
              <td>{booking.status}</td>
              <td>{booking.late ? "Yes" : "No"}</td>
              <td></td>
              <td><button className="btn btn-sm btn-primary"onClick={this.openExtendModal.bind(this, booking.bid, booking.rego, booking.day, booking.end)}>Extend</button></td>
              <td><button className="btn btn-sm btn-danger" onClick={this.openCancelModal.bind(this, booking.bid)}>Cancel</button></td>
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
          {this.state.history.sort(dateTimeCompare).map(booking => (
            <tr key={booking.bid}>
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
            <th scope="col">Transaction ID</th>
            <th scope="col">Booking ID</th>
            <th scope="col">Status</th>
            <th scope="col">Amount</th>
            <th scope="col">Late Fee</th>
            <th scope="col">Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {this.state.transactions.sort((a, b) => a.timestamp > b.timestamp ? -1 : 1).map(t => (
            <tr key={t.tid}>
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

  generateTimeOptions(times) {
    return times.map(t => (<option key={t}>{t}</option>))
  }

  onFnameChange(event) {
    this.setState({
      updateFname: event.target.value
    })
  }

  onLnameChange(event) {
    this.setState({
      updateLname: event.target.value
    })
  }

  onLicenseChange(event) {
    this.setState({
      updateLicense: event.target.value
    })
  }
  
  async update() {
    if (this.state.updateFname && this.state.updateLname && this.state.updateLicense) {

      const result = await service.updateUser({ 
        username: this.state.username, 
        fname: this.state.updateFname || this.state.fname,
        lname: this.state.updateLname || this.state.lname,
        license: this.state.updateLicense || this.state.license,
      })

      if (!result.error) {
        this.setState({
          
          fname: result.fname,
          lname: result.lname,
          license: result.license,

          updateFname: result.fname,
          updateLname: result.lname,
          updateLicense: result.license,

          isEditing: false
        })
      }
    }
  }

  editBox() {
    return (
      <div className="mt-3 d-flex gap-3">
        <input className="form-control" onChange={this.onFnameChange.bind(this)} type="text" placeholder="First name.." aria-label="" value={this.state.updateFname} />
        <input className="form-control" onChange={this.onLnameChange.bind(this)} type="text" placeholder="Last name.." aria-label="" value={this.state.updateLname} />
        <input className="form-control" onChange={this.onLicenseChange.bind(this)} type="text" placeholder="License" aria-label="" value={this.state.updateLicense} />
        <div className="d-flex gap-1">
          <button className="btn btn-success" onClick={this.update.bind(this)}>Update</button>
          <button className="btn btn-outline-secondary" onClick={this.edit.bind(this)}>Cancel</button>
        </div>
      </div>
    )
  }

  detailsBox() {
    return (
      <div className="mt-3 d-flex gap-5">
        <p>{capitalize(this.state.fname)} {capitalize(this.state.lname)}</p>
        <p>License: {this.state.license}</p>
      </div>
    )
  }

  edit() {
    this.setState({
      isEditing: !this.state.isEditing
    })
  }

  render() {
    return (
        <div className="container py-3 mt-4 w-75 mb-5">
            <div className="border-bottom border-dark d-flex justify-content-between">
              <h1>Hello {capitalize(this.state.fname)}</h1>
              <div>
                {!this.state.isEditing ? <button onClick={this.edit.bind(this)} className="btn btn-outline-primary">Edit</button> : ""}
              </div>
            </div>
            <div>
              <div>
                {this.state.isEditing ? this.editBox() : this.detailsBox()}
              </div>
            </div>
            <div className="mt-5">
              <nav>
                <div className="nav nav-tabs" id="nav-tab" role="tablist">
                  <button className="nav-link active" id="nav-home-tab" data-bs-toggle="tab" data-bs-target="#nav-home" type="button" role="tab" aria-controls="nav-home" aria-selected="true">Active Bookings</button>
                  <button className="nav-link" id="nav-profile-tab" data-bs-toggle="tab" data-bs-target="#nav-profile" type="button" role="tab" aria-controls="nav-profile" aria-selected="false">History</button>
                  <button className="nav-link" id="nav-contact-tab" data-bs-toggle="tab" data-bs-target="#nav-contact" type="button" role="tab" aria-controls="nav-contact" aria-selected="false">Transactions</button>
                </div>
              </nav>
              <div className="tab-content" id="nav-tabContent">
                <div className="tab-pane fade show active" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab">{this.activeTable()}</div>
                <div className="tab-pane fade" id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab">{this.historyTable()}</div>
                <div className="tab-pane fade" id="nav-contact" role="tabpanel" aria-labelledby="nav-contact-tab">{this.transactionTable()}</div>
              </div>        
            </div>

            {/* MODAL */}
            
            {this.state.showFeedback ? <Feedback bid={this.state.feedback} complete={this.complete} /> : ""}

            <div className="modal" id="cancelModal" tabIndex="-1">
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Cancel Booking</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div className="modal-body">
                    <p>Are you sure you want to cancel this booking?</p>
                    <p className="fw-lighter">Late booking cancellations are subject to full booking cost.</p>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Back</button>
                    <button type="button" className="btn btn-danger" onClick={this.cancelBooking.bind(this)}>Confirm</button>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal" id="extendModal" tabIndex="-1">
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Extend Booking</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div className="modal-body">
                    <select onChange={this.onEndTimeChange.bind(this)} disabled={(this.state.extendTime.length > 0)? "" : "disabled"} className="form-select">
                      <option>Please Select End Time</option>
                      {this.generateTimeOptions(this.state.extendTime)}
                    </select>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Back</button>
                    <button type="button" className="btn btn-success" onClick={this.extendBooking.bind(this)}>Confirm</button>
                  </div>
                </div>
              </div>
            </div>
        </div>
    )
  }
}

export default withRouter(Profile)