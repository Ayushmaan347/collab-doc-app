const mongoose = require("mongoose");

const DocumentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      default: "Untitled Document",
    },
    content: {
      type: String,  // <-- Remove quotes here
      required: true,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Document", DocumentSchema);  // <-- lowercase 'model'
