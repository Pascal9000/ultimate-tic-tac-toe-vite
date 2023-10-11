function updateSmallScoreBoard(btnId, playerScoreboard, currentPlayerSymbol) {
  const updatedScoreboard = playerScoreboard.map((row) =>
    row.map((value) => (value === btnId ? currentPlayerSymbol : value)),
  );
  return updatedScoreboard;
}

function updateMainScoreBoard(smallBoardId, mainScoreBoard, currentPlayerSymbol) {
  const updatedScoreboard = mainScoreBoard.map((row) =>
    row.map((value) => (value === smallBoardId ? currentPlayerSymbol : value)),
  );
  return updatedScoreboard;
}

// Checks for a win by filtering the current player symbols out of the specific score board array and check for the length. If one array is 0 length -> win!; save return current player symbol
function checkSmallGameResult(scoreBoard, roundCount, currentPlayerSymbol) {
  const maxRounds = 9;
  if (roundCount < 3) {
    return null;
  } else {
    for (let i = 0; i < scoreBoard.length; i++) {
      const filteredScoreBoard = scoreBoard[i].filter((value) => value !== currentPlayerSymbol);
      if (filteredScoreBoard.length === 0) {
        return currentPlayerSymbol;
      } else if (roundCount === maxRounds) {
        return "draw";
      }
    }
    return null;
  }
}

function checkMainGameResult(gameDataObject, currentPlayerSymbol) {
  if (gameDataObject.mainGameBoard.numerator < 3) {
    return null;
  } else {
    const scoreBoard = gameDataObject.mainGameBoard.scoreBoard;

    for (let i = 0; i < scoreBoard.length; i++) {
      const filteredScoreBoard = scoreBoard[i].filter((value) => value !== currentPlayerSymbol);
      if (filteredScoreBoard.length === 0) {
        gameDataObject.mainGameBoard.result = currentPlayerSymbol;
        return currentPlayerSymbol;
      }
    }
    // Check if draw
    // store all smallBoardResults in array
    const results = [];
    for (let row = "A"; row <= "C"; row++) {
      for (let col = 1; col <= 3; col++) {
        const cellKey = row + col;
        const cell = gameDataObject[cellKey];
        results.push(cell.result);
      }
    }
    if (results.includes(null)) {
      return null; // If any result is null, return null
    } else {
      return "Draw!"; // If all results are not null, return draw
    }
  }
}

function initializingGame() {
  // All possible combinations to win a game
  const winCondition = [
    ["a1", "a2", "a3"],
    ["b1", "b2", "b3"],
    ["c1", "c2", "c3"],
    ["a1", "b1", "c1"],
    ["a2", "b2", "c2"],
    ["a3", "b3", "c3"],
    ["a1", "b2", "c3"],
    ["a3", "b2", "c1"],
  ];
  const columnLabels = ["A", "B", "C"];
  // Create an object that contains the player icons and the scoreboard for the main game
  let gameDataObject = {
    p1: "x",
    p2: "o",
    mainGameBoard: {
      scoreBoard: winCondition.map((item) => item.map((elem) => elem.toUpperCase())),
      result: null,
      numerator: null,
    },
  };
  // Create the rest of the score boards "A1" to "C3"
  const numRows = 3;
  const numColumns = 3;
  for (let row = 0; row < numRows; row++) {
    for (let column = 0; column < numColumns; column++) {
      const rowNumber = row + 1;
      const propertyName = `${columnLabels[column]}${rowNumber}`;
      const board = {
        scoreBoard: [...winCondition],
        result: null,
        numerator: null,
      };
      gameDataObject[propertyName] = board;
    }
  }
  return gameDataObject;
}

export { updateMainScoreBoard, updateSmallScoreBoard, checkSmallGameResult, checkMainGameResult, initializingGame };
