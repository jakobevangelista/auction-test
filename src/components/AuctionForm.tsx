"use client";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { DialogFooter } from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { addDays, format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import { api } from "@/trpc/react";

interface AuctionFormProps {
  setOpen: (open: boolean) => void;
}

const formSchema = z.object({
  name: z.string().min(2).max(50),
  hour: z.coerce.number().min(0).max(23),
  minute: z.coerce.number().min(0).max(59),
  date: z.date().min(new Date(addDays(new Date(), -1))),
});
export default function AuctionForm({ setOpen }: AuctionFormProps) {
  const mutation = api.auction.addAuction.useMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      minute: 0,
      hour: 0,
      date: new Date(),
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    values.date.setHours(values.hour, values.minute);

    const utcTime = new Date(
      values.date.getTime() + values.date.getTimezoneOffset() * 60000,
    );
    console.log("utc Time: ", utcTime.toLocaleString());
    console.log("local time from utc: ", utcTime.toLocaleString());
    mutation.mutate({
      name: values.name,
      startTime: values.date,
    });
    setOpen(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center gap-4">
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="team name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center gap-4">
              <FormLabel>Start Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date <= new Date(addDays(new Date(), -1))
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-row items-center">
          <FormField
            control={form.control}
            name="hour"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center gap-4">
                <FormLabel>Start Time (Military)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="00"
                    type="number"
                    className="w-16"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="ml-3">:</div>
          <FormField
            control={form.control}
            name="minute"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center gap-4">
                <FormLabel></FormLabel>
                <FormControl>
                  <Input
                    placeholder="00"
                    type="number"
                    className="w-16"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <DialogFooter>
          <Button type="submit">Submit</Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
