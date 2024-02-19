// Import dependencies
import express from 'express';
import bodyParser from 'body-parser';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import https from 'https';
import nodemailer from 'nodemailer';
import winston from 'winston';

// App constants
const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

//const port = 3000;

//HTTPs Constants
const httpsPort = 443;
const hostname = process.env.IP_ADDRESS

const options = {
    key: fs.readFileSync('private.key'), 
    cert: fs.readFileSync('certificate.crt')
}

const httpsServer = https.createServer(options, app);

//Email forwarding constants
const password = process.env.EMAIL_PASSWORD
const emailUsername = process.env.EMAIL_USER

const tranporter = nodemailer.createTransport({
    host:'mail.privateemail.com',
    port: 465,
    secure: true,
    auth: {
        user: emailUsername,
        pass: password
    }
})



//Logging Constants
const { combine, timestamp, prettyPrint, label } = winston.format;

const logger = winston.createLogger({
    format: combine(
        timestamp(),
        prettyPrint(),
        winston.format.splat(),
        label({label:'Time since last log'}),
        winston.format.ms(),
    ),
    transports: [
        new winston.transports.File({filename: 'combined.log'}),
        new winston.transports.File({filename: 'error.log', level: 'error'}),
    ]
});



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

app.post('/email', (req, res)=>{
    let message = {
        from: emailUsername,
        to: emailUsername,
        subject: "Message from " + req.body.name + " " + req.body.email,
        text: req.body.text 

    };
    if (req.xhr || req.headers.accept.indexOf('json') > -1){
       tranporter.sendMail(message, (error, info)=>{
        if (error){
            logger.log({
                level: 'error',
                message: `${error}`
            });
            res.status(500).json({success: false, message: 'Error sending message'});
        } else{
            logger.log({
                level: 'info',
                message: 'Email sent: ' + info.response
            })
            res.status(200).json({success: true})    
        }
    }) 
    } else{
        res.render(__dirname + '/views/contact.ejs');
    }
    
    
})

// app.listen(3000, ()=>{
//     console.log(`Listening on port ${port}`)
//     logger.log({
//         level: 'info',
//         message: `Server started`
//     });
// })

httpsServer.listen(httpsPort, hostname, ()=>{
    logger.log({
        level: 'info',
        message: 'Server started'
    })
});

// Functions
