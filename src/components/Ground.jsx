/* eslint-disable react/no-unknown-property */
import { RigidBody, CuboidCollider } from "@react-three/rapier";
import {ContactShadows, Environment, Gltf} from '@react-three/drei';



export const Ground = () => {
    
    return (
        <>
        <Environment preset="sunset" />
      <ambientLight intensity={0.2} />
      <ContactShadows blur={2} />
      <directionalLight intensity={0.3} position={[25,28,-25]} />
        <RigidBody type="fixed" colliders="trimesh">
        {/* <mesh position={[0, 0, 0]} rotation-x={-Math.PI / 2}>
            <planeGeometry args={[500, 500]} />
            <meshStandardMaterial color="gray"/>
        </mesh> */}
        
        <Gltf castShadow receiveShadow scale={[0.75,0.75,0.75]} position={[0, 0, -2]} rotation-y={-Math.PI} src="models/Phongtruyenthong.glb"/>
        <CuboidCollider args={[500, 2, 500]} position={[0, -2, 0]} />
        
        
        </RigidBody>
        </>
    );
}