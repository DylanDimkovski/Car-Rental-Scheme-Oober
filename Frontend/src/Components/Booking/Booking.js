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
//	Booking.js is the booking page for the booking application process.
//
//-----------------------------------------------------------------------------

import { Component } from "react";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";
import Services from "../../Network/Services.js";

const service = new Services();

const generateTimeSlots = () => {
  return [
    "00:00", "00:30", "01:00", "01:30", "02:00", "02:30", 
    "03:00", "03:30", "04:00", "04:30", "05:00", "05:30", 
    "06:00", "06:30", "07:00", "07:30", "08:00", "08:30",
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
    "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
    "18:00", "18:30", "19:00", "19:30", "20:00", "20:30",
    "21:00", "21:30", "22:00", "22:30", "23:00", "23:30",
  ]
}

const calculateCost = (start, end, fee) => {
  const timeslots  = generateTimeSlots()
  const startIndex = timeslots.indexOf(start)
  const endIndex   = timeslots.indexOf(end)
  const intervals  = endIndex - startIndex
  
  return intervals * fee
}

class Booking extends Component {
  constructor(props) {
    super(props);

    this.state = {
      day: "",
      rego: new URLSearchParams(props.location.search).get('rego'),
      username: localStorage.getItem("username"),
      start: "",
      end: "",
      error: "",

      startTimes: [],
      endTimes: [],

      vehicle: {}
    };
  }

  async componentDidMount() {
    this.setState({
      vehicle: await service.getVehicleByRego(this.state.rego)
    })
  }

  async onDayChange(event) {
    const day = new Date(event.target.value).toLocaleDateString("en-AU")
    const data = await service.getBookingStartTime(this.state.rego, day)

    this.setState({
      day,
      startTimes: data,
      endTimes: []
    })
  }

  async onStartTimeChange(event) {
    const start = event.target.value
    const data = await service.getBookingEndTime(this.state.rego, this.state.day, start)

    this.setState({
      start: start,
      endTimes: data
    })
  }

  async onEndTimeChange(event) {
    this.setState({
      end: event.target.value
    })
  }

  async confirmBooking() {
    
    const hasDay = this.state.day
    const hasStart = this.state.startTimes.find(t => t === this.state.start)
    const hasEnd = this.state.endTimes.find(t => t === this.state.end)
    
    if (!hasDay) {
      this.setState({ error: "Please select a valid day" })
    } else if (!hasStart) {
      this.setState({ error: "Please select a valid start time" })
    } else if (!hasEnd) {
      this.setState({ error: "Please select a valid end time" })
    } else {
      const result = await service.createBooking(
        this.state.day,
        this.state.start,
        this.state.end,
        this.state.rego,
        this.state.username)

      if (!result.error) {
        await service.bookingDeposit(
          this.state.username,
          result.bid,
          this.state.start, 
          this.state.end)

        this.props.history.push("/profile")
      } else {
        this.setState({
          error: result.message
        })
      }
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

  generateTimeOptions(times) {
    return times.map(t => (<option key={t}>{t}</option>))
  }

  generateCosts() {
    
    const hasDay   = this.state.day
    const hasStart = this.state.startTimes.find(t => t === this.state.start)
    const hasEnd   = this.state.endTimes.find(t => t === this.state.end)
    
    if (hasDay && hasStart && hasEnd) {

      const cost    = calculateCost(this.state.start, this.state.end, 50.0)
      const deposit = Math.floor((cost * 0.20) * 100) / 100

      return (
        <div className="mt-4">
          <div className="d-flex gap-2 align-items-center">
            <h3 className="fw-bold">Total: ${cost}</h3>
            <p className="fw-light">incl ${deposit} upfront deposit</p>
          </div>
          <p className="fw-lighter fst-italic p-0">Total to be paid upon booking completion. Bookings are non-refundable and late cancellations will be charged the total booking fee.</p>
          <button className="btn btn-success" onClick={this.confirmBooking.bind(this)}>Confirm Booking</button>
        </div>      
      )
    }      
  }

  render() {
    return (
      <div className="container w-75 my-5 d-flex flex-column">
        <div className="w-100">
          <img src={this.state.vehicle.image_url} className="w-100" height="500px" alt={this.state.vehicle.rego} />
        </div>
        <div className="mt-5">
          <div>
            <h1>{this.state.vehicle.make} {this.state.vehicle.model} {this.state.vehicle.type}</h1>
            <p className="fw-light fst-italic">{this.state.vehicle.rego}</p>
            <p className="fw-light fst-italic">{this.state.vehicle.location}</p>
            <p>{this.state.vehicle.description}</p>
          </div>
          { this.state.error ? this.displayError() : "" }
          <div className="d-flex justify-content-between mt-4">
            <div><Link to="/search" className="btn btn-outline-secondary">Back</Link></div>
            <div className="d-flex w-75 gap-5">
              <input className="form-control" type="date" onChange={this.onDayChange.bind(this)}/>

              <select disabled={(this.state.startTimes.length > 0)? "" : "disabled"} className="form-select" id="start" onChange={this.onStartTimeChange.bind(this)}>
              <option defaultValue>Select start time</option>
                {this.generateTimeOptions(this.state.startTimes)}
              </select>

              <select disabled={(this.state.endTimes.length > 0)? "" : "disabled"} className="form-select" id="end" onChange={this.onEndTimeChange.bind(this)}>
                <option defaultValue>Select end time</option>
                {this.generateTimeOptions(this.state.endTimes)}
              </select>
            </div>
          </div>
          {this.generateCosts()}
        </div>
      </div>
    );
  }
}

export default withRouter(Booking);
