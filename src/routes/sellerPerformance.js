const express = require("express");
const router = express.Router();

// Ruta para obtener las ventas simuladas
router.get("/sales", (req, res) => {
  const mockSales = [
    { product: "test A", quantity: 5, date: "2025-01-01" },
    { product: "Test B", quantity: 3, date: "2025-01-02" },
  ];

  res.status(200).json(mockSales);
});

// Ruta para obtener el inventario simulado
router.get("/inventory", (req, res) => {
  const mockInventory = [
    { product: "Test A", stock: 20 },
    { product: "Test B", stock: 15 },
  ];

  res.status(200).json(mockInventory);
});

module.exports = router;
