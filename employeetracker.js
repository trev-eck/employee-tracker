const mysql = require('mysql');
const inquirer = require('inquirer');

const connection = mysql.createConnection({
  host: 'localhost',

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: 'root',

  // Be sure to update with your own MySQL password!
  password: 'password',
  database: 'all_employeesDB',
});


const mainMenu = () => {

    inquirer
    .prompt([
        {
            name: "choice",
            message: "What would you like to do?",
            type: "list",
            choices: ["View all employees", "View all employees by department", "View all employees by role", "Add Employee", "Remove Employee", 'Update Employee Role', 'Update Employee Manager'],
        }
    ]).then(answers => {
        switch (answers.choice) {
            case "View all employees":
                viewEmployees();
                break;
            case "View all employees by department":
                //viewByDepartment();
                break;
            case "View all employees by role":
                //viewByRole();
                break;
            case "Add Employee":
                //addEmployee();
                break;
            case "Remove Employee":
                //removeEmployee();
                break;
            case "Update Employee Role":
                //updateRole();
                break;
            case "Update Employee Manager":
                //updateManager();
                break;
        }
    });
};

const viewEmployees = () => {
    connection.query(
        `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.department, role.salary FROM employee INNER JOIN role ON (employee.role_id = role.id) 
        INNER JOIN department ON (role.department_id = department.id) ORDER BY employee.id ASC`, (err, result) => {
            if(err) throw err;
            console.table(result);
            mainMenu();
        }
    )
}

connection.connect((err) => {
  if (err) throw err;
  console.log(`Connection as id ${connection.id}`);
  mainMenu();
});
