import React from 'react'
import Enzyme, { shallow } from "enzyme"
import Adapter from "enzyme-adapter-react-16"

import Reset from './Reset'

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

describe("Reset", () => {
    it ('should display the form in the reset page', () => {

      setup([])

      const history = { push: jest.fn() }
      const wrapper = shallow(<Reset.WrappedComponent history={history}/>)
      const login = wrapper.find("form")
      expect(login.exists()).toBe(true)
    })  

    it ('should display two input passwords', () => {

      setup([])

      const history = { push: jest.fn() }
      const wrapper = shallow(<Reset.WrappedComponent history={history}/>)
      const password = wrapper.find('input[type="password"]')
      expect(password.length).toBe(2)
    })
})