import express from 'express'
import { createListing, deleteListing, updateListing } from '../controllers/listing.controller.js'
import { verifyToken } from '../utils/verifyUser.js'

const router = express.Router()

// firstly we will verify the user and then we are going to create the listing for it

router.post('/create', verifyToken ,createListing)
router.delete('/delete/:id', verifyToken ,deleteListing)
router.post('/update/:id', verifyToken, updateListing)

export default router