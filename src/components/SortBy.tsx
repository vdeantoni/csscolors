import {
  faArrowDownAZ,
  faArrowDownShortWide,
  faArrowUpAZ,
  faArrowUpShortWide,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export enum SORT_BY_TYPE {
  AZ = 0,
  ZA = 1,
  LD = 2,
  DL = 3,
}

interface SortByProps {
  value: number;
  onChange: (updater: (current: number) => number) => void;
}

const SortBy = ({ value, onChange }: SortByProps) => {
  return (
    <button
      className={"w-8 duration opacity-90 hover:opacity-100"}
      onClick={() => onChange((current) => (current + 1) % Object.keys(SORT_BY_TYPE).length)}
      title={"Sort by"}
    >
      <FontAwesomeIcon
        icon={
          value === SORT_BY_TYPE.AZ
            ? faArrowDownAZ
            : value === SORT_BY_TYPE.ZA
              ? faArrowUpAZ
              : value === SORT_BY_TYPE.LD
                ? faArrowDownShortWide
                : faArrowUpShortWide
        }
      />
    </button>
  );
};

export default SortBy;
