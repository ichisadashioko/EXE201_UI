import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { api_get_chat_threads, getAccessToken } from "../authentication";
import type { api_get_chat_threads_ChatThread } from "../authentication";

const Chat = () => {
  const [threads, setThreads] = useState<api_get_chat_threads_ChatThread[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChatThreads = async () => {
      const token = getAccessToken();
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        setLoading(true);
        const response = await api_get_chat_threads(token);
        if (response.success) {
          setThreads(response.data!.chat_threads);
        } else {
          setError(response.message || "Failed to load chat threads.");
        }
      } catch (err) {
        setError("An unexpected error occurred.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchChatThreads();
  }, [navigate]);

  if (loading) {
    return <div className="p-4">Loading chats...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Chats</h1>
      {threads.length === 0 ? (
        <p>You have no active chats. Start a conversation from a match!</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {threads.map((thread) => (
            <li key={thread.thread_id} className="py-3">
              <Link
                to={`/chat/${thread.thread_id}`}
                className="block hover:bg-gray-50 p-2 rounded-md"
              >
                <div className="flex items-center space-x-4">
                  {/* Placeholder for profile picture */}
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300">
                    {thread.other_user_profile_picture_url == null ? (
                      // TODO use default profile picture
                      <></>
                    ) : (
                      <img src={thread.other_user_profile_picture_url} alt="" className="h-10 w-10 rounded-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {thread.other_user_name}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      Click to view conversation
                    </p>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Chat;
