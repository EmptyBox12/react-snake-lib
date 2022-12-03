import React from "react";
import { storiesOf } from "@storybook/react";
import "../styles.css";

import { Snake } from "../components/Snake";

const stories = storiesOf("App Test", module);

stories.add('App', () => {
  function logger(score) {
    score && console.log(score);
    console.log("worked")
  }
  return (
    <div style={{height:"500px", width:"500px"}}>
      <Snake
        onScoreChange={logger}
        onGameOver={logger}
        onGameStart={logger}
        snakeHeadColor="orange"
        snakeColor="darkblue"
        width="100%"
        height="100%"
        bgColor="gray"
        borderColor="red"
        innerBorderColor="gray"
        startGameText="Oyunu Başlat"
        size={10}
        shakeBoard={true}
        noWall={true}
      />
    </div>


  )
})