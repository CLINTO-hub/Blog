import express from 'express'
import multer from 'multer';
import { createBlog, deleteBlog, findBlog, getBlog, updateBlog } from '../Controllers/BlogController.js'
import { protectRoute } from '../Middileware/VerifyToken.js';


const router = express.Router()
const upload = multer({ dest: 'uploads/' });

router.post('/createblog/:id',upload.single('image'),createBlog)
router.get('/blog',getBlog)
router.get('/blog/:id',findBlog)
router.put('/blog/:id',protectRoute,upload.single('file'),updateBlog)
router.delete('/blog/deleteblog/:id',protectRoute,deleteBlog)

export default router