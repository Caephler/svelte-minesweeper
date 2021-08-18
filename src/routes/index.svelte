<script>
  import Footer from "$lib/Footer.svelte";
  import MineSweeperBoard from "$lib/MineSweeperBoard.svelte";
</script>

<svelte:head>
  <title>Minesweeper</title>
</svelte:head>

<div class="container mx-auto">
  <MineSweeperBoard />
  <Footer />
</div>
