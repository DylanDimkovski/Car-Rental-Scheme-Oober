const FeedbackController = require('./FeedbackController.js')
const DatabaseMock = require('../../network/DatabaseMock')

describe("Feedback Controller", () => {

  const database   = new DatabaseMock()
  const controller = new FeedbackController(database)

  it("should return all Feedbacks", async () => {
    const res = { 
      send(result) {
        expect(result).toStrictEqual({})
      } 
    }

    controller.all({}, res)
  })

})