import { v2 as cloudinary } from "cloudinary"
import fs from "fs"
import { isNullOrUndefined } from "util"


const fileUploader = async (localfilepath) => {


    cloudinary.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.API_KEY,
        api_secret: process.env.API_SECRET
    })

    try {
        if(!localfilepath) return null
        const response = await cloudinary.uploader.upload(localfilepath,{
            resource_type: "auto"
        })
        console.log("File upload Completed"+ response.url)
        return response
    } catch (error) {
        fs.unlinkSync(localfilepath)
        return null
    }

}