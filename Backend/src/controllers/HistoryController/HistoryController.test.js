const HistoryController = require('./HistoryController.js')
const DatabaseMock = require('../../network/DatabaseMock')

describe("History Controller", () => {

  const database   = new DatabaseMock()
  const controller = new HistoryController(database)

  it("should return all Historys", async () => {
    const res = { 
      send(result) {
        expect(result).toStrictEqual([{"bid": 1}])
      } 
    }

    controller.all({}, res)
  })

  it("should return a Historys by id", async () => {
    const req = { body: database.user }
    const res = { 
      send(result) {
        expect(result).toStrictEqual([])
      } 
    }

    controller['get/id'](req, res)
  })

  it("should return a Historys by username", async () => {
    const req = { body: database.user }
    const res = { 
      send(result) {
        expect(result).toStrictEqual({})
      } 
    }

    controller['get/user'](req, res)
  })

})