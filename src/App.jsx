/* eslint-disable react/no-unknown-property */
// import { PointerLockControls, Sky } from "@react-three/drei";
import { Environment, Sky } from "@react-three/drei";
import { Ground } from "./components/Ground.jsx";
import { Physics, RigidBody } from "@react-three/rapier";
import { Character } from "./components/Character.jsx";
import { useState, useRef } from "react";
import { useFrame } from "@react-three/fiber";

export const App = () => {
  const [active, setActive] = useState(false);

  const meshRef = useRef();

  return (
    <>
      {/* <PointerLockControls/> */}
      <Sky sunPosition={[100, 20, 100]} />
      <ambientLight intensity={1.5} />
      <Physics gravity={[0, -20, 0]}>
        <Ground />
        <Character />
        <RigidBody>
          <mesh ref={meshRef}
            onPointerOver={(e) => setActive(!active)}
            onPointerOut={(e) => setActive(!active)}
            scale={active ? 1.5 : 1}
            position={[0, 3, -5]}
          >
            <boxGeometry />
          </mesh>
        </RigidBody>
      </Physics>
    </>
  );
};

export default App;
