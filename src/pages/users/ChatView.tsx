import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { getAccessToken, getUserIdFromToken } from '../../authentication';

interface ChatMessage {
    id: number;
    senderUserId: number;
    sender_name: string | null;
    content: string;
    timestamp: string;
}

export default function ChatView() {
    const { chatThreadId } = useParams<{ chatThreadId: string }>();
    const [connection, setConnection] = useState<HubConnection | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);
    const latestMessages = useRef(messages);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    latestMessages.current = messages;

    // Effect for scrolling to the bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        const token = getAccessToken();
        setCurrentUserId(getUserIdFromToken(token));

        // Fetch message history
        fetch(`/api/chat/${chatThreadId}/messages`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => setMessages(data.messages || []));

        // Setup SignalR connection
        const newConnection = new HubConnectionBuilder()
            .withUrl("/chathub", {
                accessTokenFactory: () => token || ''
            })
            .withAutomaticReconnect()
            .build();

        setConnection(newConnection);
    }, [chatThreadId]);

    useEffect(() => {
        if (connection) {
            connection.start()
                .then(() => {
                    console.log('Connected to ChatHub');
                    connection.invoke("JoinChat", parseInt(chatThreadId!));

                    connection.on("ReceiveMessage", (message) => {
                        // Use the ref here to avoid stale state
                        const updatedMessages = [...latestMessages.current, message];
                        setMessages(updatedMessages);
                    });
                })
                .catch(e => console.log('Connection failed: ', e));
        }

        // Cleanup on component unmount
        return () => {
            connection?.stop();
        };
    }, [connection, chatThreadId]);

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (connection && newMessage.trim()) {
            try {
                await connection.invoke("SendMessage", parseInt(chatThreadId!), newMessage);
                setNewMessage('');
            } catch (e) {
                console.error("Failed to send message: ", e);
            }
        }
    };

    console.debug(`typeof(messages): ${typeof (messages)}`);
    console.debug(`messages: ${JSON.stringify(messages)}`);

    // TODO update UI to show sender's name instead of user ID
    return (
        <div style={{
            maxWidth: '100vw',
            margin: 'auto',
            border: '1px solid #ccc',
            borderRadius: '8px',
            display: 'flex',
            flexDirection: 'column',
            height: '100vh'
        }}>
            <div style={{ flexGrow: 1, overflowY: 'auto', padding: '10px', display: 'flex', flexDirection: 'column' }}>
                {messages.map(msg => {
                    const isCurrentUser = msg.senderUserId === currentUserId;
                    
                    return (
                        <div key={msg.id} style={{
                            display: 'flex',
                            justifyContent: isCurrentUser ? 'flex-end' : 'flex-start',
                            marginBottom: '10px'
                        }}>
                            <div style={{
                                maxWidth: '60%',
                                padding: '10px 15px',
                                borderRadius: '20px',
                                background: isCurrentUser ? '#007bff' : '#e9e9eb',
                                color: isCurrentUser ? 'white' : 'black',
                                wordWrap: 'break-word'
                            }}>
                                <strong style={{ fontSize: '0.8rem', display: 'block', marginBottom: '4px' }}>
                                    {msg.sender_name || `User ${msg.senderUserId}`}
                                </strong>
                                {msg.content}
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={sendMessage} style={{ display: 'flex', padding: '10px', borderTop: '1px solid #ccc' }}>
                <input
                    type="text"
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    style={{ flexGrow: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                    placeholder="Type a message..."
                />
                <button type="submit" style={{
                    marginLeft: '10px',
                    padding: '8px 12px',
                    borderRadius: '4px',
                    border: 'none',
                    background: '#007bff',
                    color: 'white'
                }}>Send</button>
            </form>
        </div>
    );
}
