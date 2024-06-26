import { Matrix, PathIndex } from "../types/global.types";
import {
  colExists,
  rowExists,
  changeDirection,
  isIntersection,
  searchCharAndSetStartPoint,
  checkDirection,
  getDirection,
  findPath,
  isCharacterAllowed,
} from "./helpers";

//Row exist
describe("rowExists", () => {
  test("should return true when rowIndex is within the bounds of the matrix", () => {
    const matrix = [
      ["a", "b"],
      ["c", "d"],
      ["e", "f"],
    ];
    expect(rowExists(matrix, 0)).toBe(true);
    expect(rowExists(matrix, 1)).toBe(true);
    expect(rowExists(matrix, 2)).toBe(true);
  });

  test("should return false when rowIndex is negative", () => {
    const matrix = [
      ["a", "b"],
      ["c", "d"],
      ["e", "f"],
    ];
    expect(rowExists(matrix, -1)).toBe(false);
  });

  test("should return false when rowIndex is equal to the length of the matrix", () => {
    const matrix = [
      ["a", "b"],
      ["c", "d"],
      ["e", "f"],
    ];
    expect(rowExists(matrix, 3)).toBe(false);
  });

  test("should return false when rowIndex is greater than the length of the matrix", () => {
    const matrix = [
      ["a", "b"],
      ["c", "d"],
      ["e", "f"],
    ];
    expect(rowExists(matrix, 4)).toBe(false);
  });

  test("should return false for an empty matrix", () => {
    const matrix: Matrix = [];
    expect(rowExists(matrix, 0)).toBe(false);
  });
});

//Column exist
describe("colExists", () => {
  test("should return true when colIndex is within the bounds of the matrix", () => {
    const matrix = [
      ["a", "b"],
      ["c", "d"],
      ["e", "f"],
    ];
    expect(colExists(matrix, 0)).toBe(true);
    expect(colExists(matrix, 1)).toBe(true);
  });

  test("should return false when colIndex is negative", () => {
    const matrix = [
      ["a", "b"],
      ["c", "d"],
      ["e", "f"],
    ];
    expect(colExists(matrix, -1)).toBe(false);
  });

  test("should return false when colIndex is equal to the length of the first row of the matrix", () => {
    const matrix = [
      ["a", "b"],
      ["c", "d"],
      ["e", "f"],
    ];
    expect(colExists(matrix, 2)).toBe(false);
  });

  test("should return false when colIndex is greater than the length of the first row of the matrix", () => {
    const matrix = [
      ["a", "b"],
      ["c", "d"],
      ["e", "f"],
    ];
    expect(colExists(matrix, 3)).toBe(false);
  });

  test("should return false for an empty matrix", () => {
    const matrix: Matrix = [];
    expect(colExists(matrix, 0)).toBe(false);
  });

  test("should return false when the first row is empty", () => {
    const matrix = [[]];
    expect(colExists(matrix, 0)).toBe(false);
  });
});

//Change direction
describe("changeDirection", () => {
  test('should return "down" when input is "right"', () => {
    expect(changeDirection("right", "up")).toBe("down");
  });

  test('should return "left" when input is "down"', () => {
    expect(changeDirection("down", "right")).toBe("left");
  });

  test('should return "up" when input is "left"', () => {
    expect(changeDirection("left", "down")).toBe("up");
  });

  test('should return "right" when input is "up"', () => {
    expect(changeDirection("up", "left")).toBe("right");
  });

  test("should return the last valid direction for invalid inputs", () => {
    expect(changeDirection("invalid", "down")).toBe("down");
    expect(changeDirection("invalid", "left")).toBe("left");
    expect(changeDirection("invalid", "up")).toBe("up");
    expect(changeDirection("invalid", "right")).toBe("right");
  });
});

//Is intersection
describe("isIntersection", () => {
  test("should return false for a new intersection", () => {
    const pathIndex: PathIndex = [];
    expect(isIntersection(1, 1, pathIndex)).toBe(false);
    expect(pathIndex).toContain("1, 1");
  });

  test("should return true for a duplicate intersection", () => {
    const pathIndex: PathIndex = ["1, 1"];
    expect(isIntersection(1, 1, pathIndex)).toBe(true);
  });

  test("should return false for different intersections", () => {
    const pathIndex: PathIndex = ["1, 1"];
    expect(isIntersection(2, 2, pathIndex)).toBe(false);
    expect(pathIndex).toContain("2, 2");
  });

  test("should correctly handle multiple calls", () => {
    const pathIndex: PathIndex = [];
    expect(isIntersection(1, 1, pathIndex)).toBe(false);
    expect(isIntersection(2, 2, pathIndex)).toBe(false);
    expect(isIntersection(1, 1, pathIndex)).toBe(true);
    expect(isIntersection(2, 2, pathIndex)).toBe(true);
  });

  test("should return false for a new intersection after checking for duplicates", () => {
    const pathIndex: PathIndex = ["1, 1", "2, 2"];
    expect(isIntersection(3, 3, pathIndex)).toBe(false);
    expect(pathIndex).toContain("3, 3");
  });

  test("should correctly add new intersections to pathIndex", () => {
    const pathIndex: PathIndex = [];
    isIntersection(1, 1, pathIndex);
    isIntersection(2, 2, pathIndex);
    isIntersection(3, 3, pathIndex);
    expect(pathIndex).toEqual(["1, 1", "2, 2", "3, 3"]);
  });
});

//Search for char and set starting point
describe("searchCharAndSetStartPoint", () => {
  test("should return the correct position and existence of the character", () => {
    const grid = [
      ["a", "b", "c"],
      ["d", "@", "f"],
      ["g", "h", "i"],
    ];
    expect(searchCharAndSetStartPoint(grid, "@")).toEqual({
      isCharExist: 1,
      row: 1,
      col: 1,
    });
  });

  test("should return zero existence for a character not in the grid", () => {
    const grid = [
      ["a", "b", "c"],
      ["d", "e", "f"],
      ["g", "h", "i"],
    ];
    expect(searchCharAndSetStartPoint(grid, "@")).toEqual({
      isCharExist: 0,
      row: 0,
      col: 0,
    });
  });

  test("should return the count of character when it appears multiple times", () => {
    const grid = [
      ["a", "b", "c"],
      ["d", "@", "@"],
      ["g", "h", "i"],
    ];
    expect(searchCharAndSetStartPoint(grid, "@")).toEqual({
      isCharExist: 2,
      row: 1,
      col: 2,
    });
  });
});

//Check direction
describe("checkDirection", () => {
  test("should return the direction name for valid characters", () => {
    const matrix = [
      ["-", "-", "+"],
      [" ", " ", "|"],
      ["-", "-", "-"],
    ];
    const nextCharIndex = [0, 0];
    const currentCharIndex = [0, 1];
    const directionName = "right";
    const lastDirection = "right";

    expect(
      checkDirection(
        nextCharIndex,
        directionName,
        matrix,
        currentCharIndex,
        lastDirection
      )
    ).toBe("right");
  });

  test('should change direction when nextChar is "|" and currentChar is "+"', () => {
    const matrix = [
      ["-", "+", "|"],
      [" ", "|", "+"],
      ["-", "+", " "],
    ];
    const nextCharIndex = [0, 2];
    const currentCharIndex = [0, 1];
    const directionName = "right";
    const lastDirection = "right";

    expect(
      checkDirection(
        nextCharIndex,
        directionName,
        matrix,
        currentCharIndex,
        lastDirection
      )
    ).toBe("down");
  });

  test('should return the last direction when nextChar is "|" and currentChar valid', () => {
    const matrix = [
      ["-", "+", "|"],
      [" ", "|", "+"],
      ["-", "+", " "],
    ];
    const nextCharIndex = [1, 2];
    const currentCharIndex = [1, 1];
    const directionName = "right";
    const lastDirection = "down";

    expect(
      checkDirection(
        nextCharIndex,
        directionName,
        matrix,
        currentCharIndex,
        lastDirection
      )
    ).toBe("down");
  });
});

//Get direction
describe("getDirection", () => {
  test("should return the correct next step", () => {
    const matrix = [
      ["-", "+", " "],
      [" ", "|", " "],
      ["-", "+", " "],
    ];
    const currentCharIndex = [0, 0];
    const lastDirection = "right";

    const result = getDirection(currentCharIndex, matrix, lastDirection);

    expect(result).toEqual({
      nextStep: [0, 1],
      lastDirection: "right",
      isFakeTurn: false,
    });
  });

  test('should indicate fake turn when encountering "+" in wrong place', () => {
    const matrix = [
      ["-", "+", "-", "+"],
      [" ", " ", " ", "|"],
      ["-", "-", "-", "+"],
    ];
    const currentCharIndex = [0, 1];
    const lastDirection = "right";

    const result = getDirection(currentCharIndex, matrix, lastDirection);

    expect(result).toEqual({
      nextStep: [0, 2],
      lastDirection: "right",
      isFakeTurn: true,
    });
  });
});

//Is character allowed
describe("isCharacterAllowed", () => {
  test("should return true for allowed special characters", () => {
    expect(isCharacterAllowed("-")).toBe(true);
    expect(isCharacterAllowed("|")).toBe(true);
    expect(isCharacterAllowed("+")).toBe(true);
    expect(isCharacterAllowed("x")).toBe(true);
    expect(isCharacterAllowed("@")).toBe(true);
  });

  test("should return true for uppercase letters", () => {
    expect(isCharacterAllowed("A")).toBe(true);
    expect(isCharacterAllowed("B")).toBe(true);
    expect(isCharacterAllowed("Z")).toBe(true);
  });

  test("should return false for lowercase letters", () => {
    expect(isCharacterAllowed("a")).toBe(false);
    expect(isCharacterAllowed("b")).toBe(false);
    expect(isCharacterAllowed("z")).toBe(false);
  });

  test("should return false for digits", () => {
    expect(isCharacterAllowed("0")).toBe(false);
    expect(isCharacterAllowed("1")).toBe(false);
    expect(isCharacterAllowed("9")).toBe(false);
  });

  test("should return false for other special characters", () => {
    expect(isCharacterAllowed("!")).toBe(false);
    expect(isCharacterAllowed("$")).toBe(false);
    expect(isCharacterAllowed("%")).toBe(false);
  });
});

//Find path
describe("findPath", () => {
  test("should find a valid path with letters collected", () => {
    const matrix = [
      ["@", "-", "-", "-", "A", "-", "-", "-", "+"],
      [" ", " ", " ", " ", " ", " ", " ", " ", "|"],
      ["x", "-", "B", "-", "+", " ", " ", " ", "C"],
      [" ", " ", " ", " ", "|", " ", " ", " ", "|"],
      [" ", " ", " ", " ", "+", "-", "-", "-", "+"],
    ];

    const result = findPath(matrix);

    expect(result).toEqual({
      path: "@---A---+|C|+---+|+-B-x",
      letters: "ACB",
    });
  });

  test("should return an empty path and letters if start point is missing", () => {
    const matrix = [
      [" ", "-", "-", "-", "A", "-", "-", "-", "+"],
      [" ", " ", " ", " ", " ", " ", " ", " ", "|"],
      ["x", "-", "B", "-", "+", " ", " ", " ", "C"],
      [" ", " ", " ", " ", "|", " ", " ", " ", "|"],
      [" ", " ", " ", " ", "+", "-", "-", "-", "+"],
    ];

    const result = findPath(matrix);

    expect(result).toEqual({
      path: "",
      letters: "",
    });
  });

  test("should return an empty path and letters if end point is missing", () => {
    const matrix = [
      ["@", "-", "-", "-", "A", "-", "-", "-", "+"],
      [" ", " ", " ", " ", " ", " ", " ", " ", "|"],
      [" ", "-", "B", "-", "+", " ", " ", " ", "C"],
      [" ", " ", " ", " ", "|", " ", " ", " ", "|"],
      [" ", " ", " ", " ", "+", "-", "-", "-", "+"],
    ];

    const result = findPath(matrix);

    expect(result).toEqual({
      path: "",
      letters: "",
    });
  });

  test("should return an empty path and letters if matrix have two starting points", () => {
    const matrix = [
      ["@", "-", "-", "-", "A", "-", "-", "-", "+"],
      [" ", " ", " ", " ", " ", " ", " ", " ", "|"],
      ["x", "-", "B", "-", "+", " ", "@", " ", "C"],
      [" ", " ", " ", " ", "|", " ", " ", " ", "|"],
      [" ", " ", " ", " ", "+", "-", "-", "-", "+"],
    ];

    const result = findPath(matrix);

    expect(result).toEqual({
      path: "",
      letters: "",
    });
  });

  test("should return an empty path and letters if matrix have two ending points. This also includes fork path.", () => {
    const matrix = [
      ["@", "-", "-", "-", "A", "-", "-", "-", "+"],
      [" ", " ", " ", " ", " ", " ", " ", " ", "|"],
      ["x", "-", "B", "-", "+", " ", "x", " ", "C"],
      [" ", " ", " ", " ", "|", " ", " ", " ", "|"],
      [" ", " ", " ", " ", "+", "-", "-", "-", "+"],
    ];

    const result = findPath(matrix);

    expect(result).toEqual({
      path: "",
      letters: "",
    });
  });

  test("should return an empty path and letters if fake turns occur.", () => {
    const matrix = [
      ["@", "-", "+", "-", "A", "-", "-", "-", "+"],
      [" ", " ", " ", " ", " ", " ", " ", " ", "|"],
      ["x", "-", "B", "-", "+", " ", "x", " ", "C"],
      [" ", " ", " ", " ", "|", " ", " ", " ", "|"],
      [" ", " ", " ", " ", "+", "-", "-", "-", "+"],
    ];

    const result = findPath(matrix);

    expect(result).toEqual({
      path: "",
      letters: "",
    });
  });

  test("should return an empty path and letters if broken path occur.", () => {
    const matrix = [
      ["@", "-", " ", "-", "A", "-", "-", "-", "+"],
      [" ", " ", " ", " ", " ", " ", " ", " ", "|"],
      ["x", "-", "B", "-", "+", " ", "x", " ", "C"],
      [" ", " ", " ", " ", "|", " ", " ", " ", "|"],
      [" ", " ", " ", " ", "+", "-", "-", "-", "+"],
    ];

    const result = findPath(matrix);

    expect(result).toEqual({
      path: "",
      letters: "",
    });
  });

  test("should return an empty path and letters if char is not allowed.", () => {
    const matrix = [
      ["@", "-", ".", "-", "A", "-", "-", "-", "+"],
      [" ", " ", " ", " ", " ", " ", " ", " ", "|"],
      ["x", "-", "B", "-", "+", " ", "x", " ", "C"],
      [" ", " ", " ", " ", "|", " ", " ", " ", "|"],
      [" ", " ", " ", " ", "+", "-", "-", "-", "+"],
    ];

    const result = findPath(matrix);

    expect(result).toEqual({
      path: "",
      letters: "",
    });
  });
});
