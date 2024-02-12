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

// Site handlers
app.get('/', (req, res)=>{
    res.render(__dirname + '/views/index.ejs');
})

app.listen(8000, ()=>{
    console.log(`Listening on port ${port}`);
})

// Functions