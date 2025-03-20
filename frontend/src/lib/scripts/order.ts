export default function checkIfEditAllowed(order: Order) {
  const twoMinutesAgo = new Date(Date.now() - 20000); // 0.5 minutes ago -> minutes x 60 x 1000

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
