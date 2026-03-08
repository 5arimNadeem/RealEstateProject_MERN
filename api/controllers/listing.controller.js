import Listing from "../models/listing.model.js"
import { errorHandler } from "../utils/error.js"

//  go and check the ntoes for the explanation of hwo the next(error) is actually working inside the system , the internals of express and the other stuff too 

// variable assigment for the removal of magic numbers 
let limitForListing = 9;


export const createListing = async (req, res, next)=> {
    try {
        const listing = await Listing.create(req.body)
        return res.status(201).json(listing)
    } catch (error) {
        next(error)
    }
}

export const deleteListing = async (req, res, next) => {
    const listing = await Listing.findById(req.params.id)

    if (!listing) {
        return next(errorHandler(404, 'listing not found!!'))
    }
    if(req.user.id !== listing.userRef) {
        return next(errorHandler(401, 'you can only delete your own listings !! '))
    }

    try {
        await Listing.findByIdAndDelete(req.params.id) 
        res.status(200).json('listing has been deleted ')
    } catch (error) {
        next(error)
    }
}

export const updateListing = async (req, res, next) => {
    const listing = await Listing.findById(req.params.id)
    if(!listing){
        return next(errorHandler(404, 'Listing not found'))
    }
    if( req.user.id !== listing.userRef) {
        return next(errorHandler(401, ' you can only update your own listings!!'))
    }

    try {
        const updateListing = await Listing.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            {new : true}
        )
        res.status(200).json(updateListing)
    } catch (error) {
        next(error)
    }
}

export const getListing = async (req, res, next) => {
    try {
        const listing = await Listing.findById(req.params.id)
        if(!listing) {
            return next(errorHandler(404, 'listing not foudn!'))
        }
        res.status(200).json(listing)
    } catch (error) {
        next(error)
    }
}

export const getListings = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || limitForListing
        const startIndex = parseInt(req.query.startIndex) || 0
        let offer = req.query.offer

        if(offer === 'undefined' || offer === 'false') {
            offer = {$in: [false, true] }
        }

        let furnished = req.query.furnished

        if (furnished === 'undefined' || furnished === 'false') {
            furnished = {$in: [false, true]}
        }

        let parking = req.query.parking

        if(parking === 'undefined' || parking === 'false') {
            parking = {$in: [false, true]}
        }

        let type = req.query.type

        if(type === 'undefined' || type === 'all') {
            type = {$in: ['sale', 'rent']}
        }

        const searchTerm = req.query.searchTerm || ''

        const sort = req.query.sort || 'createdAt'

        const order = req.query.order || 'desc'



        const listings = await Listing.find({
            // regex is the builtin search functionality for mongoDB and it checks the whole line where does teh search keyword lies and gives the result accordingly and it can be even partof the word
            name: {$regex: searchTerm, $options : 'i'},
            offer, 
            furnished, 
            parking,
            type
        }).sort({
            // sort on the basis of order either desc or asce
            //  const sort = req.query.sort || 'createdAt'
            // const order = req.query.order || 'desc'
            [sort]: order

        // const limit = parseInt(req.query.limit) || limitForListing
        // const startIndex = parseInt(req.query.startIndex) || 0
        }).limit(limit).skip(startIndex)
        res.status(200).json(listings)
    } catch (error) {
        next(error)
    }
}