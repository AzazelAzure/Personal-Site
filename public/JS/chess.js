var boardconfig ={
    sparePieces : true,
    onDragStart : onDragStart,
    onDrop: onDrop,
    onSnapEnd: onSnapEnd
}


var data;
var legalSquare = '#f9d77e'
var captureSquare = '#ff2400'
var board1 = Chessboard('board1', boardconfig)
var fen;
var api;


$('#startGame').on('click', async ()=>{

    // Call API to get starting fen
    const result = await fetch('/newGame')
    const response = await result.json();

    // Set local fen to fen response and grab api
    fen = response.board;
    api = response.api;

    // Set positions to starting positions
    board1.start();
})

async function onDragStart(source, piece, position, orientation){
    data = {fen: fen}
    try{
        const status = await fetch(api+'/gameStatus', {
        method: 'POST',
        headers:{
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        });

        const response = await status.json();

        if ((response.turn === 'w' && piece.search(/^b/) !== -1) || (response.turn === 'b' && piece.search(/^w/) !== -1)){
            return false
        };

        if (response.gameover === true){
            return false
        }

        data.square = source;
        const getValid = await fetch(api+'/validMoves', {
            method: 'POST',
            headers:{
                "Content-Type" : "application/json"
            },
            body: JSON.stringify(data)
        });
        const validResp = await getValid.json();
        const moves = validResp.moves

        if (moves.length === 0){ return false}
        highlightSquare(source)
        for (let i = 0; i < moves.length; i++){
            highlightSquare(moves[i].to)
        }
    } catch(error){
        console.log('Error occured: ', error)
    }
    
}

async function onDrop(source, target, piece, newPos, oldPod, orientation){
    data = {fen: fen, from: source, to: target}
    try{
        const result = await fetch(api+'/movePiece', {
        method: 'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body: JSON.stringify(data)
        });
        const response = await result.json();

        if (response.move === null){
            console.log('Resolved null')
            board1.position(fen);
        };
        fen = response.fen

    } catch(error){
        console.log('Error occured: ', error)
    }
    
}

async function onSnapEnd(){
    removeHighlight();
    return
}

async function highlightSquare(square){
    data = {fen: fen, square: square}
    const result = await fetch(api+'/getPiece', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    const response = await result.json();
    var $square = $('#board1 .square-' + square);
    var background = legalSquare;
    
    if (response.piece != null && response.turn != response.color){
        background = captureSquare;
    }
    $square.css('background', background);
}

function removeHighlight(){
    $('#board1 .square-55d63').css('background', '')
}