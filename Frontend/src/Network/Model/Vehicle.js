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
//	Vehicle.js is the vehicle model.
//
//-----------------------------------------------------------------------------

class Vehicle {

  constructor(vehicle) {
    this.rego        = vehicle.rego
    this.make        = vehicle.make
    this.model       = vehicle.model
    this.type        = vehicle.type
    this.description = vehicle.description
    this.location    = vehicle.location
    this.image_url   = vehicle.image_url

    this.distance    = vehicle.distance
    this.duration    = vehicle.duration
  }

}

export default Vehicle