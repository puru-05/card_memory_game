import React from "react";
//import classnames from "classnames";
import defaultLogo from "./images/defaultLogo.png";
import  styled  from "styled-components";
const CardDiv=styled.div`
    width: 79px;
    height: 79px;
    border-radius: 4px;
    box-shadow: 2px 2px 4px 4px #DEDEDE;
    transition: 0.3s;
    transform-style: preserve-3d;
    position: relative;
    cursor: pointer;
    `;
    
    const Image=styled.img`
      width: 100%;
      height: 100%;
    `;
    
    const CardFace=styled.div`
      backface-visibility: hidden;
      position: absolute;
      width: 79px;
      height: 79px;
      `;
      const CardBackFace=styled.div`
      width: 79px;
      height: 79px;
      transform: rotateY(180deg);
      `;
    const IsFlipped=styled.div`
      transform: rotateY(180deg);
    `;
  
    const IsInActive=styled.div`
      // visibility: hidden;
      opacity: 0;
`;

const Card = ({ onClick, card, index, isInactive, isFlipped, isDisabled }) => {
  const handleClick = () => {
      console.log("click 1", card.image.default)
    !isFlipped && !isDisabled && onClick(index);
  };

  return (
      <>
    {isFlipped ? <IsFlipped onClick={handleClick}>
      <CardFace>
        <Image src={defaultLogo} alt="defaultLogo" />
      </CardFace>
      <CardBackFace>
        <Image src={card.image.default} alt="defaultLogo" />
      </CardBackFace>
    </IsFlipped> : (isInactive) ? <IsInActive onClick={handleClick}>
      <CardFace>
        <Image src={defaultLogo} alt="defaultLogo" />
      </CardFace>
      <CardBackFace>
        <Image src={card.image.default} alt="defaultLogo" />
      </CardBackFace>
    </IsInActive> : <CardDiv onClick={handleClick}>
      <CardFace>
        <Image src={defaultLogo} alt="defaultLogo" />
      </CardFace>
      <CardBackFace>
        <Image src={card.image.default} alt="defaultLogo" />
      </CardBackFace>
    </CardDiv>}
    </>
  );
};

export default Card;