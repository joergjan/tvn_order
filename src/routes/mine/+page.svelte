<script lang="ts">
  import { onMount } from "svelte";
  import { enhance } from "$app/forms";
  import type { PageData } from "./$types";
  import Order from "$lib/components/Order.svelte";
  import { invalidateAll } from "$app/navigation";

  export let data: PageData & { orders: any };
  $: ({ paid, unpaid, newOrder, ready, served } = data);

  let viewPaid = true;

  onMount(() => {
    const interval = setInterval(() => {
      invalidateAll();
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  });
</script>

<h2>Meine Bestellungen</h2>

<div>
  <button
    class="px-3 py-2 rounded-md bg-tvbluelight hover:bg-tvblue group text-white"
    on:click={() => {
      viewPaid = !viewPaid;
    }}
  >
    <p class="group-hover:scale-105">Ansicht wechseln</p>
  </button>
</div>
<div class="m-5"></div>

<div class="grid md:grid-cols-2 md:space-x-3">
  <ul>
    <h3>{viewPaid ? "Nicht bezahlt" : "Bestellt"}</h3>
    {#each viewPaid ? unpaid : newOrder as order}
      <li>
        <Order {order} />

        <div class="flex space-x-2">
          {#if order.status === 1}
            <div class="">
              <form action="?/changeStatusToReady" method="POST" use:enhance>
                <input
                  hidden
                  type="text"
                  bind:value={order.id}
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
          {:else if order.status === 2}
            <div class="">
              <form action="?/changeStatusToServed" method="POST" use:enhance>
                <input
                  hidden
                  type="text"
                  bind:value={order.id}
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
          {#if !order.paid}
            <div class="">
              <form action="?/updatePaymentStatus" method="POST" use:enhance>
                <input
                  hidden
                  type="text"
                  bind:value={order.id}
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
            <form action="?/deleteOrder" method="POST" use:enhance>
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

  <ul>
    <h3>{viewPaid ? "Bezahlt" : "Bereit"}</h3>
    {#each viewPaid ? paid : ready as order}
      <li>
        <Order {order} />

        <div class="flex space-x-2">
          {#if order.status === 1}
            <div class="">
              <form action="?/changeStatus" method="POST" use:enhance>
                <input
                  hidden
                  type="text"
                  bind:value={order.id}
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
          {:else if order.status === 2}
            <div class="">
              <form action="?/changeStatusToServed" method="POST" use:enhance>
                <input
                  hidden
                  type="text"
                  bind:value={order.id}
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
          {#if !order.paid}
            <div class="">
              <form action="?/updatePaymentStatus" method="POST" use:enhance>
                <input
                  hidden
                  type="text"
                  bind:value={order.id}
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
            <form action="?/deleteOrder" method="POST" use:enhance>
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

  <ul class="mt-5">
    {#if served.length > 0 && !viewPaid}
      <h3>Serviert, unbezahlt</h3>
      {#each served as order}
        <li>
          <Order {order} />

          <div class="flex space-x-2">
            {#if order.status === 1}
              <div class="">
                <form action="?/changeStatusToReady" method="POST" use:enhance>
                  <input
                    hidden
                    type="text"
                    bind:value={order.id}
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
            {:else if order.status === 2}
              <div class="">
                <form action="?/changeStatusToServed" method="POST" use:enhance>
                  <input
                    hidden
                    type="text"
                    bind:value={order.id}
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
            {#if !order.paid}
              <div class="">
                <form action="?/updatePaymentStatus" method="POST" use:enhance>
                  <input
                    hidden
                    type="text"
                    bind:value={order.id}
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
              <form action="?/deleteOrder" method="POST" use:enhance>
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
    {/if}
  </ul>
</div>

<style>
  li {
    @apply my-5 rounded-md p-2 bg-gray-300;
  }
</style>
