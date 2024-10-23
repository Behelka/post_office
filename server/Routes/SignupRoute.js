const express = require("express");
const db = require("../db"); // Import db connection
const router = express.Router();

router.post("/signup", async (req, res) => {
  const table = req.body.role;
  const { email, firstName, lastName, phoneNumber, dob, password } = req.body;
  const query = `
    INSERT INTO ${table} (
      Email,
      First_Name,
      Last_Name,
      Phone_Number,
      DOB,
      Password
    ) VALUES (?, ?, ?, ?, ?, ?)
  `;
  try {
    const [results] = await db.query(query, [
      email,
      firstName,
      lastName,
      phoneNumber,
      dob,
      password,
    ]);
    res.json({ message: "User created" });
  } catch (err) {
    console.error("Error creating user:", err);
    return res.status(500).send("Error creating user");
  }
});

module.exports = router;
