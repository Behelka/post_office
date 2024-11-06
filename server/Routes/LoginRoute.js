const db = require("../db");
const url = require("url");
const parseBody = require("../Parsebody");

const CustomerProfileRoute = (req, res) => {
  const parsedUrl = url.parse(req.url, true);

  if (req.method === "POST" && parsedUrl.pathname === "/api/login") {
    parseBody(req, async (body) => {
      const { email, password } = body;

      const query1 = `
        SELECT * FROM customer
        WHERE Customer_Email_Address = ? AND Password = ?;
      `;
    
      const query2 = `
        SELECT * FROM employee
        WHERE Email = ? AND Password = ?;
      `;

      try {
        const [results1] = await db.query(query1, [email, password]); // .25s
        const [results2] = await db.query(query2, [email, password]); // .25s

        if (results1.length > 0) {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(results1[0]));
        } else if (results2.length > 0) {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(results2[0]));
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
