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
  use:enhance={({}) => {
    loading = true;
    return async ({ result }) => {
      messageComponent.showMessage(result);
      loading = false;
    };
  }}
  class="space-y-5 -my-5"
  enctype="multipart/form-data"
>
  <hgroup>
    <h1>Login</h1>
  </hgroup>

  <div class="flex justify-between items-center">
    <label for="username" class="mr-3">Benutzername</label>
    <input type="username" id="username" name="username" required />
  </div>

  <button
    type="submit"
    class="mt-5 group bg-tvblue text-white py-2 px-3 hover:bg-tvbluelight rounded-md"
  >
    <p class="group-hover:scale-105">Login</p></button
  >
</form>
