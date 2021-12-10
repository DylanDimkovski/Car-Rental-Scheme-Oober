const PasswordController = require('./PasswordController.js')
const DatabaseMock = require('../../network/DatabaseMock')

describe("Password Controller", () => {

  const database   = new DatabaseMock()
  const controller = new PasswordController(database)

  it("should create a reset entity if the username exists", async () => {
    const req = { body: { username: database.user.username } }

    const res = { 
      send(result) {
        expect(result).toStrictEqual({ error: false, message: "Password Reset Successful." })
        expect(database.resets).toStrictEqual([{ username: database.user.username, unique: '12345678' }])
      } 
    }

    await controller.reset(req, res)
  })

  it("should update the user password when successfully reset ", async () => {
    const req = { body: { 
      username: database.user.username,
      password: "321cba",
      unique: database.resets[0].unique
    } }

    const res = { 
      send(result) {
        expect(result).toStrictEqual({ error: false, message: "Password Reset Successful." })
        expect(database.user.password).toStrictEqual(req.body.password)
      } 
    }

    await controller.update(req, res)
  })
  
})