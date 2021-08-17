<script lang="ts">
  import { TileState } from "./types";
  import Fa from "svelte-fa/src/fa.svelte";
  import { faFlag, faBomb } from "@fortawesome/free-solid-svg-icons";

  export let open: () => void;
  export let flag: () => void;
  export let state: TileState;
  export let disabled: boolean;

  // -1 means it is a bomb itself
  export let bombNeighbors: number | undefined;

  $: isOpened = state === TileState.Opened;
  $: isEmptySafeTile = state === TileState.Opened && bombNeighbors === 0;
  $: isBomb = state === TileState.Opened && bombNeighbors === -1;
</script>

<div
  class="h-12 w-12 rounded flex flex-col items-center justify-center tile"
  class:cursor-pointer={!disabled && !isOpened && state !== TileState.Flagged}
  class:tileflip={state === TileState.Opened || state === TileState.Flagged}
  on:click={disabled ? null : open}
  on:contextmenu|preventDefault={disabled ? null : flag}
>
  <div class="first-side" />
  <div
    class="second-side"
    class:bg-gray-200={isOpened &&
      !isBomb &&
      !isEmptySafeTile &&
      state !== TileState.Flagged}
    class:bg-gray-100={isEmptySafeTile}
    class:bg-red-500={isBomb}
    class:bg-yellow-500={state === TileState.Flagged}
  >
    {#if state === TileState.Unopened}
      <span />
    {:else if state === TileState.Flagged}
      <Fa icon={faFlag} color="white" />
    {:else if isBomb}
      <Fa icon={faBomb} color="white" />
    {:else if bombNeighbors > 0}
      <span>{bombNeighbors}</span>
    {:else}
      <span />
    {/if}
  </div>
</div>

<style lang="postcss">
  .tile {
    @apply relative;
    transition: all 0.2s linear;
    transform-style: preserve-3d;
  }
  .tileflip {
    transform: rotateX(180deg);
  }
  .first-side {
    @apply absolute bg-gray-300 w-full h-full rounded;
  }
  .second-side {
    @apply absolute w-full h-full flex flex-col items-center justify-center rounded;
    transform: rotateX(180deg);
  }
</style>
