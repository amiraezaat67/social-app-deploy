/**
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Promise<Response>}
 * @description User Registration
 * @api /auth/register  POST
 */

import { compareSync, hashSync } from "bcrypt"
import { User } from "../../../DB/models/index.js"
import { Encryption } from "../../../utils/crypto.utils.js"
import { nanoid } from "nanoid"
import { EmailEvent } from "../../../Services/send-email.service.js"
import { generateToken } from "../../../utils/tokens.utils.js"
import {v4 as uuidv4} from 'uuid'
import { ProvidersEnum } from "../../../constants/constants.js"

import {OAuth2Client} from 'google-auth-library'


export const registerService = async (req,res,next)=>{
    // destruct data from user (body)
    const { username , email , password , phone , gender, DOB, pivateAccount } = req.body

    // check email if exists
    const user = await User.findOne({email})
    if(user){
        return res.status(400).json({ message: 'Email already exists' })
    }

    // generate otp
    const otp = nanoid(4)
    // hashed otp
    const hashedOtp = hashSync(otp , +process.env.SALT_ROUNDS)

    // sendEmail with otp 
    EmailEvent.emit('sendEmail' , {
        subject:"Verify your email",
        html:`<h1>Verify your email</h1><p>Here is your otp: <b>${otp}</b></p>`,
        email,
    }) 
    // hash password
    // const hashedPassword = hashSync(password , +process.env.SALT_ROUNDS)
    // encrypt phone
    // const encryptedPhone = await Encryption({value:phone, secret:process.env.ENCRYPTION_SECRET_KEY  })

    // create user
    const userObject = new User({
        
        username,
        email,
        password,
        phone,
        gender,
        DOB,
        isPublic: pivateAccount ? false : true,
        confirmOtp: hashedOtp
    
    })
    const newUser = await userObject.save()

    // const createdUser = await User.create(userObject)

    return res.status(201).json({ message: 'User created successfully', newUser })
    
}


export const ConfirmEmailService = async (req,res,next)=>{
    // destruct data from user (body)
    const {email,otp} = req.body

    // check email if exists
    const user = await User.findOne({email , isVerified:false , confirmOtp:{$exists:true}})
    if(!user){
        return res.status(404).json({ message: 'User not found' })
    }

    // check otp
    const isOtpValid = compareSync(otp, user.confirmOtp)
    if(!isOtpValid){
        return res.status(400).json({ message: 'Invalid otp' })
    }

    // update user
    await User.updateOne({_id:user._id}, {isVerified:true,$unset:{ confirmOtp:""}})

    return res.status(200).json({ message: 'Email verified successfully' })

}

export const loginService = async (req,res,next)=>{

    const {email, password} = req.body

    // check email if exists
    const user = await User.findOne({email})
    if(!user){
        return res.status(404).json({ message: 'User not found' })
    }

    // check password
    const isPasswordValid = compareSync(password, user.password)
    if(!isPasswordValid){
        return res.status(400).json({ message: 'Invalid password' })
    }


    // generate tokens 
    const accesstoken = generateToken(
        {
            publicClaims:{  _id:user._id,},
            registeredClaims:{expiresIn:process.env.ACCESS_TOKEN_EXPIRATION_TIME , jwtid: uuidv4() },
            secretKey:process.env.JWT_SECRET_KEY  
        }
    )

    const refreshtoken = generateToken(
        {
            publicClaims:{  _id:user._id},
            registeredClaims:{expiresIn:process.env.REFRESH_TOKEN_EXPIRATION_TIME , jwtid: uuidv4() },
            secretKey:process.env.JWT_SECRET_KEY_REFRESH  
        }
    )

    return res.status(200).json({ accesstoken , refreshtoken })
}


export const GmailLoginService = async (req,res,next)=>{
    const { idToken } = req.body;
    const client = new OAuth2Client();
    const ticket = await client.verifyIdToken({
        idToken,
        audience:process.env.CLIENT_ID
    });
    const payload = ticket.getPayload();
    const {email_verified , email} = payload
    if(!email_verified){
        return res.status(400).json({ message: 'Email not verified' })
    }

    const user = await User.findOne({email , provider:ProvidersEnum.GOOGLE})

    // generate tokens 
    const accesstoken = generateToken(
        {
            publicClaims:{  _id:user?._id,},
            registeredClaims:{expiresIn:process.env.ACCESS_TOKEN_EXPIRATION_TIME , jwtid: uuidv4() },
            secretKey:process.env.JWT_SECRET_KEY  
        }
    )

    const refreshtoken = generateToken(
        {
            publicClaims:{  _id:user._id},
            registeredClaims:{expiresIn:process.env.REFRESH_TOKEN_EXPIRATION_TIME , jwtid: uuidv4() },
            secretKey:process.env.JWT_SECRET_KEY_REFRESH  
        }
    )

    return res.status(200).json({ accesstoken , refreshtoken })
}

export const GmailRegistrationService = async (req,res,next)=>{
        const { idToken } = req.body;
        const client = new OAuth2Client();
        const ticket = await client.verifyIdToken({
            idToken,
            audience:process.env.CLIENT_ID
        });
        const payload = ticket.getPayload();
        const {email_verified , email , name } = payload
        if(!email_verified){
            return res.status(400).json({ message: 'Email not verified' })
        }

        const userObject  = {
            username:name,
            email,
            isVerified:true,
            provider:ProvidersEnum.GOOGLE,
            password: hashSync(uuidv4() , +process.env.SALT_ROUNDS)
        }

        const user = await User.findOne({email , provider:ProvidersEnum.GOOGLE})
        if(user){
            return res.status(400).json({ message: 'Email already exists' })
        }

     await User.create(userObject)
    
        return res.status(200).json({ message: 'User created successfully' })
}