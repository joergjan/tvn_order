<script lang="ts">
  import { onMount } from "svelte";
  import { enhance } from "$app/forms";
  import type { PageData } from "../$types";
  import Actions from "../Actions.svelte";
  import Message from "$lib/components/Message.svelte";
  import Loader from "$lib/components/Loader.svelte";
  import { invalidateAll } from "$app/navigation";

  export let data: PageData & { users: any };
  $: ({ users, tables, userId, drinks, menus } = data);

  let selectedMenuItem: "Menu" | "Getränke" | "Tische" | "Benutzer" = "Menu";
  let messageComponent;

  let updateTableForm: HTMLFormElement[] = [];
  let updateMenuForm: HTMLFormElement[] = [];
  let updateDrinkForm: HTMLFormElement[] = [];
  let updateUserForm: HTMLFormElement[] = [];

  let loading = false;
</script>

<Message bind:this={messageComponent} />

<Loader {loading} />

<h1>Administration</h1>

<ul class="flex justify-between space-x-1 border-gray-300 border-b">
  <li class="w-full">
    <button
      on:click={() => {
        selectedMenuItem = "Menu";
      }}
      class="{selectedMenuItem === 'Menu'
        ? 'bg-tvblue  text-white border-t border-r border-l border-transparent'
        : 'border-t border-l border-r border-gray-300'} group md:rounded-t-xl rounded-t-lg w-full py-2"
    >
      Menu
    </button>
  </li>
  <li class="w-full">
    <button
      on:click={() => {
        selectedMenuItem = "Getränke";
      }}
      class="{selectedMenuItem === 'Getränke'
        ? 'bg-tvblue  text-white border-t border-r border-l border-transparent'
        : 'border-t border-l border-r border-gray-300'} group md:rounded-t-xl rounded-t-lg w-full py-2"
    >
      Getränke
    </button>
  </li>
  <li class="w-full">
    <button
      on:click={() => {
        selectedMenuItem = "Tische";
      }}
      class="{selectedMenuItem === 'Tische'
        ? 'bg-tvblue  text-white border-t border-r border-l border-transparent'
        : 'border-t border-l border-r border-gray-300'} group md:rounded-t-xl rounded-t-lg w-full py-2"
    >
      Tische
    </button>
  </li>
  <li class="w-full">
    <button
      on:click={() => {
        selectedMenuItem = "Benutzer";
      }}
      class="{selectedMenuItem === 'Benutzer'
        ? 'bg-tvblue  text-white border-t border-r border-l border-transparent'
        : 'border-t border-l border-r border-gray-300'} group md:rounded-t-xl rounded-t-lg w-full py-2"
    >
      Benutzer
    </button>
  </li>
</ul>

<div class="mt-7"></div>
{#if selectedMenuItem === "Menu"}
  <div>
    <h2>Menu erfassen</h2>

    <form
      action="?/createMenu"
      class="flex space-x-2"
      method="POST"
      use:enhance={({}) => {
        loading = true;

        return async ({ result, update }) => {
          messageComponent.showMessage(result);
          loading = false;
          update();
        };
      }}
    >
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
      {#each menus ?? [] as menu, i}
        <li class="flex space-x-2 -ml-2">
          <form
            action="?/updateMenu"
            method="POST"
            class="flex space-x-2"
            use:enhance={({}) => {
              loading = true;

              return async ({ result }) => {
                messageComponent.showMessage(result);
                loading = false;
              };
            }}
            bind:this={updateMenuForm[i]}
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
              <label for="name">Menu</label>

              <input
                type="text"
                bind:value={menu.name}
                name="name"
                autocomplete="off"
                id="name"
                on:change={() => updateMenuForm[i].requestSubmit()}
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
                on:change={() => updateMenuForm[i].requestSubmit()}
              />
            </div>
          </form>

          <form
            action="?/deleteMenu"
            class="place-content-end"
            method="POST"
            use:enhance={({}) => {
              loading = true;

              return async ({ result }) => {
                messageComponent.showMessage(result);
                loading = false;
              };
            }}
          >
            <input
              hidden
              type="Number"
              bind:value={menu.id}
              name="id"
              autocomplete="off"
            />
            <button
              aria-label="delete-menu"
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
{:else if selectedMenuItem === "Getränke"}
  <div>
    <h2>Getränk erfassen</h2>

    <form
      action="?/createDrink"
      class="flex space-x-2"
      method="POST"
      use:enhance={({}) => {
        loading = true;

        return async ({ result, update }) => {
          messageComponent.showMessage(result);
          loading = false;
          update();
        };
      }}
    >
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
      {#each drinks ?? [] as drink, i}
        <li class="flex space-x-2 -ml-2">
          <form
            action="?/updateDrink"
            method="POST"
            class="flex space-x-2"
            use:enhance={({}) => {
              loading = true;

              return async ({ result }) => {
                messageComponent.showMessage(result);
                loading = false;
              };
            }}
            bind:this={updateDrinkForm[i]}
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
                id="name"
                on:change={() => updateDrinkForm[i].requestSubmit()}
              />
            </div>
            <div class="block">
              <label for="price">Preis</label>

              <input
                type="number"
                step="0.05"
                bind:value={drink.price}
                name="price"
                autocomplete="off"
                id="price"
                on:change={() => updateDrinkForm[i].requestSubmit()}
              />
            </div>
          </form>

          <form
            action="?/deleteDrink"
            class="place-content-end"
            method="POST"
            use:enhance={({}) => {
              loading = true;

              return async ({ result }) => {
                messageComponent.showMessage(result);
                loading = false;
              };
            }}
          >
            <input
              hidden
              type="Number"
              bind:value={drink.id}
              name="id"
              autocomplete="off"
            />
            <button
              aria-label="delete-drink"
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
{:else if selectedMenuItem === "Tische"}
  <div>
    <h2>Tisch erfassen</h2>

    <form
      action="?/createTable"
      class="space-y-2"
      method="POST"
      use:enhance={({}) => {
        loading = true;

        return async ({ result, update }) => {
          messageComponent.showMessage(result);
          loading = false;
          update();
        };
      }}
    >
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
      {#each tables ?? [] as table, i}
        <li class="flex space-x-2">
          <form
            action="?/updateTable"
            method="POST"
            use:enhance={({}) => {
              loading = true;

              return async ({ result }) => {
                messageComponent.showMessage(result);
                loading = false;
              };
            }}
            bind:this={updateTableForm[i]}
          >
            <input hidden type="Number" bind:value={table.id} name="id" />
            <label for="name">Tischname</label>
            <input
              autocomplete="off"
              type="text"
              bind:value={table.name}
              name="name"
              on:change={() => updateTableForm[i].requestSubmit()}
            />
          </form>

          <form
            action="?/deleteTable"
            method="POST"
            use:enhance={({}) => {
              loading = true;

              return async ({ result }) => {
                messageComponent.showMessage(result);
                loading = false;
              };
            }}
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
              aria-label="delete-table"
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
{:else if selectedMenuItem === "Benutzer"}
  <div>
    <h2>Benutzer verwalten</h2>

    <ul class="space-y-2 md:max-w-96">
      <li class="grid grid-cols-3">
        <p>Name</p>
        <p class="flex justify-center">Admin</p>
        <p class="justify-end flex">löschen</p>
      </li>
      {#each users ?? [] as user, i}
        <li class="grid grid-cols-3">
          <form
            action="?/updateUser"
            method="POST"
            use:enhance={({}) => {
              loading = true;

              return async ({ result }) => {
                messageComponent.showMessage(result);
                loading = false;
              };
            }}
            class="col-span-2 grid grid-cols-2"
            bind:this={updateUserForm[i]}
          >
            <p class="flex items-center">{user.username}</p>

            <input
              hidden
              type="text"
              autocomplete="off"
              bind:value={user.id}
              name="id"
            />
            <div class="flex justify-center items-center">
              <input
                class="h-5 w-5"
                type="checkbox"
                name="isAdmin"
                autocomplete="off"
                bind:checked={user.isAdmin}
                on:change={() => {
                  updateUserForm[i].requestSubmit();
                }}
              />
            </div>
          </form>
          <div class="justify-end flex">
            <form
              action="?/deleteUser"
              method="POST"
              use:enhance={({}) => {
                loading = true;

                return async ({ result }) => {
                  messageComponent.showMessage(result);
                  loading = false;
                };
              }}
            >
              <input
                hidden
                type="text"
                bind:value={user.id}
                name="id"
                autocomplete="off"
              />
              <button
                aria-label="delete-user"
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
          </div>
        </li>
      {/each}
    </ul>
  </div>
{/if}

{#if loading}
  <div
    class="fixed top-0 bottom-0 right-0 left-0 bg-black bg-opacity-60 w-full h-full flex items-center justify-center z-50"
  >
    <div class="spinner"></div>
  </div>
{/if}

<style>
  input[type="text"],
  input[type="number"],
  textarea {
    @apply w-full;
  }

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
