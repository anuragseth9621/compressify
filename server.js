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
  res.send(`
    <h1>Upload Image</h1>

    <form action="/upload" method="POST" enctype="multipart/form-data">
      <input type="file" name="image">
      <button type="submit">Upload</button>
    </form>
  `);
});

app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const uploadedPath = req.file.path;

    const compressedFileName =
      "compressed-" + req.file.filename + ".jpg";

    const compressedPath =
      path.join("compressed", compressedFileName);

    await sharp(uploadedPath)
      .jpeg({ quality: 60 })
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

app.listen(3000, () => {
  console.log("Server Started");
});