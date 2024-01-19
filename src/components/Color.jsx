import cn from "classnames";
import color from "color";

const Color = ({ color: { name, hex } }) => {
  return (
    <div
      className={cn(
        color(`#${hex}`).contrast(color("black")) < 5.5 ? "text-white" : "text-black",
        `group relative aspect-square text-sm flex flex-col items-center justify-center tracking-wider cursor-default duration transition hover:z-10 hover:scale-110 hover:drop-shadow-lg`,
      )}
      style={{
        backgroundColor: name,
      }}
    >
      <div className={"absolute top-4 text-xs duration transition opacity-0 group-hover:opacity-100"}>
        <span className="select-all">#{hex}</span>
      </div>

      <div>
        <span className="select-all">{name}</span>
      </div>

      <div className={"absolute bottom-4 text-xs duration transition opacity-0 group-hover:opacity-100"}>
        <span className="select-all">rgb({color(`#${hex}`).rgb().array().join(", ")})</span>
      </div>
    </div>
  );
};

export default Color;
