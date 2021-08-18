<script lang="ts">
  import GameTitle from "./GameTitle.svelte";
  import GameWinLosePopup from "./GameWinLosePopup.svelte";
  import MineSweeperTile from "./MineSweeperTile.svelte";
  import { gameService } from "./service";
  import type { GameState } from "./types";

  let width = 10;
  let height = 5;
  let mineRatio = 0.05;

  let state: GameState = gameService.reset(width, height, mineRatio);

  const open = (row: number, col: number) => {
    gameService.openTile(state, { x: row, y: col });
    state = state;
  };
  const flag = (row: number, col: number) => {
    gameService.toggleFlagTile(state, { x: row, y: col });
    state = state;
  };
  const reset = () => {
    state = gameService.reset(width, height, mineRatio);
  };

  $: winState = gameService.checkBoardState(state);
  $: if (gameService.checkBoardState(state) === "lose") {
    gameService.openAllMines(state);
    state = state;
  }
  $: if (gameService.checkBoardState(state) === "win") {
    gameService.openAllTiles(state);
    state = state;
  }
</script>

<section class="flex flex-col items-center my-12">
  <GameTitle />
  <div class="relative">
    <div class="flex gap-2">
      {#each state.state as rowArr, row (row)}
        <div class="flex flex-col gap-2">
          {#each rowArr as value, col (col)}
            <MineSweeperTile
              {winState}
              index={{ x: row, y: col }}
              disabled={winState === "lose" || winState === "win"}
              open={() => open(row, col)}
              flag={() => flag(row, col)}
              state={value}
              bombNeighbors={gameService.getBombNeigbors(state, {
                x: row,
                y: col,
              })}
            />
          {/each}
        </div>
      {/each}
    </div>
    <GameWinLosePopup {reset} {winState} />
  </div>

  <div class="mt-8 text-gray-500">Settings</div>
  <div class="mt-2 flex gap-4 items-center relative">
    <div class="flex flex-col">
      <label for="width" class="text-sm text-gray-500">Width</label>
      <input name="width" bind:value={width} type="number" />
    </div>
    <div class="flex flex-col">
      <label for="height" class="text-sm text-gray-500">Height</label>
      <input name="height" bind:value={height} type="number" />
    </div>
    <div class="flex flex-col">
      <label for="height" class="text-sm text-gray-500">Difficulty</label>
      <div class="select-container">
        <select bind:value={mineRatio}>
          <option value={0.05}>Easy</option>
          <option value={0.1}>Medium</option>
          <option value={0.2}>Hard</option>
        </select>
      </div>
    </div>
  </div>
  <div class="mt-4">
    <button on:click={reset}>Reset</button>
  </div>
</section>

<style lang="postcss">
  input {
    @apply bg-gray-100 rounded-lg px-4 py-2 outline-none box-border border-2 border-transparent;
    @apply focus:border-blue-500;
  }

  button {
    @apply bg-gray-100 rounded-lg px-4 py-2;
    @apply hover:bg-gray-200;
  }

  .select-container {
    @apply bg-gray-100 rounded-lg;
  }

  select {
    @apply bg-transparent mx-4 my-2 outline-none py-1 pr-4;
  }
</style>
