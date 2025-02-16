import rateLimit from "express-rate-limit";
import { getCountryCode } from "../utils/index.js";

let limiterObject ={}
export const customRateLimiter = async (req, res, next) =>{
    const countryCode = await getCountryCode(req.headers['x-forwarded-for'])
    console.log('Country Code: ', countryCode);
 
    let limit = 10
    if(countryCode == 'EG'){
        limit = 2
    }else if(countryCode == 'US'){
        limit = 5
    }
    
    if(limiterObject[countryCode]){
        return limiterObject[countryCode](req, res, next)
    }

    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        limit,
        message: 'Too many requests, please try again later',
        legacyHeaders: false
    })
    limiterObject[countryCode] = limiter
    return  limiterObject[countryCode] (req, res, next)
}
