import { useState } from "react";
import {
  Folder,
  Plus,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";

type Status = "aktiv" | "abgeschlossen" | "pausiert";

interface Project {
  id: number;
  name: string;
  client: string;
  budget: number;
  status: Status;
}

const statusConfig: Record<
  Status,
  { label: string; color: string; icon: React.ReactNode }
> = {
  aktiv: {
    label: "Aktiv",
    color: "bg-green-100 text-green-700",
    icon: <Clock className="w-3.5 h-3.5" />,
  },
  abgeschlossen: {
    label: "Abgeschlossen",
    color: "bg-blue-100 text-blue-700",
    icon: <CheckCircle className="w-3.5 h-3.5" />,
  },
  pausiert: {
    label: "Pausiert",
    color: "bg-yellow-100 text-yellow-700",
    icon: <AlertCircle className="w-3.5 h-3.5" />,
  },
};

export default function Projektuebersicht() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [name, setName] = useState("");
  const [client, setClient] = useState("");
  const [budget, setBudget] = useState("");
  const [status, setStatus] = useState<Status>("aktiv");
  const [showForm, setShowForm] = useState(false);

  const add = () => {
    if (!name.trim()) return;
    setProjects(prev => [
      ...prev,
      { id: Date.now(), name, client, budget: Number(budget), status },
    ]);
    setName("");
    setClient("");
    setBudget("");
    setStatus("aktiv");
    setShowForm(false);
  };

  const remove = (id: number) =>
    setProjects(prev => prev.filter(p => p.id !== id));

  const cycleStatus = (id: number) => {
    const order: Status[] = ["aktiv", "pausiert", "abgeschlossen"];
    setProjects(prev =>
      prev.map(p =>
        p.id === id
          ? { ...p, status: order[(order.indexOf(p.status) + 1) % 3] }
          : p
      )
    );
  };

  return (
    <div className="p-6 max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Folder className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl font-semibold text-gray-900">
            Projektübersicht
          </h1>
        </div>
        <button
          onClick={() => setShowForm(v => !v)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" /> Neues Projekt
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6 shadow-sm">
          <div className="grid grid-cols-2 gap-3 mb-3">
            <input
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Projektname"
              value={name}
              onChange={e => setName(e.target.value)}
            />
            <input
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Auftraggeber"
              value={client}
              onChange={e => setClient(e.target.value)}
            />
            <input
              type="number"
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Budget (€)"
              value={budget}
              onChange={e => setBudget(e.target.value)}
            />
            <select
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={status}
              onChange={e => setStatus(e.target.value as Status)}
            >
              <option value="aktiv">Aktiv</option>
              <option value="pausiert">Pausiert</option>
              <option value="abgeschlossen">Abgeschlossen</option>
            </select>
          </div>
          <button
            onClick={add}
            disabled={!name.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Speichern
          </button>
        </div>
      )}

      {projects.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-12">
          Noch keine Projekte. Klicke auf „Neues Projekt".
        </p>
      ) : (
        <div className="space-y-3">
          {projects.map(p => {
            const cfg = statusConfig[p.status];
            return (
              <div
                key={p.id}
                className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex items-center justify-between"
              >
                <div>
                  <p className="font-medium text-gray-900">{p.name}</p>
                  {p.client && (
                    <p className="text-xs text-gray-400">{p.client}</p>
                  )}
                  {p.budget > 0 && (
                    <p className="text-xs text-gray-500 mt-0.5">
                      Budget: {p.budget.toLocaleString("de-DE")} €
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => cycleStatus(p.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${cfg.color}`}
                  >
                    {cfg.icon} {cfg.label}
                  </button>
                  <button
                    onClick={() => remove(p.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
