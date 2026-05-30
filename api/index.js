// import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()
import userRouter from './routes/user.route.js'
import authRouter from './routes/auth.route.js'
import listingRouter from './routes/listing.route.js'
import uploadRouter from './routes/upload.route.js'
import cookieParser from 'cookie-parser'

const app = express()

/*
## **`app.use(express.json())` - Simple Explanation**

---

## **What It Does**

**Parses incoming JSON data** from requests and makes it accessible via `req.body`.

---

## **Without It:**

```javascript
// Client sends JSON
fetch('/register', {
  method: 'POST',
  body: JSON.stringify({ name: 'Sam', email: 'sam@example.com' })
})

// Server receives
app.post('/register', (req, res) => {
  console.log(req.body)  // ❌ undefined
})
```

**Result:** `req.body` is **undefined** ❌

---

## **With It:**

```javascript
app.use(express.json())  // ✅ Enable JSON parsing

// Server receives
app.post('/register', (req, res) => {
  console.log(req.body)  // ✅ { name: 'Sam', email: 'sam@example.com' }
  const { name, email } = req.body  // ✅ Works!
})
```

**Result:** `req.body` contains the parsed JSON object ✅

---

## **One-Sentence Summary**

**`app.use(express.json())`** tells Express to **automatically convert incoming JSON strings into JavaScript objects** so you can access them via `req.body`.
*/
app.use(express.json())

app.use(cookieParser())

// On Vercel the app runs as a serverless function, so a single long-lived
// `mongoose.connect()` at startup is not reliable — each cold start would
// reconnect. We cache the connection promise and reuse it across invocations.
let connectionPromise = null
const connectDB = () => {
  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(process.env.MONGO_DB_URL)
      .then((conn) => {
        console.log('✅ MongoDB connected successfully')
        return conn
      })
      .catch((err) => {
        // Reset so the next request can try again instead of caching a failure.
        connectionPromise = null
        console.log('❌ MongoDB connection error:', err.message)
        throw err
      })
  }
  return connectionPromise
}

// Ensure the DB is connected before any route handler runs.
app.use(async (req, res, next) => {
  try {
    await connectDB()
    next()
  } catch (err) {
    next(err)
  }
})

// api routes

app.use('/api/user', userRouter)
app.use('/api/auth', authRouter)
app.use('/api/listing', listingRouter)
app.use('/api/upload', uploadRouter)

// middleware

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'internal server error'
  return res.status(statusCode).json({
    success: false,
    // if variable and the key have the same name in es6 we can remove one of them
    statusCode,
    message,
  })
})

// Only start a long-running server locally. On Vercel the exported `app` is
// used as the serverless request handler, so we must NOT call app.listen().
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 3000
  app.listen(PORT, () => console.log('server is running ' + PORT))
}

export default app
