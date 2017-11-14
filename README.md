# react-container-3d
A container for three.js canvas renderer as a react component

![alt text](https://github.com/lucascassiano/react-container-3d/raw/master/docs/react-container3d.gif)

## Install
```javascript
npm install --save react-container3d
```

## Usage
```javaScript
import Container3d from 'react-container3d';

...

<div className="canvas-3d">
<Container3d aspect={16 / 9} percentageWidth={"100%"}/>
</div>
```
#container life cycle
p5.js (and the original Processing, of course) was used as inspiration to define the life cycle names: setup and update;
```javascript

//called at when renderer is defined
Setup = (scene, camera, renderer) =>{
        console.log("starting 3d scene");
    }

//called every frame
Update = (scene, camera, renderer) =>{
        //console.log("scene", scene);
}
```

## Default 3d elements
The grid, orbitControls and lights are by default added to the scene. 
they are also easily removed:
```JavaScript
<Container3d aspect={1} percentageWidth={"100%"} addGrid={false} addControls={false} addLight = {false}/>
```

enableZoom, enablePan and enableKeys (from orbit controls) are also defined as boolean props. 

## FitScreen mode
Sometimes we just want a 3D environment to add some models and have some interactivity. Due to the drag of attention to this environment, most of times, this component occupies the main portion of the screen, so we added this simple 'fitScreen' parameter, if this is on the component will try to adjust to fill the height and width of the screen. you can use the props marginTop, marginLeft, marginBottom, marginRight to set pixels of distance. (note: we tried with css, however the renderer update wasn't happening when the screen changed).

## Usage with react-cubeview
Both components were designed to work coupled - you can read more about react-cubeview [here](https://www.npmjs.com/package/react-cubeview). They were separated due to development simplification (We might, at some point, have enough 3D UI components to create a simple UI Kit... but that's for the future).

## Custom Size/Background (CSS)
If wrapped around a div component, you can play easily with the canvas size;

By default, the canvas has a transparent background, this means your background color must be added using css background. We wanted gradient backgrounds.

```jsx
    <div className="canvas-3d">
        <Container3d ... >
    </div>
```

```css
.canvas-3d{
    margin-top:30px;
    width:100%;
    min-width: 500px;
    background: linear-gradient(to bottom,  rgba(51,51,51,0) 0%,rgba(80,80,80,1) 100%);
  }
```

## Loading 3D Models
You can use pretty much all three.js model loaders, however be awere if you're using ES6, make sure all of them are wrapped as ES6 classes or ES5 modules.
Also, for .obj we tested the [three-react-obj-loader](https://www.npmjs.com/package/three-react-obj-loader) combined with [three-react-mtl-loader](https://www.npmjs.com/package/three-react-mtl-loader).

