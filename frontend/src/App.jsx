import { useState } from "react";

function App() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];

    setFile(selected);

    if (selected) {
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleCompress = async () => {
    if (!file) {
      alert("Select an image first");
      return;
    }

    try {
      const formData = new FormData();

      formData.append("image", file);

      const response = await fetch(
        "http://localhost:3000/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      setResult(data);
    } catch (error) {
      console.error(error);
      alert("Compression Failed");
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Image Compressor</h1>

      <input
        type="file"
        onChange={handleFileChange}
      />

      <br />
      <br />

      {preview && (
        <img
          src={preview}
          alt="Preview"
          width="300"
        />
      )}

      <br />
      <br />

      <button onClick={handleCompress}>
        Compress Image
      </button>

      <br />
      <br />

      {result && (
        <div>
          <h2>Compression Result</h2>

          <p>
            Original Size:{" "}
            {(result.originalSize / 1024).toFixed(1)} KB
          </p>

          <p>
            Compressed Size:{" "}
            {(result.compressedSize / 1024).toFixed(1)} KB
          </p>

          <p>
            Saved: {result.savedPercent}%
          </p>

          <br />

          <a
            href={`http://localhost:3000/compressed/${result.fileName}`}
            target="_blank"
            rel="noreferrer"
          >
            Download Compressed Image
          </a>
        </div>
      )}
    </div>
  );
}

export default App;