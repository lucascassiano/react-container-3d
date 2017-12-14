import React from "react";
import { storiesOf } from "@kadira/storybook";
//import { action } from '@storybook/addon-actions';
import * as THREE from "three";
import Container3d from "./../src";

import "./../src/css/style.css";

let cube;
let t = 0;

function setup(scene, camera, renderer) {
  var geometry = new THREE.BoxGeometry(5, 5, 5);
  var material = new THREE.MeshBasicMaterial({ color: 0x0088aa });
  cube = new THREE.Mesh(geometry, material);
  scene.add(cube);
}

function update(scene, camera, renderer) {}

function onHoverStart(obj) {
  console.log("begin hover object", obj.material);

  obj.originalColor = obj.material.color.getHex();
  obj.material.color.setHex(0xff0000);
  if (obj instanceof THREE.Mesh) {
    console.log("is mesh");
    

    //obj.material.color = "#ff0000";
  }

  //action("hover");
  //action('button-click');
}

function onHoverEnd(obj) {
  console.log("end hovering object", obj);
  if (obj.originalColor) obj.material.color.setHex(obj.originalColor);
}

storiesOf("Button", module)
  .add("with grid", () => (
    <div className="canvas-3d">
      <Container3d
        marginTop={30}
        aspect={16 / 9}
        percentageWidth={"100%"}
        fitScreen
        key={"a"}
        marginBottom={110}
      />
    </div>
  ))

  .add("without grid", () => (
    <div className="canvas-3d">
      <Container3d
        marginTop={30}
        aspect={16 / 9}
        percentageWidth={"100%"}
        fitScreen
        key={"b"}
        marginBottom={110}
        addGrid={false}
        setup={setup}
      />
    </div>
  ))

  .add("zoom disabled", () => (
    <div className="canvas-3d">
      <Container3d
        marginTop={30}
        aspect={16 / 9}
        percentageWidth={"100%"}
        fitScreen
        key={"c"}
        marginBottom={110}
        enableZoom={false}
        setup={setup}
      />
    </div>
  ))

  .add("with Hover", () => (
    <div className="canvas-3d">
      <Container3d
        marginTop={30}
        aspect={16 / 9}
        percentageWidth={"100%"}
        fitScreen
        key={"d"}
        marginBottom={110}
        enableZoom={false}
        onHoverStart={onHoverStart}
        onHoverEnd={onHoverEnd}
        addGrid={false}
        setup={setup}
        update={update}
      />
    </div>
  ));
