"use client";

import * as z from "zod";

import {Button} from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {messageSchema} from "@/lib/schema";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";

import {Message} from "@/types";
import {useParams} from "next/navigation";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {fetcher} from "@/lib/fetchMessages";
import axios from "axios";
import {toast} from "sonner";

type Props = {
  initialMessages: Message[];
};
function MessageForm({initialMessages}: Props) {
  const params = useParams();
  const queryClient = useQueryClient();
  const {data} = useQuery({
    queryKey: ["messages"],
    queryFn: () => fetcher(params.roomId as string),
  });

  const {mutate, isPending} = useMutation({
    mutationFn: async (values: z.infer<typeof messageSchema>) => {
      const {data} = await axios.post("/api/messages", values);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["messages"]});
    },
  });

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      message: "",
    },
  });

  function onSubmit(values: z.infer<typeof messageSchema>) {
    const allValues = {...values, roomId: params.roomId as string};

    mutate(allValues, {
      onSuccess: (data) => toast.success(data?.message),
    });

    // startTransition(() => {
    //   message(allValues)
    //     .then((data) => {
    //       if (data?.success) {
    //         toast.success(data.success);
    //       }
    //       if (data?.error) {
    //         toast.error(data.error);
    //       }
    //     })
    //     .catch(() => toast.error("Something went wrong"));
    // });
  }

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-x-8 flex items-center"
        >
          <FormField
            control={form.control}
            name="message"
            render={({field}) => (
              <FormItem>
                <FormLabel>Message</FormLabel>
                <FormControl>
                  <Input
                    placeholder="your message..."
                    type="text"
                    disabled={isPending}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  This is your public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isPending}>
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default MessageForm;
