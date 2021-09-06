import { useEffect, useState, useRef } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Button,
  DialogTitle
} from "@material-ui/core";
import Card from "./card";
import styled, {css} from "styled-components";

const Bold=styled.span`
font-weight: 600;
text-transform: uppercase;
`;
const AppDiv=styled.div`
position: absolute;
width:100%;
height: 100%;
`;
const Header=styled.header`
  position: relative;
  width: 100%;
  text-align: center;
  margin-bottom: 8px;
  `;

const Footer=styled.footer`
  width: 360px;
  position: relative;
  margin: 0 auto;
  padding: 10px 4px;
  margin-top: 10px;
  `;
  
  const Score=styled.div`
    justify-content: center;
    display: flex;
    `;

  const Restart=styled.div`
    display: flex;
    justify-content: center
  `;
const Container=styled.div`
  border: 1px solid #DEDEDE;
  padding: 12px;
  box-shadow: 0 0 4px 4px #DEDEDE; 
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-template-rows: repeat(5, 1fr);
  justify-items: center;
  align-items: stretch;
  gap: 1rem;
  margin: 0 auto;
  width: 555px;
  height: 460px;
  perspective: 100%;
  max-width: 720px;
`;

const uniqueElementsArray = [
  {
    type: "C",
    image: require(`./images/c.png`)
  },
  {
    type: "C#",
    image: require(`./images/c#.png`)
  },
  {
    type: "C++",
    image: require(`./images/c++.png`)
  },
  {
    type: "Crystal",
    image: require(`./images/crystal.png`)
  },
  {
    type: "Dart",
    image: require(`./images/dart.png`)
  },
  {
    type: "Go",
    image: require(`./images/go.png`)
  },
  {
    type: "Java",
    image: require(`./images/java.png`)
  },
  {
    type: "JavaScript",
    image: require(`./images/javascript.png`)
  },
  {
    type: "Php",
    image: require(`./images/php.png`)
  },
  {
    type: "Python",
    image: require(`./images/python.png`)
  },
  {
    type: "R",
    image: require(`./images/r.png`)
  },
  {
    type: "Ruby",
    image: require(`./images/ruby.png`)
  },
  {
    type: "Rust",
    image: require(`./images/rust.png`)
  },
  {
    type: "SQL",
    image: require(`./images/sql.png`)
  },
  {
    type: "Swift",
    image: require(`./images/swift.png`)
  },
];

function shuffleCards(array) {
  const length = array.length;
  for (let i = length; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * i);
    const currentIndex = i - 1;
    const temp = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temp;
  }
  return array;
}
const App=()=> {

  const [cards, setCards] = useState(
    shuffleCards.bind(null, uniqueElementsArray.concat(uniqueElementsArray))
  );
  const [openCards, setOpenCards] = useState([]);
  const [clearedCards, setClearedCards] = useState({});
  const [shouldDisableAllCards, setShouldDisableAllCards] = useState(false);
  const [moves, setMoves] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [bestScore, setBestScore] = useState(
    JSON.parse(sessionStorage.getItem("bestScore")) || Number.POSITIVE_INFINITY
  );
  const timeout = useRef(null);

  const disable = () => {
    setShouldDisableAllCards(true);
  };
  const enable = () => {
    setShouldDisableAllCards(false);
  };

  const checkCompletion = () => {
    if (Object.keys(clearedCards).length === uniqueElementsArray.length) {
      setShowModal(true);
      const highScore = Math.min(moves, bestScore);
      setBestScore(highScore);
      sessionStorage.setItem("bestScore", highScore);
    }
  };
  const evaluate = () => {
    const [first, second] = openCards;
    enable();
    if (cards[first].type === cards[second].type) {
      setClearedCards((prev) => ({ ...prev, [cards[first].type]: true }));
      setOpenCards([]);
      return;
    }
    // This is to flip the cards back after 500ms duration
    timeout.current = setTimeout(() => {
      setOpenCards([]);
    }, 500);
  };
  const handleCardClick = (index) => {
    if (openCards.length === 1) {
      setOpenCards((prev) => [...prev, index]);
      setMoves((moves) => moves + 1);
      disable();
    } else {
      clearTimeout(timeout.current);
      setOpenCards([index]);
    }
  };

  useEffect(() => {
    let timeout = null;
    if (openCards.length === 2) {
      timeout = setTimeout(evaluate, 300);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [openCards]);

  useEffect(() => {
    checkCompletion();
  }, [clearedCards]);

  const checkIsFlipped = (index) => {
    return openCards.includes(index);
  };

  const checkIsInactive = (card) => {
    return Boolean(clearedCards[card.type]);
  };

  const handleRestart = () => {
    setClearedCards({});
    setOpenCards([]);
    setShowModal(false);
    setMoves(0);
    setShouldDisableAllCards(false);
    // set a shuffled deck of cards
    setCards(shuffleCards(uniqueElementsArray.concat(uniqueElementsArray)));
  };

  return (
    <AppDiv>
      <Header>
        <h3>Play the Flip card game</h3>
        <div>
          Select two cards with same content consequtively to make them vanish
        </div>
      </Header>
      <Container>
        {cards.map((card, index) => {
          return (
            <Card
              key={index}
              card={card}
              index={index}
              isDisabled={shouldDisableAllCards}
              isInactive={checkIsInactive(card)}
              isFlipped={checkIsFlipped(index)}
              onClick={handleCardClick}
            />
          );
        })}
      </Container>
      <Footer>
        <Score>
          <div>
            <Bold>Moves:</Bold> {moves}
          </div>
          {sessionStorage.getItem("bestScore") && (
            <div style={{marginLeft: '10px'}}>
              <Bold>Best Score:</Bold> {bestScore}
            </div>
          )}
        </Score>
        <Restart>
          <Button onClick={handleRestart} color="primary" variant="contained">
            Restart
          </Button>
        </Restart>
      </Footer>
      <Dialog
        open={showModal}
        disableBackdropClick
        disableEscapeKeyDown
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Hurray!!! You completed the challenge
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            You completed the game in {moves} moves. Your best score is{" "}
            {bestScore} moves.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRestart} color="primary">
            Restart
          </Button>
        </DialogActions>
      </Dialog>
    </AppDiv>
  );
}
export default App;