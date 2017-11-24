import React, { Component } from 'react';
import * as THREE from 'three';
import sizeMe from 'react-sizeme';
//import OBJLoader from 'three-react-obj-loader';

var OrbitControls = require('react-cubeview/lib/OrbitControls')(THREE)

let renderer, scene, camera, mainSphere, windowSize = { width: 0, height: 0 }, animation, controls;

class Container3d extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.init();
    this.updateDimensions();
    window.addEventListener("resize", this.updateDimensions.bind(this));
  }

  componentWillUnmount() {
    renderer = null;
    scene = null;
    camera = null;
    window.removeEventListener("resize", this.updateDimensions.bind(this));
  }

  /**
   * Defines the angles - useful when using OrbitControls from react-cubeview
   * @param {*} phi 
   * @param {*} theta 
   */
  setAngles(phi, theta) {
    controls.setPolarAngle(phi);
    controls.setAzimuthalAngle(theta);
  }

  getSize() {
    var { width, percentageWidth, aspect } = this.props;
    if (percentageWidth)
      width = window.innerWidth * parseFloat(percentageWidth) / 100;

    var height = width / aspect;

    height = 200;
    console.log("size", width, height);
    return ({ width: width, height: height });
  }

  updateDimensions() {
    //Get the proportions from screen

    var { width, percentageWidth, aspect, fitScreen, marginLeft, marginTop, marginBottom, height } = this.props;

    if (percentageWidth) {
      width = parseInt(window.innerWidth * parseInt(percentageWidth) / 100.0);
    }

    if (aspect) {
      height = width / aspect;
    }

    if (fitScreen) {
      height = window.innerHeight;
      if (marginTop) { height = height - marginTop; }

      if (marginBottom) {
        height = height - marginBottom;
      }

    }

    var canvas = this.refs.threeCanvas;

    canvas.height = height;
    renderer.setSize(width, height);
    camera.aspect = width / height;

    camera.updateProjectionMatrix();
  }

  init() {
    const { width, height } = this.getSize();

    const canvas = this.refs.threeCanvas;
    canvas.height = height;
    const marginTop = this.props.marginTop;

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 20, 20);
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this._createScene(canvas);
    var _this = this;

    this._render = function () {
      animation = requestAnimationFrame(_this._render);

      var { phi, theta } = _this.props;

      if (phi && theta && controls) {
        controls.setPolarAngle(phi);
        controls.setAzimuthalAngle(theta);
      }

      if (_this.props.update) {
        _this.props.update(scene, camera, renderer);
      }

      renderer.render(scene, camera);
      // this.updateRendererDimensions();
    }

    this._render();
  }

  setAngles(phi, theta) {
    console.log(phi, theta);
  }

  reloadScene(newScene) {
    if (newScene)
      scene = newScene;
    else
      scene = new THREE.Scene();

    if (this.props.setup) {
      this.props.setup(scene, camera, renderer);
    }
    //this.updateDimensions();
  }

  //Insert all 3D elements here
  _createScene(canvas) {
    console.log(this.props);

    const { addControls, addGrid, addLight, enableZoom, enableKeys, enablePan } = this.props;

    if (addGrid != undefined ? addGrid : true) {
      var gridXZ = new THREE.GridHelper(20, 20);
      gridXZ.name = "grid";
      scene.add(gridXZ);

      var planeGeometry = new THREE.PlaneGeometry(20, 20);
      planeGeometry.rotateX(- Math.PI / 2);
      var planeMaterial = new THREE.ShadowMaterial({ opacity: 0.4 });
      var plane = new THREE.Mesh(planeGeometry, planeMaterial);
      plane.receiveShadow = true;
      scene.add(plane);
    }

    if (addControls != undefined ? addControls : true) {
      controls = new OrbitControls(camera, canvas);
      controls.enablePan = enablePan != undefined ? enablePan : true;
      controls.enableZoom = enableZoom != undefined ? enableZoom : true;
      controls.enableKeys = enableKeys != undefined ? enableKeys : true;
    }

    if (addLight != undefined ? addLight : true) {
      scene.add(new THREE.AmbientLight(0xf0f0f0));
      var light = new THREE.SpotLight(0xffffff, 1.5);
      light.position.set(50, 50, 50);
      light.castShadow = true;
      light.shadow = new THREE.LightShadow(new THREE.PerspectiveCamera(70, 1, 10, 1000));
      light.shadow.bias = -0.000222;
      light.shadow.mapSize.width = 1024;
      light.shadow.mapSize.height = 1024;
      scene.add(light);
    }

    var _this = this;

    if (this.props.setup) {
      this.props.setup(scene, camera, renderer);
    }

  }

  render() {
    return (
      <div>
        <canvas ref="threeCanvas" ></canvas>
      </div>
    );
  }

}

export default Container3d;