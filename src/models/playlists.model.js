import mongoose, { Schema } from "mongoose";

const playlistSchema = new mongoose.Schema({
    name: {
        type: String,
        requried: true
    },
    description: {
        type: String,
    },
    videos: {
        type: Schema.Types.ObjectId,
        ref: "Video"
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
}, { timestamps })

export const Playlists =  mongoose.model("Playlists", playlistSchema)