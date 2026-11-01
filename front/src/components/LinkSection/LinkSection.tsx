// src/components/LinkSection.jsx

import React, { useState, type ReactNode } from "react";
import "./LinkSection.css";

interface LinkSectionProps {
  title: string;
  children: ReactNode;
}

const LinkSection: React.FC<LinkSectionProps> = ({ title, children }) => {
  const [aberto, setAberto] = useState(false);

  const toggleLinks = () => {
    setAberto(!aberto);
  };

  return (
    <div className={`div-links ${aberto ? "aberto" : ""}`}>
      <h3 onClick={toggleLinks}>
        {title} <img src="./img/arrow-more.svg" alt="ícone de seta" />
      </h3>
      {children}
    </div>
  );
};

export default LinkSection;
