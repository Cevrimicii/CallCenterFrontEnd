import React from "react";

export default function Message({ role, text, isStreaming, image }) {
    const cls = `message ${role === "user" ? "user" : role === "assistant" ? "assistant" : "system"}`;

    // Avatarlar
    const avatar =
        role === "user"
            ? "https://cdn-icons-png.flaticon.com/512/847/847969.png" // kullanıcı avatarı
            : role === "assistant"
                ? "https://cdn-icons-png.flaticon.com/512/4712/4712027.png" // AI avatarı
                : null;

    return (
        <div className={cls} aria-live={role === "assistant" ? "polite" : "off"}>
            {avatar && (
                <div className="avatar">
                    <img src={avatar} alt={role} />
                </div>
            )}
            <div className="bubble">
                {image && (
                    <div className="message-image">
                        <img src={image} alt="Gönderilen" />
                    </div>
                )}
                {text && <div className="message-text">{text}</div>}

                {isStreaming && (
                    <div className="dot-typing">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                )}
            </div>
        </div>
    );
}
