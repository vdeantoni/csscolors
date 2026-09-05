import {
  faArrowDownAZ,
  faArrowDownShortWide,
  faArrowUpAZ,
  faArrowUpShortWide,
  type IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { nextInCycle } from "../utils/cycle";
import { SORT_BY_TYPES, type SortByType } from "../utils/modes";

const ICONS: Record<SortByType, IconDefinition> = {
  AZ: faArrowDownAZ,
  ZA: faArrowUpAZ,
  LD: faArrowDownShortWide,
  DL: faArrowUpShortWide,
};

interface SortByProps {
  value: SortByType;
  onChange: (updater: (current: SortByType) => SortByType) => void;
}

const SortBy = ({ value, onChange }: SortByProps) => {
  return (
    <button
      className={"w-8 duration opacity-90 hover:opacity-100"}
      onClick={() => onChange((current) => nextInCycle(SORT_BY_TYPES, current))}
      title={"Sort by"}
    >
      <FontAwesomeIcon icon={ICONS[value]} />
    </button>
  );
};

export default SortBy;
