// DON'T TOUCH THIS CODE
if (typeof window === 'undefined') {
  var Piece = require("./piece");
}
// DON'T TOUCH THIS CODE

/**
 * Returns a 2D array (8 by 8) with two black pieces at [3, 4] and [4, 3]
 * and two white pieces at [3, 3] and [4, 4]
 */
function _makeGrid() {
  // let grid = new Array(8).fill(new Array(8));
  let grid = new Array(8).fill().map(() => new Array(8));
  grid[3][4] = new Piece("black");
  grid[4][3] = new Piece("black");
  grid[3][3] = new Piece("white");
  grid[4][4] = new Piece("white");
  // debugger
  return grid;
}

/**
 * Constructs a Board with a starting grid set up.
 */
function Board() {
  this.grid = _makeGrid();
}

Board.DIRS = [
  [0, 1], [1, 1], [1, 0],
  [1, -1], [0, -1], [-1, -1],
  [-1, 0], [-1, 1]
];

/**
 * Checks if a given position is on the Board.
 */
Board.prototype.isValidPos = function (pos) {
  if (pos[0] > 7 || pos[1] > 7) {
    return false;
  } else if (pos[0] < 0 || pos[1] < 0) {
    return false;
  } else {
    return true;
  }
};

/**
 * Returns the piece at a given [x, y] position,
 * throwing an Error if the position is invalid.
 */
Board.prototype.getPiece = function (pos) {
  if (this.isValidPos(pos)) {
    return this.grid[pos[0]][pos[1]];
  } else {
    throw new Error('Not valid pos!');
  }
};

/**
 * Checks if the piece at a given position
 * matches a given color.
 */
Board.prototype.isMine = function (pos, color) {
  if (this.grid[pos[0]][pos[1]] === undefined) {
    return false;
  }
  if (this.grid[pos[0]][pos[1]].color === color) {
    return true;
  } else {
    return false;
  }
};

/**
 * Checks if a given position has a piece on it.
 */
Board.prototype.isOccupied = function (pos) {
  if (!(this.grid[pos[0]][pos[1]] === undefined)) {
    return true;
  } else {
    return false;
  }
};

/**
 * Recursively follows a direction away from a starting position, adding each
 * piece of the opposite color until hitting another piece of the current color.
 * It then returns an array of all pieces between the starting position and
 * ending position.
 *
 * Returns an empty array if it reaches the end of the board before finding another piece
 * of the same color.
 *
 * Returns empty array if it hits an empty position.
 *
 * Returns empty array if no pieces of the opposite color are found.
 */
Board.prototype._positionsToFlip = function (pos, color, dir, piecesToFlip) {
  //initialze empty piecesArray
  let piecesArray = [];
  //continue = true
  let cont = true;
  //currentPos = pos
  let currentPos = [pos[0], pos[1]];

  if (!this.isValidPos(pos)) {
    return [];
  }
  //while continue
  while (cont) {
    // debugger
    currentPos[0] = currentPos[0] + dir[0];
    currentPos[1] = currentPos[1] + dir[1];
    let cPos = [currentPos[0], currentPos[1]];
    cont = false;
    // debugger
    // console.log(currentPos);
    if (!this.isOccupied(cPos)) {
      return [];
    } else if (this.isMine(cPos, color)) {
      return piecesArray;
    } else if (!this.isValidPos(cPos)) {
      return [];
    } else {
      piecesArray.push(cPos);
      cont = true;
      // debugger
    }
  }
  //continue = false
  //currentPos = pos + dir;
  //if !this.isOccupied()
  //return positionsArray
  //else if this.isMine()
  //return positionsArray
  //else if currentPos.isValidPos()
  //return positionsArray
  // else (where we actually add the piece )
  // push into piecesArray this.getPiece(currentPos)
  // continue = true
};

/**
 * Checks that a position is not already occupied and that the color
 * taking the position will result in some pieces of the opposite
 * color being flipped.
 */
Board.prototype.validMove = function (pos, color) {
  //make a directions constant that includes all 8 directions
  //iterate through the constant
  //check positions to flip taking in the pos, color arguments, the the dir
  //if get pos funcitn === empty array, then continue
  //else, it returns true
  //return false outside

  const directions = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
    [1, -1],
    [-1, 1],
    [1, 1],
    [-1, -1]
  ];

  if (this.isOccupied(pos)) {
    return false;
  }

  for (let i = 0; i < directions.length; i++) {
    if (this._positionsToFlip(pos, color, directions[i]).length === 0) {
      // debugger
      continue;
    } else {
      // debugger
      return true;
    }
  }

  return false
};

/**
 * Adds a new piece of the given color to the given position, flipping the
 * color of any pieces that are eligible for flipping.
 *
 * Throws an error if the position represents an invalid move.
 */
Board.prototype.placePiece = function (pos, color) {
  const directions = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
    [1, -1],
    [-1, 1],
    [1, 1],
    [-1, -1]
  ];

  if (!this.validMove(pos, color)) {
    throw new Error('Invalid move!');
  } else {
    this.grid[pos[0]][pos[1]] = new Piece(color);
    for (let i = 0; i < directions.length; i++) {
      let postionsArray = this._positionsToFlip(pos, color, directions[i]);
      for (let j = 0; j < postionsArray.length; j++) {
        // debugger
        this.grid[postionsArray[j][0]][postionsArray[j][1]].color = color;
      }
    }
  }
};

/**
 * Produces an array of all valid positions on
 * the Board for a given color.
 */
Board.prototype.validMoves = function (color) {
  let validMovesArray = [];
  for (let i = 0; i < this.grid.length; i++) {
    for (let j = 0; j < this.grid.length; j++) {
      if (this.validMove([i, j], color)) {
        validMovesArray.push([i, j]);
      }
    }
  }
  debugger
  return validMovesArray;
};

/**
 * Checks if there are any valid moves for the given color.
 */
Board.prototype.hasMove = function (color) {
  if (this.validMoves.length === 0) {
    return false;
  } else {
    return true;
  }
};



/**
 * Checks if both the white player and
 * the black player are out of moves.
 */
Board.prototype.isOver = function () {
};




/**
 * Prints a string representation of the Board to the console.
 */
Board.prototype.print = function () {
};


// DON'T TOUCH THIS CODE
if (typeof window === 'undefined') {
  module.exports = Board;
}
// DON'T TOUCH THIS CODE