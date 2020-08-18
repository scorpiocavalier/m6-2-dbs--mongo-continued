const { dbInit, dbClose } = require('./handlers')

///////////////////////////////////////////////////////////////

const seats = []
const row = [ "A", "B", "C", "D", "E", "F", "G", "H" ]
const NUM_OF_ROWS = row.length
const SEATS_PER_ROW = 12

///////////////////////////////////////////////////////////////

const generateSeats = () => {
  let _id
  for (let r = 0; r < NUM_OF_ROWS; r++) {
    for (let s = 1; s <= SEATS_PER_ROW; s++) {
      _id = `${ row[ r ] }-${ s }`
      seats.push({
        _id,
        price: 400 - r * 25,
        isBooked: false,
      })
    }
  }

  console.log('seats', seats)
}

///////////////////////////////////////////////////////////////

const insertDataToDB = async () => {
  try {
    const db = await dbInit()
    const response = await db.collection('seats').insertMany(seats)
    console.log('response', response)
    dbClose()
  } catch (err) {
    console.log(err.message)
  }
}

///////////////////////////////////////////////////////////////

const init = () => {
  generateSeats()
  insertDataToDB()
}

///////////////////////////////////////////////////////////////

init()