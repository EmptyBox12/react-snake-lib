import React, { useEffect, useState } from 'react'

export const Board = ({ map, setMap, length, snake, apple, shake, width, height, bgColor, borderColor, innerBorderColor, snakeColor, snakeHeadColor, appleColor, borderRadius, direction, snakeHeadRadius, createMap, borderWidth, boxShadow, start, startGame, startGameText, startButtonStyle, startButtonHoverStyle, shakeBoard }) => {
  const [hover, setHover] = useState(false);
  useEffect(() => {
    createMap(length)
  }, [length])

  useEffect(() =>{
    if(start){
      setHover(false);
    }
  }, [start])

  useEffect(() => {
    if (snake && snake.length > 0 && map && map.length > 0) {
      let newMap = [];
      map.map((element, y) => {
        let row = []
        element.map((cell, x) => {
          row.push({
            snake: snake.some(snakeValue => snakeValue.x === x && snakeValue.y === y),
            apple: apple.x === x && apple.y === y,
            x: x, y: y,
            head: x === snake[snake.length - 1].x && y === snake[snake.length - 1].y ? true : false,
            tail: x === snake[0].x && y === snake[0].y ? true : false,
          });
        })
        newMap.push(row);
      })
      setMap(newMap)
    }
  }, [snake, apple])

  return (
    <div className={shake && shakeBoard ? "snakeBoard snakeBoardShaking" : "snakeBoard"} style={{ width: width, height: height, boxShadow: boxShadow, borderRadius: `${borderRadius}px`, backgroundColor: !start ? bgColor : "white" }}>
      {start && map.map((element, index) => {
        return (
          <div key={index} className='snakeBoardRow'>
            {
              element.map((cell, index) => {
                return <span
                  key={index}
                  className='snakeBoardCell'
                  style={{
                    backgroundColor: cell.head ? snakeHeadColor : cell.snake ? snakeColor : cell.apple ? appleColor : bgColor,
                    borderLeftWidth: cell.x === 0 ? `${borderWidth}px` : "1px",
                    borderRightWidth: cell.x === length - 1 ? `${borderWidth}px` : "1px",
                    borderTopWidth: cell.y === 0 ? `${borderWidth}px` : "1px",
                    borderBottomWidth: cell.y === length - 1 ? `${borderWidth}px` : "1px",
                    borderStyle: "solid",
                    borderTopLeftRadius: cell.head && (direction === "up" || direction === "left") ? `${snakeHeadRadius}px` : cell.x === 0 && cell.y === 0 ? `${borderRadius}px` : "0px",
                    borderBottomLeftRadius: cell.head && (direction === "down" || direction === "left" || direction === null) ? `${snakeHeadRadius}px` : cell.x === 0 && cell.y === length - 1 ? `${borderRadius}px` : "0px",
                    borderTopRightRadius: cell.head && (direction === "up" || direction === "right") ? `${snakeHeadRadius}px` : cell.x === length - 1 && cell.y === 0 ? `${borderRadius}px` : "0px",
                    borderBottomRightRadius: cell.head && (direction === "down" || direction === "right" || direction === null) ? `${snakeHeadRadius}px` : cell.x === length - 1 && cell.y === length - 1 ? `${borderRadius}px` : "0px",
                    borderTopColor: cell.head ? snakeHeadColor : cell.snake ? snakeColor : cell.apple ? appleColor : cell.y === 0 ? borderColor : innerBorderColor, //"#eaeaea",
                    borderLeftColor: cell.head ? snakeHeadColor : cell.snake ? snakeColor : cell.apple ? appleColor : cell.x === 0 ? borderColor : innerBorderColor,
                    borderRightColor: cell.head ? snakeHeadColor : cell.snake ? snakeColor : cell.apple ? appleColor : cell.x === length - 1 ? borderColor : innerBorderColor,
                    borderBottomColor: cell.head ? snakeHeadColor : cell.snake ? snakeColor : cell.apple ? appleColor : cell.y === length - 1 ? borderColor : innerBorderColor,
                  }}>
                </span>
              })
            }
          </div>
        )
      })}
      {!start && <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={hover ? { ...startButtonStyle, ...startButtonHoverStyle } : startButtonStyle} onClick={() => startGame()}>{startGameText}</div>}
    </div>
  )
}
