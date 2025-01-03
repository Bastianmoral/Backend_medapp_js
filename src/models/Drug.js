const drugSchema = new mongoose.Schema({
  name: String,
  price: Number,
  availability: String, // e.g., "Chile"
});

module.exports = mongoose.model("Drug", drugSchema);
