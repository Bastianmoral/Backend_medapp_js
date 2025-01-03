/* const CancerTreatment = require("../models/cancerTreatment");

// Obtener todos los tratamientos
const getCancerTreatments = async (req, res) => {
  try {
    const treatments = await CancerTreatment.find();
    res.status(200).json(treatments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Crear un nuevo tratamiento
const createCancerTreatment = async (req, res) => {
  try {
    const treatment = new CancerTreatment(req.body);
    await treatment.save();
    res.status(201).json(treatment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getCancerTreatments, createCancerTreatment };
 */
