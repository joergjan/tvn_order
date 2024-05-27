<script lang="ts">
  import { onMount } from "svelte";
  import { enhance } from "$app/forms";
  import type { PageData } from "../$types";

  export let data: PageData & { users: any };
  $: ({ users, tables, userId, drinks, menues } = data);

  let updateTableForm: HTMLFormElement;
  let updateMenuForm: HTMLFormElement;
  let updateDrinkForm: HTMLFormElement;
  let updateUserForm: HTMLFormElement;
  let updateStatusForm: HTMLFormElement;
</script>

<h1>Administration</h1>

<div>
  <h2>Menu erfassen</h2>

  <form action="?/createMenu" class="flex space-x-2" method="POST">
    <div class="block">
      <label for="name">Neues Menu</label>

      <input type="text" name="name" id="name" autocomplete="off" />
    </div>
    <div class="block">
      <label for="price">Preis</label>

      <input
        type="number"
        step="0.05"
        autocomplete="off"
        name="price"
        id="price"
      />
    </div>

    <div class="place-content-end">
      <button
        class="bg-tvblue hover:bg-tvbluelight text-white group rounded-md py-2 px-3"
        type="submit"
      >
        <p class="group-hover:scale-105">Speichern</p>
      </button>
    </div>
  </form>

  <ul class="space-y-2 pt-4">
    {#each menues ?? [] as menu}
      <li class="flex space-x-2 -ml-2">
        <form
          action="?/updateMenu"
          method="POST"
          class="flex space-x-2"
          use:enhance
          bind:this={updateMenuForm}
        >
          <div>
            <input
              hidden
              type="Number"
              bind:value={menu.id}
              name="id"
              autocomplete="off"
            />
          </div>
          <div class="block">
            <label for="name">Getränk</label>

            <input
              type="text"
              bind:value={menu.name}
              name="name"
              autocomplete="off"
              id="name"
              on:change={() => updateMenuForm.requestSubmit()}
            />
          </div>
          <div class="block">
            <label for="price">Preis</label>

            <input
              type="number"
              step="0.05"
              bind:value={menu.price}
              name="price"
              autocomplete="off"
              id="price"
              on:change={() => updateMenuForm.requestSubmit()}
            />
          </div>
        </form>

        <form
          action="?/deleteMenu"
          class="place-content-end"
          method="POST"
          use:enhance
        >
          <input
            hidden
            type="Number"
            bind:value={menu.id}
            name="id"
            autocomplete="off"
          />
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

<div class="pt-16">
  <h2>Getränk erfassen</h2>

  <form action="?/createDrink" class="flex space-x-2" method="POST">
    <div class="block">
      <label for="name">Neues Getränk</label>

      <input type="text" name="name" id="name" autocomplete="off" />
    </div>
    <div class="block">
      <label for="price">Preis</label>

      <input type="number" step="0.05" name="price" autocomplete="off" />
    </div>

    <div class="place-content-end">
      <button
        class="bg-tvblue hover:bg-tvbluelight text-white group rounded-md py-2 px-3"
        type="submit"
      >
        <p class="group-hover:scale-105">Speichern</p>
      </button>
    </div>
  </form>

  <ul class="space-y-2 pt-4">
    {#each drinks ?? [] as drink}
      <li class="flex space-x-2 -ml-2">
        <form
          action="?/updateDrink"
          method="POST"
          class="flex space-x-2"
          use:enhance
          bind:this={updateDrinkForm}
        >
          <div>
            <input
              hidden
              type="Number"
              bind:value={drink.id}
              name="id"
              autocomplete="off"
            />
          </div>
          <div class="block">
            <label for="name">Getränk</label>

            <input
              type="text"
              bind:value={drink.name}
              name="name"
              autocomplete="off"
              on:change={() => updateDrinkForm.requestSubmit()}
            />
          </div>
          <div class="block">
            <label for="price">Preis</label>

            <input
              type="number"
              autocomplete="off"
              step="0.05"
              bind:value={drink.price}
              name="price"
              on:change={() => updateDrinkForm.requestSubmit()}
            />
          </div>
        </form>

        <form
          action="?/deleteDrink"
          class="place-content-end"
          method="POST"
          use:enhance
        >
          <input
            hidden
            type="Number"
            bind:value={drink.id}
            name="id"
            autocomplete="off"
          />
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

<div class="pt-16">
  <h2>Tisch erfassen</h2>

  <form action="?/createTable" class="space-y-2" method="POST" use:enhance>
    <label for="name">Tischname</label>
    <input
      type="text"
      name="name"
      autocomplete="off"
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

  <ul class="space-y-2 pt-4">
    {#each tables ?? [] as table}
      <li class="flex space-x-2">
        <form
          action="?/updateTable"
          method="POST"
          use:enhance
          bind:this={updateTableForm}
        >
          <input hidden type="Number" bind:value={table.id} name="id" />
          <label for="name">Tischname</label>
          <input
            autocomplete="off"
            type="text"
            bind:value={table.name}
            name="name"
            on:change={() => updateTableForm.requestSubmit()}
          />
        </form>

        <form
          action="?/deleteTable"
          method="POST"
          use:enhance
          class="place-content-end"
        >
          <input
            hidden
            type="Number"
            autocomplete="off"
            bind:value={table.id}
            name="id"
          />
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

<div class="pt-16">
  <h2>Benutzer verwalten</h2>

  <ul class="space-y-2">
    {#each users ?? [] as user}
      <li class="flex space-x-2">
        <form
          action="?/updateUser"
          method="POST"
          use:enhance
          bind:this={updateUserForm}
        >
          <p>{user.username}</p>
          <p>{user.isAdmin}</p>
          <input
            hidden
            type="text"
            autocomplete="off"
            bind:value={user.id}
            name="id"
          />
          <input
            type="checkbox"
            name="isAdmin"
            autocomplete="off"
            bind:checked={user.isAdmin}
            bind:value={user.isAdmin}
            on:change={() => {
              console.log(user.isAdmin);
              updateUserForm.requestSubmit();
            }}
          />
        </form>

        <form action="?/deleteUser" method="POST" use:enhance>
          <input
            hidden
            type="text"
            bind:value={user.id}
            name="id"
            autocomplete="off"
          />
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

<style>
  input[type="text"],
  input[type="number"],
  textarea {
    @apply w-full;
  }
</style>
