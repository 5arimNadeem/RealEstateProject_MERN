// import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()
import userRouter from './routes/user.route.js'
import authRouter from './routes/auth.route.js'
import authRouter from './routes/listing.route.js'
import cookieParser from 'cookie-parser'

mongoose.connect(process.env.MONGO_DB_URL)
    .then(() => console.log('✅ MongoDB connected successfully'))
    .catch(err => console.log('❌ MongoDB connection error:', err.message))

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

## **Real Example from Your Code**

```javascript
export const register = async (req, res) => {
  const { name, email, password } = req.body  
  // ↑ This ONLY works because of express.json()
}
```

**Without `express.json()`:**
- `req.body` = `undefined`
- `name`, `email`, `password` = all `undefined`
- Your registration fails! 💥

---

## **What Happens Behind the Scenes**

1. **Client sends:** 
   ```json
   { "name": "Sam", "email": "sam@example.com", "password": "123" }
   ```

2. **Express receives:** Raw text string
   ```
   '{"name":"Sam","email":"sam@example.com","password":"123"}'
   ```

3. **`express.json()` converts:** String → JavaScript Object
   ```javascript
   { name: 'Sam', email: 'sam@example.com', password: '123' }
   ```

4. **Attaches to:** `req.body`

---

## **One-Sentence Summary**

**`app.use(express.json())`** tells Express to **automatically convert incoming JSON strings into JavaScript objects** so you can access them via `req.body`.

---

## **Related Middlewares**

```javascript
app.use(express.json())           // Parses JSON data
app.use(express.urlencoded({ extended: true }))  // Parses form data
app.use(cookieParser())           // Parses cookies
```

**All serve the same purpose:** Make different types of data accessible in your controllers! 🎯
*/
app.use(express.json())

app.use(cookieParser())


app.listen(process.env.PORT, () => console.log('server is running ' + process.env.PORT))



// api routes 

app.use('/api/user', userRouter)
app.use('/api/auth', authRouter)
app.use('/api/listing', listingRouter)

// middleware 

app.use((err, req, res, next)=> {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'internal server error'
  return res.status(statusCode).json({
    success: false,
    // if variable and the key have the same name in es6 we can remove one of them
    statusCode,
    message,
  })
})