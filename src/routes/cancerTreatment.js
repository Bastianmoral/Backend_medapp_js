const express = require("express");
const { body, validationResult } = require("express-validator");
const CancerTreatment = require("../models/CancerTreatment");
const router = express.Router();

// Middleware para manejar errores de validación
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Obtener todos los tratamientos
router.get("/", async (req, res) => {
  try {
    const treatments = await CancerTreatment.find();
    res.json(treatments);
  } catch (error) {
    console.error("Error al obtener tratamientos:", error.message);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

// Buscar tratamientos por Subject
router.get("/:subject", async (req, res) => {
  try {
    const { subject } = req.params;
    const treatments = await CancerTreatment.find({ subject });
    res.json(treatments);
  } catch (error) {
    console.error("Error al obtener tratamientos:", error.message);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

module.exports = router;
