const CancerDetails = require("../models/cancerDetails");

// Obtener todos los detalles
const getCancerDetails = async (req, res) => {
  try {
    const details = await CancerDetails.find();
    res.status(200).json({ success: true, data: details });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Crear un nuevo detalle
const createCancerDetail = async (req, res) => {
  try {
    const detail = new CancerDetails(req.body);
    await detail.save();
    res.status(201).json({ success: true, data: detail });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { getCancerDetails, createCancerDetail };
