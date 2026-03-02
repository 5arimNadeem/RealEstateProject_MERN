import Listing from "../models/listing.model.js"
import User from "../models/user.model.js"
import { errorHandler } from "../utils/error.js"
import bcryptjs from "bcryptjs"

export const test = (req, res) => {
    res.json({
        name: "sarim nadeem"
    })
}

export const updateUser = async (req, res, next) => {
    // req.params.id is the url that we have give in the route let me show you 
    // 
    // router.post('/update/:id', verifyToken, updateUser)

    if (req.user.id !== req.params.id) return next(errorHandler(401), "unAuthorized")

    try {
        if (req.body.password) {
            req.body.password = bcryptjs.hashSync(req.body.password, 10)

        }

        const updateUser = await User.findByIdAndUpdate(req.params.id, {
            // it is the mongodb operator that only updates the specific fields that you want it to do
            $set: {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                avatar: req.body.avatar
            }
            // this new true is going to update the user with the new info not the old one and if you dont add it so you are going to get the previous information for your chagnes 
        }, { new: true }
        )
        // separeate the password and all the other stuff from the responce
        const { password, ...rest } = updateUser._doc

        res.status(200).json(rest)

    } catch (error) {
        next(error)
    }
}

export const deleteUser = async (req, res, next) => {
    //  we need to chekc the token first 

    // this user.id we are getting from /utils/verifyUser.js
    if (req.user.id !== req.params.id) return next(errorHandler(401, "you can only delete your own acc"))

    try {
        await User.findByIdAndDelete(req.params.id)
        // after delete tthe user we can alaso delete the cookie 
        res.clearCookie('access_token')
        res.status(200).json('user has been deleted')
    } catch (error) {
        next(error)
    }
}

export const getUserListing = async (req, res, next) => {
    if (req.user.id === req.params.id) {
        try {
            const listings = await Listing.find({ userRef: req.params.id })
            res.status(200).json(listings)
        } catch (error) {
            next(error)
        }
    } else {
        return next(errorHandler(401, 'you can only view your own listings!!'))
    }
}