import {
  faCopy,
  faObjectGroup,
  faObjectUngroup,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { GROUP_BY_TYPE } from "./GroupBy";

const Color = ({ color }) => {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(color).then(
      () => {
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
        }, 600);
      },
      () => {}
    );
  };

  return (
    <div
      key={color}
      className={`relative aspect-square text-white text-sm flex flex-col items-center justify-center tracking-wider cursor-default`}
      style={{
        backgroundColor: color,
      }}
      onClick={() => copy()}
    >
      <span
        style={{
          textShadow: "0 0 1px #000, 0 0 1px #000, 0 0 1px #000",
        }}
      >
        {color}
      </span>

      {copied && (
        <div
          className={
            "absolute bottom-2 bg-black text-white p-2 text-xs rounded"
          }
        >
          Copied!
        </div>
      )}
    </div>
  );
};

export default Color;
