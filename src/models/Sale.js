const saleSchema = new mongoose.Schema({
  drug: { type: mongoose.Schema.Types.ObjectId, ref: "Drug" }, //test id cambiar
  seller: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  client: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  quantity: Number,
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Sale", saleSchema);
