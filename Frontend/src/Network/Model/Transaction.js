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
//	Transaction.js is the transaction model.
//
//-----------------------------------------------------------------------------

class Transaction {

  constructor(transaction) {
    this.tid       = transaction.tid
    this.bid       = transaction.bid
    this.username  = transaction.username
    this.amount    = transaction.amount
    this.status    = transaction.status
    this.late      = transaction.late
    this.timestamp = transaction.timestamp
  }

}

export default Transaction