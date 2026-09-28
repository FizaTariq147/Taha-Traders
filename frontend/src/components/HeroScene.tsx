import { Canvas } from '@react-three/fiber';
import { Float, ContactShadows, Environment, OrbitControls, useGLTF } from '@react-three/drei';
import { Component, type ReactNode } from 'react';

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} scale={1.2} />;
}

function FallbackMesh() {
  return (
    <Float speed={1.4} rotationIntensity={0.4} floatIntensity={0.8}>
      <mesh castShadow>
        <cylinderGeometry args={[0.55, 0.65, 1.2, 48]} />
        <meshStandardMaterial color="#1E6BFF" metalness={0.2} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.75, 0]}>
        <torusGeometry args={[0.35, 0.08, 16, 48]} />
        <meshStandardMaterial color="#5B2C8B" metalness={0.3} roughness={0.4} />
      </mesh>
    </Float>
  );
}

class ErrorBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { error: boolean }
> {
  state = { error: false };
  static getDerivedStateFromError() {
    return { error: true };
  }
  render() {
    if (this.state.error) return this.props.fallback;
    return this.props.children;
  }
}

export default function HeroScene({
  modelUrl,
  fallbackImage,
}: {
  modelUrl?: string;
  fallbackImage: string;
}) {
  return (
    <ErrorBoundary
      fallback={<img src={fallbackImage} alt="" className="h-full w-full object-cover" />}
    >
      <Canvas
        camera={{ position: [0, 1.2, 3.2], fov: 42 }}
        dpr={[1, 1.5]}
        onCreated={({ gl }) => {
          gl.setClearColor('#0B1220');
        }}
      >
        <ambientLight intensity={0.55} />
        <directionalLight position={[4, 6, 2]} intensity={1.1} castShadow />
        {modelUrl ? <Model url={modelUrl} /> : <FallbackMesh />}
        <ContactShadows opacity={0.35} scale={8} blur={2.5} position={[0, -1.1, 0]} />
        <Environment preset="city" />
        <OrbitControls enablePan={false} enableZoom={false} autoRotate autoRotateSpeed={0.6} />
      </Canvas>
    </ErrorBoundary>
  );
}
