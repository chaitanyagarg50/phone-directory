const express = require("express");
const fs = require("fs");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const FILE = "./contacts.json";

function readContacts() {
  return JSON.parse(fs.readFileSync(FILE, 'utf8'));
}

function writeContacts(data) {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

app.get("/contacts", (req, res) => {
  res.json(readContacts());
});

app.post("/contacts", (req, res) => {
  const contacts = readContacts();
  // Generate a new, unique ID for the new contact
  const newId = contacts.length > 0 ? Math.max(...contacts.map(c => c.id)) + 1 : 1;
  const newContact = { id: newId, ...req.body };
  contacts.push(newContact);
  writeContacts(contacts);
  res.status(201).json({ message: "Contact added", contact: newContact });
});

app.delete("/contacts/:id", (req, res) => {
  const contacts = readContacts();
  // Find the contact by its ID and filter it out of the array
  const idToDelete = parseInt(req.params.id);
  const updatedContacts = contacts.filter(contact => contact.id !== idToDelete);
  writeContacts(updatedContacts);
  res.json({ message: "Contact deleted" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
