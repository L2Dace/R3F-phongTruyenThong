/* eslint-disable react/no-unknown-property */
// import { PointerLockControls, Sky } from "@react-three/drei";
import { Sky } from "@react-three/drei";
import { Ground } from "./components/Ground.jsx";
import { Physics, RigidBody } from "@react-three/rapier";
import { Character } from "./components/Character.jsx";

export const App = () => {
  return (
    <>
      {/* <PointerLockControls/> */}
      <Sky sunPosition={[100, 20, 100]} />
      <ambientLight intensity={1.5} />
      <Physics gravity={[0,-20,0]}>
        <Ground/>
        <Character/>
        <RigidBody>
          <mesh position={[0, 3, -5]}>
            <boxGeometry/>
          </mesh>
        </RigidBody>

      </Physics>
    </>
  )
}

export default App
