const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URL)

    console.log(`MongoDB Conectado: ${conn.connection.host}` )
  } catch (error) {
    // Se der erro, mostramos o erro e fechamos o processo do Node.js
    console.error(`Erro ao conectar ao MongoDB: ${error}`);
    process.exit(1); // Sai com falha
  }
};


module.exports = connectDB;
