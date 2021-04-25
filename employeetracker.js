const mysql = require('mysql');
const inquirer = require('inquirer');

//establish our connection with the host, specify the database to use
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
//This function displays the main menu and allows access to all of the functionality of the program, an inquirer prompt provides all of the options and a switch statement specifies which function to run for the desired action. This function is called at the end of all the other functions to display the menu again.
const mainMenu = () => {
    inquirer
    .prompt([
        {
            name: "choice",
            message: "What would you like to do?",
            type: "list",
            choices: ["View all employees", "View all employees by department", "View all employees by role", "Add Employee", "Remove Employee", 'Update Employee Role', 'Update Employee Manager', 'Add Role', 'Add Department', 'Exit'],
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
                updateRole();
                break;
            case "Update Employee Manager":
                updateManager();
                break;
            case "Add Role": 
                addRole();
                break;
            case "Add Department":
                addDepartment();
                break;
            case 'Exit':
                connection.end();
        }
    });
};
//this function queries the database and displays all of the current employees on screen, starting with the employee table it joins together the role table and the department table to display all of the employee information, it also joins the employee table to itself in order to show the assigned manager
const viewEmployees = () => {
    const query = `SELECT emp.id, emp.first_name, emp.last_name, role.title, department.department, role.salary, CONCAT(man.first_name, ' ', man.last_name) AS manager FROM employee emp LEFT JOIN employee man ON (emp.manager_id = man.id) INNER JOIN role ON (emp.role_id = role.id) INNER JOIN department ON (role.department_id = department.id) ORDER BY emp.id ASC`;
    connection.query(query, (err, result) => {
            if(err) throw err;
            console.table(result);
            mainMenu();
        }
    )
};
//this function generates an initial query to get a list of existing departments, it then displays that list on screen for the user to pick from, it then generates a second query to return all employees working within that department
const viewByDepartment = () => {
    connection.query('SELECT department.department FROM department', (err, result) => {
        if(err) throw err;
        const depArray = [];
        result.forEach(dep => {
            depArray.push(`${dep.department}`);
        });
    inquirer
    .prompt([
        {
            name: "department",
            message: "Which department would you like to view?",
            type: "rawlist",
            choices: depArray,
        }
    ]).then(answers => {
        const index = depArray.indexOf(answers.department) + 1;
        const query = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.department, role.salary FROM employee INNER JOIN role ON (employee.role_id = role.id) 
        INNER JOIN department ON (role.department_id = department.id) WHERE (department.id = ?) ORDER BY employee.id ASC`;
        connection.query(query, index, (err, res) => {
            if(err) throw err;
            console.table(res);
            mainMenu();
        })
        }
    );
    });
};
//this function generates an initial query to get a list of existing employee roles, it then displays that list on screen for the user to pick from, it then generates a second query to return all employees that exist with that role
const viewByRole= () => {
    connection.query('SELECT role.title FROM role', (error, result) => {
        if(error) throw error;
        const roleArray = [];
        result.forEach(role => {
            roleArray.push(`${role.title}`);
        });
    inquirer
    .prompt([
        {
            name: "role",
            message: "Which role would you like to view?",
            type: "rawlist",
            choices: roleArray,
        }
    ]).then(answers => {
        const index = roleArray.indexOf(answers.role) + 1;
        const query = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.department, role.salary FROM employee INNER JOIN role ON (employee.role_id = role.id) 
        INNER JOIN department ON (role.department_id = department.id) WHERE (role.id = ?) ORDER BY employee.id ASC`;
        connection.query(query, index, (err, res) => {
            if (err) throw err;
            console.table(res);
            mainMenu();
        })
        }
    );
    });
};
//this function uses three queries to add new employees, the first two queries are used to generate a list of currently available roles and currently available employees that can be set as a manager, the user is prompted for the necessary information to create a new employee, the third query inserts the new employee in to the employee table
const addEmployee= () => {
    connection.query('SELECT role.title FROM role', (error, result) => {
        if(error) throw error;
        const roleArray = [];
        result.forEach(role => {
            roleArray.push(`${role.title}`);
        })
        connection.query('SELECT employee.first_name, employee.last_name, employee.id FROM employee', (err, res) => {
            if(err) throw err;
            const manArray = [];
            const manID = [];
            res.forEach(employee =>{
                manArray.push(`${employee.first_name} ${employee.last_name}`);
                manID.push(employee.id);
            })
            manArray.push(`None`);
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
            message: "What is the Employees role?",
            type: "rawlist",
            choices: roleArray,
        },
        {
            name: "manager",
            message: "Who is this Employee's manager?",
            type: "rawlist",
            choices: manArray,
        },
    ]).then(answers => {
        const index = roleArray.indexOf(answers.roleid) + 1;
        const manIndex = manID[manArray.indexOf(answers.manager)];
        const query = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
        connection.query(query, [answers.firstname, answers.lastname, index, manIndex], (err, res) => {
            if(err) throw err;
            console.log(`${answers.roleid} ${answers.firstname} ${answers.lastname} added!`);
            mainMenu();
        })
        }
    );
    });
});
};
//this function generates a query to get a list of current employees, the user can select an employee from the list to remove them from the database, and the second query deletes that employee from the table
const removeEmployee = () => {
    connection.query(`SELECT employee.first_name, employee.last_name FROM employee`, (err, res) => {
        if(err) throw err;
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
            connection.query(`DELETE FROM employee WHERE (first_name = ? AND last_name = ?)`,[delEmp[0], delEmp[1]], (err, res) => {
                if(err) throw err;
                console.log(`Removed ${answers.removethem}`);
                mainMenu();
            })
        })

    });
};
//this function generates a query to get a list of current departments, the user can then input the information regarding a new role and which department it falls within, the second query inserts this information into the role table
const addRole = () => {
    connection.query('SELECT department.department FROM department', (err, result) => {
        if(err) throw err;
        const depArray = [];
        result.forEach(dep => {
            depArray.push(`${dep.department}`);
        });
inquirer
.prompt([
    {
        name: "title",
        type: "input",
        message: "What is the title of the new role?",
    },
    {
        name: "salary",
        type: "input",
        message: "What is the salary of the new role?",
    },
    {
        name: "department",
        type: "rawlist",
        message: "Which department does the new role belong to?",
        choices: depArray,
    },
]).then(answers => {
    const index = depArray.indexOf(answers.department) + 1;
    connection.query('INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)', [answers.title, answers.salary, index], (err, res) => {
        if (err) throw err;
        console.log(`New Role: ${answers.title} created!`);
        mainMenu();
    })
})
    });
};
//this function prompts the user to input a name for a new department, then inserts that data into the department table
const addDepartment = () => {
    inquirer
    .prompt([
        {
            name: "name",
            type: "input",
            message: "What is the title of the new department?",
        },
    ]).then(answers => {
        connection.query('INSERT INTO department (department) VALUES (?)', [answers.name], (err, res) =>{
            if(err) throw err;
            console.log(`New Department: ${answers.name} created!`);
            mainMenu();
        })
    })
};
//this function uses three queries to update the role of an employee, the first two queries are used to get a list of current employees and current roles, the user is prompted to select an employee and a role, the data is then updated into the employee table
const updateRole = () => {
    connection.query(`SELECT employee.first_name, employee.last_name FROM employee`, (err, res) => {
        if(err) throw err;
        const empArray = [];
        res.forEach(employee => {
            empArray.push(`${employee.first_name} ${employee.last_name}`);
        })
        connection.query('SELECT role.title FROM role', (error, result) => {
            if(error) throw error;
        const roleArray = [];
        result.forEach(role => {
            roleArray.push(`${role.title}`);
        })
        inquirer
        .prompt([
            {
                name: "employee",
                type: "rawlist",
                message: "Select an Employee to update their role: ",
                choices: empArray,
            },
            {
                name: "newrole",
                type: "list",
                message: "Select a new role: ",
                choices: roleArray,
            }
        ]).then(answers => {
            const theEmp = answers.employee.split(" ");
            const index = roleArray.indexOf(answers.newrole) + 1;
            connection.query(`UPDATE employee SET employee.role_id = ? WHERE (first_name = ? AND last_name = ?)`,[index, theEmp[0], theEmp[1]], (err, res) => {
                if(err) throw err;
                console.log(`Updated ${answers.employee}'s role to ${answers.newrole}`);
                mainMenu();
            })
        })

    });
    });
};
//this function generates a query to get a current list of employees and their IDs, the user is prompted to select an employee and who they would like to assign as a manager, the second query updates the employee table with the change in manager_id
const updateManager = () => {
    connection.query(`SELECT employee.first_name, employee.last_name, employee.id FROM employee`, (err, res) => {
        if(err) throw err;
        const empArray = [];
        const idArray = [];
        res.forEach(employee => {
            empArray.push(`${employee.first_name} ${employee.last_name}`);
            idArray.push(employee.id);
        })
        empArray.push("None");
        inquirer
        .prompt([
            {
                name: "employee",
                type: "rawlist",
                message: "Select an Employee to update their manager: ",
                choices: empArray,
            },
            {
                name: "newmanager",
                type: "rawlist",
                message: "Select a new manager: ",
                choices: empArray,
            }
        ]).then(answers => {
            const theEmp = answers.employee.split(" ");
            const index = idArray[empArray.indexOf(answers.newmanager)];
            connection.query(`UPDATE employee SET employee.manager_id = ? WHERE (first_name = ? AND last_name = ?)`,[index, theEmp[0], theEmp[1]], (err, res) => {
                if(err) throw err;
                console.log(`Updated ${answers.employee}'s manager to be ${answers.newmanager}`);
                mainMenu();
            })
        })
    });
};
//start the connection and bring up the main menu
connection.connect((err) => {
  if (err) throw err;
  console.log(`Connection as id ${connection.id}`);
  mainMenu();
});
