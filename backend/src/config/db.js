const mongoose = require('mongoose')

async function connectDB(){
    try{
       await mongoose.connect(process.env.MONGO_URL)
        console.log("Database Connected Successfully")
    }catch(err){
        console.error("Somthing Went Wrong", err.message)
        process.exit(1);
    }
}
module.exports = connectDB