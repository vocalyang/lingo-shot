import {
  FirstPersonCamera,
  Joystick,
  Model,
  Mouse,
  Reticle,
  Skybox,
  useKeyboard,
  useLoop,
  usePreload,
  useSpring,
  World,
  useWindowSize
} from "lingo3d-react";
import { useRef, useState } from "react";

const Game = () => {
  const key = useKeyboard();
  const [joystick, setJoystick] = useState({ x: 0, y: 0, angle: 0 });

  const characterRef = useRef();
  const motion = key === "w" || joystick.y < 0 ? "walking" : "idle";

  useLoop(() => {
    characterRef.current.moveForward(-10);
  }, motion === "walking");

  const gunSpring = useSpring({ from: -30, to: -40 });

  const windowSize = useWindowSize();
  const zoom = windowSize.width > windowSize.height ? 1 : 0.5;

  return (
    <>
      <World>
        <Model src="Grassland.glb" scale={270} physics="map" />
        <FirstPersonCamera active mouseControl zoom={zoom}>
          <Model
            ref={characterRef}
            src="Fox.fbx"
            physics="character"
            animations={{ idle: "Rifle Idle.fbx", walking: "Rifle Run.fbx" }}
            animation={motion}
            visible={false}
          />
          <Model
            src="gun.glb"
            z={gunSpring}
            x={20}
            y={-10}
            scale={0.2}
            innerRotationY={-90}
          />
        </FirstPersonCamera>
        <Skybox texture="skybox.jpg" />
      </World>
      <Mouse onClick={() => gunSpring.restart()} />
      <Joystick
        onMove={(e) => setJoystick(e)}
        onMoveEnd={() => setJoystick({ x: 0, y: 0, angle: 0 })}
      />
      <Reticle variant={7} color="white" />
    </>
  );
};

const App = () => {
  const progress = usePreload(
    [
      "Fox.fbx",
      "Grassland.glb",
      "ground.jpeg",
      "gun.glb",
      "Idle.fbx",
      "Rifle Idle.fbx",
      "Rifle Run.fbx",
      "skybox.jpg",
      "Walking.fbx"
    ],
    "6.6mb"
  );

  if (progress < 100)
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          left: 0,
          top: 0,
          backgroundColor: "black",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        loading {Math.round(progress)}%
      </div>
    );

  return <Game />;
};

export default App;
