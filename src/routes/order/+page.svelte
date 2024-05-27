<script lang="ts">
  import { onMount } from "svelte";
  import { enhance } from "$app/forms";
  import type { PageData } from "../$types";
  import { fly } from "svelte/transition";
  import { cubicOut } from "svelte/easing";

  export let data: PageData & { users: any };
  $: ({ tables, drinks, menues, username, myTable } = data);

  $: myChosenTable = myTable;
  $: orderForTable = myTable;

  let loading = false;
  let showError = false;
  let showSuccess = false;
</script>

<div>
  <h3>Mein Tisch</h3>

  <form action="?/chooseTable" class="flex space-x-2" method="POST" use:enhance>
    <select name="table" bind:value={myChosenTable}>
      {#each tables ?? [] as table}
        <option value={table.id}>{table.name}</option>
      {/each}
    </select>
    <div class="place-content-end">
      <button
        class="bg-tvblue hover:bg-tvbluelight text-white group rounded-md py-2 px-3"
        type="submit"
      >
        <p class="group-hover:scale-105">Speichern</p>
      </button>
    </div>
  </form>
</div>

<div class="pt-8">
  <h2>Bestellung erfassen</h2>

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
        console.log(result);

        loading = false;
        if (result.type === "success") {
          formElement.reset();
          showSuccess = true;
          setTimeout(() => {
            showSuccess = false;
          }, 3500);
        } else {
          showError = true;
          setTimeout(() => {
            showError = false;
          }, 3500);
        }
        // `result` is an `ActionResult` object
        // `update` is a function which triggers the default logic that would be triggered if this callback wasn't set
      };
    }}
  >
    <div class="">
      <label for="table">Für</label>
      <select name="table" bind:value={orderForTable}>
        {#each tables ?? [] as table}
          <option value={table.id}>{table.name}</option>
        {/each}
      </select>
    </div>
    <div class="grid md:grid-cols-2">
      <div class="mt-8">
        <h3>Menus</h3>

        <ul class="space-y-2">
          {#each menues ?? [] as menu, i}
            <li class="flex space-x-3">
              <input type="number" name="id" bind:value={menu.id} hidden />
              <div class="flex">
                <p class="w-32 place-content-center">{menu.name}</p>
                <p class="w-10 place-content-center">{menu.price}</p>
              </div>
              <div>
                <input
                  type="number"
                  min="0"
                  name="menuCount{menu.id}"
                  placeholder="Anzahl"
                  inputmode="numeric"
                  class="w-full max-w-full md:max-w-44"
                />
              </div>
            </li>
          {/each}
        </ul>
      </div>

      <div class="mt-8">
        <h3>Getränke</h3>

        <ul class="space-y-2">
          {#each drinks ?? [] as drink, i}
            <li class="flex space-x-3">
              <input type="number" name="id" bind:value={drink.id} hidden />
              <div class="flex">
                <p class="w-32 place-content-center">{drink.name}</p>
                <p class="w-10 place-content-center">{drink.price}</p>
              </div>
              <div class="">
                <input
                  type="number"
                  min="0"
                  name="menuCount{drink.id}"
                  placeholder="Anzahl"
                  class="w-full max-w-full md:max-w-44"
                />
              </div>
            </li>
          {/each}
        </ul>
      </div>
      <div class="place-content-end">
        <button
          class="bg-tvblue hover:bg-tvbluelight text-white group rounded-md py-2 px-3"
          type="submit"
        >
          <p class="group-hover:scale-105">Speichern</p>
        </button>
      </div>
    </div>
  </form>
</div>

{#if showSuccess || showError}
  <div
    aria-live="assertive"
    class="pointer-events-none fixed inset-0 z-50 flex items-end px-4 py-6 sm:items-start sm:p-6"
  >
    <div class="flex w-full flex-col items-center space-y-4 sm:items-end">
      <div
        class="pointer-events-auto w-full max-w-sm overflow-hidden rounded-md {showSuccess
          ? 'bg-green-500'
          : 'bg-red-500'} shadow-lg"
        transition:fly={{ y: 250, duration: 250, easing: cubicOut }}
      >
        <div class="p-4">
          <div class="flex items-start">
            <div class="flex-shrink-0">
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
