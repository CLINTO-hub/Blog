import  mongoose  from "mongoose";

const BlogSchema = new mongoose.Schema({

  title:{
    type:String,
    require:true,
},
  summary:{
    type:String,
    required:true,

  },
  content:{
    type:String,
    required:true,
  },
  uploadedimg:{
    type:String,
    require:true,
  },
  author:{
    type: mongoose.Types.ObjectId, 
    ref:'User'
  },
}, {
  timestamps: true,
})

export default mongoose.model("Blog",BlogSchema);