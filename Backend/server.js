const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'employee_manage'
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('MySQL Connected...');
});

// Create Employee Table
app.get('/createEmployeeTable', (req, res) => {
  let sql = 'CREATE TABLE IF NOT EXISTS t_Employee (f_Id INT AUTO_INCREMENT PRIMARY KEY, f_Image VARCHAR(255), f_Name VARCHAR(255) NOT NULL, f_Email VARCHAR(255) NOT NULL, f_Mobile VARCHAR(15) NOT NULL, f_Designation VARCHAR(255) NOT NULL, f_gender VARCHAR(10) NOT NULL, f_Course VARCHAR(255) NOT NULL, f_Createdate DATE NOT NULL)';
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.send('Employee table created...');
  });
});

// Create a new employee
// Add course to EmployeeCourses table
app.post('/api/employees', (req, res) => {
    const { f_Image, f_Name, f_Email, f_Mobile, f_Designation, f_gender, f_Course, f_Createdate } = req.body;
    
    // Insert employee
    const query = 'INSERT INTO t_Employee (f_Image, f_Name, f_Email, f_Mobile, f_Designation, f_gender, f_Createdate) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(query, [f_Image, f_Name, f_Email, f_Mobile, f_Designation, f_gender, f_Createdate], (err, result) => {
      if (err) return res.status(500).send('Error inserting employee data');
      
      const employeeId = result.insertId;
  
      // Insert employee courses
      const courseValues = f_Course.map(courseId => [employeeId, courseId]);
      const courseQuery = 'INSERT INTO EmployeeCourses (employee_id, course_id) VALUES ?';
      db.query(courseQuery, [courseValues], (err) => {
        if (err) return res.status(500).send('Error inserting employee courses');
        res.send('Employee created successfully');
      });
    });
  });
  

// Get all employees
app.get('/api/employees', (req, res) => {
  let sql = 'SELECT * FROM t_Employee';
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});

// Get employee by id
app.get('/api/employees/:id', (req, res) => {
  let sql = 'SELECT * FROM t_Employee WHERE f_Id = ?';
  db.query(sql, [req.params.id], (err, result) => {
    if (err) throw err;
    res.send(result[0]);
  });
});
function formatDateForMySQL(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }
  
  // Example usage
  const formattedDate = formatDateForMySQL('2024-07-20T18:30:00.000Z');
  

// Update employee
app.put('/apiemployees/:id', (req, res) => {
    const { id } = req.params;
    const employee = req.body;
    employee.f_Createdate = formatDateForMySQL(employee.f_Createdate);
  
    db.query('UPDATE t_Employee SET ? WHERE f_Id = ?', [employee, id], (err) => {
      if (err) throw err;
      res.send({ id, ...employee });
    });
  });
  

// Delete employee
app.delete('/api/employees/:id', (req, res) => {
  let sql = 'DELETE FROM t_Employee WHERE f_Id = ?';
  db.query(sql, [req.params.id], (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
