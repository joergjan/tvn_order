<script lang="ts">
  export let order;
  export let init: Boolean = true;

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
  class="relative rounded-md shadow-md {order.printed
    ? 'bg-green-300'
    : init
      ? 'bg-white'
      : 'bg-red-300'}"
>
  <div
    class="h-12 rounded-t-md items-center justify-center flex {order.printed
      ? 'text-white bg-green-500'
      : ' text-white bg-red-500'} font-semibold {init ? 'hidden' : ''}"
  >
    {order.printed ? "bereits gedruckt :)" : "nicht gedruckt!"}
  </div>
  <div class="p-2 mb-2">
    <div class="flex justify-between relative">
      <p class="w-1/3 flex justify-start">Nr {order.id}</p>
      <p class="w-1/3 flex justify-center">{time}</p>
      <p class="w-1/3 flex justify-end">{order.user.username}</p>
    </div>

    <h3>Reihe {order.row.name}, Tisch {order.table.name}</h3>
    {#if order.name}
      <h4>für {order.name}</h4>
    {/if}
    <ul class="lg:flex lg:space-x-12 lg:justify-between lg:space-y-0 space-y-3">
      {#if order?.orderedMenus?.menuOrder.some((menuOrder) => menuOrder.amount > 0)}
        <li class="w-full">
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
        </li>
      {/if}
      {#if order?.orderedDrinks?.drinkOrder.some((drinkOrder) => drinkOrder.amount > 0)}
        <li class="w-full">
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
    {#if order.comment}
      <p class="text-md font-medium my-5">
        Spezialwunsch: {order.comment}
      </p>
    {/if}
    <div class="flex justify-between font-semibold text-xl mt-3">
      <p>Total</p>
      <p>CHF {totalPrice}</p>
    </div>
  </div>
</div>
