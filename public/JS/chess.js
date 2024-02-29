

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
    console.log(`Current position: ${board1.fen()}`)
    console.log(`Current orientation: ${orientation} `)
    console.log(`Current source: ${source}`)
    console.log(`Current fen: ${fen}`)
    data = {fen: fen}
    console.log('Current Data: ', data)
    console.log('Data fen type: ', typeof(data.fen))
    const status = await fetch('/gameStatus', {
        method: 'POST',
        headers:{
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    const response = await status.json();
    console.log('DragStatus response: ', response)
    if ((response.turn === 'w' && piece.search(/^b/) !== -1) || (response.turn === 'b' && piece.search(/^w/) !== -1)){
        return false
    };

    if (response.gameover === true){
        return false
    }
    data = {fen: fen, square: source}
    const getValid = await fetch('/validMoves', {
        method: 'POST',
        headers:{
            "Content-Type" : "application/json"
        },
        body: JSON.stringify(data)
    });
    const validResp = await getValid.json();
    const moves = validResp.moves
    console.log(moves)
    // if (moves.length === 0){ return false}
    // highlightSquare(source)
    // for (let i = 0; i < moves.length; i++){
    //     highlightSquare(moves[i].to)
    // }
}

function onDrop(source, target, piece, newPosition, oldPosition, orientation){
    var move = game.move({
        from: source,
        to: target,
        promotion: 'q' //Update this later with a function that shows a miniture board that allows selecting what to promote to
    })

    if (move === null){
        return 'snapback'
    }
    
}

function onSnapEnd(){
    board1.position(game.fen());
    removeHighlight();
    return
}

async function highlightSquare(square){
    postConfig.body = JSON.stringify({
        fen : board1.fen(),
        square: square
    })
    console.log(postConfig)
    const result = await fetch('/getPiece', postConfig)
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