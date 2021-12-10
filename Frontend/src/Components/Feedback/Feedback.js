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
//	Feedback.js is the feedback modal for providing user feedback on bookings.
//
//-----------------------------------------------------------------------------

import React, { Component } from "react";
import Services from '../../Network/Services.js'

const service = new Services()

class Feedback extends Component {
  
  constructor(props) {
    super(props)

    this.state = {
      bid: props.bid,
      modal: {},
      rating: 0,
    } 
  }

  async componentDidMount() {

    var modal = new window.bootstrap.Modal(document.getElementById('feedback'), {
      keyboard: false
    })

    modal.show()

    this.setState({
      modal 
    })
  }

  click(e) {
    const bounds = document.getElementById("stars").getBoundingClientRect();
    const mousex = e.clientX - bounds.left
    const size   = bounds.width / 5
    const rating = Math.floor(mousex / size) + 1
    
    this.setState({ rating: rating === this.state.rating ? 0 : rating })
  }

  stars() {

    let star = []

    for (let i = 0; i < this.state.rating; i++)
      star.push(<h3 className="d-inline text-warning" key={Math.random()}>&#9733;</h3>)

    for (let i = 0; i < 5 - this.state.rating; i++)
      star.push(<h3 className="d-inline text-warning" key={Math.random()}>&#9734;</h3>)

    return (
      <div>
        <span id="stars" className="d-inline" onClick={this.click.bind(this)}>
          {star}
        </span>
      </div>
    )
  }

  async submit() {
    
    this.state.modal.hide()
    
    await service.createFeedback({
      bid: this.state.bid,
      rating: this.state.rating,
      username: localStorage.getItem("username"),
      info: document.getElementById("description").value ?? ""
    })

    this.props.complete(false)
  }

  cancel() {
    this.state.modal.hide()
    this.props.complete(false)
  }

  render() {
    return (
      <div id="feedback" className="modal" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Booking Feedback</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <p>Please rate your booking experience.</p>
              {this.stars()}
              <textarea id="description" name="description" required className="form-control mt-3" aria-describedby="basic-addon3" rows="3" maxLength="250" style={ {resize: "none"} } placeholder="Additional information.."/>
            </div>
            <div className="modal-footer">
              <button onClick={this.cancel.bind(this)} type="button" className="btn btn-outline-secondary" data-bs-dismiss="modal">Maybe Later</button>
              <button onClick={this.submit.bind(this)} type="button" className="btn btn-success">Submit</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Feedback
