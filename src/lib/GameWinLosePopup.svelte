<script lang="ts">
  import { faBomb } from "@fortawesome/free-solid-svg-icons";
  import Fa from "svelte-fa/src/fa.svelte";
  import { cubicOut, elasticOut } from "svelte/easing";
  export let winState: "win" | "lose" | "progress";
  export let reset: () => void;

  const spin = (node: Node, { duration }: { duration: number }) => {
    return {
      duration,
      css: (t: number) => {
        const eased = elasticOut(t);

        return `
          transform: scale(${eased}) rotate(${eased}turn) translate(-50%, -50%);
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
          transform: scale(${eased}) rotate(${eased}turn) translate(-50%, -50%);
        `;
      },
    };
  };
</script>

{#if winState === "win" || winState === "lose"}
  <div
    class="modal"
    in:spin={{ duration: 2000 }}
    out:spinOut={{ duration: 1000 }}
  >
    <div class="text-2xl font-bold flex items-center">
      {#if winState === "win"}
        <p>You won!</p>
      {:else if winState === "lose"}
        <Fa icon={faBomb} class="text-red-500" />
        <p class="mx-4">Game Over!</p>
        <Fa icon={faBomb} class="text-red-500" />
      {/if}
    </div>
    <div class="mt-4">
      <button on:click={reset}>Reset</button>
    </div>
  </div>
{/if}

<style lang="postcss">
  .modal {
    @apply absolute bg-white rounded-lg p-4 shadow flex flex-col justify-center items-center;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    transform-origin: 0% 0%;
  }
  button {
    @apply bg-gradient-to-br from-yellow-400 to-red-600 text-white rounded-lg px-4 py-2;
    @apply hover:from-yellow-200 hover:to-red-400;
  }
</style>
