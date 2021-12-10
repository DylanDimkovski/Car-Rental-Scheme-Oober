const TransactionController = require('./TransactionController.js')
const DatabaseMock = require('../../network/DatabaseMock')

describe("Transaction Controller", () => {

  const database   = new DatabaseMock()
  const controller = new TransactionController(database)

  it("should return all transactions", async () => {
    const res = { 
      send(result) {
        expect(result).toStrictEqual([{"tid": 1}])
      } 
    }

    controller.all({}, res)
  })

  it("should return a transactions by id", async () => {
    const req = { body: database.user }
    const res = { 
      send(result) {
        expect([]).toStrictEqual([])
      } 
    }

    controller['get/id'](req, res)
  })

  it("should return a transactions by username", async () => {
    const req = { body: database.user }
    const res = { 
      send(result) {
        expect({}).toStrictEqual({})
      } 
    }

    controller['get/user'](req, res)
  })

})