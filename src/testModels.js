const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { CancerDetails, CancerTreatment, NGSTestResult } = require("./models");

// Cargar variables de entorno
dotenv.config();

// Conectar a MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected for testing"))
  .catch((err) => console.error("Connection error:", err));

// Función de prueba
const testModels = async () => {
  try {
    // Crear un documento de prueba para cada modelo
    const cancerDetail = new CancerDetails({
      subject: "TEST-0001",
      topography_code: "C18.9",
      topography_description: "Colon NOS",
    });
    await cancerDetail.save();
    console.log("CancerDetails saved:", cancerDetail);

    const cancerTreatment = new CancerTreatment({
      subject: "TEST-0001",
      llt_name: "FOLFOX",
      atc_text: "Combination of antineoplastic agents",
      trade_name: "FOLFOX",
      llt_coded_term: "FOLFOX",
      active_ingredient: ["Fluorouracil", "Folinic Acid", "Oxaliplatin"],
      preferred_base_name: "Fluorouracil",
      treatment_type: "Chemotherapy",
      treatment_intent: "Adjuvant",
    });
    await cancerTreatment.save();
    console.log("CancerTreatment saved:", cancerTreatment);

    const ngsTestResult = new NGSTestResult({
      subject: "TEST-0001",
      specimen_id: "23D03742007-3",
      test_id: "BGI-Sentis Discovery",
      gene: "DNMT3A",
      variant_allele_frequency: "<5%",
      protein_change: "p.S278*",
      dna_change: "c.833C>G",
      no_genomic_alterations: false,
    });
    await ngsTestResult.save();
    console.log("NGSTestResult saved:", ngsTestResult);

    // Cerrar conexión
    mongoose.connection.close();
    console.log("Test completed. Connection closed.");
  } catch (error) {
    console.error("Error during testing:", error);
  }
};

// Ejecutar la prueba
testModels();
