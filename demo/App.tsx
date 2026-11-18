import { useMemo, useState } from "react";
import Color from "./components/Color";
import ColorHeader from "./components/ColorHeader";
import GroupBy from "./components/GroupBy";
import MadeBy from "./components/MadeBy";
import SortBy from "./components/SortBy";
import {
  byLightness,
  byName,
  bySpectrum,
  COLORS,
  groupColors,
  sortColors,
  type ColorGroup,
  type CssColor,
} from "../src/index.js";
import { GROUP_BY_TYPES, SORT_BY_TYPES, type GroupByType, type SortByType } from "./utils/modes";

const ALL_COLORS = Object.values(COLORS);
const spectrum = bySpectrum();

const SORTS: Record<SortByType, { key: (c: CssColor) => string | number; reverse: boolean }> = {
  AZ: { key: byName, reverse: false },
  ZA: { key: byName, reverse: true },
  LD: { key: byLightness, reverse: true },
  DL: { key: byLightness, reverse: false },
  HUE: { key: spectrum, reverse: false },
  HUE_REV: { key: spectrum, reverse: true },
};

const GROUPERS: Record<GroupByType, (colors: CssColor[]) => { group: ColorGroup | null; colors: CssColor[] }[]> = {
  NONE: (colors) => [{ group: null, colors }],
  COLOR_GROUP: groupColors,
};

export default function App() {
  const [sortByType, setSortByType] = useState<SortByType>(SORT_BY_TYPES[0]);
  const [groupByType, setGroupByType] = useState<GroupByType>(GROUP_BY_TYPES[0]);

  const groups = useMemo(() => {
    const { key, reverse } = SORTS[sortByType];
    return GROUPERS[groupByType](sortColors(ALL_COLORS, key, { reverse }));
  }, [sortByType, groupByType]);

  return (
    <main className={"w-screen min-h-screen"}>
      <div className={"fixed right-1 top-1 z-20 text-2xl text-white bg-black p-2 flex gap-2"}>
        <SortBy value={sortByType} onChange={setSortByType} />
        <GroupBy value={groupByType} onChange={setGroupByType} />
      </div>

      {groups.map(({ group, colors }) => (
        <section key={group ?? "All"}>
          {group && <ColorHeader name={group} />}
          <div
            className={
              "grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 xl:md:grid-cols-10 2xl:md:grid-cols-12 auto-rows-fr"
            }
          >
            {colors.map((color) => (
              <Color key={color.name} color={color} />
            ))}
          </div>
        </section>
      ))}
      <MadeBy />
    </main>
  );
}
