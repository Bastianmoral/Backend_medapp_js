const mongoose = require("mongoose");

const NGSTestResultSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  specimenId: { type: String, required: true },
  testId: { type: String, required: true },
  gene: { type: String, required: true }, // Aquí está el campo 'gene'
  geneOther: { type: String },
  variantAlleleFrequency: { type: String },
  proteinChange: { type: String },
  dnaChange: { type: String },
  genomicPosition: { type: String },
  rearrangements: { type: String },
});

module.exports = mongoose.model("NGSTestResult", NGSTestResultSchema);
