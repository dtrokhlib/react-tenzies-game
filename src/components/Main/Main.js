import React, { useState, useEffect } from 'react';
import './Main.css';
import { Dice } from '../Dice/Dice';
import { nanoid } from 'nanoid';
import useWindowSize from 'react-use/lib/useWindowSize';
import Confetti from 'react-confetti';

export function Main() {
    const [dice, setDice] = useState(allNewDice());
    const [tenzies, setTenzies] = useState(false);
    const { width, height } = useWindowSize();
    const [numberRolls, setNumberRolls] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [bestTime, setBestTime] = useState(
        Number(localStorage.getItem('best-time')) || null
    );

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentTime((prevValue) => prevValue + 1);
        }, 10);
        const isHeld = dice.every((item) => item.isHeld === true);
        const firstValue = dice[0].value;
        const allValueSame = dice.every((item) => item.value === firstValue);
        if (isHeld && allValueSame) {
            clearInterval(intervalId);
            setTenzies(true);
            if (!bestTime || bestTime > currentTime / 100) {
                setBestTime(currentTime / 100);
                localStorage.setItem('best-time', currentTime / 100);
            }
        }

        return () => clearInterval(intervalId);
    }, [dice]);

    function createNewDice() {
        return {
            id: nanoid(),
            value: Math.ceil(Math.random() * 6),
            isHeld: false,
        };
    }

    function allNewDice() {
        const newDice = [];
        for (let i = 0; i < 10; i++) {
            newDice.push(createNewDice());
        }
        return newDice;
    }

    function generateNewDice() {
        if (!tenzies) {
            setDice((prevDice) =>
                prevDice.map((item) => (item.isHeld ? item : createNewDice()))
            );
            setNumberRolls((prevValue) => prevValue + 1);
        } else {
            setDice(allNewDice());
            setTenzies(false);
            setCurrentTime(0);
            setNumberRolls(0);
        }
    }

    function heldValue(id) {
        setDice((prevValue) =>
            prevValue.map((item) =>
                item.id !== id ? item : { ...item, isHeld: !item.isHeld }
            )
        );
    }

    const diceElements = dice.map((item) => (
        <Dice key={item.id} heldValue={() => heldValue(item.id)} dice={item} />
    ));

    return (
        <div className='main'>
            <h1 className='main--title'>Tenzies</h1>
            <h3 className='main--description'>
                Roll until all dice are the same. Click each die to freeze it at
                its current value between rolls.
            </h3>
            <div className='main--board'>{diceElements}</div>
            {!tenzies && (
                <button onClick={generateNewDice} className='main--roll'>
                    <span>Roll</span>
                </button>
            )}
            {tenzies && (
                <button onClick={generateNewDice} className='main--roll'>
                    <span>Winner!</span>
                    <Confetti width={width} height={height} />
                </button>
            )}
            <h3 className='main--time'>Number of rolls: {numberRolls} </h3>
            <h3 className='main--time'>Current time: {currentTime / 100}s</h3>
            {bestTime && <h3 className='main--time'>Best time: {bestTime}s</h3>}
        </div>
    );
}
