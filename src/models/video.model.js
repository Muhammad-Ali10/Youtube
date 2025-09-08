import mongoose, { Schema } from "mongoose"
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"

const videoSchema = new Schema({
    video: {
        type: String,  //cloudinary
        required: true
    },
    videopublicid:{
        type: String
    },
    thumbnail: {
        type: String, //cloudinary
        required: true
    },
    thumbnailpublicid: {
        type: String
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    title: {
        type: String,
        requried: true,
    },
    description: {
        type: String,
        requried: true
    },
    duration: {
        type: Number,
        default: 0
    },
    views: {
        type: Number,
        default: 0,
    },
    isPublished: {
        type: Boolean,
        default: false
    },

 
}, { timestamps: true })


videoSchema.plugin(mongooseAggregatePaginate)

export const Video =  mongoose.model("Video", videoSchema)