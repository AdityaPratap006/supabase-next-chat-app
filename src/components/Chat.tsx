import { useCallback, useEffect, useState } from "react";
import { useSupabase } from "../hooks/useSupabase";

export const Chat = () => {
  const { supabase } = useSupabase();
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from<ChatMessage>("message")
        .select("*")
        .order("created_at", { ascending: true });

      if (data) {
        setMessages(data);
      }

      if (error) {
        console.error("Couldn't fetch messages: ", error);
      }
    };

    fetchMessages();

    const setupMessagesSubscription = () => {
      return supabase
        .from<ChatMessage>("message")
        .on("*", (payload) => {
          const { new: newMessage, old: oldMessage, eventType } = payload;

          switch (eventType) {
            case "INSERT":
              setMessages((prev) => [...prev, newMessage]);
              break;
            case "UPDATE":
              setMessages((prev) => {
                const updateIndex = prev.findIndex(
                  (m) => m.id === newMessage.id
                );
                if (updateIndex === -1) return prev;
                return [
                  ...prev.slice(0, updateIndex),
                  newMessage,
                  ...prev.slice(updateIndex + 1),
                ];
              });
              break;
            case "DELETE":
              console.log({ payload });
              setMessages((prev) => prev.filter((m) => m.id !== oldMessage.id));
              break;
            default:
              break;
          }
        })
        .subscribe();
    };

    const messageSubscription = setupMessagesSubscription();

    return () => {
      messageSubscription.unsubscribe();
    };
  }, [supabase]);

  const renderMessages = useCallback(() => {
    return messages.map((message) => (
      <div
        key={message.id}
        className="flex flex-col justify-start items-start bg-purple-400 p-4 rounded-md"
      >
        <div className="flex justify-between items-center">
          <p className=" w-2/5 truncate">{message.user_id}</p>
          <span>{new Date(message.created_at).toLocaleString()}</span>
        </div>
        <div>
          <p>{message.content}</p>
        </div>
      </div>
    ));
  }, [messages]);

  return (
    <div className=" w-full max-w-2xl min-h-screen bg-blue-200 flex flex-col justify-start items-start p-6 gap-6">
      {renderMessages()}
    </div>
  );
};

interface ChatMessage {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  update_at: string;
}
