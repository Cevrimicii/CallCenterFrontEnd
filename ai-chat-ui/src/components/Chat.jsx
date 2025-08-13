import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import Message from "./Message";
import ChatInput from "./ChatInput";
import { sendMessageToAI } from "../lib/api";

const STORAGE_KEY = "ai_chat_messages_v1";

export default function Chat() {
    const [messages, setMessages] = useState(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch {
            return [];
        }
    });
    const [isStreaming, setIsStreaming] = useState(false);
    const [error, setError] = useState(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    }, [messages]);

    useLayoutEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Scroll to bottom function
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Sayfa açıldığında hoş geldin mesajı
    useEffect(() => {
        if (messages.length === 0) {
            const typingId = "welcome-typing";
            setMessages([{ id: typingId, role: "assistant", text: "", isStreaming: true }]);

            setTimeout(() => {
                setMessages([
                    {
                        id: "sys-welcome",
                        role: "assistant",
                        text:
                            "Merhaba! Ben CallCenter AI asistanınızım. " +
                            "Size paketler, faturalar, teknik destek ve diğer telekomünikasyon hizmetleriyle ilgili yardım edebilirim. " +
                            "Nasıl yardımcı olabilirim? 😊"
                    }
                ]);
            }, 1500); // 1.5 saniye typing efekti
        }
    }, []);

    const addMessage = (msg) => setMessages((m) => [...m, msg]);

    const handleSend = async ({ text, image, audio }) => {
        setError(null);

        // Kullanıcı mesajını UI'da göster
        const userMsg = {
            id: `u-${Date.now()}`,
            role: "user",
            text,
            image: image ? URL.createObjectURL(image) : null,
            audio: audio ? URL.createObjectURL(audio) : null
        };
        addMessage(userMsg);

        const assistantId = `a-${Date.now()}`;
        addMessage({ id: assistantId, role: "assistant", text: "", isStreaming: true });

        setIsStreaming(true);

        try {
            await sendMessageToAI(
                text,
                image,
                audio,
                (chunk) => {
                    setMessages((prev) =>
                        prev.map((msg) =>
                            msg.id === assistantId
                                ? { ...msg, text: (msg.text || "") + chunk }
                                : msg
                        )
                    );
                },
                () => {
                    setMessages((prev) =>
                        prev.map((m) =>
                            m.id === assistantId ? { ...m, isStreaming: false } : m
                        )
                    );
                    setIsStreaming(false);
                }
            );
        } catch (err) {
            setError(err.message);
            setIsStreaming(false);
        }
    };

    const clearChat = () => {
        localStorage.removeItem(STORAGE_KEY);
        setMessages([]);
    };

    return (
        <div className="chat-wrapper">
            <div className="chat-toolbar">
                <button onClick={clearChat} className="btn">Temizle</button>
                <div className="status">
                    {isStreaming ? <span>AI yazıyor...</span> : <span>Hazır</span>}
                    {error && <span className="error"> — {error}</span>}
                </div>
            </div>

            <div className="chat-window">
                <div className="flex-1 p-4 overflow-y-auto">
                    {messages.map((m) => (
                        <Message
                            key={m.id}
                            role={m.role}
                            text={m.text}
                            isStreaming={m.isStreaming}
                            image={m.image}
                        />
                    ))}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            <ChatInput onSend={handleSend} disabled={isStreaming} />
        </div>
    );
}