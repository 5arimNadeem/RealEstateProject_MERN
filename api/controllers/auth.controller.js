import User from '../models/user.model.js'
import bcrypt from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken'

export const signup = async (req, res, next) => {
    const { username, email, password } = req.body;
    // `10 is the salt number you can even increase it. it will help you to get the lenght of the encrypted password`
    const hashedPassword = bcrypt.hashSync(password, 10)

    const newUser = new User({ username, email, password: hashedPassword });

    try {
        await newUser.save();

        res.status(201).json('user created successfully')
    } catch (error) {
        // 500 is the internal server error 
        next(errorHandler(550, 'error from the function'))
    }
}

export const signin = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        // const validUser = await User.findOne({ email : email  })
        // if both the key and value are same you don't need to add the value in it because they are having the same name it is the feature of ES6
        const validUser = await User.findOne({ email })

        if (!validUser) {
            return next(errorHandler(404, 'User not found'))
        }
        const validPassword = bcrypt.compareSync(password, validUser.password)
        if (!validPassword) {
            return next(errorHandler(401, 'Wrong credentials'))
        }

        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET)
        // this line is going to remove the password form the responce that we are going to get from the server and other things would stay the same it is the way to write the code in order to remove the password from it 
        // and why are we hidding it because it is the convention to do it 
        const { password: pass , ...rest} = validUser._doc;
        // it would be like a sesssion storage because we havn't give the expiration time for it 
        res.cookie('access_token', token, { httpOnly: true }).status(200).json(rest)
    } catch (error) {
        // it is the middleware that we have defined in the utils directory
        next(error)
    }
}

// for google auth 

export const google = async (req, res, next) => {
    try {
        const user = await User.findOne({email : req.body.email})

        if (user) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
            const { password: pass , ...rest} = user._doc;
            res 
            .cookie('access_token', token, { httpOnly: true }).status(200).json(rest)
        } else {
            const generatedPassword = Math.random().toString(36).slice(-8);
            const hashedPassword = bcrypt.hashSync(generatedPassword, 10)

            const newUser = new User({
                username: req.body.name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-4) ,
                email: req.body.email,
                password: hashedPassword,
                avatar: req.body.photo
            })
            await newUser.save();
            
            const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET)
            const { password: pass , ...rest} = newUser._doc;
            res 
            .cookie('access_token', token, { httpOnly: true }).status(200).json(rest)
        }
    } catch (error) {
        next(error)
    }
}


// we are just clearing the cookie in it because it the signout fucntion and after signout we want the user to loose the information in the browser and no one can access the old information that was in the cookie before for ensureing the security of the user and the application reliabilty
export const signOut = async (req, res, next) => {
    try {

        res.clearCookie('access_token')
        res.status(200).json('user has been logged out')
    } catch (error) {
        next(error)
    }
}
