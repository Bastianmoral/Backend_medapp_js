const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Esquema del modelo de usuario
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: ["admin", "seller", "user"] },
});

// Modelo de usuario
const User = mongoose.model("User", UserSchema);

// Conectar a la base de datos
const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/med_app", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Conectado a MongoDB");
  } catch (error) {
    console.error("Error al conectar a MongoDB:", error);
    process.exit(1);
  }
};

// Crear usuarios
const createUsers = async () => {
  try {
    // Encriptar contraseñas
    const hashedAdminPassword = await bcrypt.hash("12345", 10);
    const hashedSellerPassword = await bcrypt.hash("12345", 10);
    const hashedUserPassword = await bcrypt.hash("12345", 10);

    // Datos de los usuarios
    const users = [
      { username: "admin", password: hashedAdminPassword, role: "admin" },
      { username: "seller1", password: hashedSellerPassword, role: "seller" },
      { username: "user1", password: hashedUserPassword, role: "user" },
    ];

    // Insertar usuarios en la base de datos
    await User.insertMany(users);
    console.log("Usuarios creados exitosamente");
  } catch (error) {
    console.error("Error al crear usuarios:", error);
  } finally {
    mongoose.connection.close();
  }
};

// Ejecutar funciones
const run = async () => {
  await connectDB();
  await createUsers();
};

run();
