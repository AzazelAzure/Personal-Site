// Import dependencies
import express from 'express';
import bodyParser from 'body-parser';
import { dirname } from 'path';
import { fileURLToPath, format } from 'url';
import fs from 'fs';
import https from 'https';
import winston from 'winston';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import 'dotenv/config'


// App constants
const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

//const port = 3000;

//HTTPs Constants
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

const httpsServer = https.createServer(options, app);

//Email forwarding constants
const region = process.env.REGION
const emailUsername = process.env.EMAIL_USER

const ses = new SESClient({ region: region });

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

