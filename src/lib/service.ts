import type { GameState, GameBoard, Vec2dMap, Vec2d } from "./types";
import { TileState } from "./types";

class GameService {
  reset = (width = 10, height = 10, mineRatio = 0.1): GameState => {
    return {
      board: this.generateBoard(width, height, mineRatio),
      state: this.generateBoardState(width, height),
    };
  };

  isInvalidTile = (state: GameState, tile: Vec2d) => {
    return (
      tile.x >= state.board.size.width ||
      tile.y >= state.board.size.height ||
      tile.x < 0 ||
      tile.y < 0
    );
  };

  /**
   * Returns true if mine, false if not
   */
  openTile = (state: GameState, tile: Vec2d, recursive = true) => {
    if (this.isInvalidTile(state, tile)) {
      return;
    }
    state.state[tile.x][tile.y] = TileState.Opened;
    const bombNs = this.getBombNeigbors(state, tile);
    if (bombNs === -1 || bombNs !== 0 || !recursive) {
      return;
    }
    const toCheck = [
      { x: tile.x + 1, y: tile.y },
      { x: tile.x - 1, y: tile.y },
      { x: tile.x, y: tile.y - 1 },
      { x: tile.x, y: tile.y + 1 },
      { x: tile.x + 1, y: tile.y + 1 },
      { x: tile.x + 1, y: tile.y - 1 },
      { x: tile.x - 1, y: tile.y - 1 },
      { x: tile.x - 1, y: tile.y + 1 },
    ];
    toCheck.forEach((tileToCheck) => {
      if (this.isInvalidTile(state, tileToCheck)) {
        return;
      }
      const bombNs = this.getBombNeigbors(state, tileToCheck);
      if (bombNs > 0) {
        this.openTile(state, tileToCheck, false);
      } else {
        this.openIfZero(state, tileToCheck);
      }
    });
  };

  openIfZero = (state: GameState, tile: Vec2d) => {
    if (this.isInvalidTile(state, tile)) {
      return;
    }
    const bombNs = this.getBombNeigbors(state, tile);
    if (bombNs !== 0) {
      return;
    }

    if (state.state[tile.x][tile.y] === TileState.Opened) {
      return;
    }
    state.state[tile.x][tile.y] = TileState.Opened;
    const toCheck = [
      { x: tile.x + 1, y: tile.y },
      { x: tile.x - 1, y: tile.y },
      { x: tile.x, y: tile.y - 1 },
      { x: tile.x, y: tile.y + 1 },
      { x: tile.x + 1, y: tile.y + 1 },
      { x: tile.x + 1, y: tile.y - 1 },
      { x: tile.x - 1, y: tile.y - 1 },
      { x: tile.x - 1, y: tile.y + 1 },
    ];
    toCheck.forEach((tileToCheck) => {
      if (this.isInvalidTile(state, tileToCheck)) {
        return;
      }
      const bombNs = this.getBombNeigbors(state, tileToCheck);
      if (bombNs > 0) {
        this.openTile(state, tileToCheck, false);
      } else {
        this.openIfZero(state, tileToCheck);
      }
    });
  };

  toggleFlagTile = (state: GameState, tile: Vec2d): boolean => {
    const prevState = state.state[tile.x][tile.y];
    if (prevState === TileState.Opened) {
      return;
    }
    if (prevState === TileState.Unopened) {
      state.state[tile.x][tile.y] = TileState.Flagged;
    } else {
      state.state[tile.x][tile.y] = TileState.Unopened;
    }
  };

  generateBoardState = (width: number, height: number): Vec2dMap<TileState> => {
    return [...Array(width)].map(() =>
      [...Array(height)].map(() => TileState.Unopened)
    );
  };

  /**
   * Generates a new board
   */
  generateBoard = (
    width: number,
    height: number,
    mineRatio: number
  ): GameBoard => {
    if (mineRatio >= 1.0) {
      throw new Error("Mine ratio cannot be >= 1");
    }
    const numMines = Math.ceil(width * height * mineRatio);
    const mineMap: Vec2dMap<boolean> = [...Array(width)].map(() => []);
    [...Array(numMines)].forEach(() => {
      // Generate new coordinate
      let x = Math.floor(Math.random() * width);
      let y = Math.floor(Math.random() * height);

      while (mineMap[x][y] !== undefined) {
        x = Math.floor(Math.random() * width);
        y = Math.floor(Math.random() * height);
      }
      mineMap[x][y] = true;
    });

    return {
      mines: mineMap,
      size: { width, height },
    };
  };

  getBombNeigbors = (state: GameState, tile: Vec2d) => {
    const isMine = state.board.mines[tile.x][tile.y];
    if (isMine) {
      return -1;
    }
    // Check all 8 dirs
    let total = 0;
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) {
          continue;
        }
        const nextTile = { x: tile.x + i, y: tile.y + j };
        if (this.isInvalidTile(state, nextTile)) {
          continue;
        }
        if (state.board.mines[nextTile.x][nextTile.y]) {
          total += 1;
        }
      }
    }

    return total;
  };

  checkBoardState = (state: GameState): "win" | "lose" | "progress" => {
    let result = "progress";
    let wrongFlag = false;
    let totalCorrectFlagged = 0;
    let totalMines = 0;
    state.state.forEach((row, i) => {
      row.forEach((tileState, j) => {
        if (state.board.mines[i][j]) {
          totalMines++;
          if (tileState === TileState.Flagged) {
            totalCorrectFlagged += 1;
          }
        } else {
          if (tileState === TileState.Flagged) {
            wrongFlag = true;
          }
        }
        if (tileState === TileState.Opened && state.board.mines[i][j]) {
          result = "lose";
        }
      });
    });

    if (result === "lose") {
      return result;
    }

    if (wrongFlag) {
      return "progress";
    }

    // Win Condition: All mines flagged
    if (totalCorrectFlagged === totalMines) {
      return "win";
    }

    return "progress";
  };

  openAllMines = (state: GameState) => {
    state.board.mines.forEach((row, i) => {
      row.forEach((isMine, j) => {
        if (isMine) {
          state.state[i][j] = TileState.Opened;
        }
      });
    });
  };

  openAllTiles = (state: GameState) => {
    state.state.forEach((row, i) => {
      row.forEach((tileState, j) => {
        if (state.board.mines[i][j]) {
          return;
        } else {
          state.state[i][j] = TileState.Opened;
        }
      });
    });
  };
}

export const gameService = new GameService();
