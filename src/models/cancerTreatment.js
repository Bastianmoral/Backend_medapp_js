const mongoose = require("mongoose");

const CancerTreatmentSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  lltName: { type: String, required: false },
  atcText: { type: [String], required: false }, // Cambiado a Array
  tradeName: { type: String, required: false },
  activeIngredient: { type: [String], required: false }, // Array
  treatmentType: { type: String, required: false },
  treatmentIntent: { type: String, required: false },
});

module.exports = mongoose.model("CancerTreatment", CancerTreatmentSchema);
