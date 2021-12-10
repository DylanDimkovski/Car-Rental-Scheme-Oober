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
//	server.js internal server application and controller container.
//
//-----------------------------------------------------------------------------

const { Express } = require('express')

const BookingController     = require('../controllers/BookingController/BookingController')
const FeedbackController    = require('../controllers/FeedbackController/FeedbackController')
const PasswordController    = require('../controllers/PasswordController/PasswordController')
const HistoryController     = require('../controllers/HistoryController/HistoryController')
const UserController        = require('../controllers/UserController/UserController')
const VehicleController     = require('../controllers/VehicleController/VehicleController')
const TransactionController = require('../controllers/TransactionController/TransactionController')

const Route = require('./route')
const Database = require('./Database')

module.exports = class Server {
  constructor() {
    
    this.database = new Database()

    this.routes = []
    this.controllers = [
        new BookingController(this.database),
        new FeedbackController(this.database),
        new PasswordController(this.database),
        new HistoryController(this.database),
        new TransactionController(this.database),
        new UserController(this.database),
        new VehicleController(this.database),
    ];

    this.controllers.forEach((controller) => {
      Object
        .getOwnPropertyNames(controller.constructor.prototype)
        .filter(action => action != "constructor")
        .forEach(action => this.routes.push(new Route(controller, action)))
    })
  }

  /**
   * 
   * @param {Express} express 
   */
  route(express) {
    this.controllers.forEach(controller => this.routes
      .filter(route => route.source == controller.source)
      .forEach(route => {
        route.method == "GET" ?
          express.get(route.endpoint, controller[route.action].bind(controller)) :
          express.post(route.endpoint, controller[route.action].bind(controller))
      }))
  }
}