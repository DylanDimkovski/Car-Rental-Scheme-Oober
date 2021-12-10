# Overview

This file contains the current design of our backend API.

- **Cloud Service Provider**: Heroku
- **Live Link**: http://oober-capstone.herokuapp.com/

# Table of Contents
- [User Endpoints](#User-Endpoints)
  - [`api/user/get`](#apiuserget)
  - [`api/user/all`](#apiuserall)
  - [`api/user/login`](#apiuserlogin)
  - [`api/user/logout`](#apiuserlogout)
  - [`api/user/register`](#apiuserregister)
- [Password Endpoints](#Password-Endpoints)
  - [`api/password/get`](#apipasswordget)
  - [`api/password/reset`](#apipasswordreset)
  - [`api/password/update`](#apipasswordupdate)
  - [`api/password/secure`](#apipasswordsecure)
- [Vehicle Endpoints](#Vehicle-Endpoints)
  - [`api/vehicle/get`](#apivehicleget)
  - [`api/vehicle/all`](#apivehicleall)
  - [`api/vehicle/search`](#apivehiclesearch)
  - [`api/vehicle/upload`](#apivehicleupload)
- [Booking Endpoints](#Booking-Endpoints)
  - [`api/booking/get/id`](#apibookinggetid)
  - [`api/booking/get/user`](#apibookinggetuser)
  - [`api/booking/get/rego`](#apibookinggetrego)
  - [`api/booking/all`](#apibookingall)
  - [`api/booking/starts`](#apibookingstarts)
  - [`api/booking/ends`](#apibookingends)
  - [`api/booking/create`](#apibookingcreate)
  - [`api/booking/return`](#apibookingreturn)
  - [`api/booking/cancel`](#apibookingcancel)
  - [`api/booking/extend`](#apibookingextend)
  - [`api/booking/deposit`](#apibookingdeposit)
- [History Endpoints](#Booking-Endpoints)
  - [`api/history/get/id`](#apihistorygetid)
  - [`api/history/get/user`](#apihistorygetuser)
  - [`api/history/get/rego`](#apihistorygetrego)
  - [`api/history/all`](#apihistroyall)
- [Feedback Endpoints](#Feedback-Endpoints)
  - [`api/feedback/all`](#apifeedbackall)
  - [`api/feedback/create`](#apifeedbackcreate)

# User Endpoints

### `api/user/get`
- Description: Get a user by username
- Method: POST
#### Input
```JSON
{
  "username": "user@email.com",
}
```

#### Output
```JSON
[
  {
    "username": "user@email.com",
    "password": "abc123",
    "fname": "John",
    "lname": "Doe",
    "login": "0",
    "license": "12345678"
  }
]
```

### `api/user/all`
- Description: Get all users
- Method: GET
#### Output
```JSON
[
  {
    "username": "user@email.com",
    "password": "abc123",
    "fname": "John",
    "lname": "Doe",
    "login": "0",
    "license": "12345678"
  }
]
```

### `api/user/login`
- Description: Login a user if the credentials are valid
- Method: POST
#### Input
```JSON
{
  "username": "user@email.com",
  "password": "abc123",
}
```

#### Output
```JSON
{
  "error": true,
  "message": "Something went wrong."
}
```

### `api/user/logout`
- Description: Logout a user if the credentials are valid
- Method: POST
#### Input
```JSON
{
  "username": "user@email.com",
}
```

#### Output
```JSON
{
  "error": true,
  "message": "Something went wrong."
}
```

### `api/user/register`
- Description: Creates a new user if the details are valid
- Method: POST
#### Input
```JSON
{
  "username": "user@email.com",
  "password": "abc123",
  "fname": "John",
  "lname": "Doe",
  "login": "0",
  "license": "12345678"
}
```

#### Output
```JSON
{
  "error": true,
  "message": "Something went wrong."
}
```
# Password Endpoints

### `api/password/get`
- Description: Gets the password reset request entity
- Method: POST
#### Input
```JSON
{
  "username": "user@email.com",
  "unique": "12345678"
}
```

#### Output
```JSON
{
  "username": "user@email.com",
  "unique": "12345678"
}
```

### `api/password/reset`
- Description: Creates a password reset entity and sends the reset email to the user
- Method: POST
#### Input
```JSON
{
  "username": "user@email.com",
}
```

#### Output
```JSON
{
  "error": true,
  "message": "Something went wrong."
}
```

### `api/password/update`
- Description: Updates the user password and removes the reset entity
- Method: POST
#### Input
```JSON
{
  "username": "user@email.com",
  "password": "abc123",
  "unique": "12345678"
}
```

#### Output
```JSON
{
  "error": true,
  "message": "Something went wrong."
}
```

### `api/password/secure`
- Description: Checks if the user is currently logged in
- Method: POST
#### Input
```JSON
{
  "username": "user@email.com",
}
```

#### Output
```JSON
{
  "result": 1
}
```

# Vehicle Endpoints

### `api/vehicle/get`
- Description: Gets a vehicle by its registration number
- Method: POST
#### Input
```JSON
{
  "rego": "ABC123",
}
```

#### Output
```JSON
{
  "rego": "ABC123",
  "make": "Ford",
  "description": "some text",
  "model": "Fiesta",
  "type": "Hatchback",
  "location": "133 Chetwynd St, North Melbourne VIC 3051",
  "image_url": "some link"
}
```

### `api/vehicle/all`
- Description: Checks if the user is currently logged in
- Method: GET
#### Input
```JSON
{
}
```

#### Output
```JSON
[{
  "rego": "ABC123",
  "make": "Ford",
  "description": "some text",
  "model": "Fiesta",
  "type": "Hatchback",
  "location": "133 Chetwynd St, North Melbourne VIC 3051",
  "image_url": "some link"
}]
```

### `api/vehicle/search`
- Description: Search for a vehicle based on descriptors and location distance.
- Method: POST
#### Input
```JSON
{
  "location": "Melbourne",
  "make": "Ford",
  "model": "Fiesta",
  "type": "Hatchback",
  "distance": 30
}
```

#### Output
```JSON
[{
  "rego": "ABC123",
  "make": "Ford",
  "model": "Fiesta",
  "type": "Hatchback",
  "description": "some text",
  "location": "133 Chetwynd St, North Melbourne VIC 3051",
  "image_url": "some url",
  "distance": "2.4 km",
  "duration": "10 mins"
}]
```

### `api/vehicle/upload`
- Description: Uploads a new car to the vehicle catalog
- Method: POST
#### Input
```JSON
{
  "rego": "ABC123",
  "make": "Ford",
  "model": "Fiesta",
  "type": "Hatchback",
  "description": "some text",
  "location": "133 Chetwynd St, North Melbourne VIC 3051",
  "file": "JPEG_FILE"
}
```

#### Output
```JSON
{
  "error": false,
  "message": "Vehicle Successfully Created"
}
```

# Booking Endpoints

### `api/booking/get/id`
- Description: Get a booking by its booking ID
- Method: POST
#### Input
```JSON
{
  "bid": "1234"
}
```

#### Output
```JSON
{
  "username": "user@email.com",
  "rego": "ABC123",
  "start": "02/09/2021 9:00",
  "end": "02/09/2021 10:00",
  "returned": "",
  "status": "PENDING",
  "late": 0
}
```

### `api/booking/get/user`
- Description: Get a booking by username
- Method: POST
#### Input
```JSON
{
  "username": "user@user.com.au"
}
```

#### Output
```JSON
[{
  "username": "user@email.com",
  "rego": "ABC123",
  "start": "02/09/2021 9:00",
  "end": "02/09/2021 10:00",
  "returned": "",
  "status": "PENDING",
  "late": 0
}]
```

### `api/booking/get/rego`
- Description: Get a booking by vehicle registration
- Method: POST
#### Input
```JSON
{
  "rego": "ABC123"
}
```

#### Output
```JSON
[{
  "username": "user@email.com",
  "rego": "ABC123",
  "start": "02/09/2021 9:00",
  "end": "02/09/2021 10:00",
  "returned": "",
  "status": "PENDING",
  "late": 0
}]
```

### `api/booking/all`
- Description: Get all bookings
- Method: GET
#### Input
```JSON
{
}
```

#### Output
```JSON
[{
  "username": "user@email.com",
  "rego": "ABC123",
  "start": "02/09/2021 9:00",
  "end": "02/09/2021 10:00",
  "returned": "",
  "status": "PENDING",
  "late": 0
}]
```

### `api/booking/starts`
- Description: Get valid booking start times
- Method: POST
#### Input
```JSON
{
  "rego": "ABC123",
  "day": "10/10/2020"
}
```

#### Output
```JSON
[
  "19:30",
  "20:00",
  "20:30",
  "21:00",
  "22:00",
  "22:30",
  "23:00"
]
```

### `api/booking/ends`
- Description: Get valid booking end times
- Method: POST
#### Input
```JSON
{
  "rego": "ABC123",
  "day": "10/10/2020",
  "start": "20:00"
}
```

#### Output
```JSON
[
  "20:00",
  "20:30",
  "21:00",
  "21:30",
  "22:00",
  "22:30",
  "23:00"
]
```

### `api/booking/create`
- Description: Create a booking record
- Method: POST
#### Input
```JSON
{
  "rego": "ABC123",
  "username": "user@user.com",
  "day": "10/10/2020",
  "start": "20:00",
  "end": "21:00",
}
```

#### Output
```JSON
{
  "error": false,
  "message": "Vehicle booking successful"
}
```

### `api/booking/return`
- Description: Return a vehicle and complete the booking record
- Method: POST
#### Input
```JSON
{
  "id": "1234"
}
```

#### Output
```JSON
{
  "error": false,
  "message": "Vehicle return successful"
}
```

### `api/booking/cancel`
- Description: Cancel a vehicle booking record
- Method: POST
#### Input
```JSON
{
  "id": "1234"
}
```

#### Output
```JSON
{
  "error": false,
  "message": "Vehicle cancel successful"
}
```

### `api/booking/extend`
- Description: Extend a vehicle booking record
- Method: POST
#### Input
```JSON
{
  "bid": "1234",
  "end": "21:00",
}
```

#### Output
```JSON
{
  "error": false,
  "message": "Booking extend successful"
}
```

### `api/booking/deposit`
- Description: Create a booking deposit
- Method: POST
#### Input
```JSON
{
  "bid": "1234",
  "username": "user@user.com",
  "start": "10:00",
  "end": "15:00",
}
```

#### Output
```JSON
{
  "error": false,
  "message": "Booking deposit successful"
}
```

# History Endpoints

### `api/history/get/id`
- Description: Get a booking history by its booking ID
- Method: POST
#### Input
```JSON
{
  "bid": "1234"
}
```

#### Output
```JSON
{
  "username": "user@email.com",
  "rego": "ABC123",
  "start": "02/09/2021 9:00",
  "end": "02/09/2021 10:00",
  "returned": "",
  "status": "PENDING",
  "late": 0
}
```

### `api/history/get/user`
- Description: Get a booking history by username
- Method: POST
#### Input
```JSON
{
  "username": "user@user.com.au"
}
```

#### Output
```JSON
[{
  "username": "user@email.com",
  "rego": "ABC123",
  "start": "02/09/2021 9:00",
  "end": "02/09/2021 10:00",
  "returned": "",
  "status": "PENDING",
  "late": 0
}]
```

### `api/history/get/rego`
- Description: Get a booking history by vehicle registration
- Method: POST
#### Input
```JSON
{
  "rego": "ABC123"
}
```

#### Output
```JSON
[{
  "username": "user@email.com",
  "rego": "ABC123",
  "start": "02/09/2021 9:00",
  "end": "02/09/2021 10:00",
  "returned": "",
  "status": "PENDING",
  "late": 0
}]
```

### `api/history/all`
- Description: Get all bookings history
- Method: GET
#### Input
```JSON
{
}
```

#### Output
```JSON
[{
  "username": "user@email.com",
  "rego": "ABC123",
  "start": "02/09/2021 9:00",
  "end": "02/09/2021 10:00",
  "returned": "",
  "status": "PENDING",
  "late": 0
}]
```

# Feedback Endpoints

### `api/feedback/all`
- Description: Get all booking feedback
- Method: GET
#### Input
```JSON
{
}
```

#### Output
```JSON
[{
  "fid": "1234",
  "bid": "1234",
  "username": "user@email.com",
  "info": "Great stuff",
  "ratiing": 5,
}]
```

### `api/feedback/create`
- Description: Create a new booking feedback
- Method: GET
#### Input
```JSON
{
  "bid": "1234",
  "username": "user@email.com",
  "info": "Great stuff",
  "ratiing": 5,
}
```

#### Output
```JSON
{
  "error": false,
  "message": "Booking deposit successful"
}
```