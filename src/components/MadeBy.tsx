import React from "react";
import Image from "next/image";
import vdeantoni from "../../public/vdeantoni.png";

const MadeBy: React.FC = () => {
  return (
    <div className="fixed bottom-1 right-1 z-20">
      <a
        className="block w-10 h-11 rounded-full bg-white p-1 duration opacity-90 hover:opacity-100"
        title="Made by vdeantoni.com"
        href="http://vdeantoni.com"
        target="_blank"
        rel="noreferrer"
      >
        <Image src={vdeantoni} alt="Picture of the author" placeholder="blur" objectFit="cover" />
      </a>
    </div>
  );
};

export default MadeBy;
