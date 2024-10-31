<script lang="ts">
  import { enhance } from "$app/forms";
</script>

<svelte:head>
  <meta name="robots" content="noindex, nofollow" />
</svelte:head>

<form
  method="POST"
  use:enhance
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

  <div class="flex justify-between items-center">
    <label for="password" class="mr-3">Password</label>
    <input type="password" id="password" name="password" required />
  </div>

  <button
    type="submit"
    class="mt-5 group bg-tvblue text-white py-2 px-3 hover:bg-tvbluelight rounded-md"
  >
    <p class="group-hover:scale-105">Login</p></button
  >
</form>

<style>
  input {
    @apply h-10 w-56;
  }
</style>
