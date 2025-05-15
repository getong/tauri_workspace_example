import { useEffect, useRef } from "react";
import * as THREE from "three";

interface ThreeSceneProps {
  className?: string;
}

const ThreeScene = ({ className = "" }: ThreeSceneProps) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      if (!mountRef.current) return;
      console.log("Initializing Three.js scene");

      // Scene setup
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x1a1a1a);

      // Camera setup
      const camera = new THREE.PerspectiveCamera(
        75,
        mountRef.current.clientWidth / mountRef.current.clientHeight,
        0.1,
        1000,
      );
      camera.position.z = 5;

      // Renderer setup
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(
        mountRef.current.clientWidth,
        mountRef.current.clientHeight,
      );

      // Clear any existing content
      while (mountRef.current.firstChild) {
        mountRef.current.removeChild(mountRef.current.firstChild);
      }
      mountRef.current.appendChild(renderer.domElement);

      // Add lights
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(5, 5, 5);
      scene.add(directionalLight);

      // Create a cube
      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const material = new THREE.MeshStandardMaterial({
        color: 0x00ff00,
        metalness: 0.3,
        roughness: 0.4,
      });
      const cube = new THREE.Mesh(geometry, material);
      scene.add(cube);

      // Create a torus knot
      const torusGeometry = new THREE.TorusKnotGeometry(0.5, 0.2, 100, 16);
      const torusMaterial = new THREE.MeshStandardMaterial({
        color: 0xff00ff,
        metalness: 0.3,
        roughness: 0.4,
      });
      const torusKnot = new THREE.Mesh(torusGeometry, torusMaterial);
      torusKnot.position.x = 2;
      scene.add(torusKnot);

      // Create a sphere
      const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
      const sphereMaterial = new THREE.MeshStandardMaterial({
        color: 0x0000ff,
        metalness: 0.3,
        roughness: 0.4,
      });
      const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
      sphere.position.x = -2;
      scene.add(sphere);

      console.log("Added objects to scene");

      // Animation loop
      const animate = () => {
        requestAnimationFrame(animate);

        // Rotate the objects
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;

        torusKnot.rotation.x += 0.01;
        torusKnot.rotation.y += 0.01;

        sphere.rotation.x += 0.01;
        sphere.rotation.y += 0.01;

        renderer.render(scene, camera);
      };

      animate();
      console.log("Animation started");

      // Handle window resize
      const handleResize = () => {
        if (!mountRef.current) return;

        camera.aspect =
          mountRef.current.clientWidth / mountRef.current.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(
          mountRef.current.clientWidth,
          mountRef.current.clientHeight,
        );
      };

      window.addEventListener("resize", handleResize);

      // Clean up
      return () => {
        window.removeEventListener("resize", handleResize);
        if (
          mountRef.current &&
          renderer.domElement.parentNode === mountRef.current
        ) {
          mountRef.current.removeChild(renderer.domElement);
        }

        // Dispose of geometries and materials to prevent memory leaks
        geometry.dispose();
        material.dispose();
        torusGeometry.dispose();
        torusMaterial.dispose();
        sphereGeometry.dispose();
        sphereMaterial.dispose();
      };
    } catch (err) {
      console.error("Error initializing Three.js:", err);
      return () => {};
    }
  }, []);

  return (
    <div
      ref={mountRef}
      className={`w-full h-full min-h-[400px] ${className}`}
      style={{ touchAction: "none" }}
    ></div>
  );
};

export default ThreeScene;
