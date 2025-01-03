const express = require("express");
const router = express.Router();

// Ruta para obtener el rendimiento de los vendedores
router.get("/", (req, res) => {
  // Datos simulados, puedes reemplazarlos con datos reales de tu base de datos
  const dummyPerformanceData = [
    { seller: "John Doe", sales: 10, revenue: 500 },
    { seller: "Jane Smith", sales: 8, revenue: 400 },
  ];

  res.status(200).json({ success: true, data: dummyPerformanceData });
});

module.exports = router;
