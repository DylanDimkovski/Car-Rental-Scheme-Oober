import React from 'react'
import Enzyme, { shallow } from "enzyme"
import Adapter from "enzyme-adapter-react-16"

import Search from './Search'

Enzyme.configure({ adapter: new Adapter })

// * * * * * * * * * * * * * * * * * *
// * * MOCK BACKEND REQUEST SETUP  * *
// * * * * * * * * * * * * * * * * * *
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve(),
  })
)

global.localStorage = {
  getItem() { /* Intentionally Empty */ },
  setItem() { /* Intentionally Empty */ },
  clear() { /* Intentionally Empty */ }
}

const setup = (data) => {
  
  const mockPromise = Promise.resolve(data)
  const mockFetch = Promise.resolve({ json: () => mockPromise })

  jest.spyOn(global, 'fetch').mockImplementation((url) => {
    return mockFetch
  })

}
// * * * * * * * * * * * * * * * * * *
// * * * * * * * * * * * * * * * * * *

const cars = {
    make: "",
    model: "",
    type: "",
    location: "",
    distance: ""
}

const cars_valid = {
    rego: "ABC123",
    make: "Ford",
    model: "",
    type: "",
    location: "Melbourne",
    distance: "30"
}

describe("Search", () => {
  
    it ('should display the form in the search page', () => {

      setup([])

      const history = { push: jest.fn() }
      const wrapper = shallow(<Search.WrappedComponent history={history} cars={cars}/>)
      const login = wrapper.find(".container")
      expect(login.exists()).toBe(true)
    })  

    it ('should display an error on invalid address', () => {

        setup([])

        const error = true
        const message = "Location cannot be empty!"
        const history = { push: jest.fn() }

        setup({ error, message })

        const wrapper = shallow(<Search.WrappedComponent history={history} cars={cars}/>)
        wrapper.find('.btn-success').simulate('click')
        
        process.nextTick(() => {
            expect(wrapper.state("error")).toEqual(message)
        })
    })  

    it ('should display a valid car on correct input', () => {
        const history = { push: jest.fn() }
        const wrapper = shallow(<Search.WrappedComponent history={history} cars={cars_valid}/>)
        
        setup([cars_valid])
        
        wrapper.find('.btn-success').simulate('click')
        
        process.nextTick(() => {
            expect(wrapper.state("error")).toEqual("")
        })
    })  
})