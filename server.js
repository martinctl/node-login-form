const express = require('express');
const app = express();

// Use urlencoded because we are sending data from a form
app.use(express.urlencoded({extended: false}))
app.use(express.static(__dirname + '/views'));

app.set('view engine', 'ejs')
app.get('/', (req, res) => {
    res.redirect('/login');
})

app.get('/login', (req, res) => {
    res.render('login.ejs', {error: null})
})

app.post('/login', (req, res) => {
    const {username, password} = req.body
    if (username === 'admin' && password === 'admin') {
        res.render('home.ejs', {username: username})
    } else {
        res.render('login.ejs', {error: 'Invalid username or password'})
    }
})

app.listen(3000)