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
//	Booking.js is the booking model.
//
//-----------------------------------------------------------------------------

class Booking {

  constructor(booking) {
    this.bid      = booking.bid
    this.username = booking.username
    this.rego     = booking.rego
    this.day      = booking.day
    this.start    = booking.start
    this.end      = booking.end
    this.status   = booking.status
    this.late     = booking.late
  }

}

export default Booking