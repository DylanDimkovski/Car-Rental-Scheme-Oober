import React from 'react'
import Enzyme, { shallow } from "enzyme"
import Adapter from "enzyme-adapter-react-16"

import Profile from './Profile'

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

describe("Profile", () => {
    
  it ('should display a container for the tables', () => {

    setup([])

    const history = { push: jest.fn() }
    const wrapper = shallow(<Profile.WrappedComponent history={history}/>)
    const profile = wrapper.find(".container")
    expect(profile.exists()).toBe(true)
  })    

  it ('should display a nav for navigation', () => {

    setup([])

    const history = { push: jest.fn() }
    const wrapper = shallow(<Profile.WrappedComponent history={history}/>)
    const nav = wrapper.find(".nav")
    expect(nav.exists()).toBe(true)
  })    

  it ('should display a nav for navigation', () => {

    setup([])

    const history = { push: jest.fn() }
    const wrapper = shallow(<Profile.WrappedComponent history={history}/>)
    const modal = wrapper.find(".modal")
    expect(modal.exists()).toBe(true)
  })    
})