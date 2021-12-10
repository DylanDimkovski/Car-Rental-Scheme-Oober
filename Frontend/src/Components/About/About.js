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
//	About.js is the about page for the website.
//
//-----------------------------------------------------------------------------

import { Component } from 'react';

class About extends Component {

  render() {
    return (
      <div className="container mt-5 w-50 mb-5">
        <h2>Who we are</h2>
        <p> 
            In Melbourne, where taxis are extremely expensive and the public transport systems leave much to be desired, 
            an alternative mode of transportation was always needed. This is where Oober is able to provide an optimal solution at an affordable cost.
            Launched in 2021, Oober is a new company in the car rental space, designed with the customer's best interests in mind. These are addressed by
            consistently offering a wide range of vehicles that are efficient as well as reliable in driving you to your desired destination.
          </p>
        <h2>What we do</h2>
        <p> Oober focuses on making transportation a simple process by giving people easy access to a number of vehicles, so you can be sure to find the right car for you. 
            Whether it is just for the day or for a longer period of time, Oober ensures that the rental of any available vehicle will be frictionless. Additionally, Oober is also
            taking the current situation regarding COVID-19 into account by changing the booking process to be entirely online and contactless in conjunction with deep-cleaning every vehicle
            after each rental.
            </p>
        <h2> Our process </h2>
        <p> In order for Oober to maintain simplicity, our rental process needed to be as streamlined as possible. Due to the nature of the booking system being online, all valuable information such as a Driver's 
            License will have to be submitted before the booking can be accepted. To begin the rental process, all you have to do is click the button at the
            top of the webpage labelled "Make a booking" and then follow the process from there by selecting which vehicle you would like to rent. Following this step, you are also  After the booking is accepted, any of our vehicles are able to be retrieved
             from the location in closest proximity to the customer. If a customer has a change of mind, they are presented with the option to terminate the rental early. However, if a customer would like to extend their lease they are also provided with that option as well.

        </p>
      </div>
    )
  }
}

export default About;