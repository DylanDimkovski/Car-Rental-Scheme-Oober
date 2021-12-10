# Overview

This file contains the current design of our database architecture and table schema.

- **Cloud Service Provider**: Google Cloud
- **Database System**: Datastore
- **File Storage**: Cloud Storage

# Table of Contents
- [User](#User)
- [Reset](#Reset)
- [Vehicle](#Vehicle)
- [Booking](#Booking)
- [History](#History)
- [Transaction](#Transaction)
- [Feedback](#Feedback)

# User

A user record containing all user personal information.

| Field    | Datatype           | Example        | Description        |
|----------|--------------------|----------------|--------------------|
| username | Primary Key String | user@email.com | User email address |
| password | String             | abc123         | User password      |
| fname    | String             | John           | User first name    |
| lname    | String             | Doe            | User last name     |
| login    | Int                | 0              | Is user logged in  |
| license  | Int                | 12345678       | User License       |

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

# Reset

A reset record representing a current password reset request.

| Field    | Datatype           | Example        | Description          |
|----------|--------------------|----------------|----------------------|
| username | Primary Key String | user@email.com | User email address   |
| unique   | String             | 123456         | Password reset token |

```JSON
{
  "username": "user@email.com",
  "unique": "123456",
}
```

# Vehicle

A vehicle record representing a vehicle that is hirable by a user.

| Field       | Datatype           | Example        | Description                 |
|-------------|--------------------|----------------|-----------------------------|
| rego        | Primary Key String | ABC123         | Vehicle Registration Number |
| make        | String             | Ford           | Vehicle Make                |
| model       | String             | Falcon         | Vehicle Model               |
| type        | String             | Car/Truck/Van  | Vehicle Type                |
| description | String             | "A fancy car!" | Vehicle Description         |
| location    | String             | 123 Street Vic | Vehicle location            |
| image_url   | String             | car_image_url  | URL of the car image        |

```JSON
{
  "rego": "ABC123",
  "make": "Ford",
  "model": "Falcon",
  "type": "Car",
  "description": "A fancy car!",
  "location": "123 Fake Street Melbourne",
  "image_url": "https://car_image_url.com"
}
```

# Booking

A booking record representing an active booking for a vehicle.

| Field    | Datatype           | Example            | Description                 |
|----------|--------------------|------------------- |-----------------------------|
| id       | Primary Key String | 1234               | Booking ID Number           |
| username | Foreign Key String | test@test.com      | User email address          |
| rego     | Forieng Key String | ABC123             | Vehicle Registration Number |
| start    | DateTime           | 02/09/2021 9:00    | Booking start date time 24h |
| end      | DateTime           | 02/09/2021 10:00   | Booking end date time 24h   |
| status   | Enum               | `PENDING`/`ACTIVE` | Booking status              |
| late     | Int                | `0`/`1`            | Is the booking return late? |

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

# History

A booking record representing an historical booking for a vehicle.

| Field    | Datatype           | Example            | Description                 |
|----------|--------------------|------------------- |-----------------------------|
| id       | Primary Key String | 1234               | Booking ID Number           |
| username | Foreign Key String | test@test.com      | User email address          |
| rego     | Forieng Key String | ABC123             | Vehicle Registration Number |
| start    | DateTime           | 02/09/2021 9:00    | Booking start date time 24h |
| end      | DateTime           | 02/09/2021 10:00   | Booking end date time 24h   |
| status   | Enum               | `PENDING`/`ACTIVE` | Booking status              |
| late     | Int                | `0`/`1`            | Is the booking return late? |

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

# Transaction

A reset record representing a any transation for a booking.

| Field     | Datatype           | Example                | Description                 |
|-----------|--------------------|------------------------|-----------------------------|
| id        | Primary Key String | 1234                   | Transaction ID Number       |
| username  | Foreign Key String | test@test.com          | User email address          |
| rego      | Foreign Key String | ABC123                 | Vehicle Registration Number |
| timestamp | DateTime           | 02/09/2021 9:45        | Transaction timestamp       |
| amount    | Float              | 50.00                  | Booking cost                |
| status    | Enum               | `COMPLETE`/`CANCELLED` | Booking status              |
| late      | Float              | 0.00                   | Late fee cost               |

```JSON
{
  "username": "user@email.com",
  "rego": "ABC123",
  "timestamp": "02/09/2021 9:45",
  "amount": "50.00",
  "late": "0.00",
}
```

# Feedback

A feedback record representing a any user feedback for a booking.

| Field    | Datatype           | Example     | Description          |
|----------|--------------------|-------------|----------------------|
| fid      | Primary Key String | 1234        | Feedback ID          |
| bid      | Foreign Key String | 1234        | Booking ID           |
| info     | String             | Good stuff  | Feedback Information |
| rating   | Int                | 0-5         | Feedback Rating      |
| username | Float              | user@com.ay | Username             |

```JSON
{
  "fid": "1234",
  "bid": "1234",
  "info": "Good stuff",
  "rating": "5",
  "username": "user@email.com",
}
```