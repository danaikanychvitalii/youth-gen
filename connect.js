const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const app = express();
app.use(cors());
const connection = mysql.createConnection({
  host: "containers-us-west-165.railway.app",
  user: "root",
  password: "xRwTR2U23Pu15NX62GNV",
  database: "railway",
});

app.use(express.json());
app.post("/registration", (req, res) => {
  const { name, surname, phone, sex } = req.body;

  const checkQuery = `SELECT * FROM users WHERE phone_number = ?`;
  connection.query(checkQuery, [phone], (checkErr, checkRes) => {
    if (checkErr) {
      console.log(checkErr);
      return res.status(500).json({ msg: "Помилка..." });
    }
    if (checkRes.length > 0) {
      return res
        .status(409)
        .json({ msg: "Номер зареєстровано на іншого учасника" });
    } else {
      const query = `INSERT INTO users (name, surname, phone_number, sex, creation_date) VALUES (?, ?, ?, ?, now())`;

      connection.query(query, [name, surname, phone, sex], (err, result) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ msg: "Помилка..." });
        }
        return res.status(200).json({ msg: "Успішна реєстрація" });
      });
    }
  });
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
