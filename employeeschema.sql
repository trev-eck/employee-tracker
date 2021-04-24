DROP DATABASE IF EXISTS all_employeesDB;
create DATABASE all_employeesDB;

use all_employeesDB;

CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INTEGER NOT NULL,
    manager_id INTEGER,
    PRIMARY KEY(id)
);

CREATE TABLE role (
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL(10,2) NOT NULL,
    department_id INTEGER NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT,
    department VARCHAR(30) NOT NULL,
    PRIMARY KEY (id)
);

INSERT INTO department (department) VALUES ("Sales"), ("Finance"), ("Engineering"), ("Legal");

INSERT INTO role (title, salary, department_id) VALUES ("Sales Lead", 10000, 1), ("Salesperson", 8000, 1), ("Lead Engineer", 15000, 3), ("Software Engineer", 12500, 3), ("Accountant", 9000, 2), ("Legal Team Lead", 20000, 4), ("Lawyer", 17000, 4);

INSERT INTO employee (first_name, last_name, role_id) VALUES ("Trevor", "Eckberg", 3), ("Andrew", "Yu", 4), ("Joy", "Rhee", 1), ("Ty", "McFarland", 5), ("Kat", "Hunt", 2), ("Joe", "Rehfuss", 6), ("Denis", "Malloy", 7);