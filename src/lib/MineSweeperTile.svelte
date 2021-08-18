<script lang="ts">
  import { faBomb, faFlag } from "@fortawesome/free-solid-svg-icons";
  import Fa from "svelte-fa/src/fa.svelte";
  import type { Vec2d } from "./types";
  import { TileState } from "./types";

  export let open: () => void;
  export let flag: () => void;
  export let state: TileState;
  export let disabled: boolean;
  export let winState: "win" | "progress" | "lose";
  export let index: Vec2d;

  // -1 means it is a bomb itself
  export let bombNeighbors: number | undefined;

  $: isOpened = state === TileState.Opened;
  $: isEmptySafeTile = state === TileState.Opened && bombNeighbors === 0;
  $: isBomb = state === TileState.Opened && bombNeighbors === -1;
  $: delay = Math.max(index.x, index.y) * 0.25;
</script>

<div
  class:win-animation={winState === "win"}
  style="animation-delay: {delay}s;"
>
  <div
    class="h-12 w-12 rounded flex flex-col items-center justify-center tile"
    class:cursor-pointer={!disabled && !isOpened && state !== TileState.Flagged}
    class:tileflip={state === TileState.Opened || state === TileState.Flagged}
    on:click={disabled ? null : open}
    on:contextmenu|preventDefault={disabled ? null : flag}
  >
    <div
      class="first-side"
      class:win-first-side={winState === "win"}
      style="animation-delay: {delay}s;"
    />
    <div
      class="second-side"
      class:bg-gray-300={!isOpened && state !== TileState.Flagged}
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

  .win-animation {
    transform-style: preserve-3d;
    animation-name: win;
    animation-duration: 5.3s;
    animation-iteration-count: infinite;
    animation-direction: alternate;
    animation-timing-function: cubic-bezier(0.25, 0.1, 0.25, 1);
  }

  .win-first-side {
    background: linear-gradient(
      124deg,
      #ff2400,
      #e81d1d,
      #e8b71d,
      #e3e81d,
      #1de840,
      #1ddde8,
      #2b1de8,
      #dd00f3,
      #dd00f3
    );
    background-size: 1800% 1800%;
    animation: rainbow 10s ease infinite;
  }

  .second-side {
    @apply absolute w-full h-full flex flex-col items-center justify-center rounded;
    transform: rotateX(180deg);
  }

  @keyframes rainbow {
    0% {
      background-position: 0% 82%;
    }
    50% {
      background-position: 100% 19%;
    }
    100% {
      background-position: 0% 82%;
    }
  }

  @keyframes win {
    from {
      transform: scale(1);
    }

    to {
      transform: rotateX(180deg);
    }
  }
</style>
