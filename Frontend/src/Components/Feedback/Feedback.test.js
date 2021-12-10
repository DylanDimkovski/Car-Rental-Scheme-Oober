import React from 'react'
import Enzyme, { shallow } from "enzyme"
import Adapter from "enzyme-adapter-react-16"

import Feedback from './Feedback'

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
global.window = {
  bootstrap: {
    Modal: function () {
      this.show = function () {}
    }
  }
}

global.document = {
  getElementById() {}
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

describe("Feedback", () => {
  it ('should display five stars', () => {

    setup([])

    const wrapper = shallow(<Feedback/>)
    const btn = wrapper.find(".d-inline")
    expect(btn.length).toBe(6)
  })

  it ('should display a feedback area to provide additional information', () => {

    setup([])

    const wrapper = shallow(<Feedback/>)
    const btn = wrapper.find("textarea")
    expect(btn.length).toBe(1)
  })
})