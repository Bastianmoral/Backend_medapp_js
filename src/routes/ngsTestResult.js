const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const NGSTestResult = require("../models/NGSTestResult");
const cancerDetails = require("../models/CancerDetails");

// Middleware para manejar errores de validación
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Obtener todos los resultados
router.get("/", async (req, res) => {
  try {
    const results = await NGSTestResult.find();
    res.json(results);
  } catch (error) {
    console.error("Error al obtener resultados NGS:", error.message);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

router.post("/search", async (req, res) => {
  const { cancer, gene } = req.body;

  try {
    console.log("Data received in /api/ngs-test-results/search:", {
      cancer,
      gene,
    });

    // Buscar el detalle del cáncer
    const cancerDetail = await cancerDetails.findOne({
      topographyDescription: cancer,
    });

    // Deduplicar resultados por testId
    const ngsResults = await NGSTestResult.aggregate([
      { $match: { gene } }, // Filtrar por el gen especificado
      {
        $group: {
          _id: "$testId", // Agrupar por testId
          document: { $first: "$$ROOT" }, // Tomar el primer documento del grupo
        },
      },
      { $replaceRoot: { newRoot: "$document" } }, // Reemplazar el resultado con el documento
    ]);

    if (!cancerDetail && ngsResults.length === 0) {
      return res.status(404).json({ message: "No se encontraron resultados." });
    }

    res.status(200).json({ cancerDetail, ngsResults });
  } catch (err) {
    console.error("Error en /api/ngs-test-results/search:", err);
    res.status(500).json({ message: "Error en el servidor." });
  }
});

router.get("/genes", async (req, res) => {
  try {
    const testResults = await NGSTestResult.find({}); // Verificar datos
    console.log("Datos en la colección NGSTestResult:", testResults);

    const genes = await NGSTestResult.distinct("gene", { gene: { $ne: null } });
    console.log("Genes únicos:", genes);

    res.status(200).json(genes);
  } catch (error) {
    console.error("Error al obtener genes únicos:", error);
    res.status(500).json({ message: "Error al obtener la lista de genes." });
  }
});

// Buscar resultados por Subject
router.get("/:subject", async (req, res) => {
  try {
    const { subject } = req.params;
    const results = await NGSTestResult.find({ subject });
    res.json(results);
  } catch (error) {
    console.error("Error al obtener resultados NGS:", error.message);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

module.exports = router;
