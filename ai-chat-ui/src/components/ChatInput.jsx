import React, { useState, useRef } from "react";

export default function ChatInput({ onSend, disabled }) {
    const [value, setValue] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    // Resim seçme
    const handleImageSelect = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith("image/")) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onload = (ev) => setImagePreview(ev.target.result);
            reader.readAsDataURL(file);
        }
    };

    const clearImage = () => {
        setImageFile(null);
        setImagePreview(null);
    };

    // Ses kaydı başlat
    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
                // Mesaj gönder (text boş, sadece ses var)
                onSend({ text: "", image: imageFile, audio: audioBlob });
                clearImage();
            };

            mediaRecorder.start();
            setIsRecording(true);
        } catch (err) {
            console.error("Mikrofon erişimi reddedildi", err);
        }
    };

    // Ses kaydı durdur
    const stopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    // Normal gönderme (metin / resim)
    const submit = (e) => {
        e.preventDefault();
        if (!value.trim() && !imageFile) return;
        onSend({ text: value, image: imageFile });
        setValue("");
        clearImage();
    };

    return (
        <form className="chat-input" onSubmit={submit}>
            <textarea
                aria-label="Mesajınızı yazın"
                placeholder="Mesajınızı yazın veya mikrofonla ses kaydedin..."
                value={value}
                onChange={(e) => setValue(e.target.value)}
                rows={1}
                disabled={disabled}
            />

            {/* Mikrofon butonu */}
            <button
                type="button"
                className={`btn ${isRecording ? "recording" : ""}`}
                onClick={isRecording ? stopRecording : startRecording}
                disabled={disabled}
                title="Ses kaydı başlat/durdur"
            >
                🎤
            </button>

            {/* Resim ekleme */}
            <label className="btn" style={{ display: "flex", alignItems: "center" }}>
                📎
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    style={{ display: "none" }}
                    disabled={disabled}
                />
            </label>

            {/* Gönder butonu */}
            <button type="submit" className="btn" disabled={disabled || (!value.trim() && !imageFile)}>
                Gönder
            </button>

            {/* Resim önizleme */}
            {imagePreview && (
                <div className="image-preview">
                    <img src={imagePreview} alt="Önizleme" />
                    <button type="button" onClick={clearImage} className="btn">❌</button>
                </div>
            )}
        </form>
    );
}
