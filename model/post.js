import { Schema,Repository } from "redis-om";
import client from "../config/connectToRedis.js";

const postSchema = new Schema(
  'Post',
  {
    title: { type: "text" },
    message: { type: "text" },
    name: { type: "string" },
    creator: { type: "string" },
    tags: { type: "text" },
    selectedFile: { type: "string" },
    likes: { type: "string[]" },
    comments: { type: "string[]" },
    createdAt: { type: "date", sortable: true },
  },
  {
    dataStructure: "JSON",
  }
);

export const postRepository = new Repository(postSchema, client)

await postRepository.createIndex();
