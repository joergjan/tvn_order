<script lang="ts">
  import { onMount } from "svelte";
  import { enhance } from "$app/forms";
  import type { PageData } from "../$types";

  export let data: PageData & { users: any };
  $: ({ tables, drinks, menues, username, myTable } = data);

  $: myChosenTable = myTable;
  $: orderForTable = myTable;
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

<div class="pt-16">
  <h2>Bestellung erfassen</h2>

  <form action="?/createOrder" class="flex space-x-2" method="POST">
    <div class="block">
      <label for="table">Tisch</label>

      <select name="table" bind:value={orderForTable}>
        {#each tables ?? [] as table}
          <option value={table.id}>{table.name}</option>
        {/each}
      </select>
    </div>

    <div class="block">
      <h3>Menus</h3>

      <ul class="space-y-2">
        {#each menues ?? [] as menu, i}
          <li class="flex">
            <input type="number" name="id" bind:value={menu.id} hidden />
            <p class="w-16 place-content-center">{menu.name}</p>
            <p class="w-10 place-content-center">{menu.price}</p>
            <input
              type="number"
              min="0"
              name="menuCount{menu.id}"
              placeholder="Anzahl"
              inputmode="numeric"
            />
          </li>
        {/each}
      </ul>
    </div>

    <div class="block">
      <h3>Getränke</h3>

      <ul class="space-y-2">
        {#each drinks ?? [] as drink, i}
          <li class="flex">
            <input type="number" name="id" bind:value={drink.id} hidden />
            <p class="w-16 place-content-center">{drink.name}</p>
            <p class="w-10 place-content-center">{drink.price}</p>
            <input
              type="number"
              min="0"
              name="drinkCount{drink.id}"
              placeholder="Anzahl"
              inputmode="numeric"
            />
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
  </form>
</div>
