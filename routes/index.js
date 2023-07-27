import express from "express";
import { createPost, deletePost, getPost, getPosts, likePost } from "../controller/post.js";
import { signin, signup } from "../controller/user.js";
const router = express.Router();


// user

router.post('/signup', signup)
router.post('/signin', signin)



// post
router.post('/post/create', createPost)
router.get('/posts', getPosts)
router.get('/post/:id', getPost)
router.delete('/post/:id', deletePost)
router.put('/post/:id', likePost)



export default router;