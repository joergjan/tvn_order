<script lang="ts">
  import { onMount } from "svelte";
  import { enhance } from "$app/forms";
  import type { PageData } from "./$types";
  import { fade, fly } from "svelte/transition";
  import { cubicOut } from "svelte/easing";
  import Actions from "./Actions.svelte";
  import { invalidateAll } from "$app/navigation";
  import Order from "$lib/components/Order.svelte";
  import { redirect } from "@sveltejs/kit";
  import { browser } from "$app/environment";

  export let data: PageData & { users: any };
  $: ({ tables, drinks, menus } = data);

  let loading = false;
  let showError = false;
  let showSuccess = false;
  let order: Order;
  let showOrder = false;
  let tableId: number = 0;
  let intervalId;
  let totalAmount: number = 0;

  $: menuCounter = Array(menus?.length).fill(0);
  $: drinkCounter = Array(drinks?.length).fill(0);

  $: {
    if (tableId === 0 && browser) {
      intervalId = setInterval(getTableId, 500);
    }
    if (tableId > 0 && browser) {
      clearInterval(intervalId);
    }
  }

  function getTableId() {
    const element = document.getElementById("tableId");
    if (element) {
      // Do something with the element, like updating its value or content
      tableId = parseInt(element.value);
    }
  }

  function disableScroll() {
    if (browser) {
      document.body.style.margin = "0";
      document.body.style.height = "100%";
      document.body.style.overflow = "hidden";
      document.body.scrollTo(0, 0);
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
      window.scrollTo(0, 0);
    }
  }

  function enableScroll() {
    if (browser) {
      document.body.style.margin = "";
      document.body.style.height = "";
      document.body.style.overflow = "";
    }
  }

  $: if (showOrder) {
    disableScroll();
  } else {
    enableScroll();
  }

  function increment(index: number, menu: boolean) {
    if (menu) {
      menuCounter[index]++;
    } else {
      drinkCounter[index]++;
    }

    calculateTotalAmount();
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

    calculateTotalAmount();
  }

  function calculateTotalAmount() {
    let temporaryTotal = 0;

    for (var i = 0; i < menus?.length; i++) {
      if (menuCounter[i] > 0) {
        temporaryTotal += menus[i].price * menuCounter[i];
      }
    }

    for (var j = 0; j < drinks?.length; j++) {
      if (drinkCounter[j] > 0) {
        temporaryTotal += drinks[j].price * drinkCounter[j];
      }
    }

    totalAmount = temporaryTotal;
  }
</script>

<div class="text-xl relative">
  {#if !showOrder}
    <div
      class="fixed top-15 right-2 bg-tvblue text-white text-sm px-2 py-1 rounded-md"
    >
      <p>Total: CHF {totalAmount}</p>
    </div>
  {/if}
  <form
    action="?/createOrder"
    class=""
    method="POST"
    use:enhance={({ formElement, formData, action, cancel, submitter }) => {
      // `formElement` is this `<form>` element
      // `formData` is its `FormData` object that's about to be submitted
      // `action` is the URL to which the form is posted
      // calling `cancel()` will prevent the submission
      // `submitter` is the `HTMLElement` that caused the form to be submitted
      loading = true;

      return async ({ result, update }) => {
        loading = false;
        if (result.type === "success") {
          order = await result.data.order;
          formElement.reset();
          showSuccess = true;
          menuCounter.fill(0);
          menuCounter = menuCounter;
          drinkCounter.fill(0);
          drinkCounter = drinkCounter;
          showOrder = true;
          invalidateAll();
          setTimeout(() => {
            showSuccess = false;
          }, 3500);
        } else {
          showError = true;
          invalidateAll();
          formElement.reset();
          setTimeout(() => {
            showError = false;
          }, 3500);
        }
        // `result` is an `ActionResult` object
        // `update` is a function which triggers the default logic that would be triggered if this callback wasn't set
      };
    }}
  >
    <div class="space-y-3">
      <div class="flex items-center">
        <div class="w-24">
          <label for="table" class="">Tisch</label>
        </div>
        <select name="table" required id="tableId">
          <option value="" disabled selected>wählen</option>
          {#each tables ?? [] as table}
            <option value={table.id}>{table.name}</option>
          {/each}
        </select>
      </div>

      <div class="flex items-center">
        <div class="w-24">
          <label for="name">Name</label>
        </div>
        <input type="text" id="name" name="name" placeholder="(optional)" />
      </div>
    </div>
    <div class="grid md:grid-cols-2">
      <div class="mt-8">
        <h3>Menus</h3>

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

          <li>
            <label for="comment" class="text-sm">Spezialwünsche</label>
            <textarea name="comment" class="w-full"></textarea>
          </li>
        </ul>
      </div>

      <div class="mt-8">
        <h3>Getränke</h3>

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
      </div>
    </div>
    <div class="mt-10"></div>
    <div class="flex justify-center">
      <button
        class="{tableId > 0
          ? 'bg-tvblue hover:bg-tvbluelight text-white group pointer-events-auto'
          : 'bg-gray-500 text-gray-400 pointer-events-none'} rounded-md py-2 px-3"
        type="submit"
        disabled={tableId === 0}
      >
        <p class="group-hover:scale-105">Speichern</p>
      </button>
    </div>
  </form>
</div>

{#if showSuccess || showError}
  <div
    aria-live="assertive"
    class="pointer-events-none fixed inset-0 z-50 flex items-end px-4 py-6 sm:items-start sm:p-6 mt-16"
  >
    <div class="flex w-full flex-col items-center space-y-4 sm:items-end">
      <div
        class="pointer-events-auto w-full max-w-sm overflow-hidden rounded-md {showSuccess
          ? 'bg-green-500'
          : 'bg-red-500'} shadow-lg"
        transition:fly={{ y: 250, duration: 350, easing: cubicOut }}
      >
        <div class="p-4">
          <div class="flex items-start">
            <div class="flex-shrink-0">
              {#if showSuccess}
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
                {showSuccess
                  ? "Bestellung erfolgreich erfasst!"
                  : "Ein Fehler ist aufgetreten"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}

<div class="mt-10"></div>

{#if showOrder}
  <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
  <div
    class="absolute w-screen h-screen -top-24 left-0 z-10 bg-black bg-opacity-85"
    on:keypress={() => {
      showOrder = false;
    }}
    on:click={() => {
      showOrder = false;
    }}
    role="alertdialog"
    aria-modal="true"
  >
    <button
      aria-label="close-order"
      class=""
      on:click={() => {
        if (!e.target.closest(".order-container")) {
          showOrder = false;
        }
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="24px"
        viewBox="0 -960 960 960"
        width="24px"
        class="absolute fill-white h-10 w-10 top-12 right-12"
      >
        <path
          d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"
        />
      </svg>
    </button>
    <a aria-label="close-order" class="" href={"/orders/" + order.id}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="24px"
        viewBox="0 -960 960 960"
        width="24px"
        class="absolute fill-white h-10 w-10 top-12 left-12"
      >
        <path
          d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"
        />
      </svg>
    </a>
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <div
      in:fade
      class="absolute z-75 top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-screen order-container md:px-12 lg:px-56 xl:px-96"
      on:click={(e) => e.stopPropagation()}
      role="alertdialog"
      aria-modal="true"
    >
      <Order {order} />
    </div>
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

  html {
    scroll-behavior: smooth;
  }
</style>
