<script lang="ts">
  import { onMount } from "svelte";
  import { enhance } from "$app/forms";
  import type { PageData } from "../$types";

  export let data: PageData & { users: any };
  $: ({ users, tables, userId } = data);

  let updateTableForm: HTMLFormElement;
  let updateMenueForm: HTMLFormElement;
  let updateDrinkForm: HTMLFormElement;
  let updateUserForm: HTMLFormElement;
</script>

<h1>Administration</h1>

<div>
  <h2>Menu erfassen</h2>

  <form action="?/createMenu" method="POST" class="w-80">
    <input type="text" name="name" placeholder="Menuname" required />
    <input type="number" name="price" placeholder="Preis" required />

    <button
      class="bg-tvblue hover:bg-tvbluelight text-white group rounded-md py-2 px-3"
      type="submit"
    >
      <p class="group-hover:scale-105">Speichern</p>
    </button>
  </form>
</div>

<div>
  <h2>Getränk erfassen</h2>

  <form action="?/createMenu" method="POST" class="w-80">
    <input type="text" name="name" placeholder="Getränkename" required />
    <input type="number" name="price" id="price" placeholder="Preis" required />

    <button
      class="bg-tvblue hover:bg-tvbluelight text-white group rounded-md py-2 px-3"
      type="submit"
    >
      <p class="group-hover:scale-105">Speichern</p>
    </button>
  </form>
</div>

<div>
  <h2>Tisch erfassen</h2>

  <form action="?/createTable" method="POST" use:enhance>
    <input
      type="text"
      name="name"
      placeholder="Namen für Tisch eingeben"
      required
    />

    <button
      class="bg-tvblue hover:bg-tvbluelight text-white group rounded-md py-2 px-3"
      type="submit"
    >
      <p class="group-hover:scale-105">Speichern</p>
    </button>
  </form>

  <ul class="space-y-2">
    {#each tables ?? [] as table}
      <li class="flex space-x-2">
        <form
          action="?/updateTable"
          method="POST"
          use:enhance
          bind:this={updateTableForm}
        >
          <input hidden type="Number" bind:value={table.id} name="id" />
          <input
            type="text"
            bind:value={table.name}
            name="name"
            on:change={() => updateTableForm.requestSubmit()}
          />
        </form>

        <form action="?/deleteTable" method="POST" use:enhance>
          <input hidden type="Number" bind:value={table.id} name="id" />
          <button
            class="group py-2 px-3 rounded-md text-white bg-red-500 hover:bg-red-600"
            type="submit"
          >
            <p class="group-hover:animate-wiggle">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                class="group-hover:scale-105 fill-white"
              >
                <path
                  d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"
                />
              </svg>
            </p>
          </button>
        </form>
      </li>
    {/each}
  </ul>
</div>

<div>
  <h2>Benutzer verwalten</h2>

  <ul class="space-y-2">
    {#each users ?? [] as user}
      <li class="flex space-x-2">
        {#if user.id != userId}
          <form
            action="?/updateUser"
            method="POST"
            use:enhance
            bind:this={updateUserForm}
          >
            <p>{user.username}</p>
            <p>{user.isAdmin}</p>
            <input hidden type="text" bind:value={user.id} name="id" />
            <input
              type="checkbox"
              name="isAdmin"
              bind:checked={user.isAdmin}
              bind:value={user.isAdmin}
              on:change={() => {
                console.log(user.isAdmin);
                updateUserForm.requestSubmit();
              }}
            />
          </form>

          <form action="?/deleteTable" method="POST" use:enhance>
            <input hidden type="text" bind:value={user.id} name="id" />
            <button
              class="group py-2 px-3 rounded-md text-white bg-red-500 hover:bg-red-600"
              type="submit"
            >
              <p class="group-hover:animate-wiggle">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  class="group-hover:scale-105 fill-white"
                >
                  <path
                    d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"
                  />
                </svg>
              </p>
            </button>
          </form>
        {:else}
          {user.username}
        {/if}
      </li>
    {/each}
  </ul>
</div>

<style>
  input[type="file"],
  input[type="text"],
  input[type="email"],
  textarea {
    @apply w-full;
  }
</style>
