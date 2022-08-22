import convert from "color-convert";
import { sortBy } from "lodash/collection";
import { identity } from "lodash/util";
import { useEffect, useState } from "react";
import Color from "../components/Color";
import MadeBy from "../components/MadeBy";
import SortBy, { SORT_BY_TYPE } from "../components/SortBy";
import { COLORS } from "../utils/colors";

const Home = () => {
  const [sortByType, setSortByType] = useState(SORT_BY_TYPE.AZ);

  const [colors, setColors] = useState([]);

  useEffect(() => {
    switch (sortByType) {
      case SORT_BY_TYPE.AZ:
        setColors(sortBy(Object.keys(COLORS), identity));
        break;
      case SORT_BY_TYPE.ZA:
        setColors(sortBy(Object.keys(COLORS), identity).reverse());
        break;
      case SORT_BY_TYPE.LD:
        setColors(
          sortBy(Object.keys(COLORS), (c) =>
            convert.hex.rgb(COLORS[c].hex).reduce((a, c) => a + c, 0)
          ).reverse()
        );
        break;
      case SORT_BY_TYPE.DL:
        setColors(
          sortBy(Object.keys(COLORS), (c) =>
            convert.hex.rgb(COLORS[c].hex).reduce((a, c) => a + c, 0)
          )
        );
        break;
    }
  }, [sortByType]);

  return (
    <main className={"w-screen min-h-screen"}>
      <div
        className={
          "fixed right-1 top-1 text-2xl text-white bg-black p-2 flex gap-2"
        }
      >
        <SortBy value={sortByType} onChange={setSortByType} />
      </div>
      <div
        className={
          "grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 xl:md:grid-cols-10 2xl:md:grid-cols-12 auto-rows-fr"
        }
      >
        {colors.map((color) => (
          <Color key={color} color={color} />
        ))}
      </div>
      <MadeBy />
    </main>
  );
};

export default Home;
