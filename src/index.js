const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const authMiddleware = require("./middlewares/authMiddleware"); // Middleware de autenticación
const cancerDetailsRoutes = require("./routes/cancerDetails");
const cancerTreatmentRoutes = require("./routes/cancerTreatment");
const ngsTestResultRoutes = require("./routes/ngsTestResult");
const authRoutes = require("./routes/auth"); // Nueva ruta de autenticación
const sellerPerformanceRoutes = require("./routes/sellerPerformance");

// Cargar variables de entorno
dotenv.config();

// Inicializar app y puerto
const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas base
app.get("/", (req, res) => res.send("API is running!"));

// Rutas de autenticación
app.use("/api/auth", authRoutes);

// Rutas
app.use("/api/cancer-details", cancerDetailsRoutes);
app.use("/api/cancer-treatments", cancerTreatmentRoutes);
app.use("/api/ngs-test-results", ngsTestResultRoutes);
app.use("/api/seller-performance", sellerPerformanceRoutes);

// Conectar a MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// Middleware de manejo de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .json({ error: "Something went wrong! Please try again later." });
});

// Iniciar servidor
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
