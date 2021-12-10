import React from 'react'
import Enzyme, { shallow } from "enzyme"
import Adapter from "enzyme-adapter-react-16"

import Footer from './Footer'

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

describe("Footer", () => {
  it ('should display several heading links for redirection', () => {

    setup([])

    const history = { push: jest.fn() }
    const wrapper = shallow(<Footer.WrappedComponent history={history}/>)
    const btn = wrapper.find("h6")
    expect(btn.length).toBe(4)
  })
})