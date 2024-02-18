// Import dependencies
import express from 'express';
import bodyParser from 'body-parser';
import { dirname } from 'path';
import { fileURLToPath } from 'url';


// Declare Constants
const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));
const port = 8000;

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

app.listen(8000, ()=>{
    console.log(`Listening on port ${port}`);
})

app.listen(443, ()=>{
    console.log(`Listening for HTTPS`)
})

app.listen(80, ()=>{
    console.log(`Listening for HTTP`)
})
// Functions