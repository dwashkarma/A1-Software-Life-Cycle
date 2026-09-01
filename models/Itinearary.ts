import mongoose, { Schema, models } from "mongoose";

const ItinerarySchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,

      ref: "User",

      required: true,
    },

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

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    attractions: [
      {
        type: Schema.Types.ObjectId,

        // TODO: reference Attraction
        ref: "Attraction",
      },
    ],
  },
  {
    timestamps: true,
  },
);

// TODO: reuse existing model or create Itinerary model
const Itinerary =
  models.Itinerary || mongoose.model("Itinerary", ItinerarySchema);

export default Itinerary;
