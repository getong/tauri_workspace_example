import { useEffect, useRef } from "react";
import * as THREE from "three";
import * as CANNON from "cannon-es";

interface PhysicsSceneProps {
  className?: string;
}

const PhysicsScene = ({ className = "" }: PhysicsSceneProps) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Ensure the container has a size
    mountRef.current.style.width = "100%";
    mountRef.current.style.height = "400px";
    mountRef.current.style.minHeight = "400px";

    // Clear previous children
    while (mountRef.current.firstChild) {
      mountRef.current.removeChild(mountRef.current.firstChild);
    }

    // --- THREE.js setup ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x222233);

    const width = mountRef.current.clientWidth || 400;
    const height = mountRef.current.clientHeight || 400;

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 3, 8);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    mountRef.current.appendChild(renderer.domElement);

    // Confirm canvas is in DOM
    console.log("Three.js canvas appended", renderer.domElement);

    // Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(5, 10, 7.5);
    scene.add(dirLight);

    // Ground (visual)
    const groundGeo = new THREE.BoxGeometry(10, 0.1, 10);
    const groundMat = new THREE.MeshStandardMaterial({ color: 0x228822 });
    const groundMesh = new THREE.Mesh(groundGeo, groundMat);
    groundMesh.position.y = -0.05;
    scene.add(groundMesh);

    // Cube (visual)
    const boxGeo = new THREE.BoxGeometry(1, 1, 1);
    const boxMat = new THREE.MeshStandardMaterial({ color: 0x44aaff });
    const boxMesh = new THREE.Mesh(boxGeo, boxMat);
    boxMesh.position.set(0, 4, 0);
    scene.add(boxMesh);

    // --- Cannon-es physics setup ---
    const world = new CANNON.World({ gravity: new CANNON.Vec3(0, -9.82, 0) });

    // Ground (physics)
    const groundBody = new CANNON.Body({
      mass: 0,
      shape: new CANNON.Box(new CANNON.Vec3(5, 0.05, 5)),
      position: new CANNON.Vec3(0, -0.05, 0),
    });
    world.addBody(groundBody);

    // Cube (physics)
    const boxBody = new CANNON.Body({
      mass: 1,
      shape: new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5)),
      position: new CANNON.Vec3(0, 4, 0),
    });
    world.addBody(boxBody);

    // Animation loop
    let animationId: number;
    const animate = () => {
      world.step(1 / 60);

      // Sync Three.js mesh with Cannon-es body
      boxMesh.position.copy(boxBody.position as any);
      boxMesh.quaternion.copy(boxBody.quaternion as any);

      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    };
    animate();

    // Resize handler
    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth || 400;
      const h = mountRef.current.clientHeight || 400;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
      if (
        mountRef.current &&
        renderer.domElement.parentNode === mountRef.current
      ) {
        mountRef.current.removeChild(renderer.domElement);
      }
      groundGeo.dispose();
      groundMat.dispose();
      boxGeo.dispose();
      boxMat.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className={`w-full h-full min-h-[400px] ${className}`}
      style={{
        width: "100%",
        height: "400px",
        minHeight: "400px",
        touchAction: "none",
      }}
    />
  );
};

export default PhysicsScene;
