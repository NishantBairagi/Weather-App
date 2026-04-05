export default function Navbar({ setPage }) {
    return (
      <div className="flex gap-4 mb-4">
        <button onClick={() => setPage("current")}>Current</button>
        <button onClick={() => setPage("historical")}>Historical</button>
      </div>
    );
  }