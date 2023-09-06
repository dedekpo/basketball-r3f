import {
	ballRef,
	player2MeshRef,
	player2Ref,
	playerMeshRef,
	playerRef,
	useBallStore,
	useGameStore,
	usePlayer1Store,
	usePlayer2Store,
} from "@/lib/stores";
import { vec3 } from "@react-three/rapier";

export function useResetPositions() {
	const { setPlayerWithBall } = useBallStore((state) => ({
		setPlayerWithBall: state.setPlayerWithBall,
	}));

	const { setCharacterState: set1 } = usePlayer1Store((state) => ({
		setCharacterState: state.setCharacterState,
	}));

	const { setCharacterState: set2 } = usePlayer2Store((state) => ({
		setCharacterState: state.setCharacterState,
	}));

	const { isGameRunning } = useGameStore((state) => ({
		isGameRunning: state.isGameRunning,
	}));

	function resetPlayersPosition() {
		// if (!isGameRunning) {

		// };
		setPlayerWithBall(undefined);
		if (playerMeshRef.current) {
			playerMeshRef.current.hasBall = false;
			playerMeshRef.current.isShooting = false;
			playerMeshRef.current.isIncreasing = true;
			playerMeshRef.current.lookAt(-1, 0, 3);
			if (isGameRunning) {
				playerMeshRef.current.IAShouldGoTo = vec3({
					x: -1,
					y: 0.22,
					z: 0,
				});
			} else {
				playerRef.current?.setTranslation(
					{ x: -1, y: 0.22, z: 0 },
					true
				);
				playerRef.current?.setLinvel({ x: 0, y: 0, z: 0 }, true);
			}
		}
		set1("Idle");
		if (player2MeshRef.current) {
			player2MeshRef.current.hasBall = false;
			player2MeshRef.current.isShooting = false;
			player2MeshRef.current.isIncreasing = true;
			player2MeshRef.current.lookAt(0, 0, 3);
			if (isGameRunning) {
				player2MeshRef.current.IAShouldGoTo = vec3({
					x: 1,
					y: 0.22,
					z: 0,
				});
			} else {
				player2Ref.current?.setTranslation(
					{ x: 1, y: 0.22, z: 0 },
					true
				);
				player2Ref.current?.setLinvel({ x: 0, y: 0, z: 0 }, true);
			}
		}
		set2("Idle");
	}

	function resetBallPosition(shotClockPlayer?: number) {
		if (!isGameRunning) return;
		ballRef.current?.setLinvel({ x: 0, y: 0, z: 0 }, true);
		ballRef.current?.setAngvel({ x: 0, y: 0, z: 0 }, true);
		if (shotClockPlayer === 0) {
			ballRef.current?.setTranslation({ x: 1.5, y: 1, z: 0 }, true);
			return;
		}
		if (shotClockPlayer === 1) {
			ballRef.current?.setTranslation({ x: -1.5, y: 1, z: 0 }, true);
			return;
		}
	}

	return {
		resetPlayersPosition,
		resetBallPosition,
	};
}
