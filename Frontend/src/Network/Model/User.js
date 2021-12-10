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
//	User.js is the user model.
//
//-----------------------------------------------------------------------------

class User {

  constructor(user) {
    this.fname    = user.fname
    this.lname    = user.lname
    this.username = user.username
    this.password = user.password
    this.license  = user.license
    this.login    = user.login  || 0
    this.locked   = user.locked || 0
    this.admin    = user.admin  || 0
  }

}

export default User