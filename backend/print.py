from escpos.printer import Network
import asyncio
from prisma import Prisma
from datetime import datetime, timedelta
import time
from ping3 import ping


async def print_orders(prisma):
    try:
        # Ping the printer to check if it's reachable
        response = ping("192.168.1.138", timeout=2)
        if response is None:
            raise Exception("Printer not reachable")

        receipt = Network("192.168.1.138", profile='TM-T20II')
        # Check if the printer is available by sending a simple command

    except Exception as e:
        if not prisma.is_connected():
            await prisma.connect()

        existing_error = await prisma.error.find_first(
            where={
                "solved": False
            }
        )
        if not existing_error:
            await prisma.error.create(
                data={"message": "Drucker nicht gefunden"}
            )
        return

    # Ensure the Prisma client is connected
    if not prisma.is_connected():
        await prisma.connect()

    await prisma.error.update_many(
        where={"solved": False},
        data={"solved": True}
    )

    some_mintues_ago = datetime.utcnow() - timedelta(milliseconds=30000)

    # Fetch orders where printed is false
    orders = await prisma.order.find_many(
        where={
            'printed': False,
            "updatedOn": {
                'lt': some_mintues_ago.isoformat() + "Z"
            }
        },
        include={
            "user": True,
            "table": True,
            "row": True,
            'orderedMenus': {
                'include': {
                    'menuOrder': {
                        'include': {
                            'menu': True,
                        }
                    }
                }
            },
            'orderedDrinks': {
                'include': {
                    'drinkOrder': {
                        'include': {
                            'drink': True,
                        }
                    }
                }
            }
        }
    )
    try:
        for order in orders:
            adjusted_created_on = order.createdOn + timedelta(hours=2)
            formatted_time = adjusted_created_on.strftime("%H:%M")

            if len(order.orderedMenus.menuOrder) > 0 and any(menuOrder.amount > 0 for menuOrder in order.orderedMenus.menuOrder):
                receipt.set(align='center')
                receipt.image("logo.png")

                receipt.text(f"\nBestellung Nr {order.id}\n")
                receipt.text(f"Bedienung: {order.user.username}\n")
                receipt.text(f"Zeit: {formatted_time}")

                receipt.text(
                    f"\n\nReihe: {order.row.name} / Tisch: {order.table.name}")
                if order.name:
                    receipt.text(f"\nfür {order.name}")

                receipt.ln(2)
                receipt.text("Menus:\n")
                totalPrice = 0
                for menuOrder in order.orderedMenus.menuOrder:
                    if menuOrder.amount > 0:
                        receipt.text(f"{menuOrder.amount} x ")
                        receipt.text(f"{menuOrder.menu.alias}")
                        receipt.text(f" à CHF {menuOrder.menu.price}")
                        if menuOrder.amount > 1:
                            receipt.text(
                                f" / CHF {menuOrder.amount * menuOrder.menu.price}\n")
                        else:
                            receipt.text(f"\n")
                        totalPrice += menuOrder.menu.price*menuOrder.amount

                if order.comment != "":
                    receipt.text(f"\nSpezialwunsch: {order.comment}\n")

                receipt.text(f"\nTotal: CHF {totalPrice}")

                receipt.cut()

            if len(order.orderedDrinks.drinkOrder) > 0 and any(drinkOrder.amount > 0 for drinkOrder in order.orderedDrinks.drinkOrder):
                receipt.set(align='center')
                receipt.image("logo.png")

                receipt.text(f"\nBestellung Nr {order.id}\n")
                receipt.text(f"Bedienung: {order.user.username}\n")
                receipt.text(f"Zeit: {formatted_time}")

                receipt.text(
                    f"\n\nReihe: {order.row.name} / Tisch: {order.table.name}")
                if order.name:
                    receipt.text(f"\nfür {order.name}")

                totalPrice = 0
                receipt.ln(2)
                receipt.text("Getränke:\n")
                for drinkOrder in order.orderedDrinks.drinkOrder:
                    if drinkOrder.amount > 0:
                        receipt.text(f"{drinkOrder.amount} x ")
                        receipt.text(f"{drinkOrder.drink.name}")
                        receipt.text(f" à CHF {drinkOrder.drink.price}")
                        if drinkOrder.amount > 1:
                            receipt.text(
                                f" / CHF {drinkOrder.amount * drinkOrder.drink.price}\n")
                        else:
                            receipt.text(f"\n")
                        totalPrice += drinkOrder.drink.price*drinkOrder.amount

                receipt.text(f"\nTotal: CHF {totalPrice}")

                receipt.cut()

            # Update the printed status to true
            await prisma.order.update(
                where={
                    'id': order.id
                },
                data={
                    'printed': True
                }
            )

    except Exception as e:
        print(e)


async def main() -> None:
    prisma = Prisma()
    await prisma.connect()

    try:
        while True:
            await print_orders(prisma)
            await asyncio.sleep(5)
    finally:
        await prisma.disconnect()


if __name__ == '__main__':
    while True:
        try:
            asyncio.run(main())
        except Exception as e:
            print(f"Error occurred: {e}")
            time.sleep(5)
