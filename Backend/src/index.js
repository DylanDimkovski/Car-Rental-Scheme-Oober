//-----------------------------------------------------------------------------
// Copyright (C) 2021 by Oober Car Rentals, RMIT COSC2408 Programming Project 1
// 
// AUTHORS:
//  Arone Susau
//  Marcello Belli
//
// DESCRIPTION:
//	index.js is the configuration of the express server used to route requests
//  between application controllers.
//
//-----------------------------------------------------------------------------

const express = require('express')
const session = require('express-session')
const cors    = require('cors')
const multer = require('multer')

const multerMid = multer({
  storage: multer.memoryStorage(),
})

const Server = require('./network/server');
const server = new Server();

const app  = express()
const port = process.env.PORT || 80

app.use(session({
  secret: 'OoberCAPSTONE',
  resave: true,
  saveUninitialized: true,
}))

app.use(cors({"cors": { "origin": "*", "methods": ["GET", "POST"] }}))
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.disable('x-powered-by')
app.use(multerMid.single('file'))

server.route(app)

app.listen(port, () => {
  console.log(`[INFO] Listening on http://localhost:${port}`)
})
