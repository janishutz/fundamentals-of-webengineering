import express from "express";
import ViteExpress from "vite-express";
import multer from "multer";

const app = express();

const storage = multer.diskStorage({
  destination: "./src/server/uploads",
  filename: (_req, file, cb) => {
    // Suggested in Multer's readme
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + "-" + uniqueSuffix)
  }
});
const upload = multer({ storage: storage });

app.post(
  "/upload", 
  upload.single("dataFile"), 
  (req, res, next) => {
    console.log(req, res, next)
  }
);


// example route which returns a message
app.get("/hello", async function (_req, res) {
  res.status(200).json({ message: "Hello World!" });
});

// Do not change below this line
ViteExpress.listen(app, 5173, () =>
    console.log("Server is listening on http://localhost:5173"),
);
