"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { ActionTooltip } from "@/components/Action-Tooltip";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";

interface OnboardingFormProps {
  clerkId: string;
  email: string;
}

const onboardingFormSchema = z.object({
  username: z
    .string()
    .min(2, {
      message: "Username must be at least 2 characters.",
    })
    .max(200, {
      message: "Username must be at most 200 characters.",
    }),
  email: z.string().email(),
});

export function OnboardingForm({ clerkId, email }: OnboardingFormProps) {
  const signUpMutation = api.auction.signUp.useMutation();
  const router = useRouter();
  // 1. Define your form.
  const form = useForm<z.infer<typeof onboardingFormSchema>>({
    resolver: zodResolver(onboardingFormSchema),
    defaultValues: {
      username: "",
      email: `${email ?? ""}`,
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof onboardingFormSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);

    signUpMutation.mutate({
      email: values.email,
      userName: values.username,
      clerkId: clerkId,
    });

    router.push("/auction");
  }

  return (
    <div className="flex h-full w-full items-center justify-center border border-red-500">
      <div>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card className="w-[350px]">
            <CardHeader>
              <CardTitle>Sign Up for the Auction</CardTitle>
              <CardDescription>Create your username</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="shadowjakey" {...field} />
                      </FormControl>
                      <FormDescription>
                        This is your public display name.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <div className="flex flex-row">
                          <Input
                            placeholder="shadcn"
                            {...field}
                            disabled={true}
                          />
                          <ActionTooltip
                            label="log in with the email you want to use for your account"
                            side="bottom"
                            align="end"
                          >
                            <Button variant={"ghost"}>Not you?</Button>
                          </ActionTooltip>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Form>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button type="submit">Submit</Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </div>
  );
}
