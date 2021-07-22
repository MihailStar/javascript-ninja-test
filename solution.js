((global) => {
  "use strict";

  const PUZZLE_SIZE = "10x10";

  const DirectionOfRotation = { СLOCKWISE: 1, ANTICLOCKWISE: -1 };

  function rotatePiece(piece, direction = DirectionOfRotation.СLOCKWISE) {
    return direction === DirectionOfRotation.ANTICLOCKWISE
      ? {
          id: piece.id,
          edges: {
            top: piece.edges.left,
            right: piece.edges.top,
            bottom: piece.edges.right,
            left: piece.edges.bottom,
          },
        }
      : {
          id: piece.id,
          edges: {
            top: piece.edges.right,
            right: piece.edges.bottom,
            bottom: piece.edges.left,
            left: piece.edges.top,
          },
        };
  }

  function solvePuzzle(pieces) {
    /** @example { 7: { inside: 3, outside: 0 } } */
    const edgeTypeIdToEdgeTypeToIndex = {};
    pieces.forEach((piece, pieceIndex) => {
      Object.values(piece.edges).forEach((edge) => {
        if (edge === null) return;

        if (edgeTypeIdToEdgeTypeToIndex[edge.edgeTypeId] === undefined) {
          edgeTypeIdToEdgeTypeToIndex[edge.edgeTypeId] = {};
        }

        edgeTypeIdToEdgeTypeToIndex[edge.edgeTypeId] = {
          ...edgeTypeIdToEdgeTypeToIndex[edge.edgeTypeId],
          ...{ [edge.type]: pieceIndex },
        };
      });
    });

    const [
      numberOfPiecesHorizontally,
      numberOfPiecesVertically,
    ] = PUZZLE_SIZE.split("x").map((numberOf) => Number.parseInt(numberOf, 10));

    const puzzle = Array.from({ length: numberOfPiecesVertically }, () =>
      Array.from({ length: numberOfPiecesHorizontally })
    );
    puzzle.forEach((row, rowIndex) => {
      row.forEach((_, pieceIndex) => {
        if (rowIndex === 0 && pieceIndex === 0) {
          [puzzle[0][0]] = pieces;

          while (
            puzzle[0][0].edges.top !== null ||
            puzzle[0][0].edges.left !== null
          ) {
            puzzle[0][0] = rotatePiece(puzzle[0][0]);
          }

          return;
        }

        if (pieceIndex === 0) {
          const { edgeTypeId: prevEdgeTypeId, type: prevEdgeType } = puzzle[
            rowIndex - 1
          ][0].edges.bottom;
          const index =
            edgeTypeIdToEdgeTypeToIndex[prevEdgeTypeId][
              prevEdgeType === "inside" ? "outside" : "inside"
            ];
          puzzle[rowIndex][0] = pieces[index];

          while (puzzle[rowIndex][0].edges.top?.edgeTypeId !== prevEdgeTypeId) {
            puzzle[rowIndex][0] = rotatePiece(puzzle[rowIndex][0]);
          }

          return;
        }

        const { edgeTypeId: prevEdgeTypeId, type: prevEdgeType } = puzzle[
          rowIndex
        ][pieceIndex - 1].edges.right;
        const index =
          edgeTypeIdToEdgeTypeToIndex[prevEdgeTypeId][
            prevEdgeType === "inside" ? "outside" : "inside"
          ];
        puzzle[rowIndex][pieceIndex] = pieces[index];

        while (
          puzzle[rowIndex][pieceIndex].edges.left?.edgeTypeId !== prevEdgeTypeId
        ) {
          puzzle[rowIndex][pieceIndex] = rotatePiece(
            puzzle[rowIndex][pieceIndex]
          );
        }
      });
    });

    return puzzle.map((row) => row.map((piece) => piece.id)).flat();
  }

  global.solvePuzzle = solvePuzzle;
})(window);
