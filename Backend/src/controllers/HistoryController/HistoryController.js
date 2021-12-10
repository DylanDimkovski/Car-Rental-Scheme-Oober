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
//	HistoryController.js is the controller which handles all user history
//  business logic and functionality.
//
//-----------------------------------------------------------------------------

const methods = require('../../network/methods');
const Database = require('../../network/Database')

module.exports = class HistoryController {
  
  /**
   * 
   * @param {Database} db
   */
  constructor(db) {

    this.domain = "api"
    this.source = "history"

    if (db == undefined) {
      console.error("DATABASE UNDEFINED")
    }

    this.database = db

    this.methods = {
      all: methods.GET,
      ['get/id']: methods.POST,
      ['get/rego']: methods.POST,
      ['get/user']: methods.POST,
    }
  }

  async ['get/id'](req, res) {
    
    const id = req.body.id
    const [bookings] = await this.database.getAllHistory()
    const booking = bookings.filter(b => b.bid == id)
    
    res.send(booking)
  }

  async ['get/rego'](req, res) {
    
    const rego = req.body.rego
    const [booking] = await this.database.getAllHistoryByRego(rego)

    res.send(booking)
  }

  async ['get/user'](req, res) {
    
    const user = req.body.username
    const [booking] = await this.database.getAllHistoryByUser(user)

    res.send(booking)
  }

  async all(req, res) {
    const [bookings] = await this.database.getAllHistory()

    res.send(bookings)
  }
  
}
