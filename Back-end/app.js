const express = require('express');
const mysql = require('mysql');

// create connection 
const db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'techsupport'
});

// connect
db.connect((err) => {
    if(err) throw err; 
    console.log("connected to db");
});

const app = express();

// create db
app.get('/createDB', (req, res) => {
    let sql = 'CREATE DATABASE techsupport';
    db.query(sql, (err, result) => {
        if(err) throw err;f
        console.log(result);
        res.send('Database created...')
    });
});

// // create table
// app.get('/createTable', (req, res) => {
//     let sql = 'CREATE TABLE '
// });


app.listen('3000', () => {
    console.log('Server is up and running on port 3000');
});
