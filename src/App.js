import React from "react";
import { useState, useEffect } from "react";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";

import "./App.css";
import Die from "./components/Die";
import Counter from "./components/Counter";

export default function App() {
  const [drawnNumbers, setNumbers] = useState(draw());
  const [rollTen, setrollTen] = useState(false);
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);
  const [counterOfRolls, setCounter] = useState(0);

  useEffect(() => {
    const ifClicked = drawnNumbers.every((item) => {
      return item.isClicked;
    });
    const firstValue = drawnNumbers[0].value;
    const ifEqual = drawnNumbers.every((item) => {
      return item.value === firstValue;
    });
    if (ifEqual && ifClicked) {
      setrollTen(true);
    }
  }, [drawnNumbers]);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  function draw() {
    let array = [];
    for (let i = 0; i < 10; i++) {
      array.push(generateObj());
    }
    return array;
  }

  function generateObj() {
    return {
      value: Math.floor(Math.random() * 6 + 1),
      id: nanoid(),
      isClicked: false,
    };
  }

  function changeIsClicked(id) {
    setNumbers((prev) =>
      prev.map((item) => {
        return item.id === id ? { ...item, isClicked: !item.isClicked } : item;
      })
    );
  }

  function rollNumbers() {
    setNumbers((prev) =>
      prev.map((item) => {
        return item.isClicked ? item : generateObj();
      })
    );

    setCounter((prev) => prev + 1);
    if (rollTen) {
      setNumbers(draw());
      setCounter(0);
      setrollTen(false);
    }
  }

  const numbers = drawnNumbers.map((item) => (
    <Die
      value={item.value}
      key={item.id}
      isClicked={item.isClicked}
      changeIsClicked={() => changeIsClicked(item.id)}
    />
  ));

  return (
    <div className="app">
      <main>
        {rollTen && <Confetti width={width} height={height} />}
        <h1 className="title">Rapid Roll 🎲</h1>
        <p className="description">
          Roll until all dice are the same. Click each die to freeze it at its
          current value between rolls.
        </p>
        <p>Who will take the least rolls?</p>
        <div className="container">{numbers}</div>
        <button className="button" onClick={rollNumbers}>
          {rollTen ? "New game" : "Roll"}
        </button>
      </main>
      <Counter counterOfRolls={counterOfRolls} />
    </div>
  );
}
