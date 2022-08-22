import React from "react";

const MadeBy = () => {
  return (
    <div className="fixed bottom-1 right-1">
      <a
        className="block rounded-full bg-white p-1 duration opacity-90 hover:opacity-100"
        title="Made by vdeantoni.com"
        href="http://vdeantoni.com"
        target="_blank"
        rel="noreferrer"
      >
        <img className="w-10 h-10" src="/vdeantoni.png" alt="vdeantoni.com" />
      </a>
    </div>
  );
};

export default MadeBy;
