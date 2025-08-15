

export async function sendMessageToAI(prompt, imageFile, audioFile, onChunk, onDone) {
    const res = await fetch("http://localhost:8080/api/v1/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: prompt, session_id: "default" })
    });

    if (!res.ok) throw new Error(await res.text());

    // Yanıtı JSON olarak al
    const data = await res.json();
    // response alanını onChunk ile ilet
    if (data && data.response) {
        onChunk(data.response);
    } else {
        onChunk("");
    }
    onDone();
}
