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
//	VehicleController.js is the controller which handles all vehicle configuration
//  business logic and functionality.
//
//-----------------------------------------------------------------------------

const methods = require('../../network/methods')
const Database = require('../../network/Database')

module.exports = class VehicleController {
  
  /**
   * 
   * @param {Database} db
   */
  constructor(db) {

    this.domain = "api"
    this.source = "vehicle"

    if (db == undefined) {
      console.error("DATABASE UNDEFINED")
    }

    this.database = db

    this.methods = {
      get: methods.POST,
      all: methods.GET,
      search: methods.POST,
      upload: methods.POST,
    }
  }

  async get(req, res) {

    const rego = req.body.rego
    
    const [vehicle] = await this.database.getVehicleByRego(rego)

    res.send(vehicle)
  }
  
  async search(req, res) {

    const make = req.body.make
    const model = req.body.model
    const type = req.body.type
    const location = req.body.location
    const limit = req.body.distance
    
    let result = {
      error: true,
      message: "Something went wrong with the request.. please try again later."
    }

    if (!location) {
      result.message = "Location cannot be empty!"
    } else {

      const [vehicles] = await this.database.getAllVehicles()
      const filtered = this.database.filterVehicleDescription(vehicles, make, model, type)
      const data = await this.database.searchVehicleDistance(location, filtered)
      const status = data.rows[0].elements[0].status == "NOT_FOUND"

      if (data.error || status) {
        result.message = "Please enter a valid location or address."
      } else {
        result = this.database.mapVehicles(filtered, data, limit)
      }
    }

    res.send(result)
  }

  async all(req, res) {

    const [vehicles] = await this.database.getAllVehicles()

    res.send(vehicles)
  }

  async upload(req, res) {

    const file = req.file
    
    const rego = req.body.rego
    const make = req.body.make
    const model = req.body.model
    const type = req.body.type
    const description = req.body.description
    const location = req.body.location

    const [vehicle] = await this.database.getVehicleByRego(rego)

    const result = {
      error: true,
      message: "Something went wrong with that request.. please try again later."
    } 

    if (!rego) {
      result.message = "Rego cannot be empty!"
    } else if (!make) {
      result.message = "Make cannot be empty!"
    } else if (!model) {
      result.message = "Model cannot be empty!"
    } else if (!type) {
      result.message = "Type cannot be empty!"
    } else if (!description) {
      result.message = "Description cannot be empty!"
    } else if (!location) {
      result.message = "Location cannot be empty!"
    } else if (!file) {
      result.message = "Vehicle image cannot be empty!"
    } else if (vehicle.length > 0) {
      result.message = "Vehicle rego already exists!"
    } else {
      const image_url = await this.database.uploadCarImage(file, rego)

      await this.database.insertVehicle({
        rego,
        make,
        model,
        type,
        description,
        location,
        image_url
      })

      result.error = false
      result.message = "Vehicle Successfully Created"
    }

    res.send(result)
  }
}
