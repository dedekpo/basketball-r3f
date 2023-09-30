import { useGamificationStore } from "../../lib/stores";

export default function ColorPicker() {
  return (
    <div>
      <span>Skin:</span>
      <div className="grid grid-cols-3 ">
        <Color color="#ffdbac" type="skin" />
        <Color color="#f1c27d" type="skin" />
        <Color color="#e0ac69" type="skin" />
        <Color color="#c68642" type="skin" />
        <Color color="#8d5524" type="skin" />
        <Color color="#3b2219" type="skin" />
      </div>
      <span>Color:</span>
      <div className="grid grid-cols-3 ">
        <Color color="#ec1010" type="shirt" />
        <Color color="#32a852" type="shirt" />
        <Color color="#2628d1" type="shirt" />
        <Color color="#d4d015" type="shirt" />
        <Color color="#e31bb4" type="shirt" />
        <Color color="#d45e0f" type="shirt" />
        <Color color="#820cf0" type="shirt" />
        <Color color="#e4ebe7" type="shirt" />
        <Color color="#1f1f1f" type="shirt" />
      </div>
    </div>
  );
}

function Color({ color, type }: { color: string; type: "skin" | "shirt" }) {
  const { skinColor, setSkinColor, shirtColor, setShirtColor } =
    useGamificationStore((state) => ({
      skinColor: state.skinColor,
      setSkinColor: state.setSkinColor,
      shirtColor: state.shirtColor,
      setShirtColor: state.setShirtColor,
    }));

  function handleSkinChange(color: string) {
    setSkinColor(color);
  }

  function handleShirtChange(color: string) {
    setShirtColor(color);
  }

  const options = {
    skin: {
      color: skinColor,
      handle: handleSkinChange,
    },
    shirt: {
      color: shirtColor,
      handle: handleShirtChange,
    },
  };

  return (
    <div
      onClick={() => options[type].handle(color)}
      className={`cursor-pointer flex items-center justify-center border-2 w-[25px] h-[25px] lg:w-[40px] lg:h-[40px] ${
        options[type].color === color ? "border-black" : ""
      }`}
      style={{
        backgroundColor: color,
      }}
    >
      <span className={`${options[type].color === color ? "" : "hidden"}`}>
        {"◉"}
      </span>
    </div>
  );
}
