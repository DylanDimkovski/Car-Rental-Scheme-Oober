const UserController = require('./UserController.js')
const DatabaseMock = require('../../network/DatabaseMock')

describe("User Controller", () => {

  const database   = new DatabaseMock()
  const controller = new UserController(database)

  it("should return the user data when passed a valid username", async () => {
    const req = { body: { username: database.user.username } }

    const res = { 
      send(result) {
        expect(result).toStrictEqual([database.user])
      } 
    }

    await controller.get(req, res)
  })

  it("should return an empty object when no matching username is found", async () => {
    const req = { body: { username: "hey now brown cow" } }

    const res = { 
      send(result) {
        expect(result).toStrictEqual({})
      } 
    }

    await controller.get(req, res)
  })

  it("should return all users", async () => {
    const req = {}

    const res = { 
      send(result) {
        const data = [database.user, database.user]
        expect(result).toStrictEqual(data)
      } 
    }

    await controller.all(req, res)
  })

  it("should login a user with correct credentials", async () => {
    const req = { body: { 
      username: database.user.username, 
      password: database.user.password 
    } }

    const res = { 
      send(result) {
        expect(database.user.login).toEqual(1)
        expect(result).toStrictEqual({ error: false, message: "Login Successful" })
      } 
    }

    await controller.login(req, res)
  })

  it("should fail to login a user with incorrect credentials", async () => {
    const req = { body: { 
      username: database.user.username, 
      password: "oopsie" 
    } }

    const res = { 
      send(result) {
        expect(database.user.login).toEqual(1)
        expect(result).toStrictEqual({ error: true, message: "Username or password is incorrect, please try again." })
      } 
    }

    await controller.login(req, res)
  })

  it("should logout a user with correct credentials", async () => {
    const req = { body: { 
      username: database.user.username, 
    } }

    const res = { 
      send(result) {
        expect(result).toStrictEqual({ error: false, message: "Logout Successful" })
      } 
    }

    await controller.logout(req, res)
  })

  it("should register a user with valid details", async () => {
    const req = { body: {
      username: "lily@test.com",
      fname: "lily",
      lname: "bar",
      password: "abc123",
      license: "12345678"
    } }

    const res = { 
      send(result) {
        expect(result).toStrictEqual({ error: false, message: "User Registration Successful" })
      } 
    }

    await controller.register(req, res)
  })

  it("should fail to register a user where the username already exists", async () => {
    const req = { body: database.user }

    const res = { 
      send(result) {
        expect(result).toStrictEqual({ error: true, message: "An account with that email already exists, please try again." })
      } 
    }

    await controller.register(req, res)
  })
  
})