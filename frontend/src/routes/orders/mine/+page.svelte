<script lang="ts">
  import { onMount } from "svelte";
  import { enhance } from "$app/forms";
  import type { PageData } from "../$types";
  import Order from "$lib/components/Order.svelte";
  import { invalidateAll } from "$app/navigation";
  import Actions from "../../Actions.svelte";

  export let data: PageData & { orders: any };
  $: ({ printedOrders, unprintedOrders } = data);

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

<h2>Bestellte Menus</h2>

<div class="grid sm:grid-cols-2 sm:space-x-3">
  <ul>
    <h3>Nicht Gedruckt</h3>
    {#each unprintedOrders as order, i}
      <li class="relative">
        <Order {order} showMenuOrDrink="menu" />

        <div class="absolute top-2 left-2">
          <form
            action="?/deleteOrder"
            method="POST"
            use:enhance={({ cancel }) => {
              loading = true;

              if (!confirm("Möchtest du diese Menu wirklich löschen?")) {
                cancel();
                loading = false;
              }

              return async ({ result }) => {
                if (result.type === "success") {
                  invalidateAll();
                  loading = false;
                }
              };
            }}
          >
            <input
              hidden
              type="number"
              bind:value={order.orderedMenus.id}
              name="id"
              autocomplete="off"
            />
            <button
              aria-label="delete-order"
              class="group py-1 px-2 rounded-md {order.printed
                ? 'text-white bg-red-500 hover:bg-red-600'
                : 'bg-white text-red-500 '} "
              type="submit"
            >
              <p class="group-hover:animate-wiggle">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  class="group-hover:scale-105 {order.printed
                    ? 'fill-white'
                    : 'fill-red-500'}"
                >
                  <path
                    d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"
                  />
                </svg>
              </p>
            </button>
          </form>
        </div>
        <div class="absolute top-2 right-2">
          <div
            class="group py-1 px-2 rounded-md {order.printed
              ? 'text-white bg-red-500 hover:bg-red-600'
              : 'bg-white text-red-500 '} "
          >
            <a href={"/orders/" + order.id} aria-label="edit-order">
              <p class="group-hover:animate-wiggle">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  class="group-hover:scale-105 {order.printed
                    ? 'fill-white'
                    : 'fill-red-500'}"
                  ><path
                    d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"
                  /></svg
                >
              </p>
            </a>
          </div>
        </div>
      </li>
    {/each}
  </ul>

  <ul>
    <h3>Gedruckt</h3>

    {#each printedOrders as order, i}
      <li class="relative">
        <Order {order} showMenuOrDrink="menu" />
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
