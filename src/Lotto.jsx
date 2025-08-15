import React, { useState, useEffect } from 'react';
import './Lotto.css';

const Lotto = () => {
  const [numbers, setNumbers] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateNumbers = () => {
    setIsGenerating(true);
    const newNumbers = [];
    while (newNumbers.length < 6) {
      const randomNumber = Math.floor(Math.random() * 45) + 1;
      if (!newNumbers.includes(randomNumber)) {
        newNumbers.push(randomNumber);
      }
    }
    setNumbers(newNumbers.sort((a, b) => a - b));
  };

  useEffect(() => {
    if (isGenerating) {
      const timer = setTimeout(() => {
        setIsGenerating(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isGenerating]);

  return (
    <div className="lotto-container">
      <h1>Lotto Number Generator</h1>
      <button onClick={generateNumbers}>Generate Numbers</button>
      <div className="numbers-display">
        {numbers.map((number, index) => (
          <span key={index} className={`lotto-number ${isGenerating ? 'number-appear' : ''}`}>
            {number}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Lotto;
