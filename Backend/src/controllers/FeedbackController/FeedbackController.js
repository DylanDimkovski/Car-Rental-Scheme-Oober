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
//	FeedbackController.js is the controller which handles all user feedback
//  business logic and functionality.
//
//-----------------------------------------------------------------------------

const methods = require('../../network/methods');
const Database = require('../../network/Database')

module.exports = class FeedbackController {
  
  /**
   * 
   * @param {Database} db
   */
  constructor(db) {

    this.domain = "api"
    this.source = "feedback"

    if (db == undefined) {
      console.error("DATABASE UNDEFINED")
    }

    this.database = db

    this.methods = {
      create: methods.POST,
      all:methods.GET
    }
  }

  async create(req, res) {
    
    const fid      = Math.floor(Math.random() * 9999999999)
    const bid      = req.body.bid
    const info     = req.body.info || ""
    const rating   = req.body.rating
    const username = req.body.username

    let result = { error: true, message: "Something went wrong, please try again." }

    if (!bid) {
      result.message = "Booking ID cannot be empty.."
    } else if (!username) {
      result.message = "Username cannot be empty."
    } else if (!rating) {
      result.message = "Feedback rating cannot be empty."
    } else {
      
      await this.database.insertFeedback({
        fid,
        bid,
        rating,
        username,
        info
      })

      result.error = false
      result.message = "Feedback Creation Successful"
    }

    res.send(result)
  }

  async all(req, res) {
    const [feedback] = await this.database.getAllFeedback()

    res.send(feedback)
  }

}
