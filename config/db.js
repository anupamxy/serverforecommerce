import mongoose from "mongoose";

const connectDB =async()=>{
    try{
        const conn=await mongoose.connect(process.env.MONGO_URL)
        console.log(`CONNNECTED TO MONGODB ${conn.connection.host}`);

    }catch(error){
        console.log(`ERROR IN MONGODB ${error}`);
    }
};
export default connectDB;