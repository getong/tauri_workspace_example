import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

interface BoxProps {
  position?: [number, number, number];
  color?: THREE.ColorRepresentation;
}

function Box(props: BoxProps) {
  // This reference gives us direct access to the THREE.Mesh object
  const meshRef = useRef<THREE.Mesh>(null!);

  // Hold state for hovered and clicked events
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);

  // Subscribe this component to the render-loop, rotate the mesh every frame
  useFrame((state, delta) => {
    meshRef.current.rotation.x += delta * 0.5;
    meshRef.current.rotation.y += delta * 0.2;
  });

  // Return the view, these are regular Threejs elements expressed in JSX
  return (
    <mesh
      position={props.position}
      ref={meshRef}
      scale={active ? 1.5 : 1}
      onClick={() => setActive(!active)}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color={hovered ? "hotpink" : props.color || "orange"}
      />
    </mesh>
  );
}

interface ReactThreeFiberSceneProps {
  className?: string;
}

export default function ReactThreeFiberScene({
  className = "",
}: ReactThreeFiberSceneProps) {
  return (
    <div className={`w-full ${className}`} style={{ height: "500px" }}>
      <Canvas>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />
        <Box position={[-1.2, 0, 0]} color="hotpink" />
        <Box position={[1.2, 0, 0]} color="lightblue" />
        <OrbitControls />
      </Canvas>
    </div>
  );
}
