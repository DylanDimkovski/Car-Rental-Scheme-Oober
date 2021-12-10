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
//	PasswordController.js is the controller which handles all user passwords
//  business logic and functionality.
//
//-----------------------------------------------------------------------------

const methods = require('../../network/methods');
const Database = require('../../network/Database')

module.exports = class PasswordController {
  
  /**
   * 
   * @param {Database} db
   */
  constructor(db) {

    this.domain = "api"
    this.source = "password"

    if (db == undefined) {
      console.error("DATABASE UNDEFINED")
    }

    this.database = db

    this.methods = {
      reset: methods.POST,
      update: methods.POST,
      secure: methods.POST,
      get: methods.POST,
    }
  }

  async reset(req, res) {

    const username = req.body.username
    const [users] = await this.database.getUser(username)

    let result = { error: true, message: "Something went wrong, please try again later." }

    if (username && users.length > 0) {
      await this.database.passwordReset(users[0])

      result.error = false
      result.message = "Password Reset Successful."
    } else {
      result = { error: true, message: "Recipient cannot be empty." }
    }

    res.send(result)
  }

  async update(req, res) {
    const unique   = req.body.unique
    const username = req.body.username
    const password = req.body.password

    let result = { error: true, message: "Something went wrong, please try again later." }

    if (!unique) {
      result.message = "Unique ID cannot be empty."
    } else if (!username) {
      result.message = "Username cannot be empty."
    } else if (!password) {
      result.message = "Password cannot be empty."
    } else {
      const [reset] = await this.database.getReset(username, unique)

      if (reset.length > 0) {
        const [user] = await this.database.getUser(username)
        
        user[0].password = password

        await this.database.updateUser(username, user[0])
        await this.database.deleteReset(username)

        result.error = false
        result.message = "Password Reset Successful."
      } else {
        result.message = "Password reset does not exist."
      }
    }

    res.send(result)
  }

  async get(req, res) {
    
    const username = req.body.username
    const unique = req.body.unique

    let result = {}

    if (username)
    {
      [result] = await this.database.getResetUsername(username)
    }
    else if (unique)
    {
      [result] = await this.database.getResetUnique(unique)
    }
    else {
      result = {
        error: true,
        message: "Username and unique cannot be empty."
      }
    }
    
    res.send(result)
  }

  async secure(req, res) {
    res.send({ result: await this.database.isLogin(req.body.username) })
  }
}
