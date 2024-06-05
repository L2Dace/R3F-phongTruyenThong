/* eslint-disable react/no-unknown-property */
import * as THREE from "three";
import * as RAPIER from "@dimforge/rapier3d-compat"
import { CapsuleCollider, RigidBody, useRapier } from "@react-three/rapier";
import { useRef, useEffect, useState } from "react";
import { CharacterControl } from "./CharacterControl";
import { useFrame } from "@react-three/fiber";
import { PointerLockControls } from "@react-three/drei";

const MOVE_SPEED = 5;
const direction = new THREE.Vector3();
const frontVector = new THREE.Vector3();
const sideVector = new THREE.Vector3();


export const Character = () => {
    const characterRef = useRef();
    const {forward, backward, left, right, jump} = CharacterControl();
    const rapier = useRapier();
    const [cameraMode, setCameraMode] = useState("firstPerson");
    const [cameraRotation, setCameraRotation] = useState(0);
    const controls = useRef();

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.code === "ControlLeft") {
                setCameraMode((prevMode) =>
                    prevMode === "firstPerson" ? "thirdPerson" : "firstPerson"
                );
            }

            // Handle arrow key events for camera rotation
            if (cameraMode === "thirdPerson") {
                if (event.code === "ArrowLeft") {
                    setCameraRotation((prevRotation) => prevRotation - Math.PI / 90); // Adjust rotation speed as needed
                } else if (event.code === "ArrowRight") {
                    setCameraRotation((prevRotation) => prevRotation + Math.PI / 90);
                }
            }

        };
    
        window.addEventListener("keydown", handleKeyDown);
    
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [cameraMode]);

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
        const grounded = ray && ray.collider && Math.abs(ray.toi) <= 1.5;

        if (jump && grounded) doJump();

        //di chuyen camera theo nhan vat
        // const {x,y,z} = characterRef.current.translation();
        // state.camera.position.set(x,y,z);


        // Update camera position based on camera mode
    if (cameraMode === "firstPerson") {
        controls.current.lock();
        const { x, y, z } = characterRef.current.translation();
        state.camera.position.set(x, y, z);
    } else {
        controls.current.unlock();
        const { x, y, z } = characterRef.current.translation();

        // Calculate orbital camera position
        const radius = 5; // Adjust this value to control the distance from the character
        const angle = cameraRotation;
        const orbitX = x + radius * Math.sin(angle);
        const orbitZ = z + radius * Math.cos(angle);
        const orbitY = y + 2; // Adjust this value to control the camera height

        state.camera.position.set(orbitX, orbitY, orbitZ);
        state.camera.lookAt(x, y, z);
        state.camera.fov = 75;
    }

    });

    const doJump = () => {
        characterRef.current.setLinvel({x: 0, y: 8, z: 0});
    }

    return (
        <>
        <PointerLockControls ref={controls} />
        <RigidBody colliders={false} mass={1} ref={characterRef} lockRotations position={[0, 0.25, 0]}>
            <mesh >
                <capsuleGeometry args={[0.5, 0.5]}/>
                <CapsuleCollider args={[0.75, 0.5]}/>
            </mesh>
        </RigidBody>
        </>
    );
}