import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: [true, "Email is required"],
    },

    password: {
        type: String,
        required: [true, "Password is required"],
    },

    role: {
        type: String,
        required: [true, "User role is required"],
        enum: ["admin", "member"],
    },

    tenantId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Tenant ID is required"],
        ref: "Tenant",
    }
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;