export default function checkIfEditAllowed(order: Order) {
  const twoMinutesAgo = new Date(Date.now() - 1 * 60 * 1000); // 1 minutes ago

  const createdOn = new Date(order.createdOn);
  let updatedOn = new Date(order.createdOn);

  if (order?.updatedOn) {
    updatedOn = new Date(order.updatedOn);
  }

  return (
    createdOn > twoMinutesAgo &&
    updatedOn > twoMinutesAgo &&
    order.printed === false
  );
}
