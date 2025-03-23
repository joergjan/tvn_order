<script>
  export let data;
</script>

<h2>Umsatz</h2>

<div class="m-2"></div>
<div class="grid grid-cols-2 max-w-md">
  <p>Anzahl Bestellte Getränke:</p>
  <p class="text-end">{data.drinkOrdersAmount}</p>
  <p>Getränke:</p>
  <p class="text-end">
    {Intl.NumberFormat("de-CH", {
      style: "currency",
      currency: "CHF",
    }).format(data.totalDrinkAmount)}
  </p>

  <p>Anzahl Bestellte Menus:</p>
  <p class="text-end">{data.menuOrdersAmount}</p>
  <p>Menus:</p>
  <p class="text-end">
    {Intl.NumberFormat("de-CH", {
      style: "currency",
      currency: "CHF",
    }).format(data.totalMenuAmount)}
  </p>

  <p>Total Bestellungen:</p>
  <p class="text-end">{data.ordersAmount}</p>

  <p class="text-lg font-bold">Total:</p>
  <p class="text-lg font-bold text-end">
    {Intl.NumberFormat("de-CH", {
      style: "currency",
      currency: "CHF",
    }).format(data.totalAmount)}
  </p>
</div>
