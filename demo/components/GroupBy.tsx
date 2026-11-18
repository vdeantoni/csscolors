import { faObjectGroup, faObjectUngroup } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { nextInCycle } from "../utils/cycle";
import { GROUP_BY_TYPES, type GroupByType } from "../utils/modes";

interface GroupByProps {
  value: GroupByType;
  onChange: (updater: (current: GroupByType) => GroupByType) => void;
}

const GroupBy = ({ value, onChange }: GroupByProps) => {
  return (
    <button
      className={"w-8 duration opacity-90 hover:opacity-100"}
      onClick={() => onChange((current) => nextInCycle(GROUP_BY_TYPES, current))}
      title={"Group by"}
    >
      <FontAwesomeIcon icon={value === "NONE" ? faObjectGroup : faObjectUngroup} />
    </button>
  );
};

export default GroupBy;
