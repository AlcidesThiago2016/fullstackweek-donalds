// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ConsumptionMethod } from "@prisma/client";
import { notFound } from "next/navigation";

import { db } from "@/lib/prisma";

import RestaurantCategories from "./components/categories";
import RestaurantHeader from "./components/header";

interface RestaurantMenuPageProps {
    params: Promise<{slug: string}>;
    searchParams: Promise<{consumptionMethod: string}>
}

const isConsumptionMethodValid = (ConsumptionMethod: string) => {
    return ["DINE_IN", "TAKEAWAY"].includes(ConsumptionMethod.toUpperCase());
}

const RestaurantMenuPage = async ({params, searchParams}: RestaurantMenuPageProps) => {
    const {slug} = await params;
    const {consumptionMethod} = await searchParams;
    if (!isConsumptionMethodValid(consumptionMethod)){
        return notFound();
    }
    const restaurant = await db.restaurant.findUnique({
        where: {slug}, 
        include: { 
            menuCategory: {
                include: { products: true},
            }     
        },
    });
    if (!restaurant){
        return notFound();
    }
    return (
        <div>
            <RestaurantHeader restaurant={restaurant}/>
            <RestaurantCategories restaurant={restaurant}/>
        </div>
    );
}

export default RestaurantMenuPage;