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
//	BookingController.js is the controller which handles all booking business
//  logic and transactions.
//
//-----------------------------------------------------------------------------

const methods = require('../../network/methods')
const Database = require('../../network/Database')

const generateTimeSlots = () => {
  return [
    "00:00", "00:30", "01:00", "01:30", "02:00", "02:30", 
    "03:00", "03:30", "04:00", "04:30", "05:00", "05:30", 
    "06:00", "06:30", "07:00", "07:30", "08:00", "08:30",
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
    "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
    "18:00", "18:30", "19:00", "19:30", "20:00", "20:30",
    "21:00", "21:30", "22:00", "22:30", "23:00", "23:30",
  ]
}

const calculateCost = (start, end, fee) => {
  const timeslots  = generateTimeSlots()
  const startIndex = timeslots.indexOf(start)
  const endIndex   = timeslots.indexOf(end)
  const intervals  = endIndex - startIndex
  
  return intervals * fee
}

const compareDay = (a, b, sign) => {
  a = a.split("/")
  a = a[2] + a[1] + a[0]

  b = b.split("/")
  b = b[2] + b[1] + b[0]

  if (sign == "<")
    return a < b
  else if (sign == ">")
    return a > b
  else if (sign == "=")
    return a == b
}

const depositRatio = 0.2

module.exports = class BookingController {
  
  /**
   * 
   * @param {Database} db
   */
  constructor(db) {

    this.domain = "api"
    this.source = "booking"

    if (db == undefined) {
      console.error("DATABASE UNDEFINED")
    }

    this.database = db

    this.methods = {
      ['get/id']: methods.POST,
      ['get/user']: methods.POST,
      ['get/rego']: methods.POST,
      all: methods.GET,
      starts: methods.POST,
      ends: methods.POST,
      create: methods.POST,
      return: methods.POST,
      cancel: methods.POST,
      extend: methods.POST,     
      deposit: methods.POST,      
    }

    // Update booking late status
    const milliseconds        = 1000
    const minute              = milliseconds * 60
    const lateBookingInterval = minute * 15

    setInterval(async () => {
      
      const [bookings] = await this.database.getAllBookings()
      
      bookings.forEach(b => {
        
        const date   = new Date()
        const day    = date.toLocaleDateString('en-AU', { hour12: false, timeZone: "Australia/Sydney" })
        const time   = date.toLocaleTimeString('en-AU', { hour12: false, timeZone: "Australia/Sydney" })
        const isLate = b.day < day || (b.day == day && b.end < time)
        
        b.late = isLate
        this.database.updateBooking(b)
      })
    }, lateBookingInterval)
  }

  async ['get/id'](req, res) {
    
    const id = req.body.id
    const [bookings] = await this.database.getAllBookings()
    const booking = bookings.filter(b => b.bid == id)
    
    res.send(booking)
  }

  async ['get/rego'](req, res) {
    
    const rego = req.body.rego
    const [booking] = await this.database.getAllBookingsByRego(rego)

    res.send(booking)
  }

  async ['get/user'](req, res) {
    
    const user = req.body.username
    const [booking] = await this.database.getAllBookingsByUser(user)

    res.send(booking)
  }

  async all(req, res) {
    const [bookings] = await this.database.getAllBookings()

    res.send(bookings)
  }

  async starts(req, res) {

    const rego  = req.body.rego
    const day   = req.body.day
    const today = new Date().toLocaleDateString('en-AU', { hour12: false, timeZone: "Australia/Sydney" })
    const now   = new Date().toLocaleTimeString('en-AU', { hour12: false, timeZone: "Australia/Sydney" })
    
    let timeslots = generateTimeSlots()
    timeslots.pop()

    const result = {
      error: true,
      message: "Booking unavailable, please select another time slot."
    }

    if (!rego) {
      result.message = "Vehicle registration cannot be empty."
    } else if (!day) {
      result.message = "Booking day cannot be empty."
    } else if (compareDay(day, today, "<")) {
      result.error = false
      timeslots = []
    } else {

      const [bookings] = await this.database.getAllBookingsByRego(rego)      
      const filtered   = bookings.filter(b => b.day == day) 
      const sorted     = filtered.sort((a, b) => a.start > b.start ? 1 : -1)

      if (day == today) {
        timeslots = timeslots.filter(t => t >= now)
      }

      sorted.forEach(b => {
        
        const start = timeslots.indexOf(b.start)
        const count = timeslots.indexOf(b.end) - start
        
        timeslots.splice(start, count)
      })

      result.error = false
    }

    res.send(result.error ? result : timeslots)
  }

  async ends(req, res) {

    const rego  = req.body.rego
    const day   = req.body.day
    const start = req.body.start

    let timeslots = generateTimeSlots()

    const result = {
      error: true,
      message: "Booking unavailable, please select another time slot."
    }

    if (!rego) {
      result.message = "Vehicle registration cannot be empty."
    } else if (!day) {
      result.message = "Booking day cannot be empty."
    } else if (!start) {
      result.message = "Start time cannot be empty."
    } else {

      const [bookings] = await this.database.getAllBookingsByRego(rego)     
      const validate   = bookings.filter(b => b.day == day && start >= b.start && start < b.end)
      
      if (validate.length > 0) {
        timeslots = []
        result.error = false
      } else {
        const sorted     = bookings.sort((a, b) => a.start > b.start ? 1 : -1)
        const filtered   = sorted.filter(b => {
          
          return b.day == day && b.start > start
        })
        
        const startIndex = timeslots.indexOf(start)
        timeslots.splice(0, startIndex + 1)

        if (filtered.length > 0) {
          
          const endIndex = timeslots.indexOf(filtered[0].start)

          timeslots.splice(endIndex + 1, timeslots.length - endIndex)
        }

        result.error = false
      }
    }

    res.send(result.error ? result : timeslots)
  }

  async create(req, res) {

    const day      = req.body.day
    const start    = req.body.start
    const end      = req.body.end
    const rego     = req.body.rego
    const username = req.body.username

    const bid = Math.floor(Math.random() * 9999999999)
    const status = "PENDING"
    const late = 0

    const booking = {
      bid,
      rego,
      username,
      day,
      start,
      end,
      status,
      late
    }

    this.database.insertBooking(booking)
    res.send(booking)
  }

  async return(req, res) {

    const id = req.body.id

    const result = {
      error: true,
      message: "Booking unavailable, please select another time slot."
    }

    if (!id) {
      result.message = "ID cannot be empty!"
    } else {
      const [bookings] = await this.database.getAllBookings()
      const booking = bookings.filter(b => b.bid == id)[0]
      
      if (!booking) {
        result.message = "Booking doesn't exist"
      } else {
        
        const cost = calculateCost(booking.start, booking.end, 50.0)
        
        booking.status = "COMPLETE"

        await this.database.deleteBooking(booking)
        await this.database.insertHistory(booking)
        await this.database.insertTransactions({
          tid: Math.floor(Math.random() * 9999999999),
          bid: booking.bid,
          username: booking.username,
          timestamp: Date.now("en-AU", {timeZone: "Australia/Sydney"}),
          status: "COMPLETE",
          amount: cost,
          late: booking.late ? 15.0 : 0,
        })

        result.message = "Vehicle return successful"
        result.error = false
      }
    }

    res.send(result)
  }

  async deposit(req, res) {

    const username = req.body.username
    const bid      = req.body.bid

    const start    = req.body.start
    const end      = req.body.end

    const result = {
      error: true,
      message: "Booking unavailable, please select another time slot."
    }

    if (!username) {
      result.message = "Username cannot be empty."
    } else if (!bid) {
      result.message = "Booking ID cannot be empty."
    } else {
      
      await this.database.insertTransactions({
        tid: Math.floor(Math.random() * 9999999999),
        bid: bid,
        username: username,
        timestamp: Date.now("en-AU", {timeZone: "Australia/Sydney"}),
        status: "DEPOSIT",
        amount: calculateCost(start, end, 50.0) * depositRatio,
        late: 0,
      })

      result.message = "Deposit Successful"
      result.error   = false
    }

    res.send(result)
  }

  async cancel(req, res) {
    
    const id = req.body.id
    const result = {
      error: true,
      message: "Booking unavailable, please try again later."
    }

    if (!id) {
      result.message = "ID cannot be empty!"
    } else {
      const [bookings] = await this.database.getAllBookings()
      const booking = bookings.filter(b => b.bid == id)[0]
      
      if (!booking) {
        result.message = "Booking doesn't exist"
      } else {

        const day    = new Date().toLocaleDateString('en-AU', { hour12: false, timeZone: "Australia/Sydney" })
        const time   = new Date().toLocaleTimeString('en-AU', { hour12: false, timeZone: "Australia/Sydney" })

        let cost     = 0

        // Apply late cancelation fee if booking is canceled 
        // after the start time. Fee is half the booking cost
        // minus the deposit amount
        if (compareDay(booking.day, day, "<") || (compareDay(booking.day, day, "=") && booking.start < time)) {
          const total = calculateCost(booking.start, booking.end, 50.0)
          cost = total - (total * depositRatio)
        }

        booking.status = "CANCELLED"

        await this.database.deleteBooking(booking)
        await this.database.insertHistory(booking)
        await this.database.insertTransactions({
          tid: Math.floor(Math.random() * 9999999999),
          bid: booking.bid,
          username: booking.username,
          timestamp: Date.now("en-AU", {timeZone: "Australia/Sydney"}),
          status: "CANCELED",
          amount: cost,
          late: 0,
        })

        result.message = "Vehicle return successful"
        result.error = false
      }

    }

    res.send(result)
  }

  async extend(req, res) {

    const bid = req.body.bid
    const end = req.body.end

    const result = {
      error: true,
      message: "Booking unavailable, please try again later."
    }

    if (!bid) {
      result.message = "Booking id cannot be empty!"
    } else if (!end) {
      result.message = "Booking end time cannot be empty!"
    } else {
      const [bookings] = await this.database.getAllBookings()
      const [booking] = bookings.filter(b => b.bid == bid)

      booking.end = end
    
      this.database.updateBooking(booking)
      result.error = false
      result.message = "Booking extension successful"
    }

    res.send(result)
  }
}