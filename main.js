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

function createSmallBoard(columnLabels, column, row) {
  const smallBoardTemplate = document.getElementById("smallBoardTemplate");
  const smallBoardClone = document.importNode(smallBoardTemplate.content, true);

  const smallBoardWrapper = smallBoardClone.querySelector(".smallBoardWrapper");
  const smallBoardElement = smallBoardClone.querySelector(".smallBoardElement");

  const rowNumber = row + 1;
  const wrapperId = `smallBoardWrapper-${columnLabels[column]}${rowNumber}`;
  smallBoardWrapper.setAttribute("id", wrapperId);
  smallBoardWrapper.classList.add(`${columnLabels[column]}${rowNumber}`);

  const smallBoardId = `smallBoardElement-${columnLabels[column]}${rowNumber}`;
  smallBoardElement.setAttribute("id", smallBoardId);

  const numRows = 3;
  const numColumns = 3;
  for (let rowSmallBoard = 0; rowSmallBoard < numRows; rowSmallBoard++) {
    for (let columnSmallBoard = 0; columnSmallBoard < numColumns; columnSmallBoard++) {
      const fieldButtonFragment = createFieldButtons(columnLabels, columnSmallBoard, rowSmallBoard);
      smallBoardElement.appendChild(fieldButtonFragment);
    }
  }
  smallBoardWrapper.appendChild(smallBoardElement);

  const smallBoardFragment = document.createDocumentFragment();
  smallBoardFragment.appendChild(smallBoardWrapper);

  return smallBoardFragment;
}

function createFieldButtons(columnLabels, column, row) {
  const fieldButtonTemplate = document.getElementById("fieldButtonTemplate");
  const fieldButtonClone = document.importNode(fieldButtonTemplate.content, true);
  const fieldButton = fieldButtonClone.querySelector("button");
  const fieldButtonId = `field-button-${columnLabels[column].toLowerCase()}${row + 1}`;
  fieldButton.setAttribute("id", fieldButtonId);
  fieldButton.classList.add(`${columnLabels[column].toLowerCase()}${row + 1}`);

  const fieldButtonFragment = document.createDocumentFragment();
  fieldButtonFragment.appendChild(fieldButton);

  return fieldButtonFragment;
}

function createGameBoard() {
  const game = document.getElementById("gameBoard");
  const mainGameBoardTemplate = document.getElementById("mainGameBoardTemplate");
  const mainGameBoardClone = document.importNode(mainGameBoardTemplate.content, true);
  const mainGameBoard = mainGameBoardClone.querySelector("div");

  const columnLabels = ["A", "B", "C"];
  const fragment = document.createDocumentFragment();

  // Get rid of magic numbers
  for (let row = 0; row < 3; row++) {
    for (let column = 0; column < 3; column++) {
      const elem = createSmallBoard(columnLabels, column, row);
      fragment.appendChild(elem);
    }
  }
  mainGameBoard.appendChild(fragment); // Append the main fragment to the big board
  game.appendChild(mainGameBoard);
}

// currentPlayerSymbol should be a var not a param of the function
function togglePlayer(p1, p2, currentPlayerSymbol) {
  return currentPlayerSymbol == p1 ? p2 : p1;
}

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

function processMove(clickedButtonId, gameDataObject) {
  const availableBoards = clickedButtonId.toUpperCase();
  const fields = [];
  // columnLabels needs to be a parameter of the function
  const columnLabels = ["A", "B", "C"];
  if (gameDataObject[availableBoards].result === null) {
    fields.push(`smallBoardElement-${availableBoards}`);
    return fields;
  } else {
    for (let column = 0; column < 3; column++) {
      for (let row = 0; row < 3; row++) {
        const index = `${columnLabels[column]}${row + 1}`;
        const result = gameDataObject[index].result;
        result ? null : fields.push(`smallBoardElement-${index}`);
      }
    }
  }
  return fields;
}

document.addEventListener("DOMContentLoaded", function () {
  const gameBoard = document.getElementById("gameBoard");
  // const resultBanner = document.getElementById("result");
  const playerDisplay = document.getElementById("playerDisplay");

  let availableBoards = [
    "smallBoardElement-A1",
    "smallBoardElement-A2",
    "smallBoardElement-A3",
    "smallBoardElement-B1",
    "smallBoardElement-B2",
    "smallBoardElement-B3",
    "smallBoardElement-C1",
    "smallBoardElement-C2",
    "smallBoardElement-C3",
  ];

  createGameBoard();

  // Create game data
  let gameDataObject = [];
  gameDataObject = initializingGame();

  // console.log(gameDataObject);

  // Player one starts the game
  let currentPlayerSymbol = gameDataObject.p1;

  // gameBoard.addEventListener("click", (event) => {
  function clickEventHandler(event) {
    const targetButton = event.target;
    const clickedBoardId = targetButton.parentNode.id;
    const targetBoard = targetButton.parentNode.id.slice(-2);

    const playedButton = targetButton.classList.contains("p1-icon") || targetButton.classList.contains("p2-icon");

    if (targetButton.matches("button") && !playedButton && availableBoards.includes(clickedBoardId)) {
      const clickedButtonId = targetButton.id.slice(-2);

      gameDataObject[targetBoard].numerator += 1;

      playerDisplay.textContent = `Player: ${
        currentPlayerSymbol === gameDataObject.p1 ? gameDataObject.p2 : gameDataObject.p1
      }`;

      const playerIcon = currentPlayerSymbol === "x" ? "p1-icon" : "p2-icon";

      targetButton.classList.add(playerIcon);
      // currentPlayerSymbol === "x" ? targetButton.classList.add("p1-icon") : targetButton.classList.add("p2-icon");

      gameDataObject[targetBoard].scoreBoard = updateSmallScoreBoard(
        clickedButtonId,
        gameDataObject[targetBoard].scoreBoard,
        currentPlayerSymbol,
      );

      const gameResult = checkSmallGameResult(
        gameDataObject[targetBoard].scoreBoard,
        gameDataObject[targetBoard].numerator,
        currentPlayerSymbol,
      );
      // if win on small board
      if (gameResult !== null) {
        gameDataObject[targetBoard].result = gameResult;
        gameDataObject.mainGameBoard.scoreBoard = updateMainScoreBoard(
          targetBoard,
          gameDataObject.mainGameBoard.scoreBoard,
          currentPlayerSymbol,
        );
        gameDataObject.mainGameBoard.numerator += 1;
        //remove small Board and add the player symbol
        const element = document.getElementById(`smallBoardWrapper-${targetBoard}`);
        while (element.firstChild) {
          element.removeChild(element.firstChild);
        }
        // element.classList.add("flex", "flex-col", "justify-center", `${currentPlayerSymbol}`);
        const resultElem = document.createElement("div");
        console.log(resultElem);
        resultElem.classList.add(playerIcon, "w-full", "h-full");
        console.log(playerIcon);

        // resultElem.innerText = currentPlayerSymbol;
        // resultElem.classList.add("text-center", "py-auto");
        element.appendChild(resultElem);
      }

      // remove all backgrounds from last round
      const allSmallBoards = document.querySelectorAll('[id^="smallBoardElement"]');
      for (let i = 0; i < allSmallBoards.length; i++) {
        allSmallBoards[i].classList.remove("bg-orange-200");
      }

      const finalResult = checkMainGameResult(gameDataObject, currentPlayerSymbol);
      if (finalResult) {
        playerDisplay.textContent = `${currentPlayerSymbol} Wins!`;
        const winStreak = document.getElementsByClassName(playerIcon);
        for (let i = 0; i < winStreak.length; i++) {
          winStreak[i].classList.add("bg-blue-200");
        }
        //remove event listener
        gameBoard.removeEventListener("click", clickEventHandler);
      } else {
        // add new backgrounds for the available fields for next move
        availableBoards = processMove(clickedButtonId, gameDataObject);
        for (let i = 0; i < availableBoards.length; i++) {
          const nextBoardElem = document.getElementById(availableBoards[i]);
          nextBoardElem.classList.add("bg-orange-200");
        }
      }

      currentPlayerSymbol = togglePlayer(gameDataObject.p1, gameDataObject.p2, currentPlayerSymbol);
    }
  }
  // });
  gameBoard.addEventListener("click", clickEventHandler);
});
