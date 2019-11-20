const express = require("express");
const cors = require("cors");
const serialPort = require("serialport");
const Readline = require("@serialport/parser-readline");

const app = express();
app.use(cors());

const port = new serialPort("\\\\.\\COM5", { baudRate: 9600 }, err => {
  if (err) console.log(err);
});

const parser = port.pipe(new Readline({ delimiter: "\r\n" }));

let valorEnergeticoSomado = 0;
let segundos = 0;

parser.on("data", line => {
  let watts = Number(line.split("|")[3].replace("W", ""));
  let gastoKwH = watts / 3600;
  valorEnergeticoSomado += gastoKwH;
  segundos = line.split("|")[2].replace("S", "");
});

app.get("/buscar-energia", (_, res) => {
  res.json({
    acumulativo: valorEnergeticoSomado,
    segundos
  });
});

app.listen(3000, () => console.log("App na porta 3000"));

