import mongoose from "mongoose";
const Schema = mongoose.Schema;
const userSchema = new Schema({
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
    booking: [{
        type: mongoose.Types.ObjectId,
        ref: "Booking"
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

export default mongoose.model("User", userSchema);