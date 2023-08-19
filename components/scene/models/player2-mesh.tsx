import { usePlayerAnimations } from "@/hooks/usePlayerAnimations";
import { player2MeshRef, usePlayer2Store } from "@/lib/stores";
import { useGLTF } from "@react-three/drei";
import { useGraph } from "@react-three/fiber";
import { useMemo } from "react";
import { SkeletonUtils } from "three-stdlib";

export default function Player2Mesh() {
	const { characterState } = usePlayer2Store((state) => ({
		characterState: state.characterState,
	}));

	const { scene, materials } = usePlayerAnimations(
		player2MeshRef,
		characterState
	);

	// Skinned meshes cannot be re-used in threejs without cloning them
	const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
	// useGraph creates two flat object collections for nodes and materials
	const { nodes } = useGraph(clone) as any;

	return (
		<group ref={player2MeshRef} name="Scene" dispose={null}>
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
					name="Cube003_1"
					geometry={nodes.Cube003_1.geometry}
					material={materials.Black}
					skeleton={nodes.Cube003_1.skeleton}
				/>
				{/* Shirt */}
				<skinnedMesh
					name="Cube003_2"
					geometry={nodes.Cube003_2.geometry}
					// material={materials.Blue}
					skeleton={nodes.Cube003_2.skeleton}
				>
					<meshStandardMaterial color="#ff2c2c" />
				</skinnedMesh>
				{/* Internal Shirt */}
				<skinnedMesh
					name="Cube003"
					geometry={nodes.Cube003.geometry}
					material={nodes.Cube003.material}
					skeleton={nodes.Cube003.skeleton}
				/>
				{/* Skin */}
				<skinnedMesh
					name="Cube003_3"
					geometry={nodes.Cube003_3.geometry}
					// material={materials["Skin white"]}
					skeleton={nodes.Cube003_3.skeleton}
				>
					<meshStandardMaterial color="#714137" />
				</skinnedMesh>
				{/* Eyes */}
				<skinnedMesh
					name="Cube003_4"
					geometry={nodes.Cube003_4.geometry}
					material={materials["Material.001"]}
					skeleton={nodes.Cube003_4.skeleton}
				/>
			</group>
		</group>
	);
}

useGLTF.preload("/models/timmy2.glb");
