import mongoose, { Schema, models } from "mongoose";

const AttractionSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    destination: {
      type: Schema.Types.ObjectId,

      ref: "Destination",

      required: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
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

// TODO: reuse existing model or create Attraction model
const Attraction =
  models.Attraction || mongoose.model("Attraction", AttractionSchema);

export default Attraction;
