const mongoose = require("mongoose");

const CancerDetailSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  topographyCode: { type: String, required: true },
  topographyDescription: { type: String, required: false },
});

module.exports = mongoose.model("CancerDetails", CancerDetailSchema);
