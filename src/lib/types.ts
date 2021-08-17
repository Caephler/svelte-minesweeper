export type Vec2d = {
  x: number;
  y: number;
};

export type Vec2dMap<T> = T[][];

export type Size2d = {
  width: number;
  height: number;
};

export type GameBoard = {
  size: Size2d;
  mines: Vec2dMap<boolean>;
};

export enum TileState {
  Unopened,
  Opened,
  Flagged,
}

export type GameState = {
  board: GameBoard;
  state: Vec2dMap<TileState>;
};
