import cloudinary from 'cloudinary';
import Blog from '../models/BlogModel.js';
import dotenv from 'dotenv'


dotenv.config()

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.VITE_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// POST /blog/createblog
export const createBlog = async (req, res) => {
  const { title, summary, content } = req.body;
  const { id: userid } = req.params; 
  
  console.log('user',userid);

  try {
    let uploadedimg = ''; 

    
    if (req.file) {
      
      const result = await cloudinary.v2.uploader.upload(req.file.path);
      uploadedimg = result.secure_url;
    }

    // Create new blog post
    const newBlog = await Blog.create({
      title,
      summary,
      content,
      uploadedimg,  
      author: userid,  
    });

    res.status(201).json({ success: true, message: 'Blog post created successfully', newBlog });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal from blog server error' });
  }
};

//Get Blog
export const getBlog = async (req, res) => {
  try {
    const result = await Blog.find().populate('author', ['firstname', 'lastname']).sort({ createdAt: -1 }).limit(20);
    res.status(200).json({ success: true, message: "Successfully fetched", result });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

//Update the Blog
export const updateBlog = async (req, res) => {
  const id = req.params.id;

  console.log('newbody',req.body);

  try {
    let uploadedimg = '';  

    
    if (req.file) {
      
      const result = await cloudinary.v2.uploader.upload(req.file.path);
      uploadedimg = result.secure_url;
    }

    // Update blog post
    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      {
        ...req.body,  
        uploadedimg: uploadedimg || req.body.uploadedimg,  
      },
      { new: true }
    );

    if (!updatedBlog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    res.status(200).json({ success: true, message: 'Successfully updated', data: updatedBlog });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};


//Find by Id
export const findBlog = async (req,res)=>{
  try {
    const id = req.params.id
    const findBlog = await Blog.findById(id).populate('author', ['firstname', 'lastname'])
    res.status(200).json({success:true,message:'Sucessfully found', findBlog})
    
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Internal server error" });
    
  }
}

//Delete blog by Id
export const deleteBlog = async (req, res) => {
  const id = req.params.id;
  try {
    const deletedBlog = await Blog.findByIdAndDelete(id);

    if (!deletedBlog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    res.status(200).json({ success: true, message: 'Successfully deleted', deletedBlog });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};