import  mongoose  from "mongoose";

const userSchema = new mongoose.Schema({
    email:{
    type:String,
    required:true,
    unique:true,
    },
    firstname:{
        type:String,
        required:true,
    },
    lastname:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
        minlength:6,
    },
    gender:{
        type:String,
        required:true,
    },
    resetPasswordOTP:{
        type:String,
    }   
})

export default mongoose.model("User",userSchema);