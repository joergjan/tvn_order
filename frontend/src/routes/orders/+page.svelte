<script lang="ts">
  import { onMount } from "svelte";
  import { enhance } from "$app/forms";
  import type { PageData } from "../$types";
  import Order from "$lib/components/Order.svelte";
  import { invalidateAll } from "$app/navigation";
  import Message from "$lib/components/Message.svelte";
  import Loader from "$lib/components/Loader.svelte";
  import checkIfEditAllowed from "$lib/scripts/order";

  export let data: PageData & { users: any };
  $: ({ tables, users, username } = data);

  let messageComponent;
  let searchForm: HTMLFormElement;
  let orders;
  let loading: boolean = false;
  let tableIndex: number = 0;
  let userIndex: number = 0;
  let selectedUser: string = "";

  onMount(() => {
    const interval = setInterval(() => {
      searchForm.requestSubmit();
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  });

  onMount(() => {
    for (var i = 0; i < users.length; i++) {
      if (users[i].username == username) {
        selectedUser = users[i].id;

        userIndex = 1;
      }
    }
    setTimeout(() => {
      searchForm.requestSubmit();
    }, 200);
  });
</script>

<Message bind:this={messageComponent} />

<Loader {loading} />

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
  <div class="flex space-x-5">
    <div>
      <div>
        <label for="tableId" class="">Tisch</label>
      </div>
      <div class="flex space-x-2">
        <select
          class="w-32"
          id="tableid"
          name="tableid"
          on:change={() => {
            searchForm.requestSubmit();
            tableIndex = 1;
          }}
        >
          <option value="" disabled selected>wählen</option>
          {#each tables ?? [] as table}
            <option value={table.id}>{table.name}</option>
          {/each}
        </select>
        <div class="flex justify-center items-center">
          <button
            aria-label="reset user filter"
            on:click={() => {
              let tableSelect = document.getElementById("tableid");
              tableSelect.selectedIndex = 0;
              tableIndex = 0;
              searchForm.requestSubmit();
            }}
            disabled={tableIndex === 0}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              class="transition-all duration-200 {tableIndex == 0
                ? 'fill-gray-300'
                : 'fill-red-500'}"
            >
              <path
                d="m336-280 144-144 144 144 56-56-144-144 144-144-56-56-144 144-144-144-56 56 144 144-144 144 56 56ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
    <div>
      <div>
        <label for="userid">Bedienung</label>
      </div>
      <div class="flex space-x-2">
        <select
          class="w-32"
          bind:value={selectedUser}
          id="userid"
          name="userid"
          on:change={() => {
            searchForm.requestSubmit();
            userIndex = 1;
          }}
        >
          <option value="" disabled selected>wählen</option>
          {#each users ?? [] as user}
            <option value={user.id}>{user.username}</option>
          {/each}
        </select>
        <div class="flex justify-center items-center">
          <button
            aria-label="reset user filter"
            on:click={() => {
              let userSelect = document.getElementById("userid");
              userSelect.selectedIndex = 0;
              userIndex = 0;
              searchForm.requestSubmit();
            }}
            disabled={userIndex === 0}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              class="transition-all duration-200 {userIndex == 0
                ? 'fill-gray-300'
                : 'fill-red-500'}"
            >
              <path
                d="m336-280 144-144 144 144 56-56-144-144 144-144-56-56-144 144-144-144-56 56 144 144-144 144 56 56ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</form>

<br />

<h3>Bestellungen</h3>
<div class="grid md:grid-cols-2 gap-3">
  {#if orders?.length >= 1 && tables?.length >= 1}
    <div>
      <br />

      <h4>Offen</h4>
      <ul>
        {#each orders as order, i}
          {#if !order.printed}
            <li class="relative">
              <Order {order} init={false} />

              {#if checkIfEditAllowed(order)}
                <div class="absolute top-2 left-2">
                  <form
                    action="?/deleteOrder"
                    method="POST"
                    use:enhance={({ cancel }) => {
                      loading = true;
                      if (
                        !confirm(
                          "Möchtest du diese Bestellung wirklich löschen?"
                        )
                      ) {
                        cancel();
                      }

                      return async ({ result }) => {
                        messageComponent.showMessage(result);
                        loading = false;
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
                      class="group py-1 px-2 rounded-md bg-white text-red-500"
                      type="submit"
                    >
                      <p class="group-hover:animate-wiggle">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="24px"
                          viewBox="0 -960 960 960"
                          width="24px"
                          class="group-hover:scale-105 fill-red-500"
                        >
                          <path
                            d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"
                          />
                        </svg>
                      </p>
                    </button>
                  </form>
                </div>
                <div class="absolute top-2 right-2 flex space-x-2">
                  <div class="h-5">
                    <form
                      action="?/changePrintStatus"
                      method="POST"
                      use:enhance={({ cancel }) => {
                        if (
                          !confirm(
                            `Möchtest du den Status wirklich auf augeliefert / gedruckt ändern für Bestellung Nr. ${order.id}?`
                          )
                        ) {
                          cancel();
                        }

                        return async ({ result }) => {
                          loading = true;
                          messageComponent.showMessage(result);
                          if (result.tyoe === "success") {
                            invalidateAll();
                            searchForm.requestSubmit();
                          }
                          loading = false;
                        };
                      }}
                    >
                      <input
                        type="number"
                        name="id"
                        hidden
                        bind:value={order.id}
                      />
                      <button
                        type="submit"
                        aria-label="changePrintStatus"
                        class="group py-1 px-2 rounded-md bg-white text-red-500"
                      >
                        <p class="group-hover:animate-wiggle">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="24px"
                            viewBox="0 -960 960 960"
                            width="24px"
                            class="group-hover:scale-105 fill-red-500"
                          >
                            <path
                              d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q65 0 123 19t107 53l-58 59q-38-24-81-37.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160q133 0 226.5-93.5T800-480q0-18-2-36t-6-35l65-65q11 32 17 66t6 70q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm-56-216L254-466l56-56 114 114 400-401 56 56-456 457Z"
                            />
                          </svg>
                        </p>
                      </button>
                    </form>
                  </div>

                  <div class="group py-1 px-2 rounded-md bg-white text-red-500">
                    <a href={"/orders/" + order.id} aria-label="edit-order">
                      <p class="group-hover:animate-wiggle">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="24px"
                          viewBox="0 -960 960 960"
                          width="24px"
                          class="group-hover:scale-105 fill-red-500"
                        >
                          <path
                            d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"
                          />
                        </svg>
                      </p>
                    </a>
                  </div>
                </div>
              {/if}
            </li>
          {/if}
        {/each}
      </ul>
    </div>

    <div>
      <br />

      <h4>Gedruckt</h4>
      <ul class="">
        {#each orders as order, i}
          {#if order.printed}
            <Order {order} />
          {/if}
        {/each}
      </ul>
    </div>
  {:else}
    <p>keine Bestellung gefunden</p>
  {/if}
</div>
