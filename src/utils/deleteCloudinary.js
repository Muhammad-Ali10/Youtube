import { v2 as cloudinary } from "cloudinary"

const fileDelete = async (publicId) => {
    cloudinary.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.API_KEY,
        api_secret: process.env.API_SECRET
    })  
    
   const response = await cloudinary.uploader.destroy(publicId)
   console.log(response)
   return response
}

export { fileDelete }