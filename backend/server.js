const app = require("./app");
const db = require("./config/db");

const dotenv = require("dotenv");

//handling uncaugh exception (like use vriable which is not defined)
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting down the server");
  process.exit(1);
});

process.on("ECONNRESET", (err) => {
  console.log(`Error: ${err.message}`);
  process.exit(1);
});

dotenv.config({ path: "backend/.env" });

db();

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`server is working on this ${PORT}`);
});
