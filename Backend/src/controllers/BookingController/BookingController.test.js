const BookingController = require('./BookingController.js')
const DatabaseMock = require('../../network/DatabaseMock')

describe("Booking Controller", () => {

  const database   = new DatabaseMock()
  const controller = new BookingController(database)

  it("should return all Bookings", async () => {
    const res = { 
      send(result) {
        expect(result).toStrictEqual([{"bid": 1}])
      } 
    }

    controller.all({}, res)
  })

  it("should return a Bookings by id", async () => {
    const req = { body: database.user }
    const res = { 
      send(result) {
        expect(result).toStrictEqual([])
      } 
    }

    controller['get/id'](req, res)
  })

  it("should return a Bookings by username", async () => {
    const req = { body: database.user }
    const res = { 
      send(result) {
        expect(result).toStrictEqual({})
      } 
    }

    controller['get/user'](req, res)
  })

})