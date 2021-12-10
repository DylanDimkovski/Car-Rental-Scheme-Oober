import React from 'react'
import Enzyme, { shallow } from "enzyme"
import Adapter from "enzyme-adapter-react-16"

import Login from './Login'

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
  
  const mockPromise = Promise.resolve([data])
  const mockFetch = Promise.resolve({ json: () => mockPromise })

  jest.spyOn(global, 'fetch').mockImplementation((url) => {
    return mockFetch
  })

}
// * * * * * * * * * * * * * * * * * *
// * * * * * * * * * * * * * * * * * *

const user = {
  fname: "test",
  lname: "tester",
  username: "tester@email.com",
  password: "Abcd1234",
  cPassword: "Abcd1234",
  license: "123456789",
}

describe("Login", () => {
  
  it ('should display error on invalid input', () => {
    const error = true
    const message = ""
    const history = { push: jest.fn() }
    
    setup({ error, message })
    
    const wrapper = shallow(<Login.WrappedComponent history={history} />)
    wrapper.find('.btn-success').simulate('click')
  
    process.nextTick(() => {
      expect(wrapper.state("error")).toEqual(message)
    })
  })
  
  it ('should accept valid user', () => {
    const error = false
    const message = ''
    const history = { push: jest.fn() }
  
    setup({ error, message })
    
    const wrapper = shallow(<Login.WrappedComponent user={user} history={history} />)
    wrapper.find('.btn-success').simulate('click')
  
    process.nextTick(() => {    
      expect(wrapper.state("error")).toEqual(message)
    })
  })
  
  it ('render forgot password', () => {
    const error = false
    const message = ''
    const history = { push: jest.fn() }
  
    setup({ error, message })
    
    const wrapper = shallow(<Login.WrappedComponent user={user} history={history}/>)
    
    wrapper.find('.forgotPassword').simulate('click', {
      preventDefault: () => { /* Intentionally Empty */ }
    });
    
    wrapper.find('.forgotsend').simulate('click')
  
    process.nextTick(() => {    
      expect(wrapper.state("error")).toEqual(message)
    })
  })

})
