import * as THREE from "three";
import * as RAPIER from "@dimforge/rapier3d-compat"
import { RigidBody, useRapier } from "@react-three/rapier";
import { useRef } from "react";
import { CharacterControl } from "./CharacterControl";
import { useFrame } from "@react-three/fiber";

const MOVE_SPEED = 5;
const direction = new THREE.Vector3();
const frontVector = new THREE.Vector3();
const sideVector = new THREE.Vector3();


export const Character = () => {
    const characterRef = useRef();
    const {forward, backward, left, right, jump} = CharacterControl();
    const rapier = useRapier();

    useFrame((state) => {
        if (!characterRef.current) return;

        //di chuyen nhan vat
        const velocity = characterRef.current.linvel();

        frontVector.set(0, 0, backward - forward);
        sideVector.set(left - right, 0, 0);
        direction.subVectors(frontVector, sideVector).normalize().multiplyScalar(MOVE_SPEED).applyEuler(state.camera.rotation);

        characterRef.current.wakeUp();
        characterRef.current.setLinvel({ x: direction.x, y: velocity.y, z: direction.z});

        // jump
        const world = rapier.world;
        const ray = world.castRay(new RAPIER.Ray(characterRef.current.translation(), { x: 0, y: -1, z: 0 }));
        const grounded = ray && ray.collider && Math.abs(ray.toi) <= 1;

        if (jump && grounded) doJump();

        //di chuyen camera theo nhan vat
        const {x,y,z} = characterRef.current.translation();
        state.camera.position.set(x,y,z);

    });

    const doJump = () => {
        characterRef.current.setLinvel({x: 0, y: 8, z: 0});
    }

    return (
        <>
        <RigidBody position={[0, 1, -2]} mass={1} ref={characterRef} lockRotations>
            <mesh >
                <capsuleGeometry args={[0.5, 0.5]}/>
            </mesh>
        </RigidBody>
        </>
    );
}