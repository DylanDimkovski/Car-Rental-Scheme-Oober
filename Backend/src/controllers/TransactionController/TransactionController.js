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
//	TransactionController.js is the controller which handles all user transactions
//  business logic and functionality.
//
//-----------------------------------------------------------------------------

const methods = require('../../network/methods');
const Database = require('../../network/Database')

module.exports = class TransactionController {
  
  /**
   * 
   * @param {Database} db
   */
  constructor(db) {

    this.domain = "api"
    this.source = "transaction"

    if (db == undefined) {
      console.error("DATABASE UNDEFINED")
    }

    this.database = db

    this.methods = {
      all: methods.GET,
      ['get/id']: methods.POST,
      ['get/user']: methods.POST,
    }
  }

  async ['get/id'](req, res) {
    
    const id = req.body.id
    const [transactions] = await this.database.getAllTransaction()
    const transaction = transactions.filter(t => t.tid == id)

    res.send(transaction)
  }

  async ['get/user'](req, res) {
    
    const user = req.body.username
    const [transaction] = await this.database.getTransactionByUsername(user)

    res.send(transaction)
  }

  async all(req, res) {
    const [transactions] = await this.database.getAllTransaction()

    res.send(transactions)
  }
  
}
