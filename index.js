// Import dependencies
import express from 'express';
import bodyParser from 'body-parser';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

// Declare Constants
const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

// Middleware


// Site handlers
app.get('/', (req, res)=>{
    app.render(__dirname + 'views/index.ejs');
})

// Functions