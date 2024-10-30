<script lang="ts">
  import { onMount } from "svelte";
  import { enhance } from "$app/forms";
  import type { PageData } from "../$types";
  import Order from "$lib/components/Order.svelte";
  import { invalidateAll } from "$app/navigation";
  import Actions from "../Actions.svelte";

  export let data: PageData & { orders: any };
  $: ({ newOrders, ready } = data);

  onMount(() => {
    const interval = setInterval(() => {
      invalidateAll();
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  });

  let loading = false;
</script>

<Actions />

<h2>Bestellte Getränke</h2>

<div class="grid sm:grid-cols-2 sm:space-x-3">
  <ul>
    <h3>Bestellt</h3>
    {#each newOrders as order}
      <li>
        <Order {order} showMenuOrDrink="drink" />

        <div class="flex space-x-2">
          {#if order.orderedDrinks.status === 1}
            <div class="">
              <form
                action="?/changeStatusToReady"
                method="POST"
                use:enhance={({}) => {
                  loading = true;
                  return async ({ result }) => {
                    await invalidateAll();
                    if (result.type === "success") {
                      loading = false;
                    }
                  };
                }}
              >
                <input
                  hidden
                  type="text"
                  bind:value={order.orderedDrinks.id}
                  name="id"
                  autocomplete="off"
                />
                <button
                  class="group py-2 px-3 rounded-md text-white bg-blue-500 hover:bg-blue-600"
                  type="submit"
                >
                  als bereit markieren
                </button>
              </form>
            </div>
          {:else if order.orderedDrinks.status === 2}
            <div class="">
              <form
                action="?/changeStatusToServed"
                method="POST"
                use:enhance={({}) => {
                  loading = true;
                  return async ({ result }) => {
                    await invalidateAll();
                    if (result.type === "success") {
                      loading = false;
                    }
                  };
                }}
              >
                <input
                  hidden
                  type="text"
                  bind:value={order.orderedDrinks.id}
                  name="id"
                  autocomplete="off"
                />
                <button
                  class="group py-2 px-3 rounded-md text-white bg-blue-500 hover:bg-blue-600"
                  type="submit"
                >
                  als serviert markieren
                </button>
              </form>
            </div>
          {/if}
          {#if !order.orderedDrinks.paid}
            <div class="">
              <form
                action="?/updatePaymentStatus"
                method="POST"
                use:enhance={({}) => {
                  loading = true;
                  return async ({ result }) => {
                    await invalidateAll();
                    if (result.type === "success") {
                      loading = false;
                    }
                  };
                }}
              >
                <input
                  hidden
                  type="text"
                  bind:value={order.orderedDrinks.id}
                  name="id"
                  autocomplete="off"
                />
                <button
                  class="group py-2 px-3 rounded-md text-white bg-green-500 hover:bg-green-600"
                  type="submit"
                >
                  als bezahlt markieren
                </button>
              </form>
            </div>
          {/if}
          <div>
            <form
              action="?/deleteOrder"
              method="POST"
              use:enhance={({}) => {
                loading = true;
                return async ({ result }) => {
                  await invalidateAll();
                  if (result.type === "success") {
                    loading = false;
                  }
                };
              }}
            >
              <input
                hidden
                type="number"
                bind:value={order.orderedDrinks.id}
                name="id"
                autocomplete="off"
              />
              <button
                aria-label="deleteOrder"
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
        </div>
      </li>
    {/each}
  </ul>

  <ul>
    <h3>Bereit</h3>

    {#each ready as order}
      <li>
        <Order {order} showMenuOrDrink="drink" />

        <div class="flex space-x-2">
          {#if order.orderedDrinks.status === 1}
            <div class="">
              <form
                action="?/changeStatus"
                method="POST"
                use:enhance={({}) => {
                  loading = true;
                  return async ({ result }) => {
                    await invalidateAll();
                    if (result.type === "success") {
                      loading = false;
                    }
                  };
                }}
              >
                <input
                  hidden
                  type="text"
                  bind:value={order.orderedDrinks.id}
                  name="id"
                  autocomplete="off"
                />
                <button
                  class="group py-2 px-3 rounded-md text-white bg-blue-500 hover:bg-blue-600"
                  type="submit"
                >
                  als bereit markieren
                </button>
              </form>
            </div>
          {:else if order.orderedDrinks.status === 2}
            <div class="">
              <form
                action="?/changeStatusToServed"
                method="POST"
                use:enhance={({}) => {
                  loading = true;
                  return async ({ result }) => {
                    await invalidateAll();
                    if (result.type === "success") {
                      loading = false;
                    }
                  };
                }}
              >
                <input
                  hidden
                  type="text"
                  bind:value={order.orderedDrinks.id}
                  name="id"
                  autocomplete="off"
                />
                <button
                  class="group py-2 px-3 rounded-md text-white bg-blue-500 hover:bg-blue-600"
                  type="submit"
                >
                  als serviert markieren
                </button>
              </form>
            </div>
          {/if}
          {#if !order.orderedDrinks.paid}
            <div class="">
              <form
                action="?/updatePaymentStatus"
                method="POST"
                use:enhance={({}) => {
                  loading = true;
                  return async ({ result }) => {
                    await invalidateAll();
                    if (result.type === "success") {
                      loading = false;
                    }
                  };
                }}
              >
                <input
                  hidden
                  type="text"
                  bind:value={order.orderedDrinks.id}
                  name="id"
                  autocomplete="off"
                />
                <button
                  class="group py-2 px-3 rounded-md text-white bg-green-500 hover:bg-green-600"
                  type="submit"
                >
                  als bezahlt markieren
                </button>
              </form>
            </div>
          {/if}
          <div>
            <form
              action="?/deleteOrder"
              method="POST"
              use:enhance={({}) => {
                loading = true;
                return async ({ result }) => {
                  await invalidateAll();
                  if (result.type === "success") {
                    loading = false;
                  }
                };
              }}
            >
              <input
                hidden
                type="number"
                bind:value={order.id}
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
          </div>
        </div>
      </li>
    {/each}
  </ul>
</div>

{#if loading}
  <div
    class="fixed top-0 bottom-0 right-0 left-0 bg-black bg-opacity-60 w-full h-full flex items-center justify-center z-50"
  >
    <div class="spinner"></div>
  </div>
{/if}

<style>
  li {
    @apply my-5 rounded-md p-2 bg-gray-300;
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
