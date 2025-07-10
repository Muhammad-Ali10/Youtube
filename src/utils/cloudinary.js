import { v2 as cloudinary } from "cloudinary"
import fs from "fs"

const fileUploader = async (localfilepath) => {


    cloudinary.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.API_KEY,
        api_secret: process.env.API_SECRET
    })

    try {
        if (!localfilepath) return null
        const response = await cloudinary.uploader.upload(localfilepath, {
            resource_type: "auto"
        })
        //console.log("File upload Completed" + response)
        //fs.unlinkSync(localfilepath)
        return response
    } catch (error) {
        fs.unlinkSync(localfilepath)
        return null
    }

}

export { fileUploader }