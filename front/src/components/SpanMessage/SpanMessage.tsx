// src/components/SpanMessage/SpanMessage.tsx

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import "./SpanMessage.css";

interface SpanMessageProps {
  message: string;
  status: string;
}

const SpanMessage: React.FC<SpanMessageProps> = ({ message, status }) => {
  const [showSpanMessage, setShowSpanMessage] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSpanMessage(false);
    }, 4000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  if (!showSpanMessage) return null;

  return createPortal(
    <div className={`span-message-container ${status}`}>
      <p className="span-message-text">{message}</p>
    </div>,
    document.body,
  );
};

export default SpanMessage;
