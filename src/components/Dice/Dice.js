import React from 'react';
import './Dice.css';

export function Dice({ dice, heldValue }) {
    function diceDots() {
        const elements = [];
        for (let i = 1; i <= dice.value; i++) {
            elements.push(<div key={i} className='dice-dot'></div>);
        }
        return elements;
    }

    const diceDotsElement = diceDots();

    return (
        <div
            onClick={heldValue}
            className={
                dice.isHeld ? 'main--board__item active' : 'main--board__item'
            }
        >
            <div className='dice'>{diceDotsElement}</div>
        </div>
    );
}
