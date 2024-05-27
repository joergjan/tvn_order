<script lang="ts">
  export let order;

  let totalMenuOrderPrice = order.MenuOrder.reduce(
    (total: number, menuOrder: { amount: number; menu: { price: number } }) =>
      total + menuOrder.amount * menuOrder.menu.price,
    0
  ).toFixed(2);
  let totalDrinkOrderPrice = order.DrinkOrder.reduce(
    (total: number, drinkOrder: { amount: number; drink: { price: number } }) =>
      total + drinkOrder.amount * drinkOrder.drink.price,
    0
  ).toFixed(2);
  let totalPrice = (
    parseFloat(totalMenuOrderPrice) + parseFloat(totalDrinkOrderPrice)
  ).toFixed(2);
</script>

<div
  class="relative rounded-md p-2 mb-2 {order.status === 1
    ? 'bg-yellow-300'
    : order.status === 2
      ? 'bg-blue-300'
      : 'bg-green-300'}"
>
  {#if !order.paid}
    <div
      class="h-8 absolute top-0 left-0 right-0 rounded-t-md items-center justify-center flex bg-red-500 text-white font-semibold"
    >
      noch nicht bezahlt!
    </div>
    <div class="h-8"></div>
  {:else}
    <div
      class="h-2 absolute top-0 left-0 right-0 rounded-t-md items-center justify-center flex bg-green-500 font-semibold"
    ></div>
    <div class="h-2"></div>
  {/if}
  <p class="font-bold">Bestellung {order.id}</p>
  <div
    class="absolute {Boolean(order.paid) === true ? 'top-5' : 'top-10'} right-3"
  >
    <p>{order.user.username}</p>
  </div>
  <h3>{order.table.name}</h3>
  <ul class="lg:flex lg:space-x-20 lg:space-y-0 space-y-10">
    <li class="w-48">
      <div class="flex justify-between">
        <p class="font-bold">Menus</p>
        <p class="font-bold">CHF</p>
      </div>
      {#each order.MenuOrder as menu}
        <div class="flex justify-between">
          <p>
            {menu.menu.name} x {menu.amount}
          </p>
          <p>
            {(menu.amount * menu.menu.price).toFixed(2)}
          </p>
        </div>
      {/each}
      <div class="flex justify-between font-semibold">
        <p>Total Menus</p>
        <p>{totalMenuOrderPrice}</p>
      </div>
    </li>
    <li class="w-48">
      <div class="flex justify-between">
        <p class="font-bold">Getränke</p>
        <p class="font-bold">CHF</p>
      </div>
      {#each order.DrinkOrder as drink}
        <div class="flex justify-between">
          <p>
            {drink.drink.name} x {drink.amount}
          </p>
          <p>
            {(drink.amount * drink.drink.price).toFixed(2)}
          </p>
        </div>
      {/each}
      <div class="flex justify-between font-semibold">
        <p>Total Getränke</p>
        <p>{totalDrinkOrderPrice}</p>
      </div>
    </li>
  </ul>
  <div class="flex justify-between font-bold text-xl">
    <p>Total</p>
    <p>CHF {totalPrice}</p>
  </div>
</div>
