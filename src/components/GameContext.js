import React, { createContext, useEffect } from 'react';
import {items} from './Data'

import useInterval from '../hooks/use-interval.hook';

export const GameContext = createContext(null)

const usePersistedState = (defaultValue, key) => {
  const [state, setState] = React.useState(
    () => JSON.parse(localStorage.getItem(key)) || defaultValue
  );
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);
  return [state, setState];
}

const GameContextProvider = ({children}) => {
  const [numCookies, setNumCookies] = usePersistedState(1000, "numCookies");

  const [purchasedItems, setPurchasedItems] = usePersistedState({
      cursor: 0,
      grandma: 0,
      farm: 0
    },
    "purchasedItems"
  );

  const calculateCookiesPerSecond = (purchasedItems) => {
    return purchasedItems.cursor + purchasedItems.grandma*10 + purchasedItems.farm*80;
  };

  useInterval(() => {
    const numOfGeneratedCookies = calculateCookiesPerSecond(purchasedItems);

    setNumCookies(numCookies + numOfGeneratedCookies);
  }, 1000);

  return (
    <GameContext.Provider value={{
        numCookies,
        setNumCookies,
        purchasedItems,
        setPurchasedItems,
        cookiesPerSecond: calculateCookiesPerSecond(purchasedItems)
      }}>
      {children}
    </GameContext.Provider>
  )
}

export default GameContextProvider