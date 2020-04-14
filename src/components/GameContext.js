import React, { createContext, useEffect } from 'react';
import {items} from './Data'

export const GameContext = createContext(null)


const GameContextProvider = ({children}) => {

  const usePersistedState = (defaultValue, key) => {
    const [state, setState] = React.useState(
      () => JSON.parse(localStorage.getItem(key)) || defaultValue
    );
    useEffect(() => {
      localStorage.setItem(key, JSON.stringify(state));
    }, [key, state]);
    return [state, setState];
  }

  const [numCookies, setNumCookies] = usePersistedState(1000, "numCookies");
  const [gameItems, setGameItems] = usePersistedState(items,"gameItems")

  const totalItems = {};
  gameItems.forEach(item => {
    totalItems[item.id] = 0;
  });

  const [purchasedItems, setPurchasedItems] = usePersistedState(totalItems, "purchasedItems");

  const strongerClickWorth = () => {
    let strongerClickWorth=0;
    gameItems.forEach(item => {
      if(item.type==='click')(strongerClickWorth += item.value*purchasedItems[item.id])
    })
    return strongerClickWorth;
  }

  const calculateCookiesPerSecond = () => {
    let ret = 0;
    for (const key in purchasedItems) {
      const theItem = gameItems.find(item=>item.id===key)
      if(theItem.type==='production') ret+=purchasedItems[key]*theItem.value;
    }
    return roundNumber(ret);
  };

  const incrementCookies = () => {
    setNumCookies(c => roundNumber(c + 1 + strongerClickWorth()));
  };

  const roundNumber = (num) => {
    return Math.round(num * 10) / 10
  }

  const handleAttemptedPurchase = ({ cost, id }) => {
    if (numCookies < cost) {
      alert('Cannot afford item');
      return;
    }

    setNumCookies(roundNumber(numCookies - cost));

    if(purchasedItems[id]!==0){
      let newGameItems = [...gameItems]
      const theItem = newGameItems.find(item=>item.id===id);
      const itemValue = newGameItems.find(item=>item.id===id).value;
      theItem.cost = roundNumber(cost*1.3);
      theItem.value = roundNumber(itemValue*1.1);

      setGameItems(newGameItems)
    }
    setPurchasedItems({
      ...purchasedItems,
      [id]: purchasedItems[id] + 1
    });
  }

  const clear = () => {
    setNumCookies(1000);
    setPurchasedItems(totalItems);
    setGameItems(items);
  }

  return (
    <GameContext.Provider value={{
        numCookies,
        setNumCookies,
        purchasedItems,
        setPurchasedItems,
        cookiesPerSecond: calculateCookiesPerSecond(),
        incrementCookies,
        handleAttemptedPurchase,
        gameItems,
        usePersistedState,
        strongerClickWorth,
        clear,
      }}>
      {children}
    </GameContext.Provider>
  )
}

export default GameContextProvider