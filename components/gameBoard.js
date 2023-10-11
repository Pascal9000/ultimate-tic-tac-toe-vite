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

export default createGameBoard;
