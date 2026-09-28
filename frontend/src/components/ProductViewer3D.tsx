import { Canvas } from '@react-three/fiber';
import { Center, ContactShadows, Environment, OrbitControls, useGLTF } from '@react-three/drei';

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return (
    <Center>
      <primitive object={scene} />
    </Center>
  );
}

export default function ProductViewer3D({ modelUrl }: { modelUrl: string }) {
  return (
    <Canvas camera={{ position: [0, 0.8, 2.6], fov: 40 }} dpr={[1, 1.5]}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 4, 2]} intensity={1} />
      <Model url={modelUrl} />
      <ContactShadows opacity={0.3} scale={6} blur={2} position={[0, -0.8, 0]} />
      <Environment preset="warehouse" />
      <OrbitControls enablePan={false} />
    </Canvas>
  );
}
