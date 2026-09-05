"use client";

import color from "color";
import { groupBy, sortBy } from "lodash";
import React, { useMemo, useState } from "react";
import Color from "../components/Color";
import ColorHeader from "../components/ColorHeader";
import GroupBy, { GROUP_BY_TYPES, type GroupByType } from "../components/GroupBy";
import MadeBy from "../components/MadeBy";
import SortBy, { SORT_BY_TYPES, type SortByType } from "../components/SortBy";
import { COLORS } from "../utils/colors";

type ColorEntry = (typeof COLORS)[keyof typeof COLORS];

const brightness = (c: ColorEntry) =>
  color(`#${c.hex}`)
    .rgb()
    .array()
    .reduce((a, v) => a + v, 0);

const SORTS: Record<SortByType, { key: (c: ColorEntry) => string | number; reverse: boolean }> = {
  AZ: { key: (c) => c.name, reverse: false },
  ZA: { key: (c) => c.name, reverse: true },
  LD: { key: brightness, reverse: true },
  DL: { key: brightness, reverse: false },
};

const GROUPERS: Record<GroupByType, (c: ColorEntry) => string> = {
  NONE: () => "All",
  COLOR_GROUP: (c) => c.group,
};

export default function Home() {
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
