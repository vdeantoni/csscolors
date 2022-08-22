import { useState } from "react";

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

      {copied && <div className={"absolute bottom-2 bg-black text-white py-1 px-3 text-xs rounded"}>Copied!</div>}
    </div>
  );
};

export default Color;
