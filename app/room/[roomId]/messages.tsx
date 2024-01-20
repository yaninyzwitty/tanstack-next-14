"use client";
import {fetcher} from "@/lib/fetchMessages";
import {messageSchema} from "@/lib/schema";
import {Message} from "@/types";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import axios from "axios";
import {useParams} from "next/navigation";
import {FC} from "react";
import * as z from "zod";

interface MessagesProps {
  initialMessages: Message[];
  roomId: string;
}

const Messages: FC<MessagesProps> = ({initialMessages, roomId}) => {
  const queryClient = useQueryClient();
  const {mutate, isPending} = useMutation({
    mutationFn: async (values: z.infer<typeof messageSchema>) => {
      const {data} = await axios.post("/api/messages", values);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["messages"]});
    },
  });

  const params = useParams();
  const {data: messages} = useQuery<Message[]>({
    queryKey: ["messages"],
    queryFn: () => fetcher(params.roomId as string),
  });

  return (
    <div>
      {(messages || initialMessages).map((message) => (
        <p key={message.messageId}>{message.message}</p>
      ))}
    </div>
  );
};

export default Messages;
