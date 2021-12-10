import React from 'react'
import Enzyme, { shallow } from "enzyme"
import Adapter from "enzyme-adapter-react-16"

import Booking from './Booking'

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

describe("Booking", () => {
  it ('should display the date input', () => {

    setup([{ rego: "" }])
    const location = { hash: "", key: "fr1u9m", pathname: "/booking", search: "?rego=ABC124", state: {} }
    const history = { push: jest.fn() }
    const wrapper = shallow(<Booking.WrappedComponent history={history} location={location}/>)
    const btn = wrapper.find('input[type="date"]')
    expect(btn.length).toBe(1)
  })

  it ('should display two select times for the booking slots', () => {

    setup([{ rego: "" }])
    const location = { hash: "", key: "fr1u9m", pathname: "/booking", search: "?rego=ABC124", state: {} }
    const history = { push: jest.fn() }
    const wrapper = shallow(<Booking.WrappedComponent history={history} location={location}/>)
    const btn = wrapper.find('select')
    expect(btn.length).toBe(2)
  })

})