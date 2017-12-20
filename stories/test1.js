import React, { Component } from "react";
import ReactDOM from "react-dom";
import * as THREE from "three";
import Container3d from "./../src";

export default class test1 extends Component {
  render() {
    return (
      <div className="canvas-3d">
        <Container3d
          marginTop={30}
          aspect={16 / 9}
          percentageWidth={"100%"}
          fitScreen
          marginBottom={110}
        />
        <canvas
          className="canvas-2d"
          ref={c => (this.c2d = c)}
          width={500}
          key={"c2d"}
          height={500}
        />
      </div>
    );
  }
}
