import React from 'react';
import styled from 'styled-components';

const Item = ({
  index,
  name,
  cost,
  value,
  type,
  id,
  numOwned,
  handleAttemptedPurchase
}) => {
  const ref = React.useRef(null);

  React.useEffect(() => {
    if (index === 0) {
      ref.current.focus();
    }
  }, [index]);
  const info = `Cost: ${cost} cookies.`
  const info2 = `Each produces ${numOwned===0 ? '0' : value} more cookies/${type==='production'? 'second' : 'click'}`
  return (
    <Wrapper ref={ref} onClick={() => handleAttemptedPurchase({ cost, id })}>
      <Left>
        <Name>{name}</Name>
        <Info>
          <p>{info}</p>
          <p>{info2}</p>
        </Info>
      </Left>
      <Right>{numOwned}</Right>
    </Wrapper>
  );
};

const Wrapper = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  background: transparent;
  border: none;
  border-bottom: 1px solid #444;
  color: #fff;
  text-align: left;
  padding: 15px 0;
`;

const Left = styled.div`
  flex: 1;
`;

const Name = styled.h4`
  font-size: 22px;
`;

const Info = styled.div`
  color: #ccc;
  font-size: 15px;
`;

const Right = styled.div`
  font-size: 32px;
  padding: 0 20px;
`;

export default Item;
