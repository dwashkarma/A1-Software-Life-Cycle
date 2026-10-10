import mongoose, { Schema, models } from "mongoose";

const UserPreferenceSchema = new Schema(
    {
        // One preference per user: the unique index enforces "at most one".
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },

        destinations: [
            {
                type: Schema.Types.ObjectId,
                ref: "Destination",
            },
        ],

        categories: [
            {
                type: String,
                trim: true,
            },
        ],

        // true once the traveller has saved or skipped the setup popup.
        completed: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    },
);

// Reuse the existing model when Next.js hot-reloads, otherwise create it.
const UserPreference = models.UserPreference || mongoose.model("UserPreference", UserPreferenceSchema);

export default UserPreference;