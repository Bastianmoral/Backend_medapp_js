const mongoose = require("mongoose");
const fs = require("fs");
const csvParser = require("csv-parser");

const CancerDetail = require("./models/CancerDetails");
const CancerTreatment = require("./models/CancerTreatment");
const NGSTestResult = require("./models/NGSTestResult");

// Conexión a MongoDB
mongoose
  .connect("mongodb://localhost:27017/med_app", {})
  .then(() => console.log("Conectado a MongoDB"))
  .catch((err) => console.error("Error al conectar a MongoDB:", err));

// Función para leer y cargar datos desde un archivo CSV
const loadData = (filePath, model, transformFunction) => {
  return new Promise((resolve, reject) => {
    const results = [];
    console.log(`Iniciando carga del archivo: ${filePath}`);

    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on("data", (data) => {
        const transformed = transformFunction(data); // Transforma los datos
        if (transformed) results.push(transformed); // Ignora nulos
      })
      .on("end", async () => {
        try {
          const cleanedResults = results.filter((item) => item !== null);
          if (cleanedResults.length > 0) {
            await model.insertMany(cleanedResults); // Guarda en MongoDB
            console.log(
              `Datos cargados correctamente desde: ${filePath} - Total: ${cleanedResults.length}`
            );
          } else {
            console.warn(`No se encontraron datos válidos en: ${filePath}`);
          }
          resolve();
        } catch (error) {
          console.error(`Error al cargar datos desde ${filePath}:`, error);
          reject(error);
        }
      });
  });
};

// Funciones de transformación para cada modelo
const transformCancerDetail = (data) => {
  if (!data["Subject"] || !data["Topography description"]) {
    console.warn(
      `Fila ignorada por falta de campos requeridos: ${JSON.stringify(data)}`
    );
    return null;
  }
  return {
    subject: data["Subject"],
    topographyCode: data["Topography (icdo3) code"],
    topographyDescription: data["Topography description"],
  };
};

const transformCancerTreatment = (data) => {
  if (!data["Subject"] || !data["LLT Name"]) {
    console.warn(
      `Fila ignorada por falta de campos requeridos: ${JSON.stringify(data)}`
    );
    return null;
  }
  return {
    subject: data["Subject"],
    lltName: data["LLT Name"] || null,
    atcText: Array.isArray(data["ATC Text"])
      ? data["ATC Text"].join(", ")
      : data["ATC Text"] || null,
    tradeName: data["Trade Name"] || null,
    activeIngredients: data["ACTIVE INGREDIENT"]
      ? data["ACTIVE INGREDIENT"].split(";").map((item) => item.trim())
      : [],
    treatmentType: data["Treatment type"] || null,
    treatmentIntent: data["Treatment intent"] || null,
  };
};

const transformNGSTestResult = (data) => {
  const gene = data["Gene"] ? data["Gene"].trim() : null;

  // Validar que los campos requeridos estén presentes
  if (
    !data["Subject"] ||
    !data["Specimen ID / Sample ID"] ||
    !data["Test ID"] ||
    !gene
  ) {
    console.warn(
      `Fila ignorada por falta de campos requeridos: ${JSON.stringify(data)}`
    );
    return null; // Ignorar filas incompletas
  }

  return {
    subject: data["Subject"],
    specimenId: data["Specimen ID / Sample ID"],
    testId: data["Test ID"],
    gene: gene,
    geneOther: data["Gene - other, specify"] || null,
    variantAlleleFrequency: data["Variant allele frequency (%)"] || null,
    proteinChange: data["Protein change"] || null,
    dnaChange: data["DNA change"] || null,
    genomicPosition: data["Genomic position"] || null,
    copyNumberAlterationType: data["Copy Number Alteration (CNA) type"] || null,
    rearrangementGeneFusionPartner:
      data["Rearrangements - Gene fusion partner"] || null,
  };
};

// Cargar los datos
const run = async () => {
  try {
    await Promise.all([
      loadData(
        "data/Grid - Current Cancer Details.csv",
        CancerDetail,
        transformCancerDetail
      ),
      loadData(
        "data/Grid - Cancer Treatments.csv",
        CancerTreatment,
        transformCancerTreatment
      ),
      loadData(
        "data/Grid - NGS Test Results.csv",
        NGSTestResult,
        transformNGSTestResult
      ),
    ]);
    console.log("Carga completa.");
    mongoose.disconnect();
  } catch (error) {
    console.error("Error durante la carga de datos:", error);
    mongoose.disconnect();
  }
};

run();
