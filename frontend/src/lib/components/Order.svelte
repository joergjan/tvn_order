<script lang="ts">
  export let order;

  let totalMenuOrderPrice: string = "0";
  let totalDrinkOrderPrice: string = "0";
  let updatedOn: Date = new Date(order.updatedOn);
  let time: string;

  if (order?.orderedMenus?.menuOrder?.length > 0) {
    totalMenuOrderPrice = order.orderedMenus.menuOrder
      .reduce(
        (
          total: number,
          menuOrder: { amount: number; menu: { price: number } }
        ) => total + menuOrder.amount * menuOrder.menu.price,
        0
      )
      .toFixed(2);
  }
  if (order?.orderedDrinks?.drinkOrder?.length > 0) {
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

  let totalPrice = (
    parseFloat(totalMenuOrderPrice) + parseFloat(totalDrinkOrderPrice)
  ).toFixed(2);

  const options: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  };

  time = updatedOn.toLocaleTimeString("ch-DE", options);
</script>

<div
  class="relative rounded-md p-2 mb-2 shadow-md {order.printed
    ? 'bg-green-300'
    : 'bg-red-300'}"
>
  <div
    class="h-12 absolute top-0 left-0 right-0 rounded-t-md items-center justify-center flex {order.printed
      ? 'text-white bg-green-500'
      : ' text-white bg-red-500'}  font-semibold"
  >
    {order.printed ? "bereits gedruckt :)" : "nicht gedruckt!"}
  </div>
  <div class="h-12"></div>
  <div class="flex justify-between relative">
    <p class="w-1/3 flex justify-start">Bestellung {order.id}</p>
    <p class="w-1/3 flex justify-center">{time}</p>
    <p class="w-1/3 flex justify-end">{order.user.username}</p>
  </div>

  <h3>Tisch {order.table.name}</h3>
  {#if order.name}
    <h4>für {order.name}</h4>
  {/if}
  <ul class="lg:flex lg:space-x-20 lg:space-y-0 space-y-10">
    {#if order?.orderedMenus?.menuOrder.some((menuOrder) => menuOrder.amount > 0)}
      <li class="w-48">
        <div class="flex justify-between">
          <p class="">Menus</p>
          <p class="">CHF</p>
        </div>
        {#each order?.orderedMenus?.menuOrder as menuOrder}
          {#if menuOrder.amount > 0}
            <div class="flex justify-between text-xl font-medium">
              <p>
                {menuOrder.menu.name} x {menuOrder.amount}
              </p>
              <p>
                {(menuOrder.amount * menuOrder.menu.price).toFixed(2)}
              </p>
            </div>
          {/if}
        {/each}
        <div class="flex justify-between">
          <p>Total Menus</p>
          <p>{totalMenuOrderPrice}</p>
        </div>
      </li>
    {/if}
    {#if order?.orderedDrinks?.drinkOrder.some((drinkOrder) => drinkOrder.amount > 0)}
      <li class="w-48">
        <div class="flex justify-between">
          <p class="">Getränke</p>
          <p class="">CHF</p>
        </div>
        {#each order.orderedDrinks.drinkOrder as drinkOrder}
          {#if drinkOrder.amount > 0}
            <div class="flex justify-between text-xl font-medium">
              <p>
                {drinkOrder.drink.name} x {drinkOrder.amount}
              </p>
              <p>
                {(drinkOrder.amount * drinkOrder.drink.price).toFixed(2)}
              </p>
            </div>
          {/if}
        {/each}
        <div class="flex justify-between">
          <p>Total Getränke</p>
          <p>{totalDrinkOrderPrice}</p>
        </div>
      </li>
    {/if}
  </ul>
  <div class="flex justify-between font-semibold text-xl mt-3">
    <p>Total</p>
    <p>CHF {totalPrice}</p>
  </div>
</div>
