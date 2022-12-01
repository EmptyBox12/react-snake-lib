# Snake Game Lib

A highly customizable snake game component created using React.js

You can demo the game <a targer="_blank" href="https://react-snake-lib-demo.netlify.app/">here</a>

## Installation

```
npm i react-snake-lib
```

## Usage
You can use it simply by 
```
<Snake />
```
Or you can customize it

```
<Snake
  onScoreChange={onScoreChange}
  onGameOver={onGameOver}
  onGameStart={onGameStart}
  width="500px"
  height="500px"
  bgColor="silver"
  innerBorderColor="#b1b0b0"
  snakeSpeed={90}
  borderColor="black"
  snakeColor="#3e3e3e"
  snakeHeadColor="#1a1a1a"
  appleColor="tomato"
  borderRadius={5}
  snakeHeadRadius={1}
  borderWidth={0}
  shakeBoard={true}
  boxShadow="rgba(100, 100, 111, 0.2) 0px 7px 29px 0px"
  size={16}
  startGameText="Start Game"
  startButtonStyle={{
    color: "white",
    padding: "6px 20px",
    backgroundColor: "#1a1a1a",
    borderRadius: "10px",
    fontSize: "17px",
    fontWeight: "600",
    cursor:"pointer"
  }}
  startButtonHoverStyle={{
    backgroundColor: "#4f4d4d"
  }}
  />
```
