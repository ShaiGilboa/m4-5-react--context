import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import { GameContext } from './GameContext';
import useInterval from '../hooks/use-interval.hook';

import cookieSrc from '../cookie.svg';
import Item from './Item';

const Game = () => {
  const {
    numCookies,
    setNumCookies,
    purchasedItems,
    cookiesPerSecond,
    incrementCookies,
    handleAttemptedPurchase,
    gameItems,
    usePersistedState,
    strongerClickWorth,
    clear
  } = React.useContext(GameContext)

  const [gameTime, setGameTime] = usePersistedState((new Date()).getTime(), "gameTime")

// change title of page
  React.useEffect(() => {
    document.title = `${numCookies} cookies - Cookie Clicker Workshop`;

    return () => {
      document.title = 'Cookie Clicker Workshop';
    };
  }, [numCookies]);
// handleKeydown, space->inrecment cookies
  React.useEffect(() => {
    const handleKeydown = ev => {
      if (ev.code === 'Space') {
        incrementCookies();
      }
    };

    window.addEventListener('keydown', handleKeydown);

    return () => {
      window.removeEventListener('keydown', handleKeydown);
    };
  });

  // update cookies by new Date()
  React.useEffect(() => {
    const nowTime = (new Date()).getTime();
    const timeDiff = (nowTime - gameTime)/1000;
    const numOfGeneratedCookies = cookiesPerSecond * timeDiff
    setNumCookies(Math.round((numCookies + numOfGeneratedCookies) * 10) / 10)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  //game interval
  useInterval(() => {
    const numOfGeneratedCookies = cookiesPerSecond;
    setGameTime((new Date()).getTime())
    setNumCookies(Math.round((numCookies + numOfGeneratedCookies) * 10) / 10);
  }, 1000);

  

  return (
    <Wrapper>
      <GameArea>
        <Indicator>
          <Total><p>{numCookies}</p> cookies</Total>
          <p><strong>{cookiesPerSecond}</strong> cookies
          per second</p>
          <p><strong>{1+strongerClickWorth()}</strong> cookies
          per click</p>
        </Indicator>
        <Button onClick={()=>incrementCookies()}>
          <Cookie src={cookieSrc} />
        </Button>
      </GameArea>

      <ItemArea>
        <SectionTitle>Items:</SectionTitle>
        {gameItems.map((item, index) => {
          return (
            <Item
              key={item.id}
              index={index}
              name={item.name}
              cost={item.cost}
              value={item.value}
              type={item.type}
              id={item.id}
              numOwned={purchasedItems[item.id]}
              handleAttemptedPurchase={handleAttemptedPurchase}
            />
          );
        })}
        <Button className="clear" onClick={()=>clear()}>
          clear
        </Button>
      </ItemArea>
      <HomeLink to="/">Return home</HomeLink>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  height: 100vh;
`;
const GameArea = styled.div`
  flex: 1;
  display: grid;
  place-items: center;
`;
const Button = styled.button`
  border: none;
  background: transparent;
  cursor: pointer;
  transform-origin: center center;

  & .clear{
    width:100px;
    height:100px;
    color:white;
    position:absolute;
  }
  &:active {
    transform: scale(0.9);
  }
`;
const Cookie = styled.img`
  width: 200px;
`;
const ItemArea = styled.div`
  height: 100%;
  padding-right: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;
const SectionTitle = styled.h3`
  text-align: center;
  font-size: 32px;
  color: yellow;
`;
const Indicator = styled.div`
  position: absolute;
  width: 250px;
  top: 0;
  left: 0;
  right: 0;
  margin: auto;
  text-align: center;
`;
const Total = styled.h3`
  font-size: 28px;
  color: lime;
`;
const HomeLink = styled(Link)`
  position: absolute;
  top: 15px;
  left: 15px;
  color: #666;
`;

export default Game;
