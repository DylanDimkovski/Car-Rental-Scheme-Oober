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
//	Search.js is the search page for the booking application process.
//
//-----------------------------------------------------------------------------

import { Component } from 'react';
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom';
import Services from '../../Network/Services.js'

const service = new Services()

class Search extends Component {
    
    constructor() {
        super()
        
        this.state = {
            cars: [],
            carCards: [],
            make: "",
            model: "",
            type: "",
            location: "",
            distance: 5,
            error: ""
        }
    }

    async fetchSearch() {
        const cars = await service.getVehicleSearch(
            this.state.make,
            this.state.model,
            this.state.type,
            this.state.location,
            this.state.distance
        )

        if (cars.error) {
            this.setState({
                error: cars.message,
            })
        } else {
            this.setState({
                error: "",
                cars: cars,
                carCards: this.generateCards(cars)
            })
        }
    }

    generateCards(cars) {
        return cars.map(product => (
                <div className="card shadow-sm" style={{width: "18rem"}} key={product.rego}>
                    <img src={product.image_url} className="card-img-top" alt={`${product.make}CarImage`} />
                    <div className="card-body d-flex flex-column justify-content-end gap-3">
                        <div className="d-flex flex-column justify-content-between">
                            <h5 className="card-title">{product.make} {product.model} {product.type}</h5>
                            <p>{`${product.rego}`}</p>
                            <p className="fw-lighter">{`${product.location}`}</p>
                        </div>
                        <div className="d-flex justify-content-between mt-3">
                            <p>{`${product.distance}, ${product.duration}` }</p>
                            <Link className="btn btn-primary view" to={localStorage.getItem("loggedIn") ? `booking?rego=${product.rego}` : 'register'}>View</Link>
                        </div>
                    </div>
                </div>
            )
        )
    }

    updateMake(e) { this.setState({ make: e.target.value }) }

    updateModel(e) { this.setState({ model: e.target.value }) }

    updateType(e) { this.setState({ type: e.target.value }) }

    updateLocation(e) { this.setState({ location: e.target.value }) }

    updateDistance(e) { 
        let distance = e.target.value

        if (distance > 30) {
           distance = 30 
           e.target.value = 30
        }

        this.setState({ distance: distance })
    }
    
    displayError() {
        return (
            <div className="d-flex justify-content-center w-100"> 
                <p className="p-2 px-4 rounded-pill bg-danger text-white font-bold">{this.state.error}</p>
            </div>
        )
    }

    render() {
        return (
        <div className="container mt-5 w-75 mb-5">
            <h1>View Avaliable Cars</h1>
            <div className="d-flex gap-3">
                <input onChange={this.updateLocation.bind(this)} type="address" className="form-control mb-3 mt-2" placeholder="Current Address.."/> 
                <div className="input-group mb-3 w-25">
                    <span className="input-group-text mt-2" id="basic-addon3">Distance</span>
                    <input onChange={this.updateDistance.bind(this)} type="number" className="form-control mt-2" min="0" max="30" step="5" id="basic-url" aria-describedby="basic-addon3" />
                </div>
            </div>
            <div className="d-flex flex-row gap-3">
                <input onChange={this.updateMake.bind(this)} type="text" className="form-control mt-2" placeholder="Make.."/>
                <input onChange={this.updateModel.bind(this)} type="text" className="form-control mt-2" placeholder="Model.."/>
                <input onChange={this.updateType.bind(this)} type="text" className="form-control mt-2" placeholder="Type.."/>
                <button className="mt-2 btn btn-success w-25" onClick={this.fetchSearch.bind(this)}>Search</button>
            </div>
            <div className="d-flex flex-wrap mt-4 mb-5 justify-content-between gap-5">
                {this.state.error ? this.displayError() : this.state.carCards}
            </div>
        </div>
    )
  }
}

export default withRouter(Search)