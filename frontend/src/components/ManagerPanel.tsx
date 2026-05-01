import { useState } from "react";
import type { User } from "../types";
import { getAllPuzzles as initialPuzzles } from "./PuzzleDatabase";

interface ManagerPanelProps {
  user: User | null;
}

export default function ManagerPanel({ user }: ManagerPanelProps) {
  const [puzzles, setPuzzles] = useState(initialPuzzles);

  const toggleArchived = (id: string) => {
    setPuzzles((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isArchived: !p.isArchived } : p)),
    );
  };

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
