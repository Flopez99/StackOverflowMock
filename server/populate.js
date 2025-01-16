const mysql = require('mysql');

// Get user and password from command line arguments
let userArgs = process.argv.slice(2);
let dbUser = userArgs[1];
let dbPass = userArgs[3];

// Create a connection to the database
const connection = mysql.createConnection({
    host: "localhost",
    user: dbUser,
    password: dbPass,
    database: "fake_so"
});

// Connect to the database
connection.connect((err) => {
    if (err) throw err;
    console.log("Connected to the database.");

    // Insert sample users
    connection.query(
        `INSERT INTO users (username, email, password, reputation) VALUES 
        ('Alice', 'alice@example.com', 'password123', 150),
        ('Bob', 'bob@example.com', 'password456', 120),
        ('Charlie', 'charlie@example.com', 'password789', 100);`,
        (err) => {
            if (err) throw err;
            console.log("Inserted sample users.");
        }
    );

    // Insert sample tags
    connection.query(
        `INSERT INTO tag (name) VALUES 
        ('JavaScript'),
        ('MySQL'),
        ('Node.js'),
        ('React'),
        ('Programming');`,
        (err) => {
            if (err) throw err;
            console.log("Inserted sample tags.");
        }
    );

    // Insert sample questions
    connection.query(
        `INSERT INTO question (title, text, asked_by, views, votes, summary) VALUES 
        ('What is Node.js?', 'Can someone explain what Node.js is?', 'Alice', 10, 2, 'Node.js explanation'),
        ('How to write SQL queries?', 'Looking for basic SQL query examples.', 'Bob', 15, 5, 'SQL query basics'),
        ('Best practices for React hooks?', 'What are the best practices for using hooks in React?', 'Charlie', 20, 8, 'React hooks practices');`,
        (err) => {
            if (err) throw err;
            console.log("Inserted sample questions.");
        }
    );

    // Insert sample answers
    connection.query(
        `INSERT INTO answer (text, ans_by, votes) VALUES 
        ('Node.js is a runtime for executing JavaScript outside a browser.', 'Bob', 3),
        ('Start with SELECT statements to fetch data from tables.', 'Charlie', 2),
        ('Always wrap hooks in custom functions for reusability.', 'Alice', 5);`,
        (err) => {
            if (err) throw err;
            console.log("Inserted sample answers.");
        }
    );

    // Insert sample comments
    connection.query(
        `INSERT INTO comment (text, username) VALUES 
        ('This is a great question!', 'Charlie'),
        ('I had the same issue.', 'Alice'),
        ('Thanks for the answer!', 'Bob');`,
        (err) => {
            if (err) throw err;
            console.log("Inserted sample comments.");
        }
    );

    // Insert relationships into mapping tables (example for `qc`, `qa`, etc.)
    connection.query(
        `INSERT INTO qa (qstnId, ansId) VALUES 
        (1, 1),
        (2, 2),
        (3, 3);`,
        (err) => {
            if (err) throw err;
            console.log("Mapped questions to answers.");
        }
    );

    connection.query(
        `INSERT INTO qc (qstnId, commentId) VALUES 
        (1, 1),
        (2, 2),
        (3, 3);`,
        (err) => {
            if (err) throw err;
            console.log("Mapped questions to comments.");
        }
    );

    connection.query(
        `INSERT INTO qt (qstnId, tagId) VALUES 
        (1, 1),
        (2, 2),
        (3, 4);`,
        (err) => {
            if (err) throw err;
            console.log("Mapped questions to tags.");
        }
    );

    connection.query(
        `INSERT INTO ut (userId, tagId) VALUES 
        (1, 3),
        (2, 1),
        (3, 5);`,
        (err) => {
            if (err) throw err;
            console.log("Mapped users to tags.");
        }
    );

    console.log("Populated database with sample data. Ending connection.");
    connection.end();
});
