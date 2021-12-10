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
//	DatabaseMock.js is used to mock the actual database. Used for testing purposes.
//
//-----------------------------------------------------------------------------

module.exports = class DatabaseMock {

  constructor() {

    this.user = {
      username: "john@test.com",
      password: "123",
      fname: "john",
      lname: "doe",
      license: "12345678",
      login: 0
    }

    this.reset = {
      username: "john@test.com",
      unique: "12345678"
    }

    this.vehicle = {
      "rego": "ABC123",
      "make": "Ford",
      "model": "Falcon",
      "type": "Car",
      "description": "A fancy car!",
      "location": "123 Fake Street Melbourne",
      "image_url": "https://car_image_url.com"
    }

    this.users = []
    this.resets = []
    this.vehicles = [this.vehicle]

  }
  
  async getUser(username) {
    
    let result = [{}]

    if (username === this.user.username) {
      result = [[this.user]]
    }

    return result;
  }

  async getAllUsers() {
    return [[this.user, this.user]]
  }

  async validate(username, password) {
    let result = { }
    
    if (username == this.user.username && password == this.user.password) {
      result = [this.user]
    }

    return [result]
  }

  async getReset(username, unique) {
    let result = [{}]

    if (username === this.reset.username && this.reset.unique == unique) {
      result = [[this.reset]]
    }

    return result;
  }

  async isLogin(username) {
    const loggedIn = username == this.user.username && this.user.login == 1

    return loggedIn ? 1 : 0
  }

  async deleteReset(username) { 
    this.resets.filter(r => r.username != username)
  }

  async passwordReset(user) { 
    this.resets.push({
      username: user.username,
      unique: "12345678"
    })
  }

  async updateUser(username, user) {
    if (username == this.user.username) {
    
      this.user = user
    }
  }

  async insertUser(username, password, fname, lname, license) {
    this.users.push({
      username,
      password,
      fname,
      lname,
      license
    })
  }

  async getVehicleByRego(rego) {
    return [this.vehicles.find(v => v.rego == rego)]
  }

  async getAllVehicles() { 
    return [this.vehicles]
  }

  async insertVehicle(vehicle) {
    this.vehicles.push(vehicle)
  }

  async searchVehicleDistance(location, data) {
    return {
      rows: [
        {
          elements: [
            { 
              distance: { text: "5.0 km" },
              duration: { text: "5 minutes" },
              status: "200"
            },
          ]
        }
      ]
    }
  }

  filterVehicleDescription(cars, make, model, type) {
    return cars.filter(car => {
      return (
        new RegExp("^" + make, 'i').test(car.make) &&
        new RegExp("^" + model, 'i').test(car.model) &&
        new RegExp("^" + type, 'i').test(car.type)
      )
    })
  }

  mapVehicles(cars, data, limit) {
    return cars.map((v, i) => {
      return {
        rego: v.rego,
        make: v.make,
        model: v.model,
        type: v.type,
        description: v.description,
        location: v.location,
        image_url: v.image_url,
        distance: data.rows[0].elements[i].distance.text,
        duration: data.rows[0].elements[i].duration.text,
      }
    }).filter(v => parseFloat(v.distance.split(" ") [0]) <= limit)
  }

  async uploadCarImage(file, rego) { 
    return file
  }

  // * * * * * * * * * * * * * * * * 
  // BOOKING METHODS
  // * * * * * * * * * * * * * * * * 

  async getBooking(id) {
    return [{}]
  }

  async getAllBookings() {
    return [[{"bid": 1}]]
  }

  async getAllBookingsByRego(rego) {
    return [{}]
  }

  async getAllBookingsByUser(username) {
    return [{}]
  }

  async insertBooking(booking) {
    return [{}]
  }

  async updateBooking(booking) {
    return [{}]
  }

  isBookingAvailable(startdate, enddate, b) {
    return [{}]
  }

  mapBookingTime(b) {
    return [{}]
  }

  async deleteBooking(booking){
    return [{}]
  }


  // * * * * * * * * * * * * * * * * 
  // BOOKING METHODS
  // * * * * * * * * * * * * * * * * 
  
  async insertTransactions(transaction){
    return [{}]
  }

  async updateTransactions(transaction){
    return [{}]
  }

  async deleteTransactions(transaction){
    return [{}]
  }

  async getTransactionByID(id){
    return [{}]
  }

  async getTransactionByUsername(username){
    return [{}]
  }
  async getTransactionRego(rego){
    return [{}]
  }

  async getAllTransaction() {
    return [[{ tid: 1 }]]
  }

  // * * * * * * * * * * * * * * * * 
  // HISTORY METHODS
  // * * * * * * * * * * * * * * * * 
  
  async getHistory(id) {
    return [{}]
  }

  async getAllHistory() {
    return [[{ bid: 1 }]]
  }

  async getAllHistoryByRego(rego) {
    return [{}]
  }

  async getAllHistoryByUser(username) {
    return [{}]
  }

  async insertHistory(history){
    return [{}]
  }

  // * * * * * * * * * * * * * * * * 
  // FEEDBACK METHODS
  // * * * * * * * * * * * * * * * * 

  async getAllFeedback() {
    return [{}]
  }

  async insertFeedback(feedback){
    return [{}]
  }

}