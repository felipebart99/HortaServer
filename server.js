const express = require("express");
const { SerialPort } = require("serialport");

const app = express();
const port = 3000;

// Exemplo de dados de umidade
let humidityData = {
  humidity: null, // Inicializa como nulo até receber dados do sensor
};

// Rota para retornar a umidade
app.get("/humidity", (req, res) => {
  res.json(humidityData);
});

// Conectar à porta serial
const serialPort = new SerialPort({
  path: "COM3", // Substitua pela sua porta serial
  baudRate: 9600,
});

// Variável para armazenar dados fragmentados
let buffer = "";

// Ler dados da porta serial
serialPort.on("data", (data) => {
  buffer += data.toString(); // Acumula os dados recebidos

  // Verifica se recebeu o delimitador de fim de linha '\n'
  if (buffer.includes("\n")) {
    const lines = buffer.split("\n");
    buffer = lines.pop(); // Mantém qualquer fragmento de linha incompleta no buffer

    // Processa todas as linhas completas
    lines.forEach((line) => {
      const humidityValue = parseFloat(line.trim()); // Converte para número

      // Verifique se a conversão foi bem-sucedida
      if (!isNaN(humidityValue)) {
        console.log("Umidade recebida:", humidityValue);
        humidityData.humidity = humidityValue; // Atualiza o valor da umidade
      }
    });
  }
});

// Tratamento de erros na porta serial
serialPort.on("error", (err) => {
  console.error("Erro na porta serial:", err.message);
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor escutando em http://localhost:${port}`);
});
