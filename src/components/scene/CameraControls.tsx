import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useGameStore } from "../../lib/stores";
import { useResetPositions } from "../../hooks/useResetPositions";
import { onClickSound } from "../../lib/utils";
import { SDKStopGame } from "../../lib/game-controll";
import {
  cameraCreditsPosition,
  cameraGamePosition,
  cameraMenuPosition,
} from "../../lib/config";

export function CameraControls() {
  const { gameMode } = useGameStore((state) => ({
    gameMode: state.gameMode,
  }));

  return useFrame(({ camera }) => {
    if (gameMode === "menu") {
      camera.position.lerp(cameraMenuPosition, 0.05);
    }
    if (
      gameMode === "challenge" ||
      gameMode === "free" ||
      gameMode === "match" ||
      gameMode === "tournament"
    ) {
      camera.position.lerp(cameraGamePosition, 0.05);
    }
    if (gameMode === "credits") {
      camera.position.lerp(cameraCreditsPosition, 0.05);
    }
  });
}
