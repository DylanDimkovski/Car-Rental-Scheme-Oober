const VehicleController = require('./VehicleController.js')
const DatabaseMock = require('../../network/DatabaseMock')

describe("Vehicle Controller", () => {

  const database   = new DatabaseMock()
  const controller = new VehicleController(database)

  it("should return a valid vehicle if the rego matches an existing vehicle", async () => {
    const req = { body: { rego: database.vehicle.rego } }

    const res = { 
      send(result) {
        expect(result).toStrictEqual(database.vehicle)
      } 
    }

    await controller.get(req, res)
  })

  it("should return an empty list if the rego does not match an existing vehicle", async () => {
    const req = { body: { rego: "" } }

    const res = { 
      send(result) {
        expect(result).toStrictEqual()
      } 
    }

    await controller.get(req, res)
  })

  it("should return all vehicles", async () => {
    const res = { 
      send(result) {
        expect(result).toStrictEqual([database.vehicles[0]])
      } 
    }

    await controller.all({}, res)
  })

  it("should insert a new vehicle into the list with all attributes present", async () => {
    const req = { body: database.vehicle }
    
    req.body.rego = "321ABC"
    req.file = "cows go moo"

    const res = { 
      send(result) {
        expect(result).toStrictEqual({
          error: false,
          message: "Vehicle Successfully Created"
        })

        expect(database.vehicles[1].rego).toStrictEqual(req.body.rego)

        database.vehicles.pop()
      } 
    }

    await controller.upload(req, res)
  })

  it("should return an error if the rego attribute is missing", async () => {
    const req = { body: {} }
    
    const res = { 
      send(result) {
        expect(result).toStrictEqual({
          "error": true,
          "message": "Rego cannot be empty!",
        })
      } 
    }

    await controller.upload(req, res)
  })

  it("should return an error if the image file attribute is missing", async () => {
    const req = { body: database.vehicle }
    
    req.body.rego = "321ABC"

    const res = { 
      send(result) {
        expect(result).toStrictEqual({
          "error": true,
          "message": "Vehicle image cannot be empty!",
        })
      } 
    }

    await controller.upload(req, res)
  })

  it("should return a list of vehicles within range of limit", async () => {
    const req = { 
      body: {
        make: "",
        model: "",
        type: "",
        location: database.vehicle.location,
        distance: 50,
      } 
    }
    
    const res = { 
      send(result) {
        expect(result[0].rego).toStrictEqual(database.vehicle.rego)
      } 
    }

    await controller.search(req, res)
  })

  it("should return an empty list of vehicles if none are within range", async () => {
    const req = { 
      body: {
        make: "",
        model: "",
        type: "",
        location: database.vehicle.location,
        distance: 1,
      } 
    }
    
    const res = { 
      send(result) {
        expect(result).toStrictEqual([])
      } 
    }

    await controller.search(req, res)
  })

  it("should return an error if the location is not defined", async () => {
    const req = { body: {} }
    
    const res = { 
      send(result) {
        expect(result).toStrictEqual({
          "error": true,
          "message": "Location cannot be empty!",
        })
      } 
    }

    await controller.search(req, res)
  })
  
})