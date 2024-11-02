<script lang="ts">
  import { onMount } from "svelte";
  import { enhance } from "$app/forms";
  import type { PageData } from "./$types";
  import { fade, fly } from "svelte/transition";
  import { cubicOut, cubicIn, cubicInOut } from "svelte/easing";
  import { invalidateAll } from "$app/navigation";
  import type { ActionResult } from "@sveltejs/kit";

  export let data: PageData;
  $: ({ order, tables, menus, drinks } = data);

  let messageId = 0;

  interface Message {
    id: number;
    type: "success" | "error";
    text: string;
    flying: boolean;
  }

  let loading: boolean = false;
  let drinkCounter: number[] = Array(drinks?.length).fill(0);
  let menuCounter: number[] = Array(menus?.length).fill(0);
  let tableForm: HTMLFormElement;
  let nameForm: HTMLFormElement;
  let menuForm: HTMLFormElement;
  let drinkForm: HTMLFormElement;
  let message: string = "";
  let messages: Message[] = [];

  $: menus && calculateMenuCounter();
  $: drinks && calculateDrinkCounter();

  function calculateMenuCounter() {
    if (order && menus) {
      for (var i = 0; i < order.orderedMenus.menuOrder.length; i++) {
        for (var j = 0; j < menus.length; j++) {
          if (menus[j].id == order.orderedMenus.menuOrder[i].menu.id) {
            menuCounter[j] = order.orderedMenus.menuOrder[i].amount;
          }
        }
      }
    }
  }

  function calculateDrinkCounter() {
    if (order && drinks) {
      for (var i = 0; i < order.orderedDrinks.drinkOrder.length; i++) {
        for (var j = 0; j < drinks.length; j++) {
          if (drinks[j].id == order.orderedDrinks.drinkOrder[i].drink.id) {
            drinkCounter[j] = order.orderedDrinks.drinkOrder[i].amount;
          }
        }
      }
    }
  }

  function increment(index: number, menu: boolean) {
    if (menu) {
      menuCounter[index]++;
    } else {
      drinkCounter[index]++;
    }
  }

  function decrement(index: number, menu: boolean) {
    if (menu) {
      if (menuCounter[index] > 0) {
        menuCounter[index]--;
      }
    } else {
      if (drinkCounter[index] > 0) {
        drinkCounter[index]--;
      }
    }
  }

  function showMessage(result: ActionResult, form: string) {
    loading = true;

    const messageText =
      form === "table"
        ? "Der Tisch wurde erfolgreich aktualisiert"
        : form === "name"
          ? "Der Name wurde erfolgreich aktualisiert"
          : form === "menu"
            ? "Die Menus wurden erfolgreich aktualisiert"
            : form === "drink"
              ? "Die Getränke wurden erfolgreich aktualisiert"
              : "Unbekannt";

    let newMessage: Message = {
      id: messageId++,
      type: result.type === "success" ? "success" : "error",
      text: messageText,
      flying: false,
    };
    console.log(messageId);
    messages.push(newMessage);
    messages = messages;

    // Remove the message
    setTimeout(() => {
      messages = messages.filter((m) => m.id !== newMessage.id); // Use the ID to filter
    }, 3500); // Time to display the message

    invalidateAll();
    loading = false;
  }
</script>

{#if order && menus && drinks}
  <h2>Bestellung Nr. {order.id} bearbeiten</h2>
  <p class="mb-3">Bestellung erstellt von {order.user.username}</p>

  <div class="text-xl">
    <div class="space-y-3">
      <form
        action="?/updateTable"
        method="POST"
        bind:this={tableForm}
        use:enhance={({}) => {
          return async ({ result }) => {
            showMessage(result, "table");
          };
        }}
      >
        <div class="flex items-center">
          <div class="w-24">
            <label for="table" class="">Tisch</label>
          </div>

          <select
            name="table"
            required
            value={order?.tableId}
            on:change={() => tableForm.requestSubmit()}
          >
            {#each tables ?? [] as table}
              <option value={table.id}>{table.name}</option>
            {/each}
          </select>
        </div>
      </form>

      <form
        action="?/updateName"
        method="POST"
        bind:this={nameForm}
        use:enhance={({}) => {
          return async ({ result }) => {
            showMessage(result, "name");
          };
        }}
      >
        <div class="flex items-center">
          <div class="w-24">
            <label for="name">Name</label>
          </div>
          <input
            type="text"
            id="name"
            name="name"
            bind:value={order.name}
            on:change={() => nameForm.requestSubmit()}
          />
        </div>
      </form>
    </div>
    <div class="grid md:grid-cols-2">
      <div class="mt-8">
        <h3>Menus</h3>

        <form
          action="?/updateMenus"
          method="POST"
          bind:this={menuForm}
          use:enhance={({}) => {
            return async ({ result }) => {
              showMessage(result, "menu");
            };
          }}
        >
          <ul class="space-y-5">
            {#each menus ?? [] as menu, i}
              <li class="flex space-x-3 justify-between md:justify-normal">
                <input type="number" name="id" bind:value={menu.id} hidden />
                <div class="flex">
                  <p class="w-32 place-content-center">{menu.name}</p>
                  <p class="w-10 place-content-center">{menu.price}</p>
                </div>

                <div class="grid grid-cols-3 items-center content-center">
                  <div class="items-center justify-center flex">
                    <button
                      aria-label="menu-amount-decrease"
                      on:click={() => {
                        decrement(i, true);
                      }}
                      class="p-1 border rounded-full {menuCounter[i] > 0
                        ? 'hover:bg-gray-200'
                        : ''} transition-all duration-200"
                      disabled={menuCounter[i] === 0}
                      type="button"
                      on:click={() => {
                        console.log("button was called");
                        menuForm.requestSubmit();
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="35px"
                        viewBox="0 -960 960 960"
                        width="35px"
                        class={menuCounter[i] === 0
                          ? "fill-gray-200"
                          : "fill-black"}
                      >
                        <path d="M200-440v-80h560v80H200Z" />
                      </svg>
                    </button>
                  </div>
                  <div class="items-center justify-center flex">
                    <p>{menuCounter[i]}</p>

                    <input
                      type="number"
                      hidden
                      min="0"
                      bind:value={menuCounter[i]}
                      name="menuCount{menu.id}"
                    />
                  </div>
                  <div class="items-center justify-center flex">
                    <button
                      aria-label="menu-amount-increase"
                      class="p-1 border rounded-full {menuCounter[i] > 0
                        ? 'hover:bg-gray-200'
                        : ''} transition-all duration-200"
                      on:click={() => {
                        increment(i, true);
                      }}
                      type="button"
                      on:click={() => {
                        menuForm.requestSubmit();
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="35px"
                        viewBox="0 -960 960 960"
                        width="35px"
                        class="fill-black"
                      >
                        <path
                          d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </li>
            {/each}
          </ul>
        </form>
      </div>

      <div class="mt-8">
        <h3>Getränke</h3>

        <form
          action="?/updateDrinks"
          method="POST"
          bind:this={drinkForm}
          use:enhance={({}) => {
            return async ({ result }) => {
              showMessage(result, "drink");
            };
          }}
        >
          <ul class="space-y-5">
            {#each drinks ?? [] as drink, i}
              <li class="flex space-x-3 justify-between md:justify-normal">
                <input type="number" name="id" bind:value={drink.id} hidden />
                <div class="flex">
                  <p class="w-32 place-content-center">{drink.name}</p>
                  <p class="w-10 place-content-center">{drink.price}</p>
                </div>
                <div class="grid grid-cols-3 items-center content-center">
                  <div class="items-center justify-center flex">
                    <button
                      aria-label="drink-amount-decrease"
                      on:click={() => {
                        decrement(i, false);
                      }}
                      class="p-1 border rounded-full {drinkCounter[i] > 0
                        ? 'hover:bg-gray-200'
                        : ''} transition-all duration-200"
                      disabled={drinkCounter[i] === 0}
                      type="button"
                      on:click={() => {
                        drinkForm.requestSubmit();
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="35px"
                        viewBox="0 -960 960 960"
                        width="35px"
                        class={drinkCounter[i] === 0
                          ? "fill-gray-200"
                          : "fill-black"}
                      >
                        <path d="M200-440v-80h560v80H200Z" />
                      </svg>
                    </button>
                  </div>
                  <div class="items-center justify-center flex">
                    <p>{drinkCounter[i]}</p>

                    <input
                      type="number"
                      hidden
                      min="0"
                      bind:value={drinkCounter[i]}
                      name="drinkCount{drink.id}"
                    />
                  </div>
                  <div class="items-center justify-center flex">
                    <button
                      aria-label="drink-amount-increase"
                      on:click={() => {
                        increment(i, false);
                      }}
                      class="p-1 border rounded-full {drinkCounter[i] > 0
                        ? 'hover:bg-gray-200'
                        : ''} transition-all duration-200"
                      type="button"
                      on:click={() => {
                        drinkForm.requestSubmit();
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="35px"
                        viewBox="0 -960 960 960"
                        width="35px"
                        class="fill-black"
                      >
                        <path
                          d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </li>
            {/each}
          </ul>
        </form>
      </div>
    </div>
  </div>
{/if}

<div
  aria-live="assertive"
  class="pointer-events-none fixed inset-0 z-50 flex items-end px-4 py-6 sm:items-start sm:p-6 mt-16"
>
  <div
    class="flex w-full flex-col items-center space-y-4 sm:items-end message-transition duration-300 transition-transform"
  >
    {#each messages as { id, type, text } (id)}
      <div
        class="pointer-events-auto w-full max-w-sm overflow-hidden rounded-md {type ===
        'success'
          ? 'bg-green-500'
          : 'bg-red-500'} shadow-lg ease-in-out"
        in:fly={{ y: 250, duration: 300, easing: cubicOut }}
        out:fade={{ duration: 300, easing: cubicOut }}
      >
        <div class="p-4">
          <div class="flex items-start">
            <div class="flex-shrink-0">
              {#if type === "success"}
                <svg
                  class="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              {:else}
                <svg
                  class="h-6 w-6 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#e8eaed"
                >
                  <path
                    d="M480-280q17 0 28.5-11.5T520-320q0-17-11.5-28.5T480-360q-17 0-28.5 11.5T440-320q0 17 11.5 28.5T480-280Zm-40-160h80v-240h-80v240Zm40 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"
                  />
                </svg>
              {/if}
            </div>
            <div class="ml-3 w-0 flex-1 pt-0.5">
              <p class="text-sm font-medium text-white">
                {type === "success" ? text : "Ein Fehler ist aufgetreten"}
              </p>
            </div>
          </div>
        </div>
      </div>
    {/each}
  </div>
</div>

<div class="mt-10"></div>

{#if loading}
  <div
    class="fixed top-0 bottom-0 right-0 left-0 bg-black bg-opacity-60 w-full h-full flex items-center justify-center z-50"
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
