<script lang="ts">
  import { enhance } from "$app/forms";
  import Message from "$lib/components/Message.svelte";
  import Loader from "$lib/components/Loader.svelte";

  let messageComponent;
  let loading: boolean = false;
</script>

<svelte:head>
  <meta name="robots" content="noindex, nofollow" />
</svelte:head>

<Message bind:this={messageComponent} />

<Loader {loading} />

<form
  method="POST"
  class="space-y-5 -my-5"
  use:enhance={({}) => {
    loading = true;
    return async ({ result }) => {
      if (result.type === "success") {
        window.location.href = "/";
      }
      loading = false;
    };
  }}
>
  <h2>Registrieren</h2>

  <div class="flex justify-between items-center">
    <label for="username">Benutzername</label>
    <input type="text" id="username" name="username" required />
  </div>

  <button
    type="submit"
    class="bg-tvblue hover:bg-tvbluelight px-3 py-2 rounded-md text-white group"
  >
    <p class="group group-hover:scale-105">Registrieren</p>
  </button>
</form>

<div class="mt-10 mb-5">
  <p>Bereits registriert?</p>
</div>

<button
  class="bg-tvblue hover:bg-tvbluelight px-3 py-2 rounded-md text-white group"
  on:click={() => {
    window.location.href = "/login";
  }}
>
  <p class="group group-hover:scale-105">Login</p>
</button>
