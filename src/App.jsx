/* eslint-disable react/no-unknown-property */
// import { PointerLockControls, Sky } from "@react-three/drei";
import { Environment, Sky, Html, Billboard, Text, Plane } from "@react-three/drei";
import { Ground } from "./components/Ground.jsx";
import { Physics, RigidBody } from "@react-three/rapier";
import { Character } from "./components/Character.jsx";
import { useState, useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Outlines } from "@react-three/drei";
import {
  Selection,
  Select,
  EffectComposer,
  Outline,
} from "@react-three/postprocessing";

function Box(props) {
  // This reference gives us direct access to the THREE.Mesh object
  const ref = useRef();
  // Hold state for hovered and clicked events
  const [hovered, hover] = useState(false);
  const [clicked, click] = useState(false);

  return (
      <mesh
        {...props}
        ref={ref}
        // scale={clicked ? 1.5 : 1}
        onClick={(event) => click(!clicked)}
        onPointerOver={(event) => (event.stopPropagation(), hover(true))}
        onPointerOut={(event) => hover(false)}
      >
        <sphereGeometry args={[0.1, 64, 64]} />
        <meshStandardMaterial color={hovered ? "orange" : "orange"} />
        {hovered && (
          <>
          <Outlines thickness={0.02} color="#ffffff" />
          <Html position={[-1, -0.2, 0]}>
            <div class="content">
              <p>Press B to show information</p>
            </div>
          </Html>
          </>
        )}
        {clicked && (
          <Billboard position={[0, 0, 2]} args={[3, 3]}>
            <Plane args={[5, 4]} material-color="gray" />
            <Text
              fontSize={0.3}
              outlineColor="#000000"
              outlineOpacity={1}
              outlineWidth="5%"
              color="black" // default
              anchorX="center" // defaults
              anchorY="middle" // default
            >
              Hello world!
            </Text>
          </Billboard>
        )}
      </mesh>
  );
}

export const App = () => {
  return (
    <>
      {/* <PointerLockControls/> */}
      <Sky sunPosition={[100, 20, 100]} />
      <Environment preset="sunset" />
      <ambientLight intensity={1.5} />
      <Physics gravity={[0, -20, 0]}>
        <Ground />
        <Character />
      </Physics>
        <Box position={[0, 2, -9]} />
    </>
  );
};

export default App;
