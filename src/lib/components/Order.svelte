<script lang="ts">
  export let order;
  export let showMenuOrDrink: "menu" | "drink" = "menu";

  let totalMenuOrderPrice: string = "0";
  let totalDrinkOrderPrice: string = "0";
  let isMenu = showMenuOrDrink === "menu";
  let isPaid = false;

  if (isMenu && order?.orderedMenus?.menuOrder?.length > 0) {
    totalMenuOrderPrice = order.orderedMenus.menuOrder
      .reduce(
        (
          total: number,
          menuOrder: { amount: number; menu: { price: number } }
        ) => total + menuOrder.amount * menuOrder.menu.price,
        0
      )
      .toFixed(2);
  } else if (order?.orderedDrinks?.drinkOrder?.length > 0) {
    totalDrinkOrderPrice = order.orderedDrinks.drinkOrder
      .reduce(
        (
          total: number,
          drinkOrder: { amount: number; drink: { price: number } }
        ) => total + drinkOrder.amount * drinkOrder.drink.price,
        0
      )
      .toFixed(2);
  }

  $: {
    if (isMenu) {
      isPaid = order.orderedMenus?.paid;
    } else {
      isPaid = order.orderedDrinks?.paid;
    }
  }

  let totalPrice = (
    parseFloat(totalMenuOrderPrice) + parseFloat(totalDrinkOrderPrice)
  ).toFixed(2);
</script>

<div
  class="relative rounded-md p-2 mb-2 {order.orderedMenus?.status === 1 ||
  order.orderedDrinks?.status === 1
    ? 'bg-yellow-300'
    : order.orderedMenus?.status === 2 || order.orderedDrinks?.status === 2
      ? 'bg-blue-300'
      : 'bg-green-300'}"
>
  {#if !isPaid}
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
  <div class="absolute {isPaid ? 'top-5' : 'top-10'} right-3">
    <p>{order.user.username}</p>
  </div>
  <h3>Tisch {order.table.name}</h3>
  {#if order.name}
    <h4>für {order.name}</h4>
  {/if}
  <ul class="lg:flex lg:space-x-20 lg:space-y-0 space-y-10">
    {#if isMenu && order?.orderedMenus?.menuOrder?.length > 0}
      <li class="w-48">
        <div class="flex justify-between">
          <p class="font-bold">Menus</p>
          <p class="font-bold">CHF</p>
        </div>
        {#each order?.orderedMenus?.menuOrder as menu}
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
    {:else if order?.orderedDrinks?.drinkOrder.length > 0}
      <li class="w-48">
        <div class="flex justify-between">
          <p class="font-bold">Getränke</p>
          <p class="font-bold">CHF</p>
        </div>
        {#each order.orderedDrinks.drinkOrder as drink}
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
    {/if}
  </ul>
  <div class="flex justify-between font-bold text-xl">
    <p>Total</p>
    <p>CHF {totalPrice}</p>
  </div>
</div>
