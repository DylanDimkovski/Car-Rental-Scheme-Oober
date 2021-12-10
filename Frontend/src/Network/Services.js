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
//	Services.js provides an API that the frontend application can use to 
//  access the backend functionality programatically rather than directly
//  using queries or network requests.
//
//-----------------------------------------------------------------------------

import User from "./Model/User";
import Vehicle from "./Model/Vehicle";

import Outcome from "./Model/Outcome";
import Reset from "./Model/Reset";
import Booking from "./Model/Booking";
import Transaction from "./Model/Transaction";

/**
 * Basic Services and API requests
 */
class Services {
  constructor() {
    this.root =
      process.env.NODE_ENV === "development"
        ? "http://localhost/api"
        : "https://oober-capstone.herokuapp.com/api";
  }

  // * * * * * * * * * * *
  // User Authentication *
  // * * * * * * * * * * *

  /**
   * Login with users credentials
   * @param {string} username
   * @param {string} password
   * @returns {Promise<Outcome>} Outcome
   */
  login(username, password) {
    return fetch(this.root + "/user/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    })
      .then((res) => res.json())
      .then((res) => new Outcome(res));
  }

  /**
   * Logout user
   * @param {string} username
   * @returns {Promise<Outcome>} Outcome
   */
  logout(username) {
    return fetch(this.root + "/user/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    })
      .then((res) => res.json())
      .then((res) => new Outcome(res));
  }

  // * * * * * *
  // User CRUD *
  // * * * * * *

  /**
   * Get user by username
   * @param {string} username
   * @returns {Promise<Array<User>>} User
   */
  getUser(username) {
    return fetch(this.root + "/user/get", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    })
      .then((res) => res.json())
      .then((res) => res.map((user) => new User(user)));
  }

  /**
   * Get all users
   * @returns {Promise<Array<User>>} User Array
   */
  getAllUsers() {
    return fetch(this.root + "/user/all", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((res) => res.map((user) => new User(user)));
  }

  /**
   * Registers a new user
   * @returns {Promise<Outcome>} User Array
   */
  register(user) {
    return fetch(this.root + "/user/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    })
      .then((res) => res.json())
      .then((res) => new Outcome(res));
  }

  /**
   * Updates a user
   * @returns {Promise<Object>} User object
   */
   updateUser(user) {
    return fetch(this.root + "/user/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    }).then((res) => res.json())
  }

  // * * * * * * * * * * *
  // Password Management *
  // * * * * * * * * * * *

  /**
   * Submits a request to reset a users password
   * @param {string} username
   * @returns {Promise<Outcome>} User
   */
  passwordReset(username) {
    return fetch(this.root + "/password/reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    })
      .then((res) => res.json())
      .then((res) => new Outcome(res));
  }

  /**
   * Submits a request to update a user password if the reset request exists
   * @param {string} username
   * @param {string} password
   * @param {string} unique
   * @returns {Promise<Outcome>} User
   */
  passwordUpdate(username, password, unique) {
    return fetch(this.root + "/password/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, unique }),
    })
      .then((res) => res.json())
      .then((res) => new Outcome(res));
  }

  /**
   * Gets the details of a password reset request
   * @param {string} username
   * @param {string} unique
   * @returns {Promise<Outcome>} User
   */
  getReset(username, unique) {
    return fetch(this.root + "/password/get", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, unique }),
    })
      .then((res) => res.json())
      .then((res) => new Reset(res));
  }

  // * * * * * * * *
  // Vehicle CRUD  *
  // * * * * * * * *

  /**
   * Search for a vehicle by rego
   * @returns {Promise<Vehicle>} Vehicle
   */
  getVehicleByRego(rego) {
    return fetch(this.root + "/vehicle/get", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rego }),
    })
      .then((res) => res.json())
      .then((res) => new Vehicle(res[0]));
  }

  /**
   * Gets all vehicles
   * @returns {Promise<Array<Vehicle>>} Vehicles
   */
  getAllVehicles() {
    return fetch(this.root + "/vehicle/all", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((res) => res.map((vehicle) => new Vehicle(vehicle)));
  }

  /**
   * Search for a vehicle
   * @returns {Promise<Array<Vehicle>>} Vehicles
   */
  getVehicleSearch(make, model, type, location, distance) {
    return fetch(this.root + "/vehicle/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        make,
        model,
        type,
        location,
        distance,
      }),
    })
      .then((res) => res.json())
      .then((res) =>
        res.error ? res : res.map((vehicle) => new Vehicle(vehicle))
      );
  }

  // * * * * * * * *
  // Booking CRUD  *
  // * * * * * * * *

  /**
   * Gets booking by id
   * @returns {Promise<Array<Booking>>} Booking
   */
  getBookingById(id) {
    return fetch(this.root + "/booking/get/id", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })
      .then((res) => res.json())
      .then((res) => res.map((booking) => new Booking(booking)));
  }

  /**
   * Gets booking by username
   * @returns {Promise<Array<Booking>>} Booking
   */
  getBookingByUsername(username) {
    return fetch(this.root + "/booking/get/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    })
      .then((res) => res.json())
      .then((res) => res.map((booking) => new Booking(booking)));
  }

  /**
   * Gets booking by rego
   * @returns {Promise<Array<Booking>>} Booking
   */
  getBookingByRego(rego) {
    return fetch(this.root + "/booking/get/rego", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rego }),
    })
      .then((res) => res.json())
      .then((res) => res.map((booking) => new Booking(booking)));
  }

  /**
   * Gets all bookings
   * @returns {Promise<Array<Booking>>} Booking
   */
  getAllBookings() {
    return fetch(this.root + "/booking/all", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((res) => res.map((booking) => new Booking(booking)));
  }

  /**
   * Gets all possible booking start times for a vehicle
   * on a certain day
   * @returns {Promise<Array<String>>} Booking Start Times
   */
  getBookingStartTime(rego, day) {
    return fetch(this.root + "/booking/starts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rego, day }),
    }).then((res) => res.json());
  }

  /**
   * Gets all possible booking end times for a vehicle on
   * a certain day, given a certain starting time
   * @returns {Promise<Array<String>>} Booking End Times
   */
  getBookingEndTime(rego, day, start) {
    return fetch(this.root + "/booking/ends", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rego, day, start }),
    }).then((res) => res.json());
  }

  /**
   * Creates booking
   * @param {String} day Day of booking
   * @param {String} start Start time of booking
   * @param {String} end End time of booking
   * @param {String} rego Vehicle rego of booking
   * @param {String} username Username making booking
   * @returns {Promise<Outcome>} Response outcome
   */
  createBooking(day, start, end, rego, username) {
    return fetch(this.root + "/booking/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ day, start, end, rego, username }),
    }).then((res) => res.json());
  }

  /**
   * Returns booking and completes booking
   * @param {String} day Day of booking
   * @returns {Promise<Outcome>} Response outcome
   */
  returnBooking(bid) {
    return fetch(this.root + "/booking/return", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: bid }),
    }).then((res) => res.json());
  }

  /**
   * Create booking deposit
   * @param {String} username Username
   * @param {String} bid Booking id 
   * @param {String} start Booking start time
   * @param {String} end Booking time
   * @returns {Promise<Outcome>} Response outcome
   */
  bookingDeposit(username, bid, start, end) {
    return fetch(this.root + "/booking/deposit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, bid, start, end }),
    }).then((res) => res.json());
  }

  /**
   * Cancels booking
   * @param {String} day Day of booking
   * @returns {Promise<Outcome>} Response outcome
   */
  cancelBooking(bid) {
    return fetch(this.root + "/booking/cancel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: bid }),
    }).then((res) => res.json());
  }

  /**
   * Extends booking
   * @param {String} bid Booking ID
   * @param {String} end Booking end time
   * @returns {Promise<Outcome>} Response outcome
   */
  extendBooking(bid, end) {
    return fetch(this.root + "/booking/extend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bid, end }),
    }).then((res) => res.json());
  }

  // * * * * * * * *
  // History CRUD  *
  // * * * * * * * *

  /**
   * Gets all history
   * @returns {Promise<Array<Booking>>} Booking
   */
   getAllHistory() {
    return fetch(this.root + "/history/all", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((res) => res.map((booking) => new Booking(booking)));
  }

  /**
   * Gets histroy by booking id
   * @returns {Promise<Array<Booking>>} Booking
   */
   getHistory(id) {
    return fetch(this.root + "/history/get/id", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })
      .then((res) => res.json())
      .then((res) => res.map((booking) => new Booking(booking)));
  }

  /**
   * Gets histroy by booking rego
   * @returns {Promise<Array<Booking>>} Booking
   */
   getHistoryByRego(rego) {
    return fetch(this.root + "/history/get/rego", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rego }),
    })
      .then((res) => res.json())
      .then((res) => res.map((booking) => new Booking(booking)));
  }

  /**
   * Gets histroy by booking username
   * @returns {Promise<Array<Booking>>} Booking
   */
   getHistoryByUser(username) {
    return fetch(this.root + "/history/get/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    })
      .then((res) => res.json())
      .then((res) => res.map((booking) => new Booking(booking)));
  }

  // * * * * * * * * * *
  // Transaction CRUD  *
  // * * * * * * * * * *

  /**
   * Gets all transactions
   * @returns {Promise<Array<Transaction>>} Transaction
   */
   getAllTransaction() {
    return fetch(this.root + "/transaction/all", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((res) => res.map((booking) => new Transaction(booking)));
  }

  /**
   * Gets transaction by booking id
   * @returns {Promise<Array<Transaction>>} Transaction
   */
   getTransaction(id) {
    return fetch(this.root + "/transaction/get/id", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })
      .then((res) => res.json())
      .then((res) => res.map((booking) => new Transaction(booking)));
  }

  /**
   * Gets transaction by rego
   * @returns {Promise<Array<Transaction>>} Transaction
   */
   getTransactionByRego(rego) {
    return fetch(this.root + "/transaction/get/rego", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rego }),
    })
      .then((res) => res.json())
      .then((res) => res.map((booking) => new Transaction(booking)));
  }

  /**
   * Gets histroy by transaction username
   * @returns {Promise<Array<Transaction>>} Transaction
   */
   getTransactionByUser(username) {
    return fetch(this.root + "/transaction/get/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    })
      .then((res) => res.json())
      .then((res) => res.map((booking) => new Transaction(booking)));
  }

  // * * * * * * * * * * *
  // Admin Functionality *
  // * * * * * * * * * * *

  /**
   * Locks a user account
   * @returns {Promise<Object>} Result
   */
   lockAccount(username) {
    return fetch(this.root + "/user/lock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    })
      .then((res) => res.json())
  }

  /**
   * Unlocks a user account
   * @returns {Promise<Object>} Result
   */
   unlockAccount(username) {
    return fetch(this.root + "/user/unlock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    })
      .then((res) => res.json())
  }

  /**
   * Unlocks a car to the list
   * @returns {Promise<Object>} Result
   */
  uploadCar(data) {
    return fetch(this.root + "/vehicle/upload", {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
  }

  // * * * * * * * *
  // Feedback CRUD *
  // * * * * * * * *

  /**
   * Gets all feedback
   * @returns {Promise<Array<Object>>} Result
   */
  getAllFeedback(data) {
    return fetch(this.root + "/feedback/all", {
      method: "GET",
    })
    .then((res) => res.json())
  }

  /**
   * Sends feedback of vehicle
   * @returns {Promise<Object>} Result
   */
   createFeedback(data) {
    return fetch(this.root + "/feedback/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
  }

}

export default Services;
