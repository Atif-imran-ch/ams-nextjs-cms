import mongoose, { Schema, model, models } from "mongoose";

const ArticleSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true, required: true },
    content: { type: String, required: true },
    image: { type: String },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    category: { type: Schema.Types.ObjectId, ref: "Category" },
  },
  { timestamps: true }
);

const Article = models.Article || model("Article", ArticleSchema);
export default Article;
