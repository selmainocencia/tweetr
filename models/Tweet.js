import mongoose, { model, models } from "mongoose";

const TweetSchema = new mongoose.Schema(
  {
    content: { type: String, required: true, maxlength: 280 },
    author: { type: String, default: "Anonymous" },
    handle: { type: String, default: "@user" },
    likes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    retweets: { type: Number, default: 0 },
    userId: { type: String },
    isRetweet: { type: Boolean, default: false },
    retweetedFrom: { type: String },
    postType: { type: String, default: "advocacy" },
    subCategory: { type: String, default: "" },
  },
  { timestamps: true },
);

export const Tweet = models.Tweet ?? model("Tweet", TweetSchema);
