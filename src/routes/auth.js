const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const router = express.Router();

// Secret para JWT (debería estar en .env)
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

// Ruta de inicio de sesión
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  // Log para verificar qué datos está recibiendo el backend
  console.log("Received Request Body:", req.body);

  try {
    // Busca al usuario en la base de datos
    const user = await User.findOne({ username });

    // Log para verificar si el usuario se encuentra en la base de datos
    console.log("MongoDB User Document:", user);

    if (!user) {
      console.log("User not found:", username);
      return res.status(404).json({ message: "User not found" });
    }

    // Verifica si la contraseña coincide
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    // Genera un token JWT
    const token = jwt.sign(
      { username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    console.log("Login Successful. Token Generated:", token);

    return res.status(200).json({ token });
  } catch (error) {
    // Log de errores para depuración
    console.error("Error during login:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
