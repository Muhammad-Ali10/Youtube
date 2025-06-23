import mongoose, { Schema } from "mongoose"
import bycrypt from "bcrypt"


const userSchema = new Schema({
    username: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        requried: true,
        index: true,
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        requried: true,
    },
    fullName: {
        type: String,
        requried: true
    },
    avatar: {
        type: String,
        requried: true
    },
    coverImage: {
        type: true,
    },
    watchHistory: {
        type: Schema.Types.ObjectId,
        ref: "Video"
    },
    password: {
        type: String,
        require: [true, "Password is required"]
    }
}, { timestamps: true })


userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next()
    this.password = await bycrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bycrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefrwdhToken = function () {
    return jwt.sign(
        { _id: this._id },
        process.env.REFRESH_TOKEN - SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }

    )
}
export const User = mongoose.model("Person", userSchema)