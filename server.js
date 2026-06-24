const cors = require("cors");
const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const path = require("path");

const app = express();
app.use(cors());
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },

  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
});

app.use("/compressed", express.static("compressed"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "upload.html"));
});

app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const uploadedPath = req.file.path;

    const compressedFileName =
      "compressed-" + req.file.filename + ".jpg";

    const compressedPath =
      path.join("compressed", compressedFileName);

      const quality =
      parseInt(req.body.quality) || 60;
      
      await sharp(uploadedPath)
      .jpeg({ quality })
      .toFile(compressedPath);

      const fs = require("fs");

      const originalSize = fs.statSync(uploadedPath).size;
      
      const compressedSize = fs.statSync(compressedPath).size;
      
      const savedPercent = Math.round(
        ((originalSize - compressedSize) / originalSize) * 100
      );
      
      res.json({
        success: true,
        fileName: compressedFileName,
        originalSize,
        compressedSize,
        savedPercent,
      });

  } catch (error) {
    console.error(error);

    res.status(500).send("Compression Failed");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server Started on ${PORT}`);
});