"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { PatternFormat } from "react-number-format";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { isValidCPF, removeCpfPunctuantuon } from "../../menu/helpers/cpf";

const formSchema = z.object({
    cpf: z.string().trim().min(1, {
        message: 'O CPF é obrigatório.',
    }).refine((value) => isValidCPF(value), {
        message: 'CPF inválido.'
    }),
});

type FormSchema = z.infer<typeof formSchema>;

const CpfForm = () => {
    const form = useForm<FormSchema>({
        resolver: zodResolver(formSchema)
    })

    const router = useRouter();
    const pathName = usePathname();
    const onSubmit = (data: FormSchema) => {
        router.replace(`${pathName}?cpf=${removeCpfPunctuantuon(data.cpf)}`);
    };
    const handleCancel = () => {
        router.back();
    };
    return (
        <Drawer open>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Visualizar Pedidos</DrawerTitle>
                    <DrawerDescription>Insira seu CPF abaixo para visualizar seus pedidos.</DrawerDescription>
                </DrawerHeader>
                <div className="p-5">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                            <FormField
                                control={form.control}
                                name="cpf"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Seu CPF</FormLabel>
                                        <FormControl>
                                            <PatternFormat
                                                placeholder="Digite seu CPF..."
                                                format="###.###.###-##"
                                                customInput={Input}
                                                {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <DrawerFooter className="mt-5 flex-row p-0">
                                <DrawerClose asChild>
                                    <Button
                                        className="w-1/2 rounded-full"
                                        variant="secondary"
                                        size="lg"
                                        onClick={handleCancel}
                                    >
                                        Cancelar
                                    </Button>
                                </DrawerClose>

                                <Button
                                    className="w-1/2 rounded-full"
                                    type="submit"
                                    variant="destructive"
                                    size="lg"
                                >
                                    Confirmar
                                </Button>
                            </DrawerFooter>
                        </form>
                    </Form>
                </div>
            </DrawerContent>
        </Drawer>

    );
}

export default CpfForm;