"use client";

import { OrderStatus, Prisma } from "@prisma/client";
import { ChevronLeftIcon, ScrollTextIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/helpers/format-currency";

interface OrderListProps {
    orders: Array<
        Prisma.OrderGetPayload<{
            include: {
                restaurant: {
                    select: {
                        name: true,
                        avatarImageUrl: true,
                    }
                };
                OrderProducts: {
                    include: {
                        product: true,
                    }
                }
            }
        }>
    >;
}

const getStatusLabel = (status: OrderStatus) => {
    if (status == "FINISHED") return "Finalizado";
    if (status == "IN_PREPARATION") return "Em preparo";
    if (status == "PENDING") return "Pendente";
    return "";
}

const OrderList = ({ orders }: OrderListProps) => {
    const router = useRouter();
    const handleBackClick = () => router.back();
    return (
        <div className="space-y-6 p-6">
            <Button size="icon" variant="secondary" className="rounded-full" onClick={handleBackClick}>
                <ChevronLeftIcon />
            </Button>
            <div className="flex items-center gap-3">
                <ScrollTextIcon />
                <h2 className="text-lg font-semibold">
                    Meus Pedidos
                </h2>
            </div>
            {orders.map(orders => (
                <Card key={orders.id}>
                    <CardContent className="p-5 space-y-4">
                        <div className={`w-fit rounded-full text-white px-2 py-1 text-xs-font-semibold
                            ${orders.status == OrderStatus.FINISHED ? "bg-green-400 text-white" : "bg-gray-200 text-gray-500"}
                            ${orders.status == OrderStatus.IN_PREPARATION ? "bg-yellow-400 text-black" : "bg-gray-200 text-gray-500"}
                        `}>
                            {getStatusLabel(orders.status)}
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="relative h-5 w-5">
                                <Image
                                    src={orders.restaurant.avatarImageUrl}
                                    alt={orders.restaurant.name}
                                    className="rounded-sm"
                                    fill
                                />
                            </div>
                            <p className="text-sm font-semibold">{orders.restaurant.name}</p>
                        </div>
                        <Separator />
                        <div className="space-y-2">
                            {orders.OrderProducts.map((orderProduct) => (
                                <div key={orderProduct.id} className="flex items-center gap-1">
                                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-400 text-white text-sm font-semibold">
                                        {orderProduct.quantity}
                                    </div>
                                    <p className="text-sm">{orderProduct.product.name} </p>
                                </div>
                            ))}
                        </div>
                        <Separator />
                        <p className="text-sm font-medium">{formatCurrency(orders.total)}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

export default OrderList;