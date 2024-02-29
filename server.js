// Import dependencies
import express from 'express';
import bodyParser from 'body-parser';
import { dirname } from 'path';
import { fileURLToPath, format } from 'url';
import fs from 'fs';
import https from 'https';
import winston from 'winston';
<<<<<<< HEAD:server.js
import {Chess} from 'chess.js';
import cors from 'cors';
=======
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import 'dotenv/config'

>>>>>>> 5cdb04a4a8e20e3ccba93de878ce57320db3a0d3:index.js

// App constants
const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));
const CHESS_API = 'http://localhost:3001'

const port = 3000;

//HTTPs Constants
<<<<<<< HEAD:server.js
// const httpsPort = 443;
// const hostname = process.env.IP_ADDRESS

// const options = {
//     key: fs.readFileSync('private.key'), 
//     cert: fs.readFileSync('certificate.crt'),
//     ca: fs.readFileSync('www_azazelazure_com.ca-bundle')
// }
=======
const httpsPort = 443;
const hostname = process.env.IP_ADDRESS
const key = process.env.SSL_KEY
const cert = process.env.SSL_CERT
const ca = process.env.SSL_CA

const options = {
    key: fs.readFileSync(key), 
    cert: fs.readFileSync(cert),
    ca: fs.readFileSync(ca)
}
>>>>>>> 5cdb04a4a8e20e3ccba93de878ce57320db3a0d3:index.js

// const httpsServer = https.createServer(options, app);

//Email forwarding constants
<<<<<<< HEAD:server.js
// const password = process.env.EMAIL_PASSWORD
// const emailUsername = process.env.EMAIL_USER

// const tranporter = nodemailer.createTransport({
//     host:'mail.privateemail.com',
//     port: 465,
//     secure: true,
//     auth: {
//         user: emailUsername,
//         pass: password
//     }
// })


=======
const region = process.env.REGION
const emailUsername = process.env.EMAIL_USER

const ses = new SESClient({ region: region });
>>>>>>> 5cdb04a4a8e20e3ccba93de878ce57320db3a0d3:index.js

//Logging Constants
const { combine, timestamp, prettyPrint, label } = winston.format;

const logger = winston.createLogger({
    format: combine(
        timestamp(), 
        winston.format.splat(),
        label({label:'Time since last log'}),
        winston.format.ms(),
        prettyPrint(),
       
    ),
    transports: [
        new winston.transports.File({filename: 'combined.log'}),
        new winston.transports.File({filename: 'error.log', level: 'error'}),
    ]
});

// Middleware
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}))
app.use(cors())

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

<<<<<<< HEAD:server.js
app.get('/chess', (req, res) =>{
    res.render(__dirname + '/views/chess.ejs', {chess: true});
})

app.get('/newGame', (req, res)=>{
    const chess = new Chess();
    const position = chess.fen()
    res.json({board: position, api: CHESS_API})
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
=======
app.post('/email', async (req, res)=>{
	const params = {
		Source: emailUsername,
		Destination: {ToAddresses: [emailUsername]},
		Message:{
			Subject:{
				Data:'Message from ' + req.body.name, 
				Charset: 'UTF-8',
			},
			Body:{
				Text:{
					Data:req.body.text + ' sent from: ' + req.body.email, 
					Charset: 'UTF-8',
				},
			},
		},
	};
	
	try{
		const command = new SendEmailCommand(params);
		const info = await ses.send(command);
		logger.log({level: 'info', message: 'Email sent: ' + info.response});
		res.status(200).json({success: true});
	} catch (error) {
		logger.log({level: 'error', message: `${error}`});
		res.status(500).json({success: false, message: 'Error sending message'});
	}
});
>>>>>>> 5cdb04a4a8e20e3ccba93de878ce57320db3a0d3:index.js

app.listen(3000, ()=>{
    console.log(`Listening on port ${port}`)
    logger.log({
        level: 'info',
        message: `Server started`
    });
})

// httpsServer.listen(httpsPort, hostname, ()=>{
//     logger.log({
//         level: 'info',
//         message: 'Server started'
//     })
// });

