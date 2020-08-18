require('dotenv').config()
const { MONGO_URI } = process.env
const { MongoClient } = require('mongodb')

///////////////////////////////////////////////////////////////

let client
const collectionName = 'seats'

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

const getSeats = async () => {
  let seats

  try {
    const db = await dbInit()
    seats = await db.collection(collectionName).find().toArray()
    dbClose()
  } catch (err) {
    console.log('err', err.message)
  }

  return seats
}

///////////////////////////////////////////////////////////////

module.exports = { dbInit, dbClose, getSeats }