const NGSTestResult = require("../models/ngsTestResult");

// Obtener todos los resultados de pruebas
const getNGSTestResults = async (req, res) => {
  try {
    const results = await NGSTestResult.find();
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Crear un nuevo resultado
const createNGSTestResult = async (req, res) => {
  try {
    const result = new NGSTestResult(req.body);
    await result.save();
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getNGSTestResults, createNGSTestResult };
