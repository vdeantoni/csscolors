import cn from "classnames";

const GRADIENT_MAP = {
  Blues: ["from-[LightBlue]", "to-[Navy]"],
  Browns: ["from-[BlanchedAlmond]", "to-[Maroon]"],
  Grays: ["from-[Gainsboro]", "to-[Black]"],
  Greens: ["from-[PaleGreen]", "to-[DarkGreen]"],
  Oranges: ["from-[Coral]", "to-[OrangeRed]"],
  Pinks: ["from-[Pink]", "to-[MediumVioletRed]"],
  Purples: ["from-[Thistle]", "to-[Indigo]"],
  Reds: ["from-[LightSalmon]", "to-[DarkRed]"],
  Whites: ["from-[WhiteSmoke]", "to-[AntiqueWhite]"],
  Yellows: ["from-[Khaki]", "to-[Gold]"],
};

const ColorHeader = ({ name }) => {
  return (
    <h2
      className={`text-3xl pl-2 uppercase tracking-wide w-min font-bold bg-clip-text text-transparent bg-gradient-to-r 
                ${cn(GRADIENT_MAP[name])}`}
    >
      {name}
    </h2>
  );
};

export default ColorHeader;
