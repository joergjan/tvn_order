<script lang="ts">
  import { enhance } from "$app/forms";
</script>

<svelte:head>
  <meta name="robots" content="noindex, nofollow" />
</svelte:head>

<form method="POST" use:enhance class="space-y-5 -my-5">
  <hgroup>
    <h1>Login</h1>
  </hgroup>

  <div class="flex justify-between items-center">
    <label for="username" class="mr-3">Mail</label>
    <input class="w-56" type="mail" id="username" name="username" required />
  </div>

  <div class="flex justify-between items-center">
    <label for="password" class="mr-3">Password</label>
    <input
      class="w-56"
      type="password"
      id="password"
      name="password"
      required
    />
  </div>

  <button
    type="submit"
    class="mt-5 group bg-tvblue text-white py-2 px-3 hover:bg-tvbluelight rounded-md"
  >
    <p class="group-hover:scale-105">Login</p></button
  >
</form>
