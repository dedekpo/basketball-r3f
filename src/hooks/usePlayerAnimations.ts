import { useAnimations, useGLTF } from "@react-three/drei";
import { useEffect } from "react";

export function usePlayerAnimations(ref: any, characterState: any) {
	const { scene, materials, animations } = useGLTF(
		"/models/player-final-transformed.glb"
	) as any;

	const { actions } = useAnimations<any>(animations, ref);

	useEffect(() => {
		actions[characterState]?.reset().fadeIn(0.2).play();
		return () => {
			actions[characterState]?.fadeOut(0.2);
		};
	}, [characterState]);

	return {
		scene,
		materials,
		actions,
	};
}

useGLTF.preload("/models/player-final-transformed.glb");
