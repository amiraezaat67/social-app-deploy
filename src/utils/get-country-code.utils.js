import axios from "axios";

export const getCountryCode = async(ip)=>{
    try {
        const response = await axios.get(`http://ip-api.com/json/${ip}`)
        return response?.data?.countryCode
    
    } catch (error) {
        console.error(error)
        return null
    }
}