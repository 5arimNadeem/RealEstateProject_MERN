import express from 'express'
import { createListing } from '../controllers/listing.controller.js'
import { verifyToken } from '../utils/verifyUser.js'

const router = express.Router()

// firstly we will verify the user and then we are going to create the listing for it

router.post('/create', verifyToken ,createListing)

export default router