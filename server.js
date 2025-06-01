// server.js
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

let users = []; // збереження юзерів у пам'яті (приклад)

app.post("/signup", (req, res) => {
  const { username, email, password } = req.body;
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ message: "User already exists" });
  }
  users.push({ username, email, password, packingList: [], visitedCountries: [] });
  res.json({ message: "User created" });
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ message: "Invalid credentials" });
  // Для простоти — повертаємо просто user info (без токена)
  res.json({ username: user.username, email: user.email });
});

app.get("/userdata", (req, res) => {
  const email = req.query.email;
  const user = users.find(u => u.email === email);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json({ packingList: user.packingList, visitedCountries: user.visitedCountries });
});

app.post("/userdata", (req, res) => {
  const { email, packingList, visitedCountries } = req.body;
  const user = users.find(u => u.email === email);
  if (!user) return res.status(404).json({ message: "User not found" });
  user.packingList = packingList;
  user.visitedCountries = visitedCountries;
  res.json({ message: "Data saved" });
});

app.listen(3000, () => console.log("Server started on port 3000"));
