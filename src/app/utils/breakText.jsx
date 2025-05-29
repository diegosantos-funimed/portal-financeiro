import React from 'react';

const breakText = (text) => {
  if (!text) return "";

  const words = text.toString().split(' ');
  let currentLine = "";
  const lines = [];
  const MAX_LENGTH = 18; // Definindo o comprimento máximo para maior clareza

  words.forEach((word, index) => {
    // Se adicionar a palavra atual exceder o limite
    if ((currentLine + word).length > MAX_LENGTH && currentLine.length > 0) {
      lines.push(currentLine.trim()); // Adiciona a linha atual (sem espaços extras no final)
      currentLine = word + " "; // Começa uma nova linha com a palavra atual
    } else {
      currentLine += word + " "; // Adiciona a palavra à linha atual
    }

    // Se for a última palavra, adiciona a linha restante
    if (index === words.length - 1) {
      lines.push(currentLine.trim());
    }
  });

  return lines.map((line, index) => (
    <React.Fragment key={index}>
      {line}
      {index !== lines.length - 1 && <br />}
    </React.Fragment>
  ));
};


export default breakText;