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
//	UserController.js is the controller which handles all users data and info
//  business logic and functionality.
//
//-----------------------------------------------------------------------------

const methods = require('../../network/methods');
const Database = require('../../network/Database')

module.exports = class UserController {
  
  /**
   * 
   * @param {Database} db
   */
  constructor(db) {

    this.domain = "api"
    this.source = "user"

    if (db == undefined) {
      console.error("DATABASE UNDEFINED")
    }

    this.database = db

    this.methods = {
      get: methods.POST,
      all: methods.GET,
      login: methods.POST,
      logout: methods.POST,
      register: methods.POST,
      update: methods.POST,
      lock: methods.POST,
      unlock: methods.POST
    }
  }

  async get(req, res) {
    
    const username = req.body.username
    const [user] = await this.database.getUser(username)

    res.send(user)
  }

  async all(req, res) {
    
    const [users] = await this.database.getAllUsers()

    res.send(users)
  }

  async login(req, res) {
    
    const username = req.body.username
    const password = req.body.password
    let result = { error: true, message: "Username or password is incorrect, please try again." }

    if (!username) {
      result.message = "Please provide a username."
    } else if (!password) {
      result.message = "Please provide a password."
    } else {
      const [users] = await this.database.validate(username, password)
      
      if (users.length == 1 && users[0].locked) {
        result.message = "User account locked, please contact support for further details."
      } else if (users.length == 1) {
        users[0].login = 1
        result = { error: false, message: "Login Successful" }

        await this.database.updateUser(username, users[0])
      }
    }

    res.send(result)
  }

  async logout(req, res) {
    
    const username = req.body.username
    let result = { error: true, message: "Something went wrong, please try again." }
    
    if (!username) {
      result.message = "Please provide a username."
    } else {
      const [users] = await this.database.getUser(username)
      
      if (users.length == 1) {
        users[0].login = 0
        result = { error: false, message: "Logout Successful" }

        await this.database.updateUser(username, users[0])
      } else {
        result.message = "Invalid username provided."
      }
    }

    res.send(result)
  }

  async register(req, res) {

    const username = req.body.username
    const password = req.body.password
    const fname = req.body.fname
    const lname = req.body.lname
    const license = req.body.license

    let result = { error: true, message: "Something went wrong, please try again." }

    const [users] = await this.database.getUser(username)
    
    if (!username) {
      result.message = "Username cannont be empty, please try again."
    } else if (!password) {
      result.message = "Password cannont be empty, please try again."
    } else if (!fname || !lname) {
      result.message = "Please add your first or last name."
    } else if (users.length > 0) {
      result.message = "An account with that email already exists, please try again."
    } else if (!license) {
      result.message = "License cannot be empty, please try again."
    } else {
      
      await this.database.insertUser(
        username, 
        password, 
        fname, 
        lname, 
        license
      )

      result.error = false
      result.message = "User Registration Successful"
    }

    res.send(result)
  }

  async update(req, res) {

    const username = req.body.username
    const fname = req.body.fname
    const lname = req.body.lname
    const license = req.body.license

    let result = { error: true, message: "Something went wrong, please try again." }
    let data

    if (!username) {
      result.message = "Username cannont be empty, please try again."
    } else if (!fname) {
      result.message = "Please add your first name."
    } else if (!lname) {
      result.message = "Please add your last name."
    } else if (!license) {
      result.message = "License cannot be empty, please try again."
    } else {

      const [user] = await this.database.getUser(username)

      if (user.length == 0)
        result.message = "User does not exist."
      else {
        result.error = false

        user[0].fname   = fname
        user[0].lname   = lname
        user[0].license = license

        await this.database.updateUser(username, user[0])
        data = user[0]
      }
    }

    res.send(result.error ? result : data)
  }

  async lock(req, res) {

    const username = req.body.username
    const result = { error: true, message: "Something went wrong, please try again." }
    
    let userData;
    
    if (username) {

      const [user] = await this.database.getUser(username)
      
      if (user.length == 0)
        result.message = "User does not exist"
      else {
        result.error = false
        user[0].locked = 1
        userData = user
        await this.database.updateUser(username, user[0])
      }
    } else result.message = "Username cannot be empty"

    res.send(result.error ? result : userData)
  }

  async unlock(req, res) {

    const username = req.body.username
    const result = { error: true, message: "Something went wrong, please try again." }
    
    let userData;
    
    if (username) {

      const [user] = await this.database.getUser(username)
      
      if (user.length == 0)
        result.message = "User does not exist"
      else {
        result.error = false
        user[0].locked = 0
        userData = user
        await this.database.updateUser(username, user[0])
      }
    } else result.message = "Username cannot be empty"

    res.send(result.error ? result : userData)
  }
}
