const gameCanvas = document.getElementById("game_canvas");
const gameContext = gameCanvas.getContext("2d");
//gameContext.scale(1,1);

// Make it square and responsive
const size = 640; // canvas size will be 640x640 px
gameCanvas.width = size;
gameCanvas.height = size;

/*
gameCanvas.width and gameCanvas.height set the internal pixel resolution of the canvas.
This determines how many pixels the canvas actually “has” to draw on.
So here, your canvas has 640 × 640 actual pixels, independent of how big it appears on the page.

The width and height attributes on the <canvas> element control the drawing buffer size, not the CSS layout.
If you just do CSS width: 100% without setting the internal canvas.width, your canvas will stretch the drawing, 
making it blurry or misaligned.

So setting size = 640 ensures you have a fixed drawing grid of 640 × 640 pixels.

*/

//Colors for the messages that will be displayed in the HTML result element
const positiveMessageColor = "rgba(200,255,200,1)";
const negativeMessageColor = "rgba(255,200,200,1)";
const neutralMessageColor = "rgba(220,220,255,1)";
const whitePlayerMessageColor = "rgba(255,255,255,1)";
const blackPlayerMessageColor = "black";

//const regularWhiteColor = "#f0d9b5";
//const regularBlackColor = "#b58863";

const regularWhiteColor = "rgba(250,230,230,1)";
const regularBlackColor = "rgba(160,100,100,1)";

const selectionWhiteColor = "lightgreen";
const selectionBlackColor = "darkgreen";

//this list help tracking the active animations that are running
const activeAnimations = new Set();

//This is the width / height of each sprite within the provided chess spritesheet
const pieceWidth = 640;
const pieceHeight = 640;

//This is the spritesheet used to texture all chess pieces
const spriteSheet = new Image();
spriteSheet.src = "./textures/chess_sprite_sheet.png";

/*This variable will store all the pieceTextures*/
const pieceTextures = {}

/*This variable will store instances of the pieceTypes*/
const pieceTypes = {};

class PawnType
{
    constructor()
    {
        this.name = "pawn";
    }
    
    getLegalMoves(game, row, col, piece)
    {
        /*This function returns all possible moves for the piece WITHOUT regards for king's safety*/
        const moves = [];
        const direction = piece.color === "white" ? -1 : 1;

        const forwardRow = row + direction;

        //Forward 1 square
        const forwardSquare = game.board.getSquare(forwardRow, col);
        
        if (forwardSquare && !forwardSquare.piece)
        {
            moves.push(forwardSquare);

            //Forward 2 squares (only if its first move)
            if (!piece.hasMoved)
            {
                const doubleForwardRow = row + direction * 2;
                const doubleSquare = game.board.getSquare(doubleForwardRow, col);

                if (doubleSquare && !doubleSquare.piece)
                {
                    moves.push(doubleSquare);
                }
            }
        }

        //Diagonal captures
        const captureOffsets = [-1, 1];

        for (let offset of captureOffsets)
        {
            const captureCol = col + offset;
            const captureSquare = game.board.getSquare(forwardRow, captureCol);

            if ( captureSquare &&
                 captureSquare.piece &&
                 captureSquare.piece.color !== piece.color )
            {
                moves.push(captureSquare);
            }
        }

        return moves;
    }
}

class RookType
{
    constructor()
    {
        this.name = "rook";
    }
    
    getLegalMoves(game, row, col, piece)
    {
        /*This function returns all possible moves for the piece WITHOUT regards for king's safety*/
        const directions = [
            {row: 1,  col: 0},   // down
            {row: -1, col: 0},   // up
            {row: 0,  col: 1},   // right
            {row: 0,  col: -1}   // left
        ];
        
        const moves = piece.getMultipleSlidingMoves(game, row, col, directions);

        return moves;
    }
    
    getLegalMoves_OLD(game, row, col, piece)
    {
        /*This function returns all possible moves for the piece WITHOUT regards for king's safety*/
        const moves = [];
        
        //Forward movement
        let forwardRow = row + 1;
        
        while(forwardRow < 8)
        {
            let square = game.board.getSquare(forwardRow, col);
            
            if(square.piece != null && square.piece.color != piece.color)
            {
                moves.push(square);
                break;
            }
            else if(square.piece != null && square.piece.color == piece.color)
            {
                break;
            }
            else
            {
                moves.push(square);
            }
            
            forwardRow++;
        }
        
        //Backward movement
        let backwardRow = row - 1;
        while(backwardRow >= 0)
        {
            let square = game.board.getSquare(backwardRow, col);
            
            if(square.piece != null && square.piece.color != piece.color)
            {
                moves.push(square);
                break;
            }
            else if(square.piece != null && square.piece.color == piece.color)
            {
                break;
            }
            else
            {
                moves.push(square);
            }
            
            backwardRow--;
        }
        
        //Right movement
        let rightColumn = col + 1;
        while(rightColumn < 8)
        {
            let square = game.board.getSquare(row, rightColumn);
            
            if(square.piece != null && square.piece.color != piece.color)
            {
                moves.push(square);
                break;
            }
            else if(square.piece != null && square.piece.color == piece.color)
            {
                break;
            }
            else
            {
                moves.push(square);
            }
            
            rightColumn++;
        }
        
        //Left movement
        let leftColumn = col - 1;
        while(leftColumn >= 0)
        {
            let square = game.board.getSquare(row, leftColumn);
            
            if(square.piece != null && square.piece.color != piece.color)
            {
                moves.push(square);
                break;
            }
            else if(square.piece != null && square.piece.color == piece.color)
            {
                break;
            }
            else
            {
                moves.push(square);
            }
            
            leftColumn--;
        }

        return moves;
    }
}

class BishopType
{
    constructor()
    {
        this.name = "bishop";
    }
    
    getLegalMoves(game, row, col, piece)
    {
        /*This function returns all possible moves for the piece WITHOUT regards for king's safety*/
        const directions = [
            {row: 1,  col: 1},   //diagonal bottom-right
            {row: 1,  col: -1},  //diagonal bottom-left
            {row: -1, col: 1},   //diagonal top-right
            {row: -1, col: -1},  //diagonal top-left
        ];
        
        const moves = piece.getMultipleSlidingMoves(game, row, col, directions);
        
        return moves;
    }
}

class KnightType
{
    constructor()
    {
        this.name = "knight";
    }
    
    getLegalMoves(game, row, col, piece)
    {
        /*This function returns all possible moves for the piece WITHOUT regards for king's safety*/
        
        const directions = [
          { row: 2,  col:  1},  //row + 2  and col + 1 can be a valid move
          { row: 2,  col: -1},  //row + 2  and col - 1 can be a valid move
          { row: 1,  col:  2},  //row + 1  and col + 2 can be a valid move
          { row: -1, col:  2},  //row - 1  and col + 2 can be a valid move
          { row:  1, col: -2},  //row + 1  and col - 2 can be a valid move   
          { row: -1, col: -2},  //row - 1  and col - 2 can be a valid move
          { row: -2, col:  1},  //row - 2  and col + 1 can be a valid move
          { row: -2, col: -1},  //row - 2  and col - 1 can be a valid move
        ];

        const moves = piece.getSingleSlidingMoves(game, row, col, directions);
        
        return moves;
    }
}

class QueenType
{
    constructor()
    {
        this.name = "queen";
    }
    
    getLegalMoves(game, row, col, piece)
    {
        /*This function returns all possible moves for the piece WITHOUT regards for king's safety*/
        const directions = [
            {row: 1,  col: 0},   // down
            {row: -1, col: 0},   // up
            {row: 0,  col: 1},   // right
            {row: 0,  col: -1},  // left
            {row: 1,  col: 1},   //diagonal bottom-right
            {row: 1,  col: -1},  //diagonal bottom-left
            {row: -1, col: 1},   //diagonal top-right
            {row: -1, col: -1},  //diagonal top-left
        ];
        
        const moves = piece.getMultipleSlidingMoves(game, row, col, directions);
        
        return moves;
    }
}

class KingType
{
    constructor()
    {
        this.name = "king";
    }
    
    getLegalMoves(game, row, col, piece)
    {
        /*This function returns all possible moves for the piece WITHOUT regards for king's safety*/
        const directions = [
            {row: 1,  col: 0},   // down
            {row: -1, col: 0},   // up
            {row: 0,  col: 1},   // right
            {row: 0,  col: -1},  // left
            {row: 1,  col: 1},   //diagonal bottom-right
            {row: 1,  col: -1},  //diagonal bottom-left
            {row: -1, col: 1},   //diagonal top-right
            {row: -1, col: -1},  //diagonal top-left
        ];
        
        const moves = piece.getSingleSlidingMoves(game, row, col, directions);
        
        return moves;
    }

    getCastlingMoves(game, row, col, piece)
    {
        /*Function to check for the castling move between king and rock*/
        const moves = [];

        if(piece.hasMoved)
        {
            return moves;
        }
        
        //both kings are initially on 4th column
        let kingSquare = game.board.getSquare(row, col); 
        let isKingInCheck = game.isKingInCheck(kingSquare.piece.color);
        
        //if the king is in check the castling cannot continue
        if(isKingInCheck)
        {
            return moves;
        }
        
        // kingside castling
        const rookSquare = game.board.getSquare(row, 7);
        
        //if rock square has a piece which was never moved - it means we have the rock at its initial position.
        if(rookSquare.piece && rookSquare.piece.hasMoved == false && rookSquare.piece.type.name == "rook" &&
                        rookSquare.piece.color === kingSquare.piece.color )
        {
            const emptySquares = [];
            
            //Grab the required squares between the king and the king-side rock
            emptySquares.push(game.board.getSquare(row,5)) //the square which is initially occupied by the bishop
            emptySquares.push(game.board.getSquare(row,6)) //the square which is initially occupied by the knight
            
            let castlingPossible = true;
            
            //Check if the squares between the king and the king-side rock are empty
            for(let square of emptySquares)
            {
                 //if square is not empty... or its in check
                if(square.piece != null || game.willMoveLeaveKingInCheck(kingSquare, square))
                {
                    castlingPossible = false;
                    break;
                }
            }
            
            //if all squares are empty and they are not in check
            if(castlingPossible)
            {
                moves.push(game.board.getSquare(row,6)); // king moves here
            }
        }

        // queenside castling
        const rookQSquare = game.board.getSquare(row,0);
        
        //if rock square has a piece which was never moved - it means we have the rock at its initial position.
        if(rookQSquare.piece && !rookQSquare.piece.hasMoved && rookQSquare.piece.type.name == "rook" && 
                        rookQSquare.piece.color === kingSquare.piece.color )
        {
            const emptySquares = [];
            
            
            //Grab the required squares between the king and the king-side rock
            emptySquares.push(game.board.getSquare(row,1)) //the square which is initially occupied by the knight
            emptySquares.push(game.board.getSquare(row,2)) //the square which is initially occupied by the bishop
            emptySquares.push(game.board.getSquare(row,3)) //the square which is initially occupied by the queen

            let castlingPossible = true;
            
            //Check if the squares between the king and the king-side rock are empty
            for(let square of emptySquares)
            {
                //if square is not empty... or its in check
                if(square.piece != null || game.willMoveLeaveKingInCheck(kingSquare, square))
                {
                    castlingPossible = false;
                    break;
                }
            }

            //if all squares are empty and they are not in check
            if(castlingPossible)
            {
                moves.push(game.board.getSquare(row, 2)); // king moves here
            }
        }

        return moves;
    }
}

class ChessPiece
{
    constructor(type, color, texture)
    {
        this.type = type;       // instance of "PawnType", "RookType", etc.
        this.color = color;     // "white" or "black"
        this.texture = texture; // Image object or canvas offscreen extraction
        this.hasMoved = false;  // useful for castling & pawn first move
    }
    
    getLegalMoves(game, square)
    {
        /*Method that returns the pseudo-legal moves of each piece.type. 
        
        A pseudo-legal move is a move that is legal in chess but doesn't take under consideration the safety of 
        its king.
        */
        
        return this.type.getLegalMoves(game, square.row, square.col, this);
    }
    
    getCastlingMoves(game, square)
    {
        /*Method that checks if piece.type defines a method for castling and 
        then return the output of that method, or null if such method is undefined.
        */

        if(square.piece.type.getCastlingMoves != undefined)
        {
            return square.piece.type.getCastlingMoves(game, square.row, square.col, this);
        }
        return [];
    }
    
    getMultipleSlidingMoves(game, row, col, directions)
    {
        /* Helper for calculating pseudo-legal moves for pieces with ability to travelled 
        multiple squares per move such as: Rook, Bishop, Queen
        
        A pseudo-legal move is a move that is legal in chess but doesn't take under consideration the safety of 
        its king.
        */
        
        const moves = [];

        for(let direction of directions)
        {
            let directionRow = row + direction.row;
            let directionCol = col + direction.col;
            
            while(true)
            {
                let square = game.board.getSquare(directionRow, directionCol);
                
                if(square == null)
                {
                    break;
                }
                else if(square.piece == null)
                {
                    moves.push(square);
                }
                else
                {
                    //allow capturing the opponent's piece
                    if(square.piece.color != this.color)
                    {
                        moves.push(square)
                    }
                    
                    //break out - the remaining squares on this direction are out of reach
                    break;
                }
                
                //keep travelling the direction
                directionRow += direction.row;
                directionCol += direction.col;
            }
        }

        return moves;
    }
    
    getSingleSlidingMoves(game, row, col, directions)
    {
        /*Helper for calculating pseudo-legal moves for pieces with ability to travelled 
        1 single square per move such as: King, Knight
        
        A pseudo-legal move is a move that is legal in chess but doesn't take under consideration the safety of 
        its king.
        */
        
        const moves = [];
        
        for(let direction of directions)
        {
            let directionRow = row + direction.row;
            let directionCol = col + direction.col;
            
            let square = game.board.getSquare(directionRow, directionCol);
            
            if(square != null)
            {
                if(square.piece == null)
                {
                    moves.push(square);
                }
                else if(square.piece.color != this.color)
                {
                    moves.push(square);
                }
            }
        }
        
        return moves;
    }
}

class Square
{
    constructor(row, col)
    {
        this.row = row;
        this.col = col;
        this.piece = null;

        this.isSelected = false;
        this.isValidMove = false;
        this.isLastMove = false;
    }
}

class Player
{
    //Base class for any type of player
    constructor(color)
    {
        this.color = color;
        this.capturedPieces = [];
    }
    
    requestMove(game)
    {
        throw new Error("requestMove must be implemented");
    }
}

class AIPlayer extends Player
{
    constructor(color)
    {
        //calling the parent class constructor
        super(color);
    }
    
    requestMove(game)
    {
        const move = this.calculateMove(game);
    }
    
    calculateMove(game)
    {
        const allMoves = [];
        
        //Scan the chessboard
        for (let row of game.board.squares)
        {
            for (let square of row)
            {
                //for any piece of the AIPlayer's color
                if (square.piece && square.piece.color === this.color)
                {
                    //Get all valid legal moves.
                    const moves = game.getFilteredLegalMoves(square);
                    
                    //For each valid move, add the move to the allMoves list as part of an object storing 
                    //the square where the piece is located and the square where the piece will be moved.
                    moves.forEach(toSquare => allMoves.push({from: square, to: toSquare}));
                }
            }
        }

        if(allMoves.length === 0)
        {
            return; // no moves possible (checkmate/stalemate)
        }
        
        //Evaluate each move that the AI has.
        allMoves.forEach(move => move.score = this.evaluateMoveWithRisk(game, move));

        //Sort moves in descending order by score
        allMoves.sort((a, b) => b.score - a.score);

        //Pick top 2–3 moves randomly
        const topMoves = allMoves.slice(0, Math.min(3, allMoves.length));
        const choice = topMoves[Math.floor(Math.random() * topMoves.length)];
        
        //Add a delay before commiting the move to the game... this way the AI will not move instantly.
        setTimeout(() => {
            
            game.move(choice.from, choice.to);
            
            /*
            HTML Canvas is immediate-mode rendering, not reactive.
            Changing game state (e.g., moving a piece in memory) does not automatically update what is displayed. 
            The canvas only updates when drawing functions (drawBoard(), drawImage(), etc.) are explicitly called.

            In this project, the board is redrawn inside the click handler (squareClicked → drawBoard()). 
            When the AI moved synchronously (without delay), its move executed before the click handler finished, 
            so the final redraw included both the player and AI moves.

            However, when setTimeout is introduced, the click handler completes and the board is redrawn before the 
            AI move executes. The AI updates the game state later, but no redraw is triggered, so the visual board 
            remains outdated until another click forces a redraw.
            */
            
            game.drawBoard();
            
        }, 2000);
        
        
    }
    
    evaluateMoveWithRisk(game, move)
    {
        const fromPiece = move.from.piece;
        const captured = move.to.piece;

        //Make the move temporarily
        move.to.piece = fromPiece;  //each move is an object containing a 'to' and 'from' square object
        move.from.piece = null;

        let score = 0;

        //Reward for captures
        if (captured)
        {
            score += this.getPieceValue(captured);
        }
        
        //Pawn bonuses (promotion potential, center control)
        if (fromPiece.type === 'pawn')
        {
            const rowAdvance = this.color === 'white' ? move.to.row : 7 - move.to.row;
            score += rowAdvance * 0.5;  //the further forward, the higher the bonus
            const col = move.to.col;
            
            //Center controls - the further a pawn is from its origin the more valuable its capture becomes
            if (col >= 2 && col <= 5)
            {
                score += 0.1;  //center columns get small bonus
            }
        }

        //Scan the checkboard and apply penalty for leaving pieces exposed
        for (let row of game.board.squares)
        {
            for (let square of row)
            {
                const piece = square.piece;
                if (piece && piece.color === this.color)
                {
                    //Get squares where opponent can capture
                    const attackers = this.getSquaresThreatening(game, square); 
                    
                    if (attackers.length > 0)
                    {
                        for(let attacker of attackers)
                        {
                            if (move.to === attacker)
                            {
                                //defend valuable pieces - treat threats with priority
                                score += this.getPieceValue(threatenedPiece) * 0.8; 
                            }
                        }
                    }
                }
            }
        }

        //Undo move
        move.from.piece = fromPiece;
        move.to.piece = captured;

        return score;
    }
        
    getSquaresThreatening(game, targetSquare)
    {
        const threats = [];

        //Scan the checkboard looking for threats
        for (let row of game.board.squares)
        {
            for (let square of row)
            {
                const piece = square.piece;
                
                //if this is the opponent's piece
                if (piece && piece.color !== this.color)
                {
                    //interogate legal moves of opponent's piece
                    const moves = piece.getLegalMoves(game, square);
                    
                    //if opponent can capture targetSquare
                    if (moves.includes(targetSquare))
                    {
                        //add to the list of threats
                        threats.push(square);
                    }
                }
            }
        }

        return threats; // array of squares from which this square is threatened
    }

    getPieceValue(piece)
    {
        /*Assign some imaginary values to each piece on the checkboard*/
        switch(piece.type)
        {
            case 'pawn':
            {
                return 1;
            }
            case 'knight':
            {
                return 3;
            }
            case 'bishop':
            {
                return 3;
            }
            case 'rook':
            {
                return 5;
            }
            case 'queen':
            {
                return 9;
            }
            case 'king':
            {
                /*this will make the AI extremely aggressive towards the king
                  and will lead towards the final objective which is checkmate - capturing the king.
                */
                return 1000;
            }
        }
    }
}

class HumanPlayer extends Player
{
    constructor(color)
    {
        //Calling parent constructor
        super(color);
    }
    
    requestMove(game)
    {
        // Do nothing
        // Wait for UI input (click events)
    }
}

class Board
{
    constructor()
    {
        this.size = 8;
        this.squares = []; // this will be a 2d array / matrix
        this.selection = null
        this.whiteKingSquare = null;
        this.blackKingSquare = null;
        
        //Helps tracking the last move and apply visual styles to it
        this.lastMoveFrom = null; 
        this.lastMoveTo = null;
        
        
        //Initialize the Board instance with squares
        for (let row = 0; row < 8; row++)
        {
            const currentRow = [];

            for (let col = 0; col < 8; col++)
            {
                let square = new Square(row, col);
                
                // Row 0 → black main pieces
                if (row === 0)
                {
                    square.piece = getInitialPiece("black", col, pieceTextures);
                }
                // Row 1 → black pawns
                else if (row === 1)
                {
                    square.piece = new ChessPiece(pieceTypes["pawn"], "black", pieceTextures.black.pawn);
                }
                // Row 6 → white pawns
                else if (row === 6)
                {
                    square.piece = new ChessPiece(pieceTypes["pawn"], "white", pieceTextures.white.pawn);
                }
                // Row 7 → white main pieces
                else if (row === 7)
                {
                    square.piece = getInitialPiece("white", col, pieceTextures);
                }   
                
                //initialize the king elements to help tracking the gameStates
                this.checkUpdateBoardKingsPositions(square)
                
                currentRow.push(square);
            }
            this.squares.push(currentRow);
        }
    }
    
    checkPawnPromotion(toSquare)
    {
        /*This function is triggered by this.movePiece to check if the pawn was moved and if
        the move made the pawn is eligible for promotion*/
        
        //if the piece that was moved is a pawn
        if(toSquare != null && toSquare.piece != null && toSquare.piece.type.name == "pawn")
        {
            //if pawn is white
            if(toSquare.piece.color === "white")
            {
                //if pawn travelled to the top row - is eligible for promotion
                if(toSquare.row == 0)
                {
                    toSquare.piece = new ChessPiece(pieceTypes["queen"], "white", pieceTextures.white.queen);
                    writeResult("White Pawn promoted to Queen.", positiveMessageColor);
                }
            }
            else if(toSquare.piece.color === "black")
            {
                //if pawn travelled to the bottom row - is eligible for promotion
                if(toSquare.row == 7)
                {
                    toSquare.piece = toSquare.piece = new ChessPiece(pieceTypes["queen"], "black", pieceTextures.black.queen);
                    writeResult("Black Pawn promoted to Queen.", positiveMessageColor);
                }
            }
        }
    }
    
    checkCastlingMove(fromSquare, toSquare)
    {
        /*
        This function is triggered by this.movePiece to check if the piece moved is the king, and if the move
        is castling... then move the rook to the designated square.
        */
        
        /*This function checks for castling moves on the king and commits the rook to it
        - THIS SHOULD BE CALLED AFTER THE KING WAS ALREADY MOVED*/
        
        /*piece was in fromSquare and now is in toSquare*/
        if (toSquare.piece)
        {
            if (toSquare.piece.type.name === "king")
            {
                let column_difference = fromSquare.col - toSquare.col;
                
                //if king moves more than 1 squares - its castling movement - 
                //already validated from the game class and knightType class
                if(column_difference < -1)
                {   
                    //king side castling
                    let rookSquare = this.squares[toSquare.row][toSquare.col + 1];
                    
                    //designated position is next square at the left-side of the king
                    let designatedPositionSquare = this.squares[toSquare.row][toSquare.col - 1];
                    
                    /*these were already validated by the knightType class when commiting the move
                    - but to make sure we picked the correct squares above - we gonna recheck.
                    */
                    if(rookSquare != null && rookSquare.piece != null && rookSquare.piece.type.name == "rook")
                    {
                        if(designatedPositionSquare != null && designatedPositionSquare.piece == null)
                        {
                            //if piece was not moved before - now it is moved
                            rookSquare.piece.hasMoved = true;
                            designatedPositionSquare.piece = rookSquare.piece;
                            rookSquare.piece = null;
                            writeResult("King-side castling move complete.", positiveMessageColor);
                        }
                    }
                }
                else if(column_difference > 1)
                {
                    //queen side castling
                    let rookSquare = this.squares[toSquare.row][toSquare.col - 2];
                    
                    //designated position is next square at the right-side of the king
                    let designatedPositionSquare = this.squares[toSquare.row][toSquare.col + 1];
                    
                    /*these were already validated by the knightType class when commiting the move
                    - but to make sure we picked the correct squares above - we gonna recheck.
                    */
                    if(rookSquare != null && rookSquare.piece != null && rookSquare.piece.type.name == "rook")
                    {
                        if(designatedPositionSquare != null && designatedPositionSquare.piece == null)
                        {
                            //if piece was not moved before - now it is moved
                            rookSquare.piece.hasMoved = true;
                            designatedPositionSquare.piece = rookSquare.piece;
                            rookSquare.piece = null;
                            writeResult("Queen-side castling move complete.", positiveMessageColor);
                        }
                    }
                }
            }
        }
    }
    
    checkUpdateBoardKingsPositions(square)
    {
        /*This method is triggered by this.movePiece and will check if the piece that was moved is the king
        then update the kingPiece reference. 
        
        The king reference helps to determine the gameState: check, stalemate, checkmate.
        */
        
        if (square.piece)
        {
            if (square.piece.type.name === "king")
            {
                if (square.piece.color === "white")
                {
                    this.whiteKingSquare = square;
                }
                else
                {
                    this.blackKingSquare = square;
                }
            }
        }
    }

    getSquare(row, col)
    {
        /*This function returns a square at the given row/col coordinate on the checkboard if available... 
        else null*/
        
        if(row >= 0 && row < this.squares.length && col >=0 && col < this.squares[row].length)
        {
            return this.squares[row][col];
        }
        else
        {
            return null;
        }
    }
      
    clearSquareSelection()
    {
        /*This function clears the board.selection ...  which is the reference of the square which was selected
        by the player.
        */
        
        if(this.selection)
        {
            this.selection.isSelected = false;
            this.selection = null;
        }
    }
    
    selectSquare(row, col)
    {
        /*This function is triggered from the game after receiving input to select a square on the checkboard.*/
        this.clearSquareSelection();
        
        this.selection = this.squares[row][col];
        this.selection.isSelected = true;
    }
   
    updateLastMoveTrackers(fromSquare, toSquare)
    {
        /*
        Function to update the last move trackers - which will help highlighting the last on the chessboard.
        */
        
        //Update the last move trackers:
        this.lastMoveFrom = fromSquare;
        this.lastMoveTo = toSquare;
    }
    
    movePiece(fromSquare, toSquare)
    {
        /*This function is triggered from game.move after all validations are passed... to initialite the
        movement of a piece on the board.
        */
        
        this.clearSquareSelection();
        
        //if piece was not moved before - now it is moved.
        fromSquare.piece.hasMoved = true;
        
        toSquare.piece = fromSquare.piece;
        fromSquare.piece = null;
        
        //Update the last move trackers when moving any piece;
        this.updateLastMoveTrackers(fromSquare, toSquare);
        
        //Update king reference when moving
        this.checkUpdateBoardKingsPositions(toSquare);
        
        //Check for castling move and commit the rook to it.
        this.checkCastlingMove(fromSquare, toSquare);
        
        //Check for pawn promotion move.
        this.checkPawnPromotion(toSquare);
    }
}

class Game
{
    constructor()
    {
        this.board = new Board();

        this.players = {
            white: new HumanPlayer("white"),
            black: new AIPlayer("black"),
        };
        
        this.currentPlayer = this.players.white;
        this.currentTurn = this.currentPlayer.color;
        
        this.moveCounter = 0;
        
        //Setup of the chessboard parameters
        this.board_margin = 0.04; //chessboard margins used for drawing the coordinates -> 4% used as margin
        this.boardSize = gameCanvas.width; //board take the entires width of the canvas
        this.coordMargin =  this.boardSize * this.board_margin; //coordinate margin is 4% of the boardsize
        this.playableSize =  this.boardSize -  this.coordMargin;  //playable size is everything else that's not coordMargin
        this.squareSize =  this.playableSize / 8;  //square size is playable size / number of squares per row.
        
        //Object to help assigning and tracking different gamestates the game could have.
        this.gameStates = {checkmate: "checkmate", stalemate: "stalemate", running: "running", check: "check"};
        this.state = this.gameStates.running;
        
        updateGameStatusLabel("Game is running!");
        updatePlayerTurnLabel("Player Turn: " + this.currentTurn, this.currentTurn);
    }

    move(fromSquare, toSquare)
    {
        /*This function will be triggered when the canvas received valid inputs to trigger a move.*/
        
        // block moves if game is over
        if (this.state === this.gameStates.checkmate || this.state === this.gameStates.stalemate)
        {
            return false;
        }
        
        if(this.state === "check")
        {
            //if the move does not release the check... then the move is not valid
            if(this.willMoveLeaveKingInCheck(fromSquare, toSquare) == true)
            {
                return false;
            }
        }
        
        const piece = fromSquare.piece;
        
        //if fromSquare has no piece in it... or the piece is of opponent's color
        if (!piece || piece.color !== this.currentTurn)
        {
            return false;
        }

        //Filter out all moves that would put the king at risk
        const legalMoves = this.getFilteredLegalMoves(fromSquare);
        
        //if the toSquare is not a legal move
        if(legalMoves.includes(toSquare) == false)
        {
            return false;
        }
        
        //if piece will be captured following this move
        if(toSquare.piece != null)
        {
            this.players[this.currentTurn].capturedPieces.push(toSquare.piece);
        }
        
        this.board.movePiece(fromSquare, toSquare);
        
        this.moveCounter++;
        
        //Output the move log
        let message = this.currentTurn + " " + toSquare.piece.type.name + " from " +
                      this.getRankNumber(fromSquare.row) + this.getFileLetter(fromSquare.col) + " to " + 
                      this.getRankNumber(toSquare.row) + this.getFileLetter(toSquare.col);
        
        writeResult(this.moveCounter + ". " + message, this.getMessageColorForCurrentPlayer());
        
        //Update the game state and switch the turn
        this.updateGameState();
        this.switchTurn();

        return true;
    }

    switchTurn()
    {
        /*This function will switch the turn to the the opposite player after each move.*/
        
        if(this.state != this.gameStates.stalemate && this.state != this.gameStates.checkmate)
        {
            if(this.currentPlayer === this.players.white)
            {
                this.currentPlayer = this.players.black;
            }
            else
            {
                this.currentPlayer = this.players.white;
            }
            
            this.currentTurn = this.currentPlayer.color;
            
            updatePlayerTurnLabel("Player Turn: " + this.currentTurn, this.currentTurn);
            
            this.currentPlayer.requestMove(this);
        }
    }
      
    isKingInCheck(color)
    {
        /*This function will check whether the king of a specified color is in check.*/
        
        const kingSquare = 
            color === "white" 
            ? this.board.whiteKingSquare 
            : this.board.blackKingSquare;

        const opponentColor = color === "white" ? "black" : "white";
        
        // Loop over all squares in the 2D board
        for (let row of this.board.squares)
        {
            for (let square of row)
            {
                if (square.piece && square.piece.color === opponentColor)
                {
                    const moves = square.piece.getLegalMoves(this, square);
                    if (moves.includes(kingSquare))
                    {
                        return true;
                    }
                }
            }
        }

        return false;
    }
    
    willMoveLeaveKingInCheck(fromSquare, toSquare)
    {
        //A utility function that simulates a single move to check if it would put your own king in check.
        
        const piece = fromSquare.piece;
        const isKing = piece.type.name === "king";

        const capturedPiece = toSquare.piece;

        //Simulate the move
        toSquare.piece = piece;
        fromSquare.piece = null;

        let originalKingSquare;

        //if this is the king, temporarily update the king reference
        if (isKing)
        {
            if (piece.color === "white")
            {
                //update the white king reference
                originalKingSquare = this.board.whiteKingSquare;
                this.board.whiteKingSquare = toSquare;
            }
            else
            {
                //update the black king reference
                originalKingSquare = this.board.blackKingSquare;
                this.board.blackKingSquare = toSquare;
            }
        }

        //check if the king is in check
        const isInCheck = this.isKingInCheck(piece.color);

        //undo simulation
        fromSquare.piece = toSquare.piece;
        toSquare.piece = capturedPiece;

        //restore king reference - back to normal
        if (isKing)
        {
            if (piece.color === "white")
            {
                this.board.whiteKingSquare = originalKingSquare;
            }
            else
            {
                this.board.blackKingSquare = originalKingSquare;
            }
        }

        return isInCheck;
    }
    
    getFilteredLegalMoves(fromSquare)
    {
        //This function filters out the moves that puts the king in danger.
        //All moves that result in check to the king... will be removed.
        
        const piece = fromSquare.piece;
        
        //get possible valid moves for the piece within the provided Square
        const candidateMoves = piece.getLegalMoves(this, fromSquare);

        const legalMoves = [];
        
        //for each possible move
        for (let toSquare of candidateMoves)
        {
            //if move will not leave king in check
            if (this.willMoveLeaveKingInCheck(fromSquare, toSquare) == false)
            {
                legalMoves.push(toSquare);
            }
        }
        
        //Add castling moves - if available they are already filtered.
        const castlingMoves = piece.getCastlingMoves(this, fromSquare);
        
        legalMoves.push(...castlingMoves); //append one list to another list
        
        return legalMoves;
    }
    
    hasAnyLegalMove(color)
    {
        //Function to check if for any piece of the given color there are any legal moves left.
        
        //for each square on the checkboard
        for (let row of this.board.squares)
        {
            for (let square of row)
            {
                //if the square has a piece of the provided color
                if (square.piece && square.piece.color === color)
                {
                    //filter the moves of the piece
                    const moves = this.getFilteredLegalMoves(square);
                    
                    //if there are any moves like
                    if (moves.length > 0)
                    {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    
    getOpponentPlayerName()
    {
        /*This function will return the color of the opposite player.*/
        
        let player = this.currentTurn === "white"
                    ? "black"
                    : "white";

        return player;
    }
    
    getMessageColorForCurrentPlayer()
    {
        //This function will return a color to be used for outputting messages based on the player's color.
        let color = this.currentTurn === "white"
                        ? whitePlayerMessageColor
                        : blackPlayerMessageColor;
        
        return color;
    }
    
    updateGameState()
    {
        //This function will be triggered after each move and will detect check, checkmate, stalemate 
        
        //get the color of the opposite player to check whether the move of the current player changed 
        //the game state.
        const color = this.getOpponentPlayerName();
        
        //Check if the king is in check
        const inCheck = this.isKingInCheck(color);
        
        //Check if the player has any legal moves left
        const hasMove = this.hasAnyLegalMove(color);
        
        //if king is in danger and doesn't have any valid moves
        if (inCheck && !hasMove)
        {
            this.state = this.gameStates.checkmate;
            
            updateGameStatusLabel("The game ended in checkmate! ");
            updatePlayerTurnLabel(capitalize(this.currentTurn) + " is victorious!", this.currentTurn);
        }
        //if the king is not in check and doesn't have any valid moves
        else if (!inCheck && !hasMove)
        {
            this.state = this.gameStates.stalemate;
            
            updateGameStatusLabel("The game ended in stalemate!");
            updatePlayerTurnLabel("No Winner!");
        }
        //if the king is in check
        else if (inCheck)
        {
            this.state = this.gameStates.check;
            
            let oppositePlayer = this.getOpponentPlayerName();
            
            //Output the result
            updateGameStatusLabel(capitalize(oppositePlayer) + " King is in check!");
        }
        else
        {
            this.state = this.gameStates.running;
            
            updateGameStatusLabel("Game is running!");
        }
    }
    
    drawBoard()
    {
        /* This function will draw the chessboard within the canvas. 
        Containing margins for chessboard coordinates.
        */
        
        //Clear the canvas
        gameContext.clearRect(0, 0, this.boardSize, this.boardSize);
        
        //variable used to store the legal moves of square.piece if there is any square.piece already selected
        let board_selection_moves = [];
        
        //if there is any square.piece selected.
        if (this.board.selection)
        {
            //grab the legal moves
            board_selection_moves = this.getFilteredLegalMoves(this.board.selection);
        }

        // =======================================================
        // 1. DRAW BOARD SQUARES
        // =======================================================
        for (let row = 0; row < 8; row++)
        {
            for (let col = 0; col < 8; col++)
            {
                //link the drawn square with the board square object
                const square = this.board.getSquare(row, col);
                
                //Variable to determine whether the square we're iterating is white or black
                const isLight = (row + col) % 2 === 0;
                
                //if the current square is a valid move for the selected square.piece
                if (this.board.selection && board_selection_moves.includes(square))
                {
                    //use the selection color to color the square
                    gameContext.fillStyle = isLight ? selectionWhiteColor : selectionBlackColor;
                }
                else
                {
                    //use the regular colors to draw the square
                    gameContext.fillStyle = isLight ? regularWhiteColor : regularBlackColor;
                }
                
                //calculate the coordinate taking under consideration the margins reserved to draw the chessboard coordinates
                const x = this.coordMargin + col * this.squareSize;
                const y = row * this.squareSize;
                
                //draw the square
                gameContext.fillRect(x, y, this.squareSize, this.squareSize);
                
                //if the square object has a piece assigned to it
                if (square.piece)
                {
                    //draw the piece texture
                    gameContext.drawImage(
                        square.piece.texture,
                        x,
                        y,
                        this.squareSize,
                        this.squareSize
                    );
                }
            }
        }

        // =============================================================
        // 2. DRAW SQUARE SELECTION BORDER - if there is any square.piece selected
        // =============================================================
        
        if (this.board.selection)
        {
            const square = this.board.selection;

            const x = this.coordMargin + square.col * this.squareSize;
            const y = square.row * this.squareSize;

            gameContext.strokeStyle = "red";
            gameContext.lineWidth = 4;
            
            const lineEachSideSize = gameContext.lineWidth / 2;

            gameContext.strokeRect(
                x + lineEachSideSize,                      //x of the square starts after the border;
                y + lineEachSideSize,                      //y of the square starts after the border; 
                this.squareSize - gameContext.lineWidth,   //width of the square does not include the border;
                this.squareSize - gameContext.lineWidth    //height of the square does not include the border;
            );
        }

        // ============================================================================
        // 3. DRAW LAST MOVE HIGHLIGHT - if there is any last move to be highlighted
        // ============================================================================
        if (this.board.lastMoveFrom && this.board.lastMoveTo)
        {
            const from_x = this.coordMargin + this.board.lastMoveFrom.col * this.squareSize;
            const from_y = this.board.lastMoveFrom.row * this.squareSize;

            const to_x = this.coordMargin + this.board.lastMoveTo.col * this.squareSize;
            const to_y = this.board.lastMoveTo.row * this.squareSize;

            gameContext.strokeStyle = "blue";
            gameContext.lineWidth = 4;
            const lineEachSideSize = gameContext.lineWidth / 2;

            gameContext.strokeRect(
                from_x + lineEachSideSize,               //x of the square starts after the border;
                from_y + lineEachSideSize,               //y of the square starts after the border;    
                this.squareSize - gameContext.lineWidth, //width of the square does not include the border;
                this.squareSize - gameContext.lineWidth  //height of the square does not include the border;
            );
            
            gameContext.strokeRect(
                to_x + lineEachSideSize,                 //x of the square starts after the border;
                to_y + lineEachSideSize,                 //y of the square starts after the border;
                this.squareSize - gameContext.lineWidth, //width of the square does not include the border;
                this.squareSize - gameContext.lineWidth, //height of the square does not include the border;
            );
        }

        // ===================================
        // 4. DRAW OUTER BORDER
        // ===================================
        gameContext.strokeStyle = "black";
        gameContext.lineWidth = 3;
        gameContext.strokeRect(
            this.coordMargin + 0.5,
            0.5,
            this.playableSize - 1,
            this.playableSize - 1
        );

        // =======================================================
        // 5. DRAW COORDINATES - draw the chessboard coordinates
        // =======================================================
        gameContext.font = `${this.squareSize * 0.28}px Arial`;
        gameContext.textAlign = "center";
        gameContext.textBaseline = "middle";
        gameContext.fillStyle = "black";

        // Files (a-h) bottom
        for (let col = 0; col < 8; col++)
        {
            const letter = this.getFileLetter(col);

            const x = this.coordMargin + col * this.squareSize + this.squareSize / 2;
            const y = this.playableSize + this.squareSize * 0.25;

            gameContext.fillText(letter, x, y);
        }

        // Ranks (8-1) left
        for (let row = 0; row < 8; row++)
        {
            const number = this.getRankNumber(row);

            const x = this.coordMargin * 0.4;
            const y = row * this.squareSize + this.squareSize / 2;

            gameContext.fillText(number, x, y);
        }
    }
    
    squareClicked(event)
    {
        /*This function will be triggered whenever there is a click inside the canvas*/
        
        //this variable will store the color of the player which can have the input.
        let playerControllerColor = "white";
        //playerControllerColor = this.currentTurn; //with this assignment you can allow localMultiplayer
        
        
        /*
        getBoundingClientRect() returns the current displayed size of the canvas in pixels (CSS pixels) on the page.
        rect.width might not equal canvas.width, because of CSS styling.
        
        scaleX / scaleY calculate how much the internal canvas coordinates are scaled relative to the displayed size.
        
        ====================================================
        Example:
        canvas.width = 640

        CSS makes it 320px on screen → rect.width = 320

        Then scaleX = 640 / 320 = 2
        ====================================================
        Conclusion: each pixel on the canvas can be scaled positively or negatively to match the css.
        Canvas has its internal set of coordinates... which needs to be alligned with the css to process
        the coordinates correctly.
        */
        
        const rect = gameCanvas.getBoundingClientRect();
        const scaleX = gameCanvas.width / rect.width;
        const scaleY = gameCanvas.height / rect.height;
        
        const x = (event.clientX - rect.left) * scaleX;
        const y = (event.clientY - rect.top) * scaleY;

        // =================================================
        // 1. Reject clicks in margin
        // =================================================
        if ( x < this.coordMargin || x > this.coordMargin + this.playableSize ||
             y < 0 || y > this.playableSize )
        {
            // Clicked outside playable board
            return;
        }

        // =================================================================================================
        // 2. Adjust coordinate system so that we won't take under consideration clicks outside the playarea
        // =================================================================================================
        const col = Math.floor((x - this.coordMargin) / this.squareSize);
        const row = Math.floor(y / this.squareSize);

        let clickedSquare = this.board.getSquare(row, col);
        
        //if the square clicked is the square that was previously selected
        if (clickedSquare == this.board.selection)
        {
            //deselect the square
            this.board.clearSquareSelection();
        }
        //if the square clicked has a piece which is of color authorized to control its moves - 
        //and there is no piece selected yet
        else if( clickedSquare.piece && clickedSquare.piece.color == playerControllerColor && this.board.selection == null )
        {
            //select the square containing the piece
            this.board.selectSquare(row, col);
            this.board.selection = clickedSquare;
        }
        //if the a square was selected, attempt to move the piece - validation will be handled by game.move
        else if (this.board.selection)
        {
            this.move(this.board.selection, clickedSquare);
        }
        
        //console.log("Clicked:", row, col);
        
        //draw the board to make the updates on the checkerboard
        this.drawBoard();
    }
    
    getFileLetter(col)
    {
        return String.fromCharCode(97 + col); // a-h
    }

    getRankNumber(row)
    {
        return 8 - row; // 8-1
    }
    
    drawBoard_OLD()
    {
        /* This function will draw the chessboard within the canvas. */
        const boardSize = gameCanvas.width;
        const squareSize = boardSize / 8;
        
        let board_selection_moves = [];
        
        if(this.board.selection)
        {
            board_selection_moves = this.getFilteredLegalMoves(this.board.selection);
        }
        
        //Draw all squares first
        for (let row = 0; row < 8; row++)
        {
            for (let col = 0; col < 8; col++)
            {
                const square = this.board.getSquare(row, col);
                
                const isLight = (row + col) % 2 === 0;
                
                if( this.board.selection && board_selection_moves.includes(square) )
                {
                    gameContext.fillStyle = isLight ? selectionWhiteColor : selectionBlackColor;
                }
                else
                {
                    gameContext.fillStyle = isLight ? regularWhiteColor : regularBlackColor;
                }
                
                const x_position = col * squareSize;
                const y_position = row * squareSize;
                
                gameContext.fillRect(
                    x_position,
                    y_position,
                    squareSize,
                    squareSize
                );
                
                if (square.piece)
                {
                    //console.log(square.piece.texture);
                    const img = square.piece.texture;
                    gameContext.drawImage(
                        img,
                        x_position,
                        y_position,
                        squareSize,
                        squareSize
                    );
                }
            }
        }

        //Draw selection on top (if any)
        if (this.board.selection)
        {
            const square = this.board.selection;

            const x = square.col * squareSize;
            const y = square.row * squareSize;

            gameContext.strokeStyle = "red";
            gameContext.lineWidth = 4;

            gameContext.strokeRect(
                //border is 2px on each size
                x + 2,
                y + 2,
                //square size shrinks to contain the border within
                squareSize - 4,
                squareSize - 4,
            );
        }
        
        //Add highlights for the last move - if any
        if (this.board.lastMoveFrom != null && this.board.lastMoveTo != null)
        {
            const from_x = this.board.lastMoveFrom.col * squareSize;
            const from_y = this.board.lastMoveFrom.row * squareSize;
            
            const to_x = this.board.lastMoveTo.col * squareSize;
            const to_y = this.board.lastMoveTo.row * squareSize;

            gameContext.strokeStyle = "blue";
            gameContext.lineWidth = 4;

            gameContext.strokeRect(
                //border is 2px on each size
                from_x + 2,
                from_y + 2,
                //square size shrinks to contain the border within
                squareSize - 4,
                squareSize - 4,
            );
            
            gameContext.strokeRect(
                //border is 2px on each size
                to_x + 2,
                to_y + 2,
                //square size shrinks to contain the border within
                squareSize - 4,
                squareSize - 4,
            );
        }

        //Draw outer border last
        gameContext.strokeStyle = "black";
        gameContext.lineWidth = 3;
        gameContext.strokeRect(0.5, 0.5, boardSize - 1, boardSize - 1);
    }
       
    squareClicked_OLD(event)
    {
        /*This function will be triggered whenever there is a click inside the canvas*/
        
        //this variable will store the color of the player which can have the input.
        let playerControllerColor = "white";
        //playerControllerColor = this.currentTurn; //with this assignment you can allow localMultiplayer
        
        /*
        getBoundingClientRect() returns the current displayed size of the canvas in pixels (CSS pixels) on the page.
        rect.width might not equal canvas.width, because of CSS styling.
        
        scaleX / scaleY calculate how much the internal canvas coordinates are scaled relative to the displayed size.
        
        ====================================================
        Example:
        canvas.width = 640

        CSS makes it 320px on screen → rect.width = 320

        Then scaleX = 640 / 320 = 2
        ====================================================
        Conclusion: each pixel on the canvas can be scaled positively or negatively to match the css.
        Canvas has its internal set of coordinates... which needs to be alligned with the css to process
        the coordinates correctly.
        */
        
        const rect = gameCanvas.getBoundingClientRect();
        const scaleX = gameCanvas.width / rect.width;
        const scaleY = gameCanvas.height / rect.height;

        const x = (event.clientX - rect.left) * scaleX;
        const y = (event.clientY - rect.top) * scaleY;

        const squareSize = gameCanvas.width / 8;

        const col = Math.floor(x / squareSize);
        const row = Math.floor(y / squareSize);

        let clickedSquare = this.board.getSquare(row, col);
        
        if(clickedSquare == this.board.selection)
        {
            this.board.clearSquareSelection();
        }
        else if(clickedSquare.piece && clickedSquare.piece.color == playerControllerColor && 
                this.board.selection == null)
        {
            this.board.selectSquare(row, col);
            this.board.selection = clickedSquare;
        }
        else if(this.board.selection)
        {
            this.move(this.board.selection, clickedSquare);
        }
        
        //console.log("Clicked:", row, col);
        
        this.drawBoard();
    }
}

async function extractPieceFromSpritesheet(col, row)
{
    /*This function will be used to extract sprites from the spritesheet*/
    
    /*if the spritesheet has not finished loading*/
    if (!spriteSheet.complete)
    {
        //wait to finish loading the spritesheet
        await new Promise(resolve => spriteSheet.onload = resolve);
    }
    
    //if spritesheet width is 0
    if (spriteSheet.width === 0)
    {
        throw new Error("Sprite sheet failed to load");
    }
    
    //source coordinates for the sprite within the spritesheet
    const sx = col * pieceWidth;
    const sy = row * pieceHeight;

    //if sprite coordinates are outside of the spritesheet:
    if( sx + pieceWidth > spriteSheet.width ||
        sy + pieceHeight > spriteSheet.height  )
    {
        throw new Error("Sprite crop out of bounds");
    }

    //return the texture as image element
    return await createImageBitmap(
        spriteSheet,
        sx,
        sy,
        pieceWidth,
        pieceHeight
    );
}

function getInitialPiece(color, col, pieceTextures)
{
    /*This function will return a piece based on the color, col-coordinate and pieceTextures.
    This will be triggered in the board constructor when setting up the checkboard squares...
    */
    
    //the order of the main chess pieces on the chessboard
    const order = [
        "rook",
        "knight",
        "bishop",
        "queen",
        "king",
        "bishop",
        "knight",
        "rook"
    ];
    
    const name = order[col];
    
    //chess piece for the given column coordinate
    return new ChessPiece(
        pieceTypes[name],                 // behavior object
        color,
        pieceTextures[color][name]
    );
}

function FullscreenMode(e) 
{
    /*Function handling switches to/out of fullscreen*/
    
    var game_content = document.getElementById("game_content");
    var fullscreen_button = document.getElementById("fullscreen");
    if (document.fullscreenElement == null)
    {
        if (game_content.requestFullscreen) 
        {
            game_content.requestFullscreen();
        } 
        else if (game_content.webkitRequestFullscreen) 
        { /* Safari */
            game_content.webkitRequestFullscreen();
        } 
        else if (game_content.msRequestFullscreen) 
        { /* IE11 */
            game_content.msRequestFullscreen();
        }
    }
    else
    {

        if (document.exitFullscreen) 
        {
            document.exitFullscreen();
        } 
        else if (document.webkitExitFullscreen) 
        { /* Safari */
            document.webkitExitFullscreen();
        } 
        else if (document.msExitFullscreen) 
        { /* IE11 */
            document.msExitFullscreen();
        }
    }
}

function Enter_FullScreen(e)
{
    /*Key shortcut for fullscreen*/
    if (e.key == "f")
    {
        FullscreenMode(); 
    }
}

function capitalize(str)
{
    /*Function to capitalize a string*/
    
    //handle empty or undefined strings
    if (!str)
    {
        return ''; 
    }
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function writeResult(result_text, color = neutralMessageColor)
{
    /*Function to write a message in the console.output*/
    const resultHUD_Element = document.getElementById("result_log");

    // Create message element
    const message = document.createElement("div");
    message.innerHTML = result_text.replace(/\n/g, '<br>');
    message.style.color = color;
    message.style.width = "100%";

    //Add slight spacing between messages
    message.style.margin = "1px";
    
    //Append message
    resultHUD_Element.appendChild(message);

    //Auto-scroll to latest message
    resultHUD_Element.scrollTop = resultHUD_Element.scrollHeight;

    //Animate newest message
    scheduleAnimation(message, "newOutputInfo");
    
    //Add separator
    //if(resultHUD_Element.children.length > 1)
    //{
    //    const lastChild = resultHUD_Element.lastElementChild;
    //    lastChild.style.borderTop = "solid 1px " + color;
    //}
    
    // Limit total stored messages to 50)
    const maxMessages = 50;
    if (resultHUD_Element.children.length > maxMessages)
    {
        resultHUD_Element.removeChild(resultHUD_Element.firstChild);
    }
}

function scheduleAnimation(element, className)
{
    /*Function that can be used to schedule an animation*/
    element.classList.add(className);

    let resolveFn;

    const promise = new Promise(resolve => {
        resolveFn = resolve;
    });

    const animObj = {
        promise,
        animation: className
    };

    activeAnimations.add(animObj);

    function handler()
    {
        element.classList.remove(className);
        element.removeEventListener("animationend", handler);

        // delete ONLY this animation instance
        activeAnimations.delete(animObj);

        resolveFn();
    }

    element.addEventListener("animationend", handler);

    return promise;
}

function getColorFromMessage(message)
{
    let color = "white";
    
    if(message == "white")
    {
        color = regularWhiteColor;
    }
    
    else if (message == "black")
    {
        color = "black";
    }
    
    return color;
}

function updatePlayerTurnLabel(message, player_color)
{
    let color = getColorFromMessage(message);

    const label = document.getElementById("current_turn");
    
    label.textContent = message;
    label.style.color = color;
}

function updateGameStatusLabel(message)
{
    document.getElementById("game_status").textContent = message;
}

async function waitForAnimation(active_animation_name)
{
    /*Function that can be used to wait for an animation to complete.*/
    var anim = null;
    
    activeAnimations.forEach(elem => {
        
        if (elem.animation === active_animation_name)
        {
            anim = elem;
        }
    });
    
    if (anim)
    {
        await anim.promise;
    }
}

function restartGame()
{
    /*Function that will restart the game.*/
    document.getElementById("result_log").innerHTML = "";
    
    //Creating a checkerboard object
    game = new Game();
    
    //Drawing a checkerboard on the canvas
    game.drawBoard();
}

//Prevent the default behaviour on this window.
window.addEventListener("keydown", function(e) {
    if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
        e.preventDefault();
    }
}, false);

document.addEventListener('DOMContentLoaded', async () => {
    
    /*Initializing the pieceTextures object with the proper texture images*/
    pieceTextures.white = {
        king:   await extractPieceFromSpritesheet(0, 0),
        queen:  await extractPieceFromSpritesheet(1, 0),
        bishop: await extractPieceFromSpritesheet(2, 0),
        knight: await extractPieceFromSpritesheet(3, 0),
        rook:   await extractPieceFromSpritesheet(4, 0),
        pawn:   await extractPieceFromSpritesheet(5, 0),
    };
    
    pieceTextures.black = {
        king:   await extractPieceFromSpritesheet(0, 1),
        queen:  await extractPieceFromSpritesheet(1, 1),
        bishop: await extractPieceFromSpritesheet(2, 1),
        knight: await extractPieceFromSpritesheet(3, 1),
        rook:   await extractPieceFromSpritesheet(4, 1),
        pawn:   await extractPieceFromSpritesheet(5, 1),
    };
    
    //Initializing the pieceTypes with instances
    pieceTypes.pawn = new PawnType();
    pieceTypes.rook = new RookType();
    pieceTypes.bishop = new BishopType();
    pieceTypes.knight = new KnightType();
    pieceTypes.queen = new QueenType();
    pieceTypes.king = new KingType();

    //Creating a checkerboard object
    game = new Game();
    
    //Drawing a checkerboard on the canvas
    game.drawBoard();
    
    //Adding listener for checkerboard / canvas
    gameCanvas.addEventListener("click", (event) => game.squareClicked(event));
});