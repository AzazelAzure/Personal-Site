// Import dependencies
import express from 'express';
import bodyParser from 'body-parser';
import { dirname } from 'path';
import { fileURLToPath, format } from 'url';
import fs, { stat } from 'fs';
import winston from 'winston';
import {Chess} from 'chess.js';
import cors from 'cors';

// App constants
const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));
const port = 3001;

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
app.use(bodyParser.json());
app.use(cors());

// Site Handlers
app.post('/gameStatus', (req, res)=>{
    const chess = new Chess(req.body.fen);
    const status = {
        turn: chess.turn(),
        gameover: chess.isGameOver(),
        check: chess.isCheck(),
        checkmate: chess.isCheckmate(),
        draw: chess.isDraw(),
        stalemate: chess.isStalemate(),
        insufficient: chess.isInsufficientMaterial(),
        threefold: chess.isThreefoldRepetition()
    };
    res.json(status);
})

app.post('/validMoves', (req, res)=>{
    const chess = new Chess(req.body.fen);
    const moves = chess.moves({
        square: req.body.square,
        verbose: true
    });
    res.json({moves: moves})
})

app.post('/getPiece', (req, res)=>{
    const chess = new Chess(req.body.fen);
    const piece = chess.get(req.body.square);
    if (piece != null){
        res.json({
            piece: piece.type,
            turn: chess.turn(),
            color: piece.color
        })
    } else{
        res.json({piece: piece})
    }
})

app.post('/movePiece', (req, res)=>{
    const chess = new Chess(req.body.fen);
    try{
        const move = chess.move({
        from: req.body.from,
        to: req.body.to
        })
        const position = chess.fen()
        res.send({move: move, fen: position})
    } catch(error){
        const move = null;
        const position = chess.fen()
        res.send({move:move, fen:position})
    }
})

app.listen(port, ()=>{
    console.log("Chess api running on: ", port);
})