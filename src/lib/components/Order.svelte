<script lang="ts">
  let order: Order;

  type Order = {
    id: number;
    table: Table;
    tableId: number;
    status?: Status;
    statusId?: number;
    menu: Menu[];
    user: User;
    drink: Drink[];
  };
</script>

<div>
  <h3>{order.id}</h3>
  <h3>{order.table.name}</h3>
  <h3>{order.status?.name}</h3>
  <h3>{order.user.username}</h3>
  {#each order.menu as menu}
    <h3>{menu.name}</h3>
    <h3>{menu.price}</h3>
  {/each}
  {#each order.drink as drink}
    <h3>{drink.name}</h3>
    <h3>{drink.price}</h3>
  {/each}
</div>
