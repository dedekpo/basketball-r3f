import { usePlayerAnimations } from "@/hooks/usePlayerAnimations";
import {
	playerMeshRef,
	useGamificationStore,
	usePlayer1Store,
} from "@/lib/stores";
import { useGLTF } from "@react-three/drei";
import { useGraph } from "@react-three/fiber";
import { useMemo } from "react";
import { SkeletonUtils } from "three-stdlib";

export default function PlayerMesh() {
	const { characterState } = usePlayer1Store((state) => ({
		characterState: state.characterState,
	}));

	const { scene, materials } = usePlayerAnimations(
		playerMeshRef,
		characterState
	);

	// Skinned meshes cannot be re-used in threejs without cloning them
	const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
	// useGraph creates two flat object collections for nodes and materials
	const { nodes } = useGraph(clone) as any;

	const { skinColor, shirtColor } = useGamificationStore((state) => ({
		skinColor: state.skinColor,
		shirtColor: state.shirtColor,
	}));

	return (
		<group
			castShadow
			receiveShadow
			ref={playerMeshRef}
			name="Scene"
			dispose={null}
		>
			<group
				name="Armature"
				position={[0, 0.14, 0]}
				rotation={[0, Math.PI, 0]}
				scale={0.035}
			>
				<primitive object={nodes.Pelvis} />
				<primitive object={nodes.IKPoleL} />
				<primitive object={nodes.IKTargetL} />
				<primitive object={nodes.IKPoleR} />
				<primitive object={nodes.IKTargetR} />
			</group>
			<group name="Mesh" position={[0, 2.152, 0]} scale={0.51}>
				<skinnedMesh
					name="Cube003"
					geometry={nodes.Cube003.geometry}
					material={nodes.Cube003.material}
					skeleton={nodes.Cube003.skeleton}
				/>
				<skinnedMesh
					name="Cube003_1"
					geometry={nodes.Cube003_1.geometry}
					material={materials.Black}
					skeleton={nodes.Cube003_1.skeleton}
				/>
				<skinnedMesh
					name="Cube003_2"
					geometry={nodes.Cube003_2.geometry}
					// material={materials.Blue}
					skeleton={nodes.Cube003_2.skeleton}
				>
					<meshStandardMaterial color={shirtColor} />
				</skinnedMesh>
				<skinnedMesh
					name="Cube003_3"
					geometry={nodes.Cube003_3.geometry}
					// material={materials["Skin white"]}
					skeleton={nodes.Cube003_3.skeleton}
				>
					<meshStandardMaterial color={skinColor} />
				</skinnedMesh>
			</group>
		</group>
	);
}
