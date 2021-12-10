import React from 'react'
import Enzyme, { shallow } from "enzyme"
import Adapter from "enzyme-adapter-react-16"

import Header from './Header'

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

describe("Header", () => {
  it ('should display two buttons', () => {

    setup([])

    const history = { push: jest.fn() }
    const wrapper = shallow(<Header.WrappedComponent history={history}/>)
    const btn = wrapper.find(".btn")
    expect(btn.length).toBe(2)
  })  
  
  it ('should display a brand logo', () => {

    setup([])

    const history = { push: jest.fn() }
    const wrapper = shallow(<Header.WrappedComponent history={history}/>)
    const btn = wrapper.find(".navbar-brand")
    expect(btn.length).toBe(1)
  })  
})