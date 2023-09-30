import { useEffect } from "react";
import { initSDK } from "./lib/game-controll";
import Experience from "./components/scene/experience";
import Menu from "./components/interface/menu";
import Match from "./components/interface/match";
import Challenge from "./components/interface/challenge";
import MusicPlayer from "./components/interface/music-player";
import HomeButton from "./components/interface/home-button";
import Joystick from "./components/interface/joystick";
import Credits from "./components/interface/credits";

export default function App() {
  useEffect(() => {
    initSDK();
  }, []);

  return (
    <div className="h-screen">
      <Experience />
      <Menu />
      <Match />
      <Challenge />
      <MusicPlayer />
      <HomeButton />
      {/* <Score /> */}
      {/* <Footer /> */}
      <Joystick />
      <Credits />
    </div>
  );
}
