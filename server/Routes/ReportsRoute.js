const db = require('../db'); // Import your db connection
const url = require('url');


const reportsRoute = (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;

    if (req.method === 'GET' && parsedUrl.pathname.startsWith('/api/Reports/')){
      const reportType = parsedUrl.pathname.split('/')[3];
      const query = 'SELECT * FROM Employee WHERE Delete_Employee != 1';
            /* if (reportType === 'employee-department') {
              const query = 'SELECT * FROM Employee WHERE Delete_Employee != 1';
          } else if (reportType === 'package-delivery') {
              const query = 'SELECT * FROM Package WHERE Delete_Package != 1';
          } else if (reportType === 'financial-transactions') {
              const query = 'SELECT * FROM Package WHERE Delete_Package != 1';
          } */

          db.query(query)
          .then(([results]) => {
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify(results));
          })
          .catch(error => {
              console.error('Error querying lpackages:', error);
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ message: 'Internal Server Error' }));
          });
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Not Found' }));
}

};

module.exports = reportsRoute;