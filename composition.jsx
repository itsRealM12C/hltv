import { jsxDEV } from "react/jsx-dev-runtime";
import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Audio, staticFile } from "remotion";
const RecordingComposition = ({ channelName }) => {
  const frame = useCurrentFrame();
  const duration = 90;
  const scale = interpolate(frame, [0, 15], [0.5, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp"
  });
  const opacity = interpolate(frame, [duration - 30, duration], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp"
  });
  return /* @__PURE__ */ jsxDEV(
    AbsoluteFill,
    {
      style: {
        backgroundColor: "rgba(34, 139, 34, 0.9)",
        // Forest Green background
        justifyContent: "center",
        alignItems: "center",
        padding: 50
      },
      children: /* @__PURE__ */ jsxDEV(
        "div",
        {
          style: {
            fontSize: "48px",
            color: "white",
            textAlign: "center",
            fontFamily: "sans-serif",
            transform: `scale(${scale})`,
            opacity
          },
          children: [
            /* @__PURE__ */ jsxDEV("p", { style: { fontWeight: "bold", margin: "0 0 10px 0" }, children: "RECORDING SAVED" }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 43,
              columnNumber: 9
            }),
            /* @__PURE__ */ jsxDEV("p", { style: { fontSize: "32px", margin: 0 }, children: [
              "Channel: ",
              channelName
            ] }, void 0, true, {
              fileName: "<stdin>",
              lineNumber: 44,
              columnNumber: 9
            }),
            /* @__PURE__ */ jsxDEV("p", { style: { fontSize: "24px", marginTop: "20px" }, children: "Simulated FFmpeg render complete." }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 45,
              columnNumber: 9
            })
          ]
        },
        void 0,
        true,
        {
          fileName: "<stdin>",
          lineNumber: 33,
          columnNumber: 7
        }
      )
    },
    void 0,
    false,
    {
      fileName: "<stdin>",
      lineNumber: 25,
      columnNumber: 5
    }
  );
};
export {
  RecordingComposition
};
