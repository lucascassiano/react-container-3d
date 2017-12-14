import React, { Component } from "react";
import ReactDOM from "react-dom";

import * as THREE from "three";
import sizeMe from "react-sizeme";
//import OBJLoader from 'three-react-obj-loader';
import * as CSS3DRenderer from "./CSS3DRenderer";

var OrbitControls = require("react-cubeview/lib/OrbitControls")(THREE);

let renderer,
  scene,
  camera,
  mainSphere,
  windowSize = { width: 0, height: 0 },
  animation,
  controls;

// for interactive hovering
let mouse = new THREE.Vector2(),
  raycaster,
  INTERSECTED;

//for css rendering
let renderer2d, scene2d, canvas2d;

class Container3d extends Component {
  constructor(props) {
    super(props);
    this.onHoverStart = this.onHoverStart.bind(this);
    this.onHoverEnd = this.onHoverEnd.bind(this);
    //this.onHover = this.onHover.bind(this);
    this.onDocumentMouseMove = this.onDocumentMouseMove.bind(this);
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
    return { width: width, height: height };
  }

  updateDimensions() {
    //Get the proportions from screen

    var {
      width,
      percentageWidth,
      aspect,
      fitScreen,
      marginLeft,
      marginTop,
      marginBottom,
      height
    } = this.props;

    if (percentageWidth) {
      width = parseInt(window.innerWidth * parseInt(percentageWidth) / 100.0);
    }

    if (aspect) {
      height = width / aspect;
    }

    if (fitScreen) {
      height = window.innerHeight;
      if (marginTop) {
        height = height - marginTop;
      }

      if (marginBottom) {
        height = height - marginBottom;
      }
    }

    var canvas = this.refs.threeCanvas;
    //var canvas2d = this.refs.cssCanvas;

    canvas.height = height;
    canvas2d.height = height;

    renderer.setSize(width, height);
    renderer2d.setSize(width, height);
    camera.aspect = width / height;

    camera.updateProjectionMatrix();
  }

  init() {
    //this.props.onHover("hello");
    const { width, height } = this.getSize();

    const canvas = this.refs.threeCanvas;
    //const canvas2d = this.refs.cssCanvas;

    canvas.height = height;
    const marginTop = this.props.marginTop;

    raycaster = new THREE.Raycaster();
    window.addEventListener("mousemove", this.onDocumentMouseMove, false);

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 20, 20);
    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: this.props.antialias ? this.props.antialias : true,
      alpha: true,
      opacity: 0.5
    });
    //renderer.setClearColor(0xffffff, 1);

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    renderer2d = new THREE.CSS3DRenderer({
      canvas: canvas2d
    });

    renderer2d.setSize(renderer.width, renderer.height);
    scene2d = new THREE.Scene();
    //test 2d
    //HTML
    var element = document.createElement("div");
    element.innerHTML = "Plain text inside a div.";
    element.style.background = "#0094ff";
    element.style.fontSize = "2em";
    element.style.color = "white";
    element.style.padding = "2em";

    //CSS Object
    var div = new THREE.CSS3DObject(element);
    div.position.x = 0;
    div.position.y = 0;
    div.position.z = 0;
    div.scale.x = 0.1;
    div.scale.y = 0.1;

    // scene2d.add(div);

    renderer2d.domElement.style.position = "absolute";
    renderer2d.domElement.style.top = 0;
    renderer2d.domElement.style.zIndex = 1;

    var node = ReactDOM.findDOMNode(this.refs.cssCanvas);
    canvas2d = this.refs.cssCanvas.appendChild(renderer2d.domElement);

    //end test 2d

    this._createScene(canvas, canvas2d);
    var _this = this;

    this._render = function() {
      //animation = requestAnimationFrame(_this._render);
      setTimeout(function() {
        requestAnimationFrame(_this._render);
      }, 1000 / 30); //running @ 30FPS

      var { phi, theta } = _this.props;

      if (phi && theta && controls) {
        controls.setPolarAngle(phi);
        controls.setAzimuthalAngle(theta);
      }

      if (_this.props.update) {
        _this.props.update(scene, camera, renderer);
      }

      // find intersections

      if (
        (_this.props.onHoverStart || _this.props.onHoverEnd) &&
        camera != null
      ) {
        //console.log("camera is", camera);
        camera.updateMatrixWorld();

        raycaster.setFromCamera(mouse, camera);

        var intersects = raycaster.intersectObjects(scene.children, true);

        if (intersects.length > 0) {
          if (INTERSECTED != intersects[0].object) {
            if (INTERSECTED) {
              _this.onHoverEnd(INTERSECTED, scene, camera, renderer);
            } else {
              INTERSECTED = intersects[0].object;
              _this.onHoverStart(INTERSECTED, scene, camera, renderer);
            }
          }
        } else {
          if (INTERSECTED)
            _this.onHoverEnd(INTERSECTED, scene, camera, renderer);
          INTERSECTED = null;
        }
      }
      renderer2d.render(scene2d, camera);
      renderer.render(scene, camera);
      // this.updateRendererDimensions();
    };

    this._render();
  }

  getIntersectedObject() {
    return INTERSECTED;
  }

  onHoverStart(object, scene, camera, renderer) {
    //console.log(scene);
    if (this.props)
      if (this.props.onHoverStart) {
        this.props.onHoverStart(object, scene, camera, renderer);
      }
  }

  onHoverEnd(object, scene, camera, renderer) {
    if (this.props)
      if (this.props.onHoverEnd) {
        this.props.onHoverEnd(object, scene, camera, renderer);
      }
  }

  onHover(object) {
    //dosomething
    if (this.props)
      if (this.props.onHover) {
        this.props.onHover(object);
      }
  }

  setAngles(phi, theta) {
    //console.log(phi, theta);
    controls.setPolarAngle(phi);
    controls.setAzimuthalAngle(theta);
  }

  reloadScene(newScene) {
    if (newScene) scene = newScene;
    else scene = new THREE.Scene();

    const {
      addControls,
      addGrid,
      addLight,
      enableZoom,
      enableKeys,
      enablePan
    } = this.props;

    if (addGrid != undefined ? addGrid : true) {
      var gridXZ = new THREE.GridHelper(20, 20);
      gridXZ.name = "grid";
      scene.add(gridXZ);

      var planeGeometry = new THREE.PlaneGeometry(20, 20);
      planeGeometry.rotateX(-Math.PI / 2);
      var planeMaterial = new THREE.ShadowMaterial({ opacity: 0.4 });
      var plane = new THREE.Mesh(planeGeometry, planeMaterial);
      plane.receiveShadow = true;
      scene.add(plane);
    }

    if (addLight != undefined ? addLight : true) {
      scene.add(new THREE.AmbientLight(0xf0f0f0));
      var light = new THREE.SpotLight(0xffffff, 1.5);
      light.position.set(50, 50, 50);
      light.castShadow = true;
      light.shadow = new THREE.LightShadow(
        new THREE.PerspectiveCamera(70, 1, 10, 1000)
      );
      light.shadow.bias = -0.000222;
      light.shadow.mapSize.width = 1024;
      light.shadow.mapSize.height = 1024;
      scene.add(light);
    }

    if (this.props.setup) {
      this.props.setup(scene, camera, renderer);
    }
    //this.updateDimensions();
  }

  //Insert all 3D elements here
  _createScene(canvas, canvas2d) {
    console.log(this.props);

    const {
      addControls,
      addGrid,
      addLight,
      enableZoom,
      enableKeys,
      enablePan
    } = this.props;

    if (addGrid != undefined ? addGrid : true) {
      var gridXZ = new THREE.GridHelper(20, 20);
      gridXZ.name = "grid";
      scene.add(gridXZ);

      var planeGeometry = new THREE.PlaneGeometry(20, 20);
      planeGeometry.rotateX(-Math.PI / 2);
      var planeMaterial = new THREE.ShadowMaterial({ opacity: 0.4 });
      var plane = new THREE.Mesh(planeGeometry, planeMaterial);
      plane.receiveShadow = true;
      scene.add(plane);
    }

    if (addControls != undefined ? addControls : true) {
      var rootDiv = this.refs.rootthree;
      controls = new OrbitControls(camera, rootDiv);
      controls.enablePan = enablePan != undefined ? enablePan : true;
      controls.enableZoom = enableZoom != undefined ? enableZoom : true;
      controls.enableKeys = enableKeys != undefined ? enableKeys : true;
    }

    if (addLight != undefined ? addLight : true) {
      scene.add(new THREE.AmbientLight(0xf0f0f0));
      var light = new THREE.SpotLight(0xffffff, 1.5);
      light.position.set(50, 50, 50);
      light.castShadow = true;
      light.shadow = new THREE.LightShadow(
        new THREE.PerspectiveCamera(70, 1, 10, 1000)
      );
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

  onDocumentMouseMove(event) {
    event.preventDefault();
    var canvas = this.refs.threeCanvas;
    var canvasDOM = ReactDOM.findDOMNode(canvas);
    
    var rect = canvasDOM.getBoundingClientRect();
    
    mouse.x = (event.clientX - rect.left) / rect.width * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    //mouse.x = event.clientX / window.innerWidth * 2 - 1;
    //mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }

  render() {
    let style = { top: 0, position: "absolute" };
    let style1 = { zIndex: 5 };
    return (
      <div ref="rootthree">
        <canvas ref="threeCanvas" style={style1} />
        <div ref="cssCanvas" />
      </div>
    );
  }
}

export default Container3d;
