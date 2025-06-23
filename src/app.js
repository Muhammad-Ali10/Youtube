import express from "express"
import cors from "cors"
import { errorHandler } from "./middlewares/error.middlerware.js"

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

app.use(express.static("public"))



import userRouter from "./routes/user.route.js"

app.use(errorHandler)

app.use("/api/v1/users", userRouter)


export { app }