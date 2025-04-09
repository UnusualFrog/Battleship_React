'use client';
import { useEffect, useRef } from 'react';

export default function GameMessages({ gameMessages }) {
  const messagesContainerRef = useRef(null);

  // Auto-scroll to the bottom of the message list (not the whole page)
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [gameMessages]);

  const styles = {
    container: "mt-2 w-150 rounded bg-white py-1 px-2",
    header: "text-sm font-bold mb-2 text-white font-bold bg-green-500 rounded p-1",
    messagesList: "max-h-40 overflow-y-auto",
    messageItem: "py-1 border-b border-gray-800 last:border-b-0",
    infoMessage: "text-blue-400",
    successMessage: "text-green-400",
    errorMessage: "text-red-400",
    warningMessage: "text-yellow-400",
    emptyState: "text-gray-500 italic"
  };

  const getMessageStyle = (type) => {
    switch (type) {
      case 'success': return styles.successMessage;
      case 'error': return styles.errorMessage;
      case 'warning': return styles.warningMessage;
      default: return styles.infoMessage;
    }
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.header}>Game Status</h3>
      <div className={styles.messagesList} ref={messagesContainerRef}>
        {
          gameMessages.length > 0 ? (
            gameMessages.map((msg, index) => (
              <div 
                key={index} 
                className={`${styles.messageItem} ${getMessageStyle(msg.type)}`}
              >
                {msg.timestamp}: {msg.text}
              </div>
            ))
          ) : (
            <div className={styles.emptyState}>No messages yet.</div>
          )
        }
      </div>
    </div>
  );
}
