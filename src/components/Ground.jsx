/* eslint-disable react/no-unknown-property */
import { RigidBody, CuboidCollider } from "@react-three/rapier";


export const Ground = () => {
    
    return (
        <RigidBody type="fixed" colliders={false}>
        <mesh position={[0, 0, 0]} rotation-x={-Math.PI / 2}>
            <planeGeometry args={[500, 500]} />
            <meshStandardMaterial color="gray"/>
        </mesh>
        <CuboidCollider args={[500, 2, 500]} position={[0, -2, 0]} />
        </RigidBody>
    );
}