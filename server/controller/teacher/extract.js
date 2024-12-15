const fs = require("fs");
const pdfParse = require("pdf-parse");

const extractTextFromPdf = (filePath) => {
  // Read the PDF file as a buffer
  const pdfBuffer = fs.readFileSync(filePath);

  // Parse the PDF buffer and extract text
  return pdfParse(pdfBuffer)
    .then((data) => {
      return data.text; // Return the extracted text
    })
    .catch((err) => {
      throw new Error("Error extracting content from the PDF: " + err.message);
    });
};

module.exports = {
  extractTextFromPdf,
};
