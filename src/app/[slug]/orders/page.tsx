import { db } from "@/lib/prisma";

import { isValidCPF, removeCpfPunctuantuon } from "../menu/helpers/cpf";
import CpfForm from "./components/cpf-form";
import OrderList from "./components/orders-list";

interface OrdersPageProps {
    searchParams: Promise<{cpf: string}>;
}

const OrdersPage = async ({searchParams}: OrdersPageProps) => {
    const { cpf } = await searchParams;
    if (!cpf) {
        return <CpfForm />
    }
    if (!isValidCPF(cpf)) {
        return <CpfForm />;
    }

    const orders = await db.order.findMany({
        orderBy: {
            createAt: "desc",
        },
        where: {
            customerCpf: removeCpfPunctuantuon(cpf)
        },
        include: {
            restaurant: {
                select: {
                    name: true,
                    avatarImageUrl: true,
                }
            },
            OrderProducts: {
                include: {
                    product: true,
                },
            },
        },
    });
    return <OrderList orders={orders} />
};
 
export default OrdersPage;