// lib/mongoose.ts
import mongoose from 'mongoose'

declare global {
  // allow global cached connection in dev to avoid multiple connections
  var mongooseConn: { conn?: typeof mongoose; promise?: Promise<typeof mongoose> }
}

const MONGO_URI = process.env.MONGODB_URI!

if (!MONGO_URI) throw new Error('MONGODB_URI not set')

async function connect() {
  if (process.env.NODE_ENV === 'development') {
    if (!global.mongooseConn) global.mongooseConn = {}
    if (global.mongooseConn.conn) return global.mongooseConn.conn
    if (!global.mongooseConn.promise) {
      global.mongooseConn.promise = mongoose.connect(MONGO_URI).then(m => m)
    }
    global.mongooseConn.conn = await global.mongooseConn.promise
    return global.mongooseConn.conn
  } else {
    return mongoose.connect(MONGO_URI)
  }
}

export default connect

export const disconnect = () => mongoose.disconnect()