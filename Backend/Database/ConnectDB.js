import  mongoose  from "mongoose";

const ConnectDB = async()=>{
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log(process.env.MONGODB_URI);
        console.log('Db connected');
        
    } catch (error) {
        console.log('Unable to collect',error.message);
    }
}
export default ConnectDB