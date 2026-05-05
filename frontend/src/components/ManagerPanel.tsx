import { useState } from "react";
import type { User } from "../types";
import { getAllPuzzles as initialPuzzles } from "./PuzzleDatabase";

// set up page links
interface ManagerPanelProps {
  user: User | null;
}

// clickable button that tracks isArchived boolean for each game
export default function ManagerPanel({ user: _user }: ManagerPanelProps) {
  
  const [puzzles, setPuzzles] = useState(initialPuzzles);

  const toggleArchived = (id: string) => {
    setPuzzles((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isArchived: !p.isArchived } : p)),
    );
  };

  // returns page
  return (
    <>
      {puzzles.map((p) => (
        <div>
          <p>
            {p.name}: {p.isArchived ? "Archived" : "Public"}{" "}
          </p>
          <button key={p.id} onClick={() => toggleArchived(p.id)}>
            Toggle {p.name}
          </button>
        </div>
      ))}
    </>
  );
}
