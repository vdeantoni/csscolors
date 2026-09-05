import vdeantoni from "../assets/vdeantoni.png";

const MadeBy = () => {
  return (
    <div className="fixed bottom-1 right-1 z-20">
      <a
        className="block w-10 h-11 rounded-full bg-white p-1 duration opacity-90 hover:opacity-100"
        title="Made by vdeantoni.com"
        href="http://vdeantoni.com"
        target="_blank"
        rel="noreferrer"
      >
        <img src={vdeantoni} alt="Picture of the author" width={40} height={44} className="w-full h-full object-cover" />
      </a>
    </div>
  );
};

export default MadeBy;
