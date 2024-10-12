<svelte:head>
  <meta name="robots" content="noindex, nofollow" />
</svelte:head>

<form method="POST" class="space-y-5 -my-5">
  <h2>Register</h2>

  <div class="flex justify-between items-center">
    <label for="username">Benutzername</label>
    <input type="text" id="username" name="username" required />
  </div>
  <div class="flex justify-between items-center">
    <label for="password">Password</label>
    <input type="password" id="password" name="password" required />
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
