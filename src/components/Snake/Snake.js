import React, { useEffect, useState } from "react";
import "../../styles.css";
import { Board } from "../Board";

export const Snake = (props) => {
  const [snake, setSnake] = useState([
    { x: 0, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: 2 },
  ]);
  const [map, setMap] = useState([]);
  const [apple, setApple] = useState({});
  const [direction, setDirection] = useState(null);
  const [moveInterval, setMoveInternal] = useState("");
  const [moveTrigger, setMoveTrigger] = useState(false);
  const [start, setStart] = useState(false);
  const [score, setScore] = useState(0);
  const [shake, setShake] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const width = props.width ?? "500px"
  const height = props.height ?? "500px";
  const bgColor = props.bgColor ?? "white";
  const borderColor = props.borderColor ?? "black";
  const innerBorderColor = props.innerBorderColor ?? "white"
  const size = props.size ?? 16;
  const snakeColor = props.snakeColor ?? "#3e3e3e";
  const snakeHeadColor = props.snakeHeadColor ?? "#1a1a1a";
  const snakeSpeed = props.snakeSpeed ?? 100;
  const appleColor = props.appleColor ?? "tomato";
  const borderRadius = props.borderRadius ?? 5;
  const snakeHeadRadius = props.snakeHeadRadius ?? 1;
  const borderWidth = props.borderWidth ?? 0;
  const shakeBoard = props.shakeBoard ?? true;
  const boxShadow = props.boxShadow ?? "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px";
  const noWall = props.noWall ?? false;
  const startButtonStyle = props.startButtonStyle ?? {
    borderRadius: "5px",
    border: "1px solid silver",
    cursor: "pointer",
    padding: "3px",
    backgroundColor: "white"
  };
  const startButtonHoverStyle = props.startButtonHoverStyle ?? {
    backgroundColor: "#f4f1f1"
  };

  const startGameText = props.startGameText ?? "Start Game"

  function moveDirection(e) {
    if (!start) return;
    if (e.code === "KeyS" || e.key == "ArrowDown") {
      if (direction === "up") return;
      setDirection("down");
    } else if (e.code === "KeyW" || e.key == "ArrowUp") {
      if (direction === "down") return;
      setDirection("up");
    } else if (e.code === "KeyA" || e.key == "ArrowLeft") {
      if (direction === "right") return;
      setDirection("left");
    } else if (e.code === "KeyD" || e.key == "ArrowRight") {
      if (direction === "left") return;
      setDirection("right");
    }
  }

  function gameOverHandler(element) {
    clearInterval(moveInterval);
    setStart(false);
    setShake(true);
    setGameOver(true);
    setTimeout(() => { setShake(false) }, 200);
    props.onGameOver && props.onGameOver();
    return { x: element.x, y: element.y };
  }
  function startGame() {
    setStart(true);
    setGameOver(false)
    let board = createMap(size);
    setScore(0);
    setSnake([
      { x: 0, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: 2 },
    ]);
    setDirection(null);
    placeApple(board);
    props.onGameStart && props.onGameStart();
  }
  function createMap(length) {
    let board = []
    for (let i = 0; i < length; i++) {
      let row = [];
      for (let j = 0; j < length; j++) {
        if ((j === 0 && i === 0) || (j === 0 && i === 1) || (j === 0 && i === 2)) {
          row.push({ snake: true, apple: false, x: j, y: i, head: i === 2 ? true : false });
        } else {
          row.push({ snake: false, apple: false, x: j, y: i });
        }
      }
      board.push(row);
    }
    setMap(board);
    return board;
  }

  function placeApple(board) {
    let freeCell = false;
    while (true) {
      let array = board ?? map;
      array.map((element => {
        if (element.some(i => !i.apple && !i.snake)) {
          freeCell = true;
        }
      }))
      if (!freeCell) {
        break;
      }

      let x = Math.floor(Math.random() * size);
      let y = Math.floor(Math.random() * size);
      if (!getCellInfo(x, y, board).snake && !getCellInfo(x, y, board).apple) {
        setApple({ x: x, y: y });
        break;
      }
    }
  }
  function getCellInfo(x, y, board) {
    if (x === size || y === size || x < 0 || y < 0) return false;
    return board ? board[y][x] : map[y][x];
  }

  useEffect(() => {
    props.onScoreChange && props.onScoreChange(score);
  }, [score])

  useEffect(() => {
    window.document.addEventListener("keydown", moveDirection);
    return () => {
      window.document.removeEventListener("keydown", moveDirection);
    };
  }, [direction, start]);

  useEffect(() => {
    clearInterval(moveInterval);
    if (direction && start) {
      setMoveTrigger((value) => !value);
      let interval = setInterval(() => {
        setMoveTrigger((value) => !value);
      }, snakeSpeed);
      setMoveInternal(interval);
    }
  }, [direction]);

  useEffect(() => {
    let grow = false;
    let gameOver = false;
    if (!start) return;
    let newSnake = snake.map((element, index) => {
      if (index === snake.length - 1) {
        if (direction === "down") {
          if (element.y + 1 === size && !noWall) {
            gameOver = true;
            return gameOverHandler(element);
          }
          let nextCell = getCellInfo(element.x, element.y + 1);
          if (nextCell.snake) {
            gameOver = true;
            return gameOverHandler(element);
          } else if (nextCell.apple) {
            grow = true;
          }
          if (noWall && element.y + 1 === size) {
            return { y: 0, x: element.x };
          }
          return { y: element.y + 1, x: element.x };
        } else if (direction === "right") {
          if (element.x + 1 === size && !noWall) {
            gameOver = true;
            return gameOverHandler(element);
          }
          let nextCell = getCellInfo(element.x + 1, element.y);
          if (nextCell.snake) {
            gameOver = true;
            return gameOverHandler(element);
          } else if (nextCell.apple) {
            grow = true;
          }
          if (noWall && element.x + 1 === size) {
            return { y: element.y, x: 0 };
          }
          return { y: element.y, x: element.x + 1 };
        } else if (direction === "up") {
          if (element.y - 1 === -1 && !noWall) {
            gameOver = true;
            return gameOverHandler(element);
          }
          let nextCell = getCellInfo(element.x, element.y - 1);
          if (nextCell.snake) {
            gameOver = true;
            return gameOverHandler(element);
          } else if (nextCell.apple) {
            grow = true;
          }
          if(noWall && element.y - 1 === -1 ){
            return { y: size - 1, x: element.x };
          }
          return { y: element.y - 1, x: element.x };
        } else if (direction === "left") {
          if (element.x - 1 === -1 && !noWall) {
            gameOver = true;
            return gameOverHandler(element);
          }
          let nextCell = getCellInfo(element.x - 1, element.y);
          if (nextCell.snake) {
            gameOver = true;
            return gameOverHandler(element);
          } else if (nextCell.apple) {
            grow = true;
          }
          if(noWall && element.x - 1 === -1 ){
            return { y: element.y, x: size - 1 };
          }
          return { y: element.y, x: element.x - 1 };
        }
      } else {
        if (!(index + 1 > snake.length)) {
          return { y: snake[index + 1].y, x: snake[index + 1].x };
        }
      }
    });
    if (grow) {
      setScore(oldScore => oldScore + 1);
      let moveDirection = "up";
      let x = newSnake[0].x;
      let y = newSnake[0].y;

      if (newSnake.length > 1) {
        let x2 = newSnake[1].x;
        let y2 = newSnake[1].y;
        if (x2 - x > 0) {
          moveDirection = "right";
        } else if (x2 - x < 0) {
          moveDirection = "left";
        } else if (y2 - y > 0) {
          moveDirection = "down";
        } else {
          moveDirection = "up";
        }
      } else {
        moveDirection = direction;
      }

      switch (moveDirection) {
        case "down":
          if (y - 1 > -1 && !getCellInfo(snake[0].x, snake[0].y - 1).snake && !getCellInfo(snake[0].x, snake[0].y - 1).apple) {
            newSnake.unshift({ x: x, y: y - 1 });
          } else if (x - 1 > -1 && !getCellInfo(snake[0].x - 1, snake[0].y).snake && !getCellInfo(snake[0].x - 1, snake[0].y).apple) {
            newSnake.unshift({ x: x - 1, y: y });
          } else {
            newSnake.unshift({ x: x + 1, y: y });
          }
          break;
        case "up":
          if (y + 1 < size && !getCellInfo(snake[0].x, snake[0].y + 1).snake && !getCellInfo(snake[0].x, snake[0].y + 1).apple) {
            newSnake.unshift({ x: x, y: y + 1 });
          } else if (x - 1 > -1 && !getCellInfo(snake[0].x - 1, snake[0].y).snake && !getCellInfo(snake[0].x - 1, snake[0].y).apple) {
            newSnake.unshift({ x: x - 1, y: y });
          } else {
            newSnake.unshift({ x: x + 1, y: y });
          }
          break;
        case "left":
          if (x + 1 < size && !getCellInfo(snake[0].x + 1, snake[0].y).snake && !getCellInfo(snake[0].x + 1, snake[0].y).apple) {
            newSnake.unshift({ x: x + 1, y: y });
          } else if (y - 1 > -1 && !getCellInfo(snake[0].x, snake[0].y - 1).snake && !getCellInfo(snake[0].x, snake[0].y - 1).apple) {
            newSnake.unshift({ x: x, y: y - 1 });
          } else {
            newSnake.unshift({ x: x, y: y + 1 });
          }
          break;
        case "right":
          if (x - 1 > -1 && !getCellInfo(snake[0].x - 1, snake[0].y).snake && !getCellInfo(snake[0].x - 1, snake[0].y).apple) {
            newSnake.unshift({ x: x - 1, y: y });
          } else if (y - 1 > -1 && !getCellInfo(snake[0].x, snake[0].y - 1).snake && !getCellInfo(snake[0].x, snake[0].y - 1).apple) {
            newSnake.unshift({ x: x, y: y - 1 });
          } else {
            newSnake.unshift({ x: x, y: y + 1 });
          }
          break;
      }
    }
    if (!gameOver) {
      setSnake(newSnake);
      if (grow) {
        placeApple();
      }
    }
  }, [moveTrigger]);

  return (
    <Board
      map={map}
      setMap={setMap}
      length={size}
      snake={snake}
      apple={apple}
      shake={shake}
      width={width}
      height={height}
      bgColor={bgColor}
      borderColor={borderColor}
      innerBorderColor={innerBorderColor}
      snakeColor={snakeColor}
      snakeHeadColor={snakeHeadColor}
      appleColor={appleColor}
      borderRadius={borderRadius}
      createMap={createMap}
      direction={direction}
      snakeHeadRadius={snakeHeadRadius}
      borderWidth={borderWidth}
      boxShadow={boxShadow}
      startGame={startGame}
      gameOver={gameOver}
      start={start}
      startButtonStyle={startButtonStyle}
      startButtonHoverStyle={startButtonHoverStyle}
      startGameText={startGameText}
      shakeBoard={shakeBoard}
    />
  );
}
