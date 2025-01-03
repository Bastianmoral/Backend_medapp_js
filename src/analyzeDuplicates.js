const mongoose = require("mongoose");
const dotenv = require("dotenv");
const CancerDetails = require("./models/cancerDetails");

// Configuración de entorno
dotenv.config();

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected for analysis"))
  .catch((err) => console.error(err));

const analyzeDuplicates = async () => {
  try {
    // Pipeline de agregación para encontrar duplicados
    const duplicates = await CancerDetails.aggregate([
      {
        $group: {
          _id: "$subject",
          count: { $sum: 1 },
          docs: { $push: "$_id" }, // Guardar los IDs duplicados
        },
      },
      { $match: { count: { $gt: 1 } } }, // Solo registros con más de 1 ocurrencia
    ]);

    if (duplicates.length === 0) {
      console.log("No duplicates found in the 'subject' field.");
    } else {
      console.log("Duplicates found:");
      duplicates.forEach((dup) => {
        console.log(
          `Subject: ${dup._id}, Count: ${dup.count}, IDs: ${dup.docs}`
        );
      });
    }

    mongoose.connection.close();
  } catch (error) {
    console.error("Error analyzing duplicates:", error);
    mongoose.connection.close();
  }
};

analyzeDuplicates();
