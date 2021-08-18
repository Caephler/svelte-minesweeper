<script lang="ts">
  import { cubicOut, elasticOut } from "svelte/easing";
  import { tweened } from "svelte/motion";
  export let winState: "win" | "lose" | "progress";
  export let reset: () => void;

  const spin = (node: Node, { duration }: { duration: number }) => {
    return {
      duration,
      css: (t: number) => {
        const eased = elasticOut(t);

        return `
          transform: scale(${eased}) rotate(${eased}turn);
        `;
      },
    };
  };

  const spinOut = (node: Node, { duration }: { duration: number }) => {
    return {
      duration,
      css: (t: number) => {
        const eased = cubicOut(t);

        return `
          transform: scale(${eased}) rotate(${eased}turn);
        `;
      },
    };
  };
</script>

{#if winState === "win" || winState === "lose"}
  <div
    class="absolute bg-white rounded-lg p-4 shadow mt-36 flex flex-col justify-center items-center"
    in:spin={{ duration: 2000 }}
    out:spinOut={{ duration: 1000 }}
  >
    <p class="text-2xl font-bold">
      {winState === "win" ? "You won!" : "Game Over"}
    </p>
    <div class="mt-4">
      <button on:click={reset}>Reset</button>
    </div>
  </div>
{/if}

<style lang="postcss">
  button {
    @apply bg-gray-100 rounded-lg px-4 py-2;
    @apply hover:bg-gray-200;
  }
</style>
