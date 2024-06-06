/* eslint-disable react/no-unknown-property */
import * as THREE from "three";
import * as RAPIER from "@dimforge/rapier3d-compat";
import { CapsuleCollider, RigidBody, useRapier } from "@react-three/rapier";
import { useRef, useEffect, useState } from "react";
import { CharacterControl } from "./CharacterControl";
import { useFrame } from "@react-three/fiber";
import { PointerLockControls, OrbitControls } from "@react-three/drei";
import Gentleman from "./gentleman";

const MOVE_SPEED = 5;
const direction = new THREE.Vector3();
const frontVector = new THREE.Vector3();
const sideVector = new THREE.Vector3();

export const Character = () => {
  const characterRef = useRef();
  const { forward, backward, left, right, jump } = CharacterControl();
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

  useEffect(() => {
    let isDragging = false;
    let startX = 0;
    let startY = 0;

    const handlePointerLockChange = () => {
      if (controls.current.isLocked) {
        document.addEventListener("mousedown", handleMouseDown);
        document.addEventListener("mouseup", handleMouseUp);
        document.addEventListener("mousemove", handleMouseMove);
      } else {
        document.removeEventListener("mousedown", handleMouseDown);
        document.removeEventListener("mouseup", handleMouseUp);
        document.removeEventListener("mousemove", handleMouseMove);
      }
    };

    const handleMouseDown = (event) => {
      isDragging = true;
      startX = event.clientX;
      startY = event.clientY;
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    const handleMouseMove = (event) => {
      if (isDragging) {
        const deltaX = event.clientX - startX;
        const deltaY = event.clientY - startY;
        setCameraRotation((prevRotation) => prevRotation + deltaX * 0.01);

        startX = event.clientX;
        startY = event.clientY;
      }
    };

    controls.current.addEventListener("lock", handlePointerLockChange);
    controls.current.addEventListener("unlock", handlePointerLockChange);

    return () => {
      controls.current.removeEventListener("lock", handlePointerLockChange);
      controls.current.removeEventListener("unlock", handlePointerLockChange);
    };
  }, [controls]);

  useFrame((state) => {
    if (!characterRef.current) return;

    //di chuyen nhan vat
    const velocity = characterRef.current.linvel();

    frontVector.set(0, 0, backward - forward);
    sideVector.set(left - right, 0, 0);
    direction
      .subVectors(frontVector, sideVector)
      .normalize()
      .multiplyScalar(MOVE_SPEED)
      .applyEuler(state.camera.rotation);

    characterRef.current.wakeUp();
    characterRef.current.setLinvel({
      x: direction.x,
      y: velocity.y,
      z: direction.z,
    });

    // jump
    const world = rapier.world;
    const ray = world.castRay(
      new RAPIER.Ray(characterRef.current.translation(), { x: 0, y: -1, z: 0 })
    );
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
      gentleman.current.quaternion.copy(state.camera.quaternion);
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

      const directionVector = new THREE.Vector3(direction.x, 0, direction.z);
    directionVector.normalize();
    const yaw = Math.atan2(directionVector.x, directionVector.z);
    const quaternion = new THREE.Quaternion();
    quaternion.setFromEuler(new THREE.Euler(0, yaw, 0));
    gentleman.current.quaternion.copy(quaternion);
    }
  });

  const doJump = () => {
    characterRef.current.setLinvel({ x: 0, y: 6, z: 0 });
  };

  const gentleman = useRef();
  return (
    <group>
      <PointerLockControls ref={controls} />
      <RigidBody
        colliders={false}
        mass={1}
        ref={characterRef}
        lockRotations
        scale={[0.5, 0.5, 0.5]}
      >
        {/* <mesh >
                <capsuleGeometry args={[0.5, 0.5]}/>
                <CapsuleCollider args={[0.75, 0.5]}/>
            </mesh> */}
        <CapsuleCollider args={cameraMode === "firstPerson"? [1.8, 0.4] : [0.75, 0.4]} />
        <group ref={gentleman}>
          <Gentleman position={cameraMode === "firstPerson"? [0, 1.2, 0] : [0, -1.0, 0]} />
        </group>
      </RigidBody>

    </group>
  );
};
