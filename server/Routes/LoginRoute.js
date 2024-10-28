const db = require("../db");
const url = require("url");
const parseBody = require("../Parsebody");

const CustomerProfileRoute = (req, res) => {
  const parsedUrl = url.parse(req.url, true);

  if (req.method === "POST" && parsedUrl.pathname === "/api/login") {
    parseBody(req, async (body) => {
      const { email, password } = body;

      const query = `
        SELECT * FROM customer
        WHERE Customer_Email_Address = ? AND Password = ?;
      `;

      try {
        const [results] = await db.query(query, [email, password]);
        if (results.length > 0) {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(results[0]));
        } else {
          res.writeHead(404, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Invalid email or password" }));
        }
      } catch (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Error with signup" }));
      }
    });
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Not Found" }));
  }
};

module.exports = CustomerProfileRoute;
