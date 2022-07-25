const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, "company is required"],
      maxlength: 64,
    },
    position: {
      type: String,
      required: [true, "position is required"],
      maxlength: 64,
    },
    status: {
      type: String,
      enum: ["interviewing", "hired", "rejected"],
      default: "interviewing",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: [true, "user is required"],
    },
  },
  { timestamps: true }
);

const Job = mongoose.model("Jobs", JobSchema);
module.exports = Job;
