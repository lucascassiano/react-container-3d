import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import Container3d from './../src';
import "./../src/css/style.css";

storiesOf('Button', module)
  .add('with grid', () => (
    <div className="canvas-3d">
      <Container3d marginTop={30} aspect={16 / 9} percentageWidth={"100%"} fitScreen key={"c3d"} marginBottom={110}/>
    </div>

  ))
  .add('without grid', () => (
    <div className="canvas-3d">
    <Container3d marginTop={30} aspect={16 / 9} percentageWidth={"100%"} fitScreen key={"c3d"} marginBottom={110} addGrid={false}/>
    </div>
  ))
  .add('zoom disabled', () => (
    <div className="canvas-3d">
    <Container3d marginTop={30} aspect={16 / 9} percentageWidth={"100%"} fitScreen key={"c3d"} marginBottom={110} enableZoom = {false}/>
    </div>
  ));
