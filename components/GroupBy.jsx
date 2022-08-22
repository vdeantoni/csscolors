import {
  faArrowDownAZ,
  faArrowDownShortWide,
  faArrowUpAZ,
  faArrowUpShortWide,
  faObjectGroup,
  faObjectUngroup,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const GROUP_BY_TYPE = {
  NONE: 0,
  COLORS: 1,
};

const GroupBy = ({ value, onChange }) => {
  return (
    <button
      className={"hidden w-8"}
      onClick={() =>
        onChange((current) => (current + 1) % Object.keys(GROUP_BY_TYPE).length)
      }
      title={"Group by"}
    >
      <FontAwesomeIcon
        icon={value === GROUP_BY_TYPE.NONE ? faObjectGroup : faObjectUngroup}
      />
    </button>
  );
};

export default GroupBy;
