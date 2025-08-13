import React from "react";
import Chat from "./components/Chat";

export default function App() {
  return (
    <div className="app-root">
      <header className="app-header">
        <h1>AI Agent Chat</h1>
      </header>
      <main className="app-main">
        <Chat />
      </main>
    </div>
  );
}
