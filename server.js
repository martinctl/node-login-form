const express = require('express');
const bcrypt = require('bcrypt');
const mysql = require('mysql2');
const app = express();

// Waiting for database connection
const users = []

// Use urlencoded because we are sending data from a form
app.use(express.urlencoded({extended: false}))
app.use(express.static(__dirname + '/views'));

app.set('view engine', 'ejs')
app.get('/', (req, res) => {
    res.redirect('/login');
})

app.get('/login', (req, res) => {
    res.render('login.ejs', {username: null, error: null})
})

app.post('/login', (req, res) => {
    const {username, password} = req.body
    const user = users.find(u => u.username === username)
    if (user) {
        if (bcrypt.compareSync(password, user.password)) {
            res.render('home.ejs', {username: username})
        } else {
            res.render('login.ejs', {username: username, error: 'Wrong password'})
        }
    } else {
        res.render('login.ejs', {username: username, error: 'User not found'})
    }
})


app.get('/register', (req, res) => {
    res.render('register.ejs', {username: null, error: null})
})

app.post('/register', (req, res) => {
    const {username, password, confirmPassword} = req.body
    if (password === confirmPassword) {
        try {
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(password, salt);
            users.push({
                id: Date.now().toString(),
                username: username,
                password: hash
            })
            console.log(users)
            res.render('login.ejs', {username: username, error: null})
        } catch {
            res.status(500).send()
        }
    } else {
        res.render('register.ejs', {username: username, error: 'Password does not match'})
    }
})

app.listen(3000)