<script>
  import Fa from "svelte-fa/src/fa.svelte";
  import { faGithub } from "@fortawesome/free-brands-svg-icons";
</script>

<div class="footer">
  <p class="mb-4">Created by Gabriel with Svelte</p>
  <a href="https://github.com/Caephler/svelte-minesweeper">
    <Fa icon={faGithub} size="2x" />
  </a>
</div>

<style lang="postcss">
  .footer {
    @apply text-center text-gray-500 flex flex-col justify-center items-center;
  }
</style>
