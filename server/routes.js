require('dotenv').config()
const { MONGO_URI } = process.env
const { MongoClient } = require('mongodb')
const router = require("express").Router()

///////////////////////////////////////////////////////////////

let seats
const NUM_OF_ROWS = 8
const SEATS_PER_ROW = 12
const collectionName = 'seats'
let state, client, lastBookingAttemptSucceeded = false

///////////////////////////////////////////////////////////////

const dbInit = async () => {
  const dbName = 'seat_booking'
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }

  client = await MongoClient(MONGO_URI, options).connect()
  return client.db(dbName)
}

const dbClose = () => client.close()

///////////////////////////////////////////////////////////////

const getSeats = async (req, res) => {
  try {
    const db = await dbInit()

    seats = await db.collection(collectionName).find().toArray()
    console.log('seats', seats)

    dbClose()
  } catch (err) {
    res.status(400).json({ status: 400, data: err.message })
  }
}

///////////////////////////////////////////////////////////////

const getRowName = (rowIndex) => {
  return String.fromCharCode(65 + rowIndex)
}

///////////////////////////////////////////////////////////////

const randomlyBookSeats = (num) => {
  const bookedSeats = {}

  while (num > 0) {
    const row = Math.floor(Math.random() * NUM_OF_ROWS)
    const seat = Math.floor(Math.random() * SEATS_PER_ROW)

    const seatId = `${ getRowName(row) }-${ seat + 1 }`

    bookedSeats[ seatId ] = true

    num--
  }

  return bookedSeats
}

///////////////////////////////////////////////////////////////

router.get("/api/seat-availability", async (req, res) => {
  if (!state) {
    state = {
      bookedSeats: randomlyBookSeats(30),
    }
  }

  return res.json({
    seats: seats,
    bookedSeats: state.bookedSeats,
    numOfRows: 8,
    seatsPerRow: 12,
  })
})

///////////////////////////////////////////////////////////////

router.post("/api/book-seat", async (req, res) => {
  const { seatId, creditCard, expiration } = req.body

  if (!state) {
    state = {
      bookedSeats: randomlyBookSeats(30),
    }
  }

  const isAlreadyBooked = !!state.bookedSeats[ seatId ]
  if (isAlreadyBooked) {
    return res.status(400).json({
      message: "This seat has already been booked!",
    })
  }

  if (!creditCard || !expiration) {
    return res.status(400).json({
      status: 400,
      message: "Please provide credit card information!",
    })
  }

  if (lastBookingAttemptSucceeded) {
    lastBookingAttemptSucceeded = !lastBookingAttemptSucceeded

    return res.status(500).json({
      message: "An unknown error has occurred. Please try your request again.",
    })
  }

  lastBookingAttemptSucceeded = !lastBookingAttemptSucceeded

  state.bookedSeats[ seatId ] = true

  return res.status(200).json({
    status: 200,
    success: true,
  })
})

///////////////////////////////////////////////////////////////

getSeats()

///////////////////////////////////////////////////////////////

module.exports = router
