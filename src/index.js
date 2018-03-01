module.exports = function solveSudoku(matrix) {
  let solvedMatrix = cloneMatrix(matrix);

  if (solveSudokuHelper(solvedMatrix)) {
    return solvedMatrix;
  }

  return matrix;
}

function solveSudokuHelper(matrix) {
  const minPossibleValues = {
    rowIndex: -1,
    columnIndex: -1,
    values: []
  };

  while (true) {
    minPossibleValues.rowIndex = -1;

    for (let i = 0, length = matrix.length; i < length; i++) {
      for (let j = 0; j < length; j++) {
        if (!matrix[i][j]) {
          let possibleValues = findPossible(i, j, matrix);
          const possibleValuesCount = possibleValues.length;

          if (!possibleValuesCount) {
            return false;
          }
          if (possibleValuesCount === 1) {
            matrix[i][j] = possibleValues.pop();
          }
          const condition = possibleValuesCount && possibleValuesCount < minPossibleValues.values.length;

          if (minPossibleValues.rowIndex < 0 || condition) {
            minPossibleValues.rowIndex = i;
            minPossibleValues.columnIndex = j;
            minPossibleValues.values = possibleValues;
          }
        }
      }
    }
    if (minPossibleValues.rowIndex === -1) {
      return true;
    } else if (1 < minPossibleValues.values.length) {
      break;
    }
  }

  for (let i = 0, length = minPossibleValues.values.length; i < length; i++) {
    let copy = cloneMatrix(matrix);
    copy[minPossibleValues.rowIndex][minPossibleValues.columnIndex] = minPossibleValues.values[i];

    if (solveSudokuHelper(copy)) {
      copyValuesFromMatrixs(copy, matrix);
      return true;
    }
  }

  return false;
}

function cloneMatrix(matrix) {
  const copy = [];

  matrix.forEach((element, index) => {
    copy[index] = element.slice();
  });

  return copy;
}

function copyValuesFromMatrixs(source, dest) {
  for (let i = 0, length = source.length; i < length; i++) {
    for (let j = 0; j < length; j++) {
      dest[i][j] = source[i][j];
    }
  }
}

function findPossible(row, column, matrix) {
  let possible = [];

  for (let i = 1; i < 10; i++) {
    possible.push(i);
  }

  checkRow(possible, row, matrix);
  checkColumn(possible, column, matrix);
  checkInNonet(row, column, possible, matrix);

  return possible;
}

function checkRow(possible, rowIndex, matrix) {
  matrix[rowIndex].forEach(element => {
    removeFromArray(possible, element);
  });
}

function checkColumn(possible, colIndex, matrix) {
  for (let i = 0, length = matrix.length; i < length; i++) {
    removeFromArray(possible, matrix[i][colIndex]);
  }
}

function checkInNonet(row, column, possible, matrix) {
  const increase = 3;
  let nonetRowIndex = increase * Math.floor(row / increase);
  let nonetColumnIndex = increase * Math.floor(column / increase);

  for (let i = 0; i < increase; i++) {
    for (let j = 0; j < increase; j++) {
      removeFromArray(possible, matrix[nonetRowIndex + i][nonetColumnIndex + j]);
    }
  }
}

function removeFromArray(array, element) {
  const foundedIndex = array.indexOf(element);

  if (foundedIndex >= 0) {
    array.splice(foundedIndex, 1);
  }
}
