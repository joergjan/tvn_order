<script>
  export let data;
</script>

<h2>Umsatz</h2>

<div class="max-w-md">
  <h4>Menus</h4>
  <ul class="">
    <li class="grid grid-cols-3">
      <p>Menu</p>
      <p class="text-right">Anzahl</p>
      <p class="text-right">Umsatz</p>
    </li>
    {#each data.menuEarningsByType as menuEarnings}
      <li class="grid grid-cols-3">
        <p>{menuEarnings.menu_name}</p>
        <p class="text-right">{menuEarnings.total_sold}</p>
        <p class="text-end">
          {Intl.NumberFormat("de-CH", {
            style: "currency",
            currency: "CHF",
          }).format(menuEarnings.total_earnings)}
        </p>
      </li>
    {/each}
  </ul>

  <br />

  <h4>Getränke</h4>
  <ul class="">
    <li class="grid grid-cols-3">
      <p>Menu</p>
      <p class="text-right">Anzahl</p>
      <p class="text-right">Umsatz</p>
    </li>
    {#each data.drinkEarningsByType as drinkEarnings}
      <li class="grid grid-cols-3">
        <p>{drinkEarnings.drink_name}</p>
        <p class="text-right">{drinkEarnings.total_sold}</p>
        <p class="text-end">
          {Intl.NumberFormat("de-CH", {
            style: "currency",
            currency: "CHF",
          }).format(drinkEarnings.total_earnings)}
        </p>
      </li>
    {/each}
  </ul>

  <div class="grid grid-cols-2 mt-5">
    <p class="text-lg font-bold">Umsatz</p>
    <p class="text-lg font-bold text-end">
      {Intl.NumberFormat("de-CH", {
        style: "currency",
        currency: "CHF",
      }).format(data.totalAmount)}
    </p>
  </div>
</div>
