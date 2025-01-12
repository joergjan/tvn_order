export default function checkIfEditAllowed(order: Order) {
  const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000); // 2 minutes ago

  const createdOn = new Date(order.createdOn);
  const updatedOn = new Date(order.updatedOn);

  return (
    createdOn > twoMinutesAgo &&
    updatedOn > twoMinutesAgo &&
    order.printed === false
  );
}
