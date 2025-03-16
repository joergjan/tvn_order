<script lang="ts">
  import { enhance } from "$app/forms";
  import type { PageData } from "./$types";
  import { fade } from "svelte/transition";
  import Order from "$lib/components/Order.svelte";
  import { browser } from "$app/environment";
  import Loader from "$lib/components/Loader.svelte";
  import Message from "$lib/components/Message.svelte";
  import { onMount } from "svelte";

  export let data: PageData & { users: any };
  $: ({ rows, drinks, menus } = data);

  let messageComponent;
  let loading = false;
  let order: Order;
  let showOrder = false;
  let tableId: number = 0;
  let intervalId;
  let totalAmount: number = 0;
  let selectedRowId: number = 0;
  let selectedTableId: number = 0;

  $: selectedRow = rows.find((row) => row.id === selectedRowId);
  $: selectedRowId && ((selectedTableId = 0), (tableId = 0));
  $: menuCounter = Array(menus?.length).fill(0);
  $: drinkCounter = Array(drinks?.length).fill(0);
  $: {
    if (tableId === 0 && browser) {
      intervalId = setInterval(getTableId, 500);
    }
    if (tableId > 0 && browser) {
      clearInterval(intervalId);
    }
    if (browser && selectedRowId) {
      localStorage.setItem("selectedRow", String(selectedRow.id));
      console.log(selectedRow);
    }
  }

  onMount(() => {
    selectedRowId = Number(localStorage.getItem("selectedRow"));
    selectedRow = rows.find((row) => row.id === selectedRowId);
  });

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
    use:enhance={({ formElement }) => {
      loading = true;

      return async ({ result, update }) => {
        selectedRowId = 0;
        order = await result.data.order;
        messageComponent.showMessage(result);
        formElement.reset();
        menuCounter.fill(0);
        menuCounter = menuCounter;
        drinkCounter.fill(0);
        drinkCounter = drinkCounter;
        totalAmount = 0;
        showOrder = true;
        loading = false;
      };
    }}
  >
    <div class="space-y-3">
      <div class="flex items-center">
        <div class="w-24">
          <label for="row" class="">Reihe</label>
        </div>
        <select name="row" required id="rowId" bind:value={selectedRowId}>
          <option value="" disabled selected>wählen</option>
          {#each rows ?? [] as row}
            <option value={row.id}>{row.name}</option>
          {/each}
        </select>
      </div>

      <div class="flex items-center">
        <div class="w-24">
          <label for="table" class="">Tisch</label>
        </div>
        {#if selectedRow}
          <select
            name="table"
            required
            id="tableId"
            bind:value={selectedTableId}
          >
            <option value="" disabled selected>wählen</option>
            {#each selectedRow.table ?? [] as table}
              <option value={table.id}>{table.name}</option>
            {/each}
          </select>
        {/if}
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

<Loader {loading} />

<Message bind:this={messageComponent} />
