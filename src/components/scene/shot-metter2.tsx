import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { player2MeshRef } from "../../lib/stores";

export default function ShotPlayer2Metter() {
  const groupMesh = useRef<THREE.Group>(null!);
  const mesh = useRef<THREE.Mesh>(null!);

  useFrame(({ camera }) => {
    if (groupMesh.current && player2MeshRef.current) {
      groupMesh.current.position.copy(player2MeshRef.current.position);
      groupMesh.current.position.setY(0.4);
      groupMesh.current.lookAt(camera.position);

      mesh.current.scale.setX(player2MeshRef.current.shotProgress || 0);
    }
  });

  return (
    <group
      visible={player2MeshRef.current?.isShooting || false}
      ref={groupMesh}
      position={[-1, 0.22, 0]}
    >
      <mesh ref={mesh} position={[0, 0, 0.0004]}>
        <planeGeometry args={[0.2, 0.03, 16, 16]} />
        <meshBasicMaterial color="green" />
      </mesh>
      <mesh>
        <planeGeometry args={[0.2, 0.03, 16, 16]} />
        <meshBasicMaterial />
      </mesh>
    </group>
  );
}
