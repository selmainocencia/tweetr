import mongoose, { model, models } from "mongoose";

const CommentSchema = new mongoose.Schema(
  {
    tweetId: { type: String, required: true },
    author: { type: String, default: "Anonymous" },
    text: { type: String, required: true, maxlength: 280 },
    likes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Comment = models.Comment ?? model("Comment", CommentSchema);
