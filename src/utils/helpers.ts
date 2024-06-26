import { Directions, Matrix, PathIndex } from "../types/global.types";

export const rowExists = (matrix: string[][], rowIndex: number) => {
  return rowIndex >= 0 && rowIndex < matrix?.length;
};

export const colExists = (matrix: string[][], colIndex: number) => {
  return matrix?.length > 0 && colIndex >= 0 && colIndex < matrix[0]?.length;
};

export const changeDirection = (direction: string, lastDirection: string) => {
  switch (direction) {
    case "right":
      return "down";
    case "down":
      return "left";
    case "left":
      return "up";
    case "up":
      return "right";
    default:
      return lastDirection;
  }
};

export const isIntersection = (
  row: number,
  col: number,
  pathIndex: string[]
) => {
  const isDuplicate = pathIndex.includes(`${row}, ${col}`);
  pathIndex.push(`${row}, ${col}`);
  return isDuplicate;
};

export const searchCharAndSetStartPoint = (
  matrix: string[][],
  char: string
) => {
  let isCharExist = 0,
    row = 0,
    col = 0;
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      if (matrix[i][j] === char) {
        row = i;
        col = j;
        isCharExist++;
      }
    }
  }
  return { isCharExist, row, col };
};

export const isCharacterAllowed = (char: string) => {
  const allowedCharacters: string[] = ["-", "|", "+", "x", "@"];
  return allowedCharacters.includes(char) || /[A-Z]/.test(char);
};

export const checkDirection = (
  nextCharIndex: number[],
  directionName: string,
  matrix: Matrix,
  currentCharIndex: number[],
  lastDirection: string
) => {
  let direction = "";

  const colRowExist =
    rowExists(matrix, nextCharIndex[0]) && colExists(matrix, nextCharIndex[1]);

  const currentChar = matrix[currentCharIndex[0]][currentCharIndex[1]];
  const nextChar = colRowExist
    ? matrix[nextCharIndex[0]][nextCharIndex[1]]
    : "";

  if (isCharacterAllowed(nextChar)) {
    if (
      currentChar === "+" &&
      nextChar !== "-" &&
      nextChar === "|" &&
      directionName !== "up" &&
      directionName !== "down"
    ) {
      direction = changeDirection(lastDirection, lastDirection);
    } else if (currentChar === "|") {
      direction = lastDirection;
    } else {
      direction = directionName;
    }
  }

  return direction;
};

export const getDirection = (
  currentCharIndex: number[],
  matrix: string[][],
  lastDirection: string
) => {
  const directions: Directions = {
    right: [0, 1],
    down: [1, 0],
    left: [0, -1],
    up: [-1, 0],
  };
  //find next index
  const right: number[] = currentCharIndex.map(
    (num, index) => num + directions.right[index]
  );
  const down: number[] = currentCharIndex.map(
    (num, index) => num + directions.down[index]
  );
  const left: number[] = currentCharIndex.map(
    (num, index) => num + directions.left[index]
  );
  const up: number[] = currentCharIndex.map(
    (num, index) => num + directions.up[index]
  );

  //check if cell exist and get direction
  let direction =
    checkDirection(right, "right", matrix, currentCharIndex, lastDirection) ||
    checkDirection(down, "down", matrix, currentCharIndex, lastDirection) ||
    checkDirection(left, "left", matrix, currentCharIndex, lastDirection) ||
    checkDirection(up, "up", matrix, currentCharIndex, lastDirection);

  const directionIndex =
    (direction === "right" && right) ||
    (direction === "down" && down) ||
    (direction === "left" && left) ||
    (direction === "up" && up);

  const lastDirectionIndex =
    (lastDirection === "right" && right) ||
    (lastDirection === "down" && down) ||
    (lastDirection === "left" && left) ||
    (lastDirection === "up" && up);

  const isFakeTurn =
    matrix[currentCharIndex[0]][currentCharIndex[1]] === "+" &&
    direction === lastDirection;

  lastDirection = direction;

  return {
    nextStep: directionIndex || lastDirectionIndex || null,
    isFakeTurn,
    lastDirection,
  };
};

export const findPath = (matrix: Matrix) => {
  const matrixDeepClone: Matrix = JSON.parse(JSON.stringify(matrix));
  const pathIndex: PathIndex = [];

  let path = "",
    letters = "",
    currentChar = "",
    lastDirectionGlobal = "",
    isStartingPointExist = searchCharAndSetStartPoint(matrixDeepClone, "@"),
    isEndingPointExist = searchCharAndSetStartPoint(matrixDeepClone, "x"),
    { row, col }: { row: number | null; col: number | null } =
      isStartingPointExist;

  while (true) {
    const { nextStep, isFakeTurn, lastDirection } = getDirection(
      [row, col],
      matrixDeepClone,
      lastDirectionGlobal
    );

    lastDirectionGlobal = lastDirection;

    const isLetter = /[A-Z]/.test(matrixDeepClone[row][col]);
    currentChar = isLetter ? matrixDeepClone[row][col] : matrix[row][col];
    path += currentChar;

    if (currentChar === "x") {
      break;
    } else if (
      isStartingPointExist.isCharExist !== 1 ||
      isEndingPointExist.isCharExist !== 1 ||
      isFakeTurn ||
      nextStep === null ||
      !isCharacterAllowed(currentChar)
    ) {
      letters = "";
      path = "";
      break;
    }

    if (path.slice(0, 2) === "@B") {
      //case for BLAH on intersection
      isLetter &&
        !isIntersection(row, col, pathIndex) &&
        (letters += matrixDeepClone[row][col]);

      !isLetter && (matrixDeepClone[row][col] = " ");
    } else {
      //all other matrices
      isLetter && (letters += matrixDeepClone[row][col]);
      matrixDeepClone[row][col] = " ";
    }

    row = nextStep[0];
    col = nextStep[1];
  }

  return { path, letters };
};
