const puppeteer = require('puppeteer');
const conn = require('./connection');
require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const user = require('./routers/users');
const puppeteerService = require('./services/puppeteer');

let app = express();

app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({
    limit: '50mb',
    'extended': 'true'
}))

app.use('/api', user)


var PORT = process.env.PORT || 3000
app.listen(PORT)
console.log('Started server on port ' + PORT)
