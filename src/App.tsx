import { useMemo, useState } from "react";
import Color from "./components/Color";
import ColorHeader from "./components/ColorHeader";
import GroupBy from "./components/GroupBy";
import MadeBy from "./components/MadeBy";
import SortBy from "./components/SortBy";
import { groupBy, sortBy } from "./utils/collections";
import { lightness, spectrumRank, type ColorEntry } from "./utils/colorMetrics";
import { COLORS } from "./utils/colors";
import { GROUP_BY_TYPES, SORT_BY_TYPES, type GroupByType, type SortByType } from "./utils/modes";

const SORTS: Record<SortByType, { key: (c: ColorEntry) => string | number; reverse: boolean }> = {
  AZ: { key: (c) => c.name, reverse: false },
  ZA: { key: (c) => c.name, reverse: true },
  LD: { key: lightness, reverse: true },
  DL: { key: lightness, reverse: false },
  HUE: { key: spectrumRank, reverse: false },
  HUE_REV: { key: spectrumRank, reverse: true },
};

const GROUPERS: Record<GroupByType, (c: ColorEntry) => string> = {
  NONE: () => "All",
  COLOR_GROUP: (c) => c.group,
};

export default function App() {
  const [sortByType, setSortByType] = useState<SortByType>(SORT_BY_TYPES[0]);
  const [groupByType, setGroupByType] = useState<GroupByType>(GROUP_BY_TYPES[0]);

  const groups = useMemo(() => {
    const { key, reverse } = SORTS[sortByType];
    const colors = sortBy(Object.values(COLORS), key);

    if (reverse) {
      colors.reverse();
    }

    return groupBy(colors, GROUPERS[groupByType]);
  }, [sortByType, groupByType]);

  return (
    <main className={"w-screen min-h-screen"}>
      <div className={"fixed right-1 top-1 z-20 text-2xl text-white bg-black p-2 flex gap-2"}>
        <SortBy value={sortByType} onChange={setSortByType} />
        <GroupBy value={groupByType} onChange={setGroupByType} />
      </div>

      {sortBy(Object.entries(groups), ([groupName]) => groupName).map(([groupName, groupColors]) => (
        <section key={groupName}>
          {groupName !== "All" && <ColorHeader name={groupName} />}
          <div
            className={
              "grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 xl:md:grid-cols-10 2xl:md:grid-cols-12 auto-rows-fr"
            }
          >
            {groupColors.map((color) => (
              <Color key={color.name} color={color} />
            ))}
          </div>
        </section>
      ))}
      <MadeBy />
    </main>
  );
}
