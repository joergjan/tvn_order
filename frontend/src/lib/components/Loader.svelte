<script lang="ts">
  export let loading: boolean;
</script>

{#if loading}
  <div
    class="fixed top-0 bottom-0 right-0 left-0 bg-black bg-opacity-60 w-full h-full flex items-center justify-center z-100"
  >
    <div class="spinner"></div>
  </div>
{/if}

<style>
  .spinner {
    border: 4px solid rgba(0, 0, 0, 0.1);
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border-left-color: white;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>
