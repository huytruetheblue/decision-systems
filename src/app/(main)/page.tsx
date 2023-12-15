"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import axios from "axios";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Checkbox } from "@/components/ui/checkbox";
import { City, Category } from "@/constants";
import { Input } from "@/components/ui/input";
import { useModal } from "@/reduxs/use-modal-store";

const formSchema = z.object({
  city: z.array(z.string()),
  budget: z.string(),
  typeOfTour: z.array(z.string()),
});

export default function Home() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      budget: "",
      city: [],
      typeOfTour: [],
    },
  });
  const { onOpen } = useModal();

  // 2. Define a submit handler.
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    const response = await axios.post("/api/findtour", {
      params: values,
    });
    onOpen("resultModal", {
      tour: response?.data?.best_S_sao,
    });
  };

  return (
    <div>
      <h1 className="text-center text-3xl font-bold py-5">
        Tour search support machine
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="budget"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Budget</FormLabel>
                <FormControl>
                  <Input placeholder="Budget" {...field} />
                </FormControl>
                <FormDescription>
                  Maximum estimated budget for the trip
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormDescription>
                  Identify the place or area you want to explore. If you choose
                  none, we understand that you choose them all
                </FormDescription>

                {City.map((city, i) => (
                  <FormItem
                    key={i}
                    className="flex flex-row items-start space-x-3 space-y-0">
                    <Checkbox
                      key={i}
                      checked={field.value?.includes(city.name)}
                      onCheckedChange={(checked) => {
                        return checked
                          ? field.onChange([...field.value, city.name])
                          : field.onChange(
                              field.value?.filter(
                                (value) => value !== city.name
                              )
                            );
                      }}
                    />
                    <FormLabel className="text-sm font-normal">
                      {city.name}
                    </FormLabel>
                  </FormItem>
                ))}

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="typeOfTour"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormDescription>
                  Determine the type of travel you want to participate in. If
                  you choose none, we understand that you choose them all
                </FormDescription>

                {Category.map((cate, i) => (
                  <FormItem
                    key={i}
                    className="flex flex-row items-start space-x-3 space-y-0">
                    <Checkbox
                      key={i}
                      checked={field.value?.includes(cate.name)}
                      onCheckedChange={(checked) => {
                        return checked
                          ? field.onChange([...field.value, cate.name])
                          : field.onChange(
                              field.value?.filter(
                                (value) => value !== cate.name
                              )
                            );
                      }}
                    />
                    <FormLabel className="text-sm font-normal">
                      {cate.name}
                    </FormLabel>
                  </FormItem>
                ))}
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
}
