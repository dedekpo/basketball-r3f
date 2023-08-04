import { useGameStore } from "@/lib/stores";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

export default function ShotMetter() {
	const groupMesh = useRef<THREE.Group>(null!);
	const mesh = useRef<THREE.Mesh>(null!);

	const { playerMeshRef } = useGameStore((state) => ({
		playerMeshRef: state.playerMeshRef,
	}));

	useFrame(({ camera }) => {
		if (groupMesh.current && playerMeshRef.current) {
			groupMesh.current.position.copy(playerMeshRef.current.position);
			groupMesh.current.position.setY(0.4);
			groupMesh.current.lookAt(camera.position);

			mesh.current.scale.setX(playerMeshRef.current.shotProgress || 0);
		}
	});

	return (
		<group ref={groupMesh} position={[-1, 0.22, 0]}>
			<mesh ref={mesh} position={[0, 0, 0.0004]}>
				<planeGeometry args={[0.2, 0.03, 16, 16]} />
				<meshBasicMaterial color="green" />
			</mesh>
			<mesh visible={playerMeshRef.current?.isShooting || false}>
				<planeGeometry args={[0.2, 0.03, 16, 16]} />
				<meshBasicMaterial />
			</mesh>
		</group>
	);
}
