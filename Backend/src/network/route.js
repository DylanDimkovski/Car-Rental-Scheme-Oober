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
//	route.js represents route paths in the application.
//
//-----------------------------------------------------------------------------

module.exports = class Route {
  
  constructor(controller, action) {

    this.domain = controller.domain
    this.source = controller.source
    this.action = action
    this.method = controller.methods[action]

    this.endpoint = `/${this.domain}/${this.source}/${action}`
    this.controller = 
      this.source.charAt(0).toUpperCase() + 
      this.source.slice(1) + "Controller"
  }

}