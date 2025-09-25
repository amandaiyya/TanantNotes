import mongoose, { Schema } from "mongoose";

const TenantSchema = new Schema({
    name: {
        type: String,
        required: [true, "Tenant name is required"],
        trim: true,
    },

    slug: {
        type: String,
        required: [true, "Slug is required"],
        enum: ["acme", "globex"],
    },

    plan: {
        type: String,
        required: [true, "Plan is required"],
        enum: ["free", "pro"],
    }
}, { timestamps: true });

const Tenant = mongoose.models.Tenant || mongoose.model("Tenant", TenantSchema);

export default Tenant;