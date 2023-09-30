import { useGameStore } from "../../lib/stores";

export default function Credits() {
  const { gameMode } = useGameStore((state) => ({
    gameMode: state.gameMode,
  }));

  if (gameMode !== "credits") return <></>;
  return (
    <div className="z-10 text-white absolute top-0 left-0 bottom-0 right-0 h-screen w-screen bg-black bg-opacity-50 backdrop-blur-sm flex flex-col items-center justify-center">
      <h1 className="font-bold text-3xl">Credits</h1>
      <p>Created by André Elias</p>
      <p>Dedicated to Carolina Rosa Meireles</p>
      <h2 className="text-xl font-bold mt-4 mb-2">Songs</h2>
      <p>C.B.P.D by Arulo</p>
      <p>Complicated by Arulo</p>
      <p>Funky Hip Hop by Arulo</p>
      <p>Trip Hop Vibes by Alejandro Magaña</p>
      <p>Try Me by Arulo</p>
      <h2 className="text-xl font-bold mt-4 mb-2">Models</h2>
      <p>Court created by Klieg3D and modified by André Elias</p>
      <p>Ball created by chroma3d</p>
      <p>City tree by Poly by Google</p>
    </div>
  );
}
