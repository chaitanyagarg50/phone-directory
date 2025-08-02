const express = require("express");
const fs = require("fs");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const FILE = "./contacts.json";

function readContacts() {
  return JSON.parse(fs.readFileSync(FILE));
}

function writeContacts(data) {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

app.get("/contacts", (req, res) => {
  res.json(readContacts());
});

app.post("/contacts", (req, res) => {
  const contacts = readContacts();
  contacts.push(req.body);
  writeContacts(contacts);
  res.status(201).json({ message: "Contact added" });
});

app.delete("/contacts/:index", (req, res) => {
  const contacts = readContacts();
  contacts.splice(req.params.index, 1);
  writeContacts(contacts);
  res.json({ message: "Contact deleted" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
