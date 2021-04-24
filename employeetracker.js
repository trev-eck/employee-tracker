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
            choices: ["View all employees", "View all employees by department", "View all employees by role", "Add Employee", "Remove Employee", 'Update Employee Role', 'Update Employee Manager', 'Add Role', 'Add Department'],
        }
    ]).then(answers => {
        switch (answers.choice) {
            case "View all employees":
                viewEmployees();
                break;
            case "View all employees by department":
                viewByDepartment();
                break;
            case "View all employees by role":
                viewByRole();
                break;
            case "Add Employee":
                addEmployee();
                break;
            case "Remove Employee":
                removeEmployee();
                break;
            case "Update Employee Role":
                //updateRole();
                break;
            case "Update Employee Manager":
                //updateManager();
                break;
            case "Add Role": 
                //addRole();
                break;
            case "Add Department":
                //addDepartment();
                break;
        }
    });
};

const viewEmployees = () => {
    const query = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.department, role.salary FROM employee INNER JOIN role ON (employee.role_id = role.id) 
        INNER JOIN department ON (role.department_id = department.id) ORDER BY employee.id ASC`;
    connection.query(query, (err, result) => {
            if(err) throw err;
            console.table(result);
            mainMenu();
        }
    )
};
const viewByDepartment = () => {
    inquirer
    .prompt([
        {
            name: "department",
            message: "Which department would you like to view? Sales = 1 , Finance = 2 , Engineering = 3, Legal = 4",
            type: "list",
            choices: [1,2,3,4],
        }
    ]).then(answers => {
        const query = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.department, role.salary FROM employee INNER JOIN role ON (employee.role_id = role.id) 
        INNER JOIN department ON (role.department_id = department.id) WHERE (department.id = ?) ORDER BY employee.id ASC`;
        connection.query(query, answers.department, (err, res) => {
            console.table(res);
            mainMenu();
        })
        }
    );
};
const viewByRole= () => {
    inquirer
    .prompt([
        {
            name: "role",
            message: "Which role would you like to view? Sales Lead = 1 , Salesperson = 2 , Lead Engineer = 3, Software Engineer = 4, Accountant = 5, Legal Team Lead = 6, Lawyer = 7",
            type: "list",
            choices: [1,2,3,4,5,6,7],
        }
    ]).then(answers => {
        const query = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.department, role.salary FROM employee INNER JOIN role ON (employee.role_id = role.id) 
        INNER JOIN department ON (role.department_id = department.id) WHERE (role.id = ?) ORDER BY employee.id ASC`;
        connection.query(query, answers.role, (err, res) => {
            console.table(res);
            mainMenu();
        })
        }
    );
};
const addEmployee= () => {
    inquirer
    .prompt([
        {
            name: "firstname",
            message: "What is the Employees first name?",
            type: "input",
        },
        {
            name: "lastname",
            message: "What is the Employees last name?",
            type: "input",
        },
        {
            name: "roleid",
            message: "What is the Employees Role?: Sales Lead = 1 , Salesperson = 2 , Lead Engineer = 3, Software Engineer = 4, Accountant = 5, Legal Team Lead = 6, Lawyer = 7",
            type: "list",
            choices: [1,2,3,4,5,6,7],
        },
    ]).then(answers => {
        const query = `INSERT INTO employee (first_name, last_name, role_id) VALUES (?, ?, ?)`;
        connection.query(query, [answers.firstname, answers.lastname, answers.roleid], (err, res) => {
            console.log(`Employee ${answers.firstname} ${answers.lastname} added!`);
            mainMenu();
        })
        }
    );
};
const removeEmployee = () => {
    connection.query(`SELECT employee.first_name, employee.last_name FROM employee`, (err, res) => {
        const empArray = [];
        res.forEach(employee => {
            empArray.push(`${employee.first_name} ${employee.last_name}`);
        })
        inquirer
        .prompt([
            {
                name: "removethem",
                type: "rawlist",
                message: "Select an Employee to remove: ",
                choices: empArray,

            }
        ]).then(answers => {
            const delEmp = answers.removethem.split(" ");
            console.log(delEmp);
            connection.query(`DELETE FROM employee WHERE (first_name = ? AND last_name = ?)`,[delEmp[0], delEmp[1]], (err, res) => {
                console.log(`Removed ${answers.removethem}`);
                mainMenu();
            })
        })

    });
};

connection.connect((err) => {
  if (err) throw err;
  console.log(`Connection as id ${connection.id}`);
  mainMenu();
});
