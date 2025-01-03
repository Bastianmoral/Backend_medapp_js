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
const allowedOrigins = [
  "http://localhost:3000", // Desarrollo local
  "https://dummy-frontend-medapp.onrender.com", // Producción
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      // Permite solicitudes sin origen (por ejemplo, Postman) y desde orígenes permitidos
      callback(null, true);
    } else {
      callback(new Error("No permitido por la política CORS"));
    }
  },
};

app.use(cors(corsOptions));
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
app.use("/api", sellerPerformanceRoutes);

// Conectar a MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Conectado a MongoDB Atlas"))
  .catch((err) => console.error("Error al conectar a MongoDB Atlas:", err));

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
