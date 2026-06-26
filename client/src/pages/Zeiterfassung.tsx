import { useState } from "react";
import { Clock, Play, Square, Trash2 } from "lucide-react";

interface TimeEntry {
  id: number;
  project: string;
  description: string;
  start: Date;
  end?: Date;
}

export default function Zeiterfassung() {
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [running, setRunning] = useState<TimeEntry | null>(null);
  const [project, setProject] = useState("");
  const [description, setDescription] = useState("");

  const start = () => {
    if (!project.trim()) return;
    const entry: TimeEntry = {
      id: Date.now(),
      project,
      description,
      start: new Date(),
    };
    setRunning(entry);
    setProject("");
    setDescription("");
  };

  const stop = () => {
    if (!running) return;
    setEntries(prev => [...prev, { ...running, end: new Date() }]);
    setRunning(null);
  };

  const remove = (id: number) =>
    setEntries(prev => prev.filter(e => e.id !== id));

  const duration = (start: Date, end?: Date) => {
    const ms = (end ?? new Date()).getTime() - start.getTime();
    const h = Math.floor(ms / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="p-6 max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <Clock className="w-6 h-6 text-blue-600" />
        <h1 className="text-2xl font-semibold text-gray-900">Zeiterfassung</h1>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6 shadow-sm">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 mb-4">
          <input
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Projekt"
            value={project}
            onChange={e => setProject(e.target.value)}
            disabled={!!running}
          />
          <input
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Beschreibung (optional)"
            value={description}
            onChange={e => setDescription(e.target.value)}
            disabled={!!running}
          />
        </div>
        <div className="flex items-center gap-3">
          {!running ? (
            <button
              onClick={start}
              disabled={!project.trim()}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <Play className="w-4 h-4" /> Start
            </button>
          ) : (
            <button
              onClick={stop}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <Square className="w-4 h-4" /> Stop
            </button>
          )}
          {running && (
            <span className="text-sm text-gray-600">
              <strong>{running.project}</strong> läuft -{" "}
              {duration(running.start)}
            </span>
          )}
        </div>
      </div>

      {entries.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">
                  Projekt
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">
                  Beschreibung
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">
                  Dauer
                </th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {entries.map(e => (
                <tr
                  key={e.id}
                  className="border-b border-gray-100 last:border-0"
                >
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {e.project}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {e.description || " - "}
                  </td>
                  <td className="px-4 py-3 text-gray-700 font-mono">
                    {duration(e.start, e.end)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => remove(e.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {entries.length === 0 && !running && (
        <p className="text-sm text-gray-400 text-center py-8">
          Noch keine Einträge. Starte einen Timer oben.
        </p>
      )}
    </div>
  );
}
