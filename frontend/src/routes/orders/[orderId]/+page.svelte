<script lang="ts">
  import { onMount } from "svelte";
  import { enhance } from "$app/forms";
  import type { PageData } from "./$types";
  import Message from "$lib/components/Message.svelte";
  import Loader from "$lib/components/Loader.svelte";

  export let data: PageData;
  $: ({ order, rows, menus, drinks } = data);

  let loading: boolean = false;
  let messageComponent;
  let drinkCounter: number[] = Array(drinks?.length).fill(0);
  let menuCounter: number[] = Array(menus?.length).fill(0);
  let rowForm: HTMLFormElement;
  let tableForm: HTMLFormElement;
  let nameForm: HTMLFormElement;
  let menuForm: HTMLFormElement;
  let drinkForm: HTMLFormElement;
  let commentForm: HTMLFormElement;
  $: selectedRow = rows?.find((row) => row.id == order.rowId);

  let totalAmount: number = 0;

  $: menus && calculateMenuCounter();
  $: drinks && calculateDrinkCounter();
  $: rows && calculateTotalAmount();

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

<Message bind:this={messageComponent} />

<Loader {loading} />

{#if order && menus && drinks}
  <div
    class="fixed top-24 right-8 bg-tvblue text-white text-sm px-2 py-1 rounded-md"
  >
    <p>Total: CHF {totalAmount}</p>
  </div>

  <div
    hidden={!order.printed}
    class="fixed top-32 right-8 bg-red-500 text-white text-sm px-2 py-1 rounded-md"
  >
    <p>bereits gedruckt</p>
  </div>

  <h2>Bestellung Nr. {order.id} {order.printed ? "" : "bearbeiten"}</h2>
  <p class="mb-3">Bestellung erstellt von {order.user.username}</p>

  <div class="text-xl">
    <div class="space-y-3">
      <form
        action="?/updateRow"
        method="POST"
        bind:this={rowForm}
        use:enhance={({}) => {
          loading = true;

          return async ({ result }) => {
            messageComponent.showMessage(result);
            order = result.data.order;
            setTimeout(() => {
              loading = false;
            }, 250);
          };
        }}
      >
        <div class="flex items-center">
          <div class="w-24">
            <label for="row" class="">Reihe</label>
          </div>

          <select
            disabled={order.printed}
            name="row"
            required
            value={order?.rowId}
            on:change={() => rowForm.requestSubmit()}
          >
            {#each rows ?? [] as row}
              <option value={row.id}>{row.name}</option>
            {/each}
          </select>
        </div>
      </form>
      <form
        action="?/updateTable"
        method="POST"
        bind:this={tableForm}
        use:enhance={({}) => {
          loading = true;

          return async ({ result }) => {
            messageComponent.showMessage(result);
            order = result.data.order;
            setTimeout(() => {
              loading = false;
            }, 250);
          };
        }}
      >
        <div class="flex items-center">
          <div class="w-24">
            <label for="table" class="">Tisch</label>
          </div>

          <select
            disabled={order.printed}
            name="table"
            required
            value={order?.tableId}
            on:change={() => tableForm.requestSubmit()}
          >
            {#each selectedRow.table ?? [] as table}
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
          loading = true;

          return async ({ result }) => {
            messageComponent.showMessage(result);
            setTimeout(() => {
              loading = false;
            }, 250);
          };
        }}
      >
        <div class="flex items-center">
          <div class="w-24">
            <label for="name">Name</label>
          </div>
          <input
            disabled={order.printed}
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
            loading = true;
            return async ({ result }) => {
              messageComponent.showMessage(result);
              setTimeout(() => {
                loading = false;
              }, 250);
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
                      disabled={menuCounter[i] === 0 || order.printed}
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
                      disabled={order.printed}
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
            loading = true;
            return async ({ result }) => {
              messageComponent.showMessage(result);
              setTimeout(() => {
                loading = false;
              }, 250);
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
                      disabled={drinkCounter[i] === 0 || order.printed}
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
                      disabled={order.printed}
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
  <div class="my-5">
    <form
      action="?/updateComment"
      method="POST"
      bind:this={commentForm}
      use:enhance={({}) => {
        loading = true;
        return async ({ result }) => {
          messageComponent.showMessage(result);
          setTimeout(() => {
            loading = false;
          }, 250);
        };
      }}
    >
      <div class="">
        <label for="comment" class="text-sm">Spezialwünsche</label>
        <textarea
          disabled={order.printed}
          name="comment"
          class="w-full"
          bind:value={order.comment}
          on:change={() => commentForm.requestSubmit()}
        ></textarea>
      </div>
    </form>
  </div>
{/if}
