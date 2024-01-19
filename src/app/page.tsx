"use client";

import convert from "color-convert";
import { groupBy, sortBy } from "lodash";
import { useEffect, useState } from "react";
import Color from "../components/Color";
import ColorHeader from "../components/ColorHeader";
import GroupBy, { GROUP_BY_TYPE } from "../components/GroupBy";
import MadeBy from "../components/MadeBy";
import SortBy, { SORT_BY_TYPE } from "../components/SortBy";
import { COLORS } from "../utils/colors";

export default function Home() {
  const [sortByType, setSortByType] = useState(SORT_BY_TYPE.AZ);
  const [groupByType, setGroupByType] = useState(GROUP_BY_TYPE.NONE);

  const [groups, setGroups] = useState({});

  useEffect(() => {
    let colors: any[] = [];

    switch (sortByType) {
      case SORT_BY_TYPE.AZ:
      case SORT_BY_TYPE.ZA:
        colors = sortBy(Object.values(COLORS), "name");
        break;
      case SORT_BY_TYPE.LD:
      case SORT_BY_TYPE.DL:
        colors = sortBy(Object.values(COLORS), (c) => convert.hex.rgb(c.hex).reduce((a, c) => a + c, 0));
        break;
    }

    switch (sortByType) {
      case SORT_BY_TYPE.ZA:
      case SORT_BY_TYPE.LD:
        colors = colors.reverse();
        break;
    }

    switch (groupByType) {
      case GROUP_BY_TYPE.NONE:
        setGroups(groupBy(colors, () => "All"));
        break;
      case GROUP_BY_TYPE.COLOR_GROUP:
        setGroups(groupBy(colors, "group"));
        break;
    }
  }, [sortByType, groupByType]);

  return (
    <main className={"w-screen min-h-screen"}>
      <div className={"fixed right-1 top-1 z-20 text-2xl text-white bg-black p-2 flex gap-2"}>
        <SortBy value={sortByType} onChange={setSortByType} />
        <GroupBy value={groupByType} onChange={setGroupByType} />
      </div>

      {sortBy(Object.entries(groups), ([groupName]) => groupName).map(([groupName, groupColors]: [string, any]) => (
        <section key={groupName}>
          {groupName !== "All" && <ColorHeader name={groupName} />}
          <div
            className={
              "grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 xl:md:grid-cols-10 2xl:md:grid-cols-12 auto-rows-fr"
            }
          >
            {groupColors.map((color: any) => (
              <Color key={color.name} color={color} />
            ))}
          </div>
        </section>
      ))}
      <MadeBy />
    </main>
  );
}
