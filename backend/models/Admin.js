import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minLength: 6,
    },
    contact_number: {
        type: String,
        required: true,
    },
    addedMovies: [{
        type: mongoose.Types.ObjectId,
        ref: "Movie",
    }],
    is_active: {
        type: Boolean,
        required: true,
    },
    is_deleted: {
        type: Boolean,
        required: true,
    },
}, {
    timestamps: true,
});
export default mongoose.model("Admin", adminSchema);
