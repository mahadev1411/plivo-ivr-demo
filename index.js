const express = require("express");
const bodyParser = require("body-parser");
const plivo = require("plivo");
require("dotenv").config();


const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const client = new plivo.Client(
  process.env.PLIVO_AUTH_ID,
  process.env.PLIVO_AUTH_TOKEN
);



app.get("/", (req, res) => {
  res.send("Plivo IVR Server Running");
});

app.post("/call", async (req, res) => {
  try {
    const response = await client.calls.create(
      "+918031274121",                         
      "+918660376081",                        
      "https://a8847fc2642f.ngrok-free.app/ivr" 
    );

    res.json({
      message: "Outbound call initiated",
      requestUuid: response.requestUuid
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error initiating call");
  }
});

app.post("/menu", (req, res) => {
  const response = new plivo.Response();
  const digit = req.body.Digits;

  const lang = digit === "2" ? "es" : "en";

  const menuMessage =
    lang === "es"
      ? "Por favor seleccione una opción. Presione 1 para escuchar un mensaje. Presione 2 para atención al cliente."
      : "Please choose an option. Press 1 to hear a message. Press 2 to contact customer care.";

  const getDigits = response.addGetDigits({
    action: `https://a8847fc2642f.ngrok-free.app/action?lang=${lang}`,
    method: "POST",
    timeout: 7,
    numDigits: 1
  });

  getDigits.addSpeak(menuMessage);
  response.addSpeak(
  lang === "es"
    ? "Entrada no válida. Adiós."
    : "Invalid input. Goodbye."
);


  res.set("Content-Type", "text/xml");
  res.send(response.toXML());
});


app.post("/action", (req, res) => {
  const response = new plivo.Response();
  const digit = req.body.Digits;
  const lang = req.query.lang || "en";

  if (digit === "1") {
    response.addSpeak(
      lang === "es"
        ? "Gracias por probar esta demostración."
        : "Thank you for trying this IVR demo."
    );

    response.addPlay("https://www.soundjay.com/human/thank-you-1.wav");

    response.addSpeak(
      lang === "es"
        ? "Esta llamada ha finalizado. Adiós."
        : "This concludes the demo. Goodbye."
    );
  } 
  else if (digit === "2") {
    response.addSpeak(
      lang === "es"
        ? "Nuestro equipo se pondrá en contacto con usted pronto. Adiós."
        : "Our customer care team will get in touch with you shortly. Goodbye."
    );
  } 
  else {
    response.addSpeak(
      lang === "es"
        ? "Entrada no válida. Adiós."
        : "Invalid input. Goodbye."
    );
  }

  res.set("Content-Type", "text/xml");
  res.send(response.toXML());
});







app.post("/ivr", (req, res) => {
  const response = new plivo.Response();

  const getDigits = response.addGetDigits({
    action: "https://a8847fc2642f.ngrok-free.app/menu",
    method: "POST",
    timeout: 7,
    numDigits: 1
  });

  getDigits.addSpeak(
    "Welcome to the Plivo demo system. For English, press 1. Para español, presione 2."
  );

  response.addSpeak(
    "We did not receive any input. Thank you for calling. Goodbye."
  );

  res.set("Content-Type", "text/xml");
  res.send(response.toXML());
});






const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
