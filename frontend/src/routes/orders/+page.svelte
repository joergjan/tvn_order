<script lang="ts">
  import { onMount } from "svelte";
  import { enhance } from "$app/forms";
  import type { PageData } from "../$types";
  import Order from "$lib/components/Order.svelte";
  import { invalidateAll } from "$app/navigation";
  import Message from "$lib/components/Message.svelte";

  export let data: PageData & { users: any };
  $: ({ tables } = data);

  let messageComponent;
  let searchForm: HTMLFormElement;
  let orders;
  let tableId: number = 0;

  onMount(() => {
    const interval = setInterval(() => {
      searchForm.requestSubmit();
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  });

  onMount(() => {
    searchForm.requestSubmit();
  });
</script>

<Message bind:this={messageComponent} />

<h2>Bestellte Menus</h2>

<form
  action="?/searchOrder"
  method="POST"
  bind:this={searchForm}
  use:enhance={({}) => {
    return async ({ result }) => {
      messageComponent.showMessage(result);

      if (result.type === "success") {
        orders = await result.data.orders;
      }
    };
  }}
>
  <div class="flex space-x-2">
    <div>
      <div class="w-24">
        <label for="tableId" class="">Tisch</label>
      </div>
      <select
        class="w-32"
        name="tableid"
        on:change={() => {
          searchForm.requestSubmit();
        }}
      >
        <option value="" disabled selected>wählen</option>
        {#each tables ?? [] as table}
          <option value={table.id}>{table.name}</option>
        {/each}
      </select>
    </div>
    <div>
      <div>
        <label for="username">Bedienung</label>
      </div>
      <input
        type="text"
        name="username"
        on:change={() => searchForm.requestSubmit()}
      />
    </div>
  </div>
  <div class="h-12">
    <div class="h-full flex items-center space-x-3">
      <label for="printed">Gedruckt</label>
      <input
        type="checkbox"
        name="printed"
        on:change={() => searchForm.requestSubmit()}
      />
    </div>
  </div>
</form>

<ul>
  <h3>Bestellungen</h3>
  {#if orders?.length >= 1 && tables?.length >= 1}
    {#each orders as order, i}
      <li class="relative">
        <Order {order} />

        {#if !order.printed}
          <div class="absolute top-2 left-2">
            <form
              action="?/deleteOrder"
              method="POST"
              use:enhance={({ cancel }) => {
                if (
                  !confirm("Möchtest du diese Bestellung wirklich löschen?")
                ) {
                  cancel();
                }

                return async ({ result }) => {
                  messageComponent.showMessage(result);
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
        {/if}
      </li>
    {/each}
  {:else}
    <p>keine Bestellung gefunden</p>
  {/if}
</ul>
