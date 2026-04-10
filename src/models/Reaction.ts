import mongoose, { Schema, model, models } from "mongoose";

const ReactionSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    article: { type: Schema.Types.ObjectId, ref: "Article", required: true },
    type: { type: String, enum: ["like", "dislike"], required: true },
  },
  { timestamps: true }
);

const Reaction = models.Reaction || model("Reaction", ReactionSchema);
export default Reaction;
