import {
  faArrowDownAZ,
  faArrowDownShortWide,
  faArrowUpAZ,
  faArrowUpShortWide,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const SORT_BY_TYPE = {
  AZ: 0,
  ZA: 1,
  LD: 2,
  DL: 3,
};

const SortBy = ({ value, onChange }) => {
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
            : value === SORT_BY_TYPE.DL
            ? faArrowUpShortWide
            : null
        }
      />
    </button>
  );
};

export default SortBy;
