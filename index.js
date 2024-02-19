// Import dependencies
import express from 'express';
import bodyParser from 'body-parser';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import https from 'https';


// Declare Constants
const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));
const httpsPort = 443;
const hostname = 'azazelazure.com'
const options = {
    key: fs.readFileSync('My Key.pem'), 
    cert: fs.readFileSync('csr.pem')
}
const httpsServer = https.createServer(options, app);

// Middleware
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}))

// Site handlers
app.get('/', (req, res)=>{
    res.render(__dirname + '/views/index.ejs');
})

app.get('/about', (req, res) =>{
    res.render(__dirname + '/views/about.ejs');
})

app.get('/contact', (req, res) =>{
    res.render(__dirname + '/views/contact.ejs')
})

app.get('/beyond', (req, res)=>{
    res.redirect('https://www.beyondmed.org');
})

// app.listen(3000, ()=>{
//     console.log(`Listening on port ${port}`);
// })

httpsServer.listen(httpsPort, hostname);

// Functions