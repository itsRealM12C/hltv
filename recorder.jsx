import { jsxDEV } from "react/jsx-dev-runtime";
import React from "react";
import { createRoot } from "react-dom/client";
import { Player } from "@websim/remotion/player";
import { RecordingComposition } from "./composition.jsx";
function startSuccessAnimationRender(channelName, recordingName, durationSeconds, updateProgressCallback, callback) {
  const container = document.getElementById("remotion-player-container");
  container.style.display = "block";
  let root = container.dataset.root;
  if (root) {
    root = JSON.parse(root);
  } else {
    root = createRoot(container);
    container.dataset.root = JSON.stringify(root);
  }
  const COMP_ID = "RecordingComposition";
  const FPS = 30;
  const DURATION_FRAMES = 90;
  const WIDTH = 720;
  const HEIGHT = 480;
  const animationProps = {
    channelName: `${channelName} (${durationSeconds.toFixed(1)}s)`
  };
  root.render(
    /* @__PURE__ */ jsxDEV(
      Player,
      {
        component: RecordingComposition,
        durationInFrames: DURATION_FRAMES,
        fps: FPS,
        compositionWidth: WIDTH,
        compositionHeight: HEIGHT,
        inputProps: animationProps,
        style: { width: "100%", height: "100%" },
        id: "RecordingPlayer"
      },
      void 0,
      false,
      {
        fileName: "<stdin>",
        lineNumber: 37,
        columnNumber: 9
      },
      this
    )
  );
  setTimeout(() => {
    const playerElement = document.getElementById("RecordingPlayer");
    if (!playerElement) {
      console.error("Remotion Player element not found.");
      container.style.display = "none";
      callback(false, new Error("Player element not found"));
      return;
    }
    console.log("Starting FFmpeg conversion simulation (Remotion Render)...");
    playerElement.render({
      compositionId: COMP_ID,
      durationInFrames: DURATION_FRAMES,
      fps: FPS,
      width: WIDTH,
      height: HEIGHT,
      defaultProps: animationProps,
      onProgress: (progress) => {
        if (updateProgressCallback) {
          updateProgressCallback(progress);
        }
      }
    }).then(async (result) => {
      console.log("FFmpeg simulation finished. Success animation rendered.");
      container.style.display = "none";
      callback(true);
    }).catch((err) => {
      console.error("FFmpeg simulation failed (Remotion error):", err);
      container.style.display = "none";
      callback(false, err);
    });
  }, 500);
}
export {
  startSuccessAnimationRender
};
