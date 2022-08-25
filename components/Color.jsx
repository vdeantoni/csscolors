import { faCheck, faCopy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import cn from "classnames";
import { useState } from "react";

const Color = ({ color: { name, hex } }) => {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(name).then(
      () => {
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
        }, 1000);
      },
      () => {}
    );
  };

  return (
    <div
      className={`group relative aspect-square text-white text-sm flex flex-col items-center justify-center tracking-wider cursor-default duration transition hover:z-10 hover:scale-110 hover:drop-shadow-lg`}
      style={{
        backgroundColor: name,
      }}
    >
      <div
        className={"absolute top-4 text-xs duration transition opacity-0 group-hover:opacity-100"}
        style={{
          textShadow: "0 0 1px #000, 0 0 1px #000, 0 0 1px #000",
        }}
      >
        #{hex}
      </div>

      <div
        style={{
          textShadow: "0 0 1px #000, 0 0 1px #000, 0 0 1px #000",
        }}
      >
        <span>{name}</span>
      </div>

      <div
        className={
          "absolute bottom-4 overflow-hidden w-7 h-7 bg-black cursor-pointer duration transition opacity-0 group-hover:opacity-100 "
        }
        onClick={() => copy()}
      >
        <FontAwesomeIcon
          icon={faCopy}
          className={"absolute top-1.5 left-1.5 w-4 h-4 duration  transition " + cn({ "translate-y-10": copied })}
        />
        <FontAwesomeIcon
          icon={faCheck}
          className={
            "absolute top-1.5 left-1.5 w-4 h-4 text-emerald-400 duration transition -translate-y-10 " +
            cn({ "translate-y-0": copied })
          }
        />
      </div>
    </div>
  );
};

export default Color;
