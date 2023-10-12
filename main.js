import createGameBoard from "./components/gameBoard";
import * as scoreBoard from "./components/gameScore";

function togglePlayer(p1, p2, currentPlayerSymbol) {
  return currentPlayerSymbol == p1 ? p2 : p1;
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
  gameDataObject = scoreBoard.initializingGame();

  // Player one starts the game
  let currentPlayerSymbol = gameDataObject.p1;

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

      gameDataObject[targetBoard].scoreBoard = scoreBoard.updateSmallScoreBoard(
        clickedButtonId,
        gameDataObject[targetBoard].scoreBoard,
        currentPlayerSymbol,
      );

      const gameResult = scoreBoard.checkSmallGameResult(
        gameDataObject[targetBoard].scoreBoard,
        gameDataObject[targetBoard].numerator,
        currentPlayerSymbol,
      );
      // if win on small board
      if (gameResult !== null) {
        gameDataObject[targetBoard].result = gameResult;
        gameDataObject.mainGameBoard.scoreBoard = scoreBoard.updateMainScoreBoard(
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

        const resultElem = document.createElement("div");

        resultElem.classList.add(playerIcon, "w-full", "h-full");

        element.appendChild(resultElem);
      }

      // remove all backgrounds from last round
      const allSmallBoards = document.querySelectorAll('[id^="smallBoardElement"]');
      for (let i = 0; i < allSmallBoards.length; i++) {
        allSmallBoards[i].classList.remove("bg-orange-200");
      }

      const finalResult = scoreBoard.checkMainGameResult(gameDataObject, currentPlayerSymbol);
      if (finalResult) {
        playerDisplay.textContent = `${currentPlayerSymbol} Wins!`;
        const winStreak = document.querySelectorAll(`div.${playerIcon}`);
        for (let i = 0; i < winStreak.length; i++) {
          winStreak[i].classList.add("bg-blue-200");
        }
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

  gameBoard.addEventListener("click", clickEventHandler);
});
