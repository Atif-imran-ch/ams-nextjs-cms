import mongoose, { Schema, model, models } from "mongoose";

const CommentSchema = new Schema(
  {
    body: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    article: { type: Schema.Types.ObjectId, ref: "Article", required: true },
  },
  { timestamps: true }
);

const Comment = models.Comment || model("Comment", CommentSchema);
export default Comment;
