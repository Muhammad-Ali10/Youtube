import 'dotenv/config'
import connectDB from './db/index.js'
import { app } from './app.js'




connectDB()
.then(()=>{
    app.on("error", (error)=>{
        console.log("error", error)
        throw error
    })
    app.listen(process.env.PORT || 8000, ()=>{
        console.log(`Server is running at port ${process.env.PORT}`)
    })
})
.catch((error)=>{
    console.log(`Mongo DB Connection Falid !!! ${error
    }`)
})





  /*  ;(async () => {
        try {
            await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
            app.on("error", (error) => {
                console.log("Isssue", error)
                throw error
            })
            app.listen(process.env.PORT, () =>  {
                console.log(`App listing on port ${process.env.PORT}`)
            })
        } catch (error) {
            console.error("Error", error)
            throw error 
        }
    })() */