import express from "express"
import cors from "cors"
import { errorHandler } from "./middlewares/error.middlerware.js"
import cookieParser from "cookie-parser"
const app = express()


app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true

}))

app.use(express.json({
    limit: "16kb",
    strict: true,
    type: 'application/json'
}))

app.use(express.urlencoded({
    extended: true,
    limit: "16kb"
}))


app.use(cookieParser())
app.use(express.static("public"))



import userRouter from "./routes/user.route.js"
import videoRouter from "./routes/video.route.js"


app.use("/api/v1/users", userRouter)
app.use("/api/v1/videos", videoRouter)



app.use(errorHandler)

export { app }