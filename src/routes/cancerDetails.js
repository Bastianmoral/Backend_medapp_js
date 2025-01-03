const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const CancerDetails = require("../models/cancerDetails");

// Middleware para manejar errores de validación
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Obtener todos los registros
router.get("/", async (req, res) => {
  try {
    const details = await CancerDetails.find();
    res.json(details);
  } catch (error) {
    console.error("Error al obtener datos:", error.message);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

// Endpoint para sugerencias de tipo de cáncer
router.get("/suggestions", async (req, res) => {
  try {
    const { query, field } = req.query;

    if (!query || !field) {
      return res.status(400).json({ message: "Faltan parámetros de búsqueda" });
    }

    let suggestions = [];
    if (field === "cancer") {
      suggestions = await CancerDetails.find({
        description: { $regex: query, $options: "i" },
      })
        .limit(10)
        .select("description -_id");
    } else if (field === "gene") {
      // Implementar búsqueda en genes
      suggestions = await CancerDetails.find({
        genes: { $regex: query, $options: "i" },
      })
        .limit(10)
        .select("genes -_id");
    }

    res.json(suggestions);
  } catch (error) {
    console.error("Error al obtener sugerencias:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
});

// Ruta para obtener la lista única de nombres de cáncer
router.get("/valid-cancers", async (req, res) => {
  try {
    // Obtener valores únicos de topographyDescription
    const uniqueCancers = await CancerDetails.distinct("topographyDescription");
    res.status(200).json(uniqueCancers);
  } catch (error) {
    console.error("Error al obtener la lista de cánceres:", error);
    res.status(500).json({ message: "Error al obtener los cánceres válidos" });
  }
});

// Buscar por subject (ID)
router.get("/:subject", async (req, res) => {
  const { subject } = req.params;
  console.log("Subject recibido en la ruta:", subject);

  try {
    // Busca el registro en la base de datos
    const record = await CancerDetails.findOne({ subject });
    if (!record) {
      console.log("Registro no encontrado en la base de datos.");
      return res.status(404).json({ message: "Registro no encontrado" });
    }

    console.log("Registro encontrado:", record);
    res.status(200).json(record);
  } catch (error) {
    console.error("Error al obtener el registro:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

module.exports = router;
