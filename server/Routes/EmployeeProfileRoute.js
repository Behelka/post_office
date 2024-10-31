const db = require("../db");
const url = require("url");
const parseBody = require("../Parsebody");

const EmployeeProfileRoute = (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const employeeId = parsedUrl.query.employeeId;
  const email = parsedUrl.query.email;

  if (req.method === "GET" && parsedUrl.pathname === "/api/employee") {
    if (!employeeId && !email) {
      res.writeHead(400, { "Content-Type": "application/json" });
      return res.end(
        JSON.stringify({ message: "Employee ID or Email is required" })
      );
    }

    let query = "";
    let param = "";

    if (email) {
      query = `SELECT Employee_ID, Email, First_Name, Middle_Name, Last_Name, Phone_Number, DOB FROM employee WHERE Email = ?;`;
      param = email;
    } else if (employeeId) {
      query = `SELECT Employee_ID, Email, First_Name, Middle_Name, Last_Name, Phone_Number, DOB FROM employee WHERE Employee_ID = ?;`;
      param = employeeId;
    }

    db.query(query, [param])
      .then(([results]) => {
        if (results.length > 0) {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(results[0]));
        } else {
          res.writeHead(404, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Employee not found" }));
        }
      })
      .catch((error) => {
        console.error("Error querying employee:", error);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Internal Server Error" }));
      });
  } else if (req.method === "PUT" && parsedUrl.pathname === "/api/employee") {
    parseBody(req, async (body) => {
      const {
        Employee_ID,
        First_Name,
        Middle_Name,
        Last_Name,
        Phone_Number,
        Email,
        DOB
      } = body;

      const updateQuery = `
        UPDATE employee SET 
          First_Name = ?, Middle_Name = ?, Last_Name = ?, 
          Phone_Number = ?, Email = ?, DOB = ?
        WHERE Employee_ID = ?;
      `;

      try {

        await db.query(updateQuery, [
          First_Name,
          Middle_Name,
          Last_Name,
          Phone_Number,
          Email,
          DOB,
          Employee_ID
        ]);

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Employee updated successfully" }));
      } catch (error) {
        console.error("Error updating employee:", error);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Internal Server Error" }));
      }
    });
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Not Found" }));
  }
};

module.exports = EmployeeProfileRoute;
