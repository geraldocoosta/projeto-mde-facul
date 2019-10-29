const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cors = require("cors");

const app = express();

app.use(cors());

const storage = multer.diskStorage({
  destination(_req, _file, cb) {
    cb(null, "uploads/");
  },
  filename(_req, file, cb) {
    cb(null, `consumoenergia${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage });

app.post("/file/upload", upload.single("file"), (_, res) => res.send("sucess"));

app.get("/consumo-energia", (_, res) => {
  const pathNormalized = path.normalize(`${__dirname}/uploads/consumo.json`);
  res.json(JSON.parse(fs.readFileSync(pathNormalized)));
});

app.listen(3000, () => console.log("App na porta 3000"));
