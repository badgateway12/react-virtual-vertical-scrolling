import React, {useCallback} from 'react';
import './App.css';
import {VirtualScroll} from "./components/VirtualScroll";
import {RowItem} from "./components/RowItem/RowItem";

function App() {
  const itemsCount = 1000;

  const getRandomIntInRange = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  const randomInts = Array.from({length: itemsCount}, () => getRandomIntInRange(30, 90));

  const getChildHeight = useCallback((index: number) => randomInts[index], [randomInts]);

  return (
      <div className="App">
        <h1>Vertical Virtual Scroll</h1>
        <VirtualScroll
            renderAheadCount={20}
            itemCount={itemsCount}
            height={300}
            getChildHeight={getChildHeight}
            Item={RowItem}
        />
        <hr />
      </div>
  );
}

export default App;
