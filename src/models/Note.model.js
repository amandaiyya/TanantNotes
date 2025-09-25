import mongoose, { Schema } from "mongoose";

const NoteSchema = new Schema({
    title: {
        type: String,
        required: [true, "Title is required"],
        trim: true,
    },

    content: {
        type: String,
        required: [true, "Content is required"],
        trim: true,
    },

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Owner ID is required"],
        ref: "User",
    },

    tenantId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Tenant ID is required"],
        ref: "Tenant",
    }
}, { timestamps: true });

const Note = mongoose.models.Note || mongoose.model("Note", NoteSchema);

export default Note;