'use strict';

const sqlite = require('sqlite3');
const bcrypt = require('bcrypt');

const db = new sqlite.Database('db.sqlite3', (err) => {
    if (err) throw err;
});

exports.getUserById = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM users WHERE username=?';
        db.get(sql, [id], (err, row) => {
            if (err)
                reject(err);
            else if (row === undefined)
                resolve({ error: 'User not found' });
            else {
                const user = { username: row.username, role: row.role };
                resolve(user);
            }
        });
    });
};

exports.getUser = (username, password) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM users WHERE username=?';
        db.get(sql, [username], (err, row) => {
            if (err)
                reject(err);
            else if (row === undefined) {
                resolve(false);
            } else {
                const user = { username: row.username, role: row.role };
                bcrypt.compare(password, row.hash).then(result => {
                    if (result)
                        resolve(user);
                    else
                        resolve(false);
                });
            }
        });
    });
};
