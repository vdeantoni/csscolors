import {
  faArrowDownAZ,
  faArrowDownShortWide,
  faArrowUpAZ,
  faArrowUpShortWide,
  faRainbow,
  type IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { nextInCycle } from "../utils/cycle";
import { SORT_BY_TYPES, type SortByType } from "../utils/modes";

interface Mode {
  icon: IconDefinition;
  label: string;
  /** The rainbow glyph is mirror-symmetric, so only rotation reads as a reversal. */
  rotation?: 180;
}

const MODES: Record<SortByType, Mode> = {
  AZ: { icon: faArrowDownAZ, label: "Sort by name, A to Z" },
  ZA: { icon: faArrowUpAZ, label: "Sort by name, Z to A" },
  LD: { icon: faArrowDownShortWide, label: "Sort by lightness, light to dark" },
  DL: { icon: faArrowUpShortWide, label: "Sort by lightness, dark to light" },
  HUE: { icon: faRainbow, label: "Sort by spectrum, greys then pinks through purples" },
  HUE_REV: { icon: faRainbow, rotation: 180, label: "Sort by spectrum, purples through pinks then greys" },
};

interface SortByProps {
  value: SortByType;
  onChange: (updater: (current: SortByType) => SortByType) => void;
}

const SortBy = ({ value, onChange }: SortByProps) => {
  const { icon, label, rotation } = MODES[value];

  return (
    <button
      className={"w-8 duration opacity-90 hover:opacity-100"}
      onClick={() => onChange((current) => nextInCycle(SORT_BY_TYPES, current))}
      title={label}
      aria-label={label}
    >
      <FontAwesomeIcon icon={icon} rotation={rotation} />
    </button>
  );
};

export default SortBy;
