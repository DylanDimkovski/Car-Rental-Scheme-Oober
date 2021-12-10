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
//	Database.js is the API used to logically seperate business logic and data
//  layer of the application. All direct data transformations should take place
//  within this data structure.
//
//-----------------------------------------------------------------------------

const fs = require('fs')
const {Datastore} = require('@google-cloud/datastore')
const {Storage} = require('@google-cloud/storage')
const axios = require('axios')

const projectId = 'oober-fdb7b'
const keyFilename = '.creds/oober-fdb7b-844859898dec.json'
const key = (JSON.parse(fs.readFileSync(keyFilename))).maps_key

const datastore = new Datastore({ projectId, keyFilename })
const storage = new Storage({ projectId, keyFilename })
const carBucket = storage.bucket('3728977-car-images')

const sgMail = require('@sendgrid/mail')
const sgCreds = fs.readFileSync('.creds/sendgrid_key.json')
const sgKey = (JSON.parse(sgCreds)).key

module.exports = class Database {

  constructor() {
    this.key = key
  }

  // * * * * * * * * * * * * * * * * 
  // USER METHODS
  // * * * * * * * * * * * * * * * * 

  async getUser(username) {
    const query = datastore
    .createQuery('user')
    .filter('username', '=', username)

    return datastore.runQuery(query)
  }

  async getAllUsers() {
    const query = datastore
    .createQuery('user')

    return datastore.runQuery(query)
  }

  async getReset(username, unique) {
        
    const query = datastore
    .createQuery('reset')
    .filter('username', '=', username)
    .filter('unique', '=', unique)

    return datastore.runQuery(query)
  }

  async getResetUsername(username) {
        
    const query = datastore
    .createQuery('reset')
    .filter('username', '=', username)

    return datastore.runQuery(query)
  }

  async getResetUnique(unique) {
        
    const query = datastore
    .createQuery('reset')
    .filter('unique', '=', unique)

    return datastore.runQuery(query)
  }

  async validate(username, password) {
    const query = datastore.createQuery('user')
      .filter('username', '=', username)
      .filter('password', '=', password)

    return datastore.runQuery(query)
  }

  async updateUser(username, user) {
    await datastore.update({ 
      key: datastore.key(['user', username]),
      data: user
    })
  }

  async insertUser(username, password, fname, lname, license) {
    await datastore.insert({ 
      key: datastore.key(['user', username]),
      data: {
        username,
        password,
        fname,
        lname,
        license,
        login: 0,
        admin: 0,
        locked: 0
      }
    })
  }

  // * * * * * * * * * * * * * * * * 
  // PASSWORD METHODS
  // * * * * * * * * * * * * * * * * 

  async isLogin(username) {
    const query = datastore.createQuery('user')
      .filter('username', '=', username)
      .filter('login', '=', 1)

    const [result] = await datastore.runQuery(query)

    return (result.length)
  }

  async deleteReset(username) {
    await datastore.delete([datastore.key(['reset', username])])
  }

  async passwordReset(user) {
    sgMail.setApiKey(sgKey)

    const unique = Math.floor(Math.random() * 9999999999999) + 10000000
    
    const msg = {
      to: user.username,
      from: 'arone.s@live.com.au',
      templateId: 'd-acaf88b2fe8443a8a0725628955615bd',
      dynamicTemplateData: {
        fname: user.fname,
        username: user.username,
        unique: unique
      },
    }
    
    await datastore.upsert({ 
      key: datastore.key(['reset', user.username]),
      data: {
        username: user.username,
        unique: `${unique}`
      }
    })

    await sgMail.send(msg)
  }

  // * * * * * * * * * * * * * * * * 
  // VEHICLE METHODS
  // * * * * * * * * * * * * * * * * 

  async uploadCarImage(file, rego) { 
    return new Promise((resolve, reject) => {
      const { originalname, buffer } = file
      const blob = carBucket.file(rego + "." + originalname.split(".")[1])
      const blobStream = blob.createWriteStream({
        resumable: false
      })

      blobStream.on('finish', () => {
        const publicUrl = `https://storage.googleapis.com/${carBucket.name}/${blob.name}`
        resolve(publicUrl)
      })
      .on('error', () => {
        reject(`Unable to upload image, something went wrong`)
      })
      .end(buffer)
    })
  }

  async getVehicleByRego(rego) {
    const query = datastore
    .createQuery('vehicle')
    .filter('rego', '=', rego)

    return datastore.runQuery(query)
  }

  async getAllVehicles() {
    const query = datastore
    .createQuery('vehicle')

    return datastore.runQuery(query)
  }

  async insertVehicle(vehicle) {
    await datastore.insert({ 
      key: datastore.key(['vehicle', vehicle.rego]),
      data: vehicle
    })
  }

  async searchVehicleDistance(location, data) {
    const base = "https://maps.googleapis.com/maps/api/distancematrix"
    const origin = "origins=" + encodeURIComponent(location)
    const locations = "destinations=" + data
      .map(f => encodeURIComponent(f.location))
      .reduce((p, c) => p + "%7C" + c)

    const url = `${base}/json?${origin}&${locations}&key=${key}`
    return axios({ url, method: "get", headers: {} })
      .then(r => r.data)
      .catch(e => { 
        return { error: true, message: e.message }
    })
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
    
    if (data.rows[0].elements[0].status === "ZERO_RESULTS")
      return []
    
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

  // * * * * * * * * * * * * * * * * 
  // BOOKING METHODS
  // * * * * * * * * * * * * * * * * 

  async getBooking(id) {
    const query = datastore
    .createQuery('booking')
    .filter('bid', '=', id)

    return datastore.runQuery(query)
  }

  async getAllBookings() {
    const query = datastore
    .createQuery('booking')

    return datastore.runQuery(query)
  }

  async getAllBookingsByRego(rego) {
    const query = datastore
    .createQuery('booking')
    .filter('rego', '=', rego)

    return datastore.runQuery(query)
  }

  async getAllBookingsByUser(username) {
    const query = datastore
    .createQuery('booking')
    .filter('username', '=', username)

    return datastore.runQuery(query)
  }

  async insertBooking(booking) {
    await datastore.insert({ 
      key: datastore.key(['booking', booking.bid]),
      data: booking
    })
  }

  async updateBooking(booking) {
    await datastore.update({ 
      key: datastore.key(['booking', booking.bid]),
      data: booking
    })
  }

  isBookingAvailable(startdate, enddate, b) {
    return (
      (startdate < b.end   && startdate > b.start)   || 
      (enddate   < b.end   && enddate   > b.start)   ||
      (b.end     < enddate && b.start   > startdate) ||
      (enddate  == b.end   && startdate == b.start)
    )
  }

  mapBookingTime(b) {
    b.start = new Date(b.start).getTime()
    b.end   = new Date(b.end).getTime()
    
    return b
  }

  async deleteBooking(booking){
    await datastore.delete([datastore.key(['booking', booking.bid])])
  }


  // * * * * * * * * * * * * * * * * 
  // BOOKING METHODS
  // * * * * * * * * * * * * * * * * 
  
  async insertTransactions(transaction){
    await datastore.insert({ 
      key: datastore.key(['transaction', transaction.tid]),
      data: transaction
    })
  }

  async updateTransactions(transaction){
    await datastore.update({ 
      key: datastore.key(['transaction', transaction]),
      data: transaction
    })
  }

  async deleteTransactions(transaction){
    await datastore.delete([datastore.key(['transaction', transaction.id])])
  }

  async getTransactionByID(id){
    const query = datastore
    .createQuery('transaction')
    .filter('tid', '=', id)

    return datastore.runQuery(query)
  }

  async getTransactionByUsername(username){
    const query = datastore
    .createQuery('transaction')
    .filter('username', '=', username)

    return datastore.runQuery(query)
  }
  async getTransactionRego(rego){
    const query = datastore
    .createQuery('transaction')
    .filter('rego', '=', rego)

    return datastore.runQuery(query)
  }

  async getAllTransaction() {
    const query = datastore
    .createQuery('transaction')

    return datastore.runQuery(query)
  }

  // * * * * * * * * * * * * * * * * 
  // HISTORY METHODS
  // * * * * * * * * * * * * * * * * 
  
  async getHistory(id) {
    const query = datastore
    .createQuery('history')
    .filter('bid', '=', id)

    return datastore.runQuery(query)
  }

  async getAllHistory() {
    const query = datastore
    .createQuery('history')

    return datastore.runQuery(query)
  }

  async getAllHistoryByRego(rego) {
    const query = datastore
    .createQuery('history')
    .filter('rego', '=', rego)

    return datastore.runQuery(query)
  }

  async getAllHistoryByUser(username) {
    const query = datastore
    .createQuery('history')
    .filter('username', '=', username)

    return datastore.runQuery(query)
  }

  async insertHistory(history){
    await datastore.insert({ 
      key: datastore.key(['history', history.bid]),
      data: history
    })
  }

  // * * * * * * * * * * * * * * * * 
  // FEEDBACK METHODS
  // * * * * * * * * * * * * * * * * 

  async getAllFeedback() {
    const query = datastore
    .createQuery('feedback')

    return datastore.runQuery(query)
  }

  async insertFeedback(feedback){
    await datastore.insert({ 
      key: datastore.key(['feedback', feedback.fid]),
      data: feedback
    })
  }

}
