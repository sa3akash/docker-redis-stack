import { EntityId } from "redis-om";
import { postRepository } from "../model/post.js";

export const createPost = async (req, res) => {
    const post = req.body;
    const newPost = await postRepository.save({
      ...post,
      creator: 'shakil ahmed',
      createdAt: new Date().toISOString(),
    });
  
    res.status(201).json({message: 'Post created successfull.' ,data: { id: newPost[EntityId], ...newPost } });
};


// get post with pagination
export const getPosts = async (req, res) => {
    const { page } = req.query;
    const limit = 2;
    const skip = (+page - 1) * limit;
    if (!page) {
      res.status(400).json({ message: "Enter count and offset" });
    }
    const posts = await postRepository.search().sortDescending("createdAt").return.page(skip, limit);
   
    const postsCount = await postRepository.search().sortDescending("createdAt").return.count();

    const newPosts = posts.map((item) => {
      return { id: item[EntityId], ...item };

    });
  

    res.status(200).json({ data:newPosts , currentPage: Number(page), numberOfPages: Math.ceil(postsCount / limit) });
  };



// get single post
  export const getPost = async (req, res) => {
    const singlePost = await postRepository.fetch(req.params.id);
    if (!singlePost.title) {
      return res.status(404).json({ message: "No post with that id" });
    }

    res.status(200).json({message: 'Post get successfull.' , data: { id: singlePost[EntityId], ...singlePost } });
  };



// delete post
  export const deletePost = async (req, res) => {
    const post = await postRepository.fetch(req.params.id);
    if (!post.title) {
      return res.status(404).json({ message: "No post with that id" });
    }
    // if (req.userId !== post.creator) {
    //   return res.status(400).json({ message: "Unauthorized, only creator of post can delete" });
    // }
    await postRepository.remove(req.params.id);
    res.status(200).json({ message: "post deleted successfully" });
  };


// like a post
  export const likePost = async (req, res) => {
    let post = await postRepository.fetch(req.params.id);



    if (!post.title) {
      return res.status(400).json({ message: "No post with that id" });
    }

    if (!post.likes) {
      post.likes = [];
    }
    const index = post.likes.findIndex((id) => id === String('df855454545'));

    if (index === -1) {
      post.likes = [...post.likes, "df855454545"];
    } else {
      post.likes = post?.likes?.filter((id) => id !== String('df855454545'));
    }

    await postRepository.save(post);

    res.status(200).json({ data: { id: post[EntityId], ...post } });
  };