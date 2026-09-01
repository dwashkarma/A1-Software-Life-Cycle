import mongoose, { Schema, models } from "mongoose";

const DestinationSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    state: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

// TODO: reuse existing model or create a new Destination model
const Destination =
  models.Destination || mongoose.model("Destination", DestinationSchema);

export default Destination;
