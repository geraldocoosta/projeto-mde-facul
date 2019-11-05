const express = require("express");
const multer = require("multer");
const cors = require("cors");
var os = require("os");

const app = express();

app.use(cors());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const SEGUNDOS_HORA = 3600;

app.post("/file/upload", upload.single("file"), (req, res) => {
  const consumoEnergetico = req.file.buffer.toString();

  const correnteTensao = consumoEnergetico.split(os.EOL); // split por quebra de linha

  let gastoAcumulativo = 0;

  const correnteTensaoPotencia = correnteTensao.map(correnteTensao => {
    [corrente, tensao] = correnteTensao.split("|");

    const potencia = corrente * tensao;
    const gastoKwH = potencia / SEGUNDOS_HORA;
    gastoAcumulativo += gastoKwH;
    
    return {
      corrente,
      tensao,
      potencia,
      kwh: gastoKwH,
      acumulativo: gastoAcumulativo
    };
  });

  res.json(correnteTensaoPotencia);
});

app.listen(3000, () => console.log("App na porta 3000"));
