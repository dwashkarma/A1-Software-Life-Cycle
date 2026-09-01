import mongoose, { Schema, models } from "mongoose";

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,

       enum: ["traveller", "admin"],
  default: "traveller",
    },
  },
  {
    timestamps: true,
  }
);

// TODO:
// Reuse existing User model if Next.js hot reload has already created it.
// Otherwise create the mongoose model.

const User = models.User || mongoose.model("User", UserSchema);

export default User;