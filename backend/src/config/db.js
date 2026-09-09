const mongoose = require('mongoose')

async function connectDB(){
    try{
       await mongoose.connect(process.env.MONGO_URL)
        console.log("Database Connected Successfully")
    }catch(err){
        console.warn("DB unavailable:", err.message)
        // Non-fatal: the API keeps running so free/AI-only features work
        // without a database. History (Phase 5) requires MONGO_URL.
    }
}
module.exports = connectDB