import { useState } from "react";
import { FileSignature, Plus, Trash2, Download } from "lucide-react";

type ContractStatus = "entwurf" | "aktiv" | "beendet";

interface Contract {
  id: number;
  title: string;
  client: string;
  startDate: string;
  endDate: string;
  value: number;
  status: ContractStatus;
}

const statusColors: Record<ContractStatus, string> = {
  entwurf: "bg-gray-100 text-gray-600",
  aktiv: "bg-green-100 text-green-700",
  beendet: "bg-red-100 text-red-600",
};

const statusLabels: Record<ContractStatus, string> = {
  entwurf: "Entwurf",
  aktiv: "Aktiv",
  beendet: "Beendet",
};

export default function Vertraege() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "",
    client: "",
    startDate: "",
    endDate: "",
    value: "",
    status: "entwurf" as ContractStatus,
  });

  const set = (field: string, value: string) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const save = () => {
    if (!form.title.trim()) return;
    setContracts(prev => [
      ...prev,
      { id: Date.now(), ...form, value: Number(form.value) },
    ]);
    setForm({
      title: "",
      client: "",
      startDate: "",
      endDate: "",
      value: "",
      status: "entwurf",
    });
    setShowForm(false);
  };

  const remove = (id: number) =>
    setContracts(prev => prev.filter(c => c.id !== id));

  return (
    <div className="p-6 max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FileSignature className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl font-semibold text-gray-900">Verträge</h1>
        </div>
        <button
          onClick={() => setShowForm(v => !v)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" /> Neuer Vertrag
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6 shadow-sm">
          <div className="grid grid-cols-2 gap-3 mb-4">
            <input
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Vertragsbezeichnung"
              value={form.title}
              onChange={e => set("title", e.target.value)}
            />
            <input
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Auftraggeber"
              value={form.client}
              onChange={e => set("client", e.target.value)}
            />
            <div>
              <label className="block text-xs text-gray-500 mb-1">Beginn</label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.startDate}
                onChange={e => set("startDate", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Ende</label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.endDate}
                onChange={e => set("endDate", e.target.value)}
              />
            </div>
            <input
              type="number"
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Vertragswert (€)"
              value={form.value}
              onChange={e => set("value", e.target.value)}
            />
            <select
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.status}
              onChange={e => set("status", e.target.value)}
            >
              <option value="entwurf">Entwurf</option>
              <option value="aktiv">Aktiv</option>
              <option value="beendet">Beendet</option>
            </select>
          </div>
          <button
            onClick={save}
            disabled={!form.title.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Speichern
          </button>
        </div>
      )}

      {contracts.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-12">
          Noch keine Verträge erfasst.
        </p>
      ) : (
        <div className="space-y-3">
          {contracts.map(c => (
            <div
              key={c.id}
              className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex items-center justify-between"
            >
              <div>
                <p className="font-medium text-gray-900">{c.title}</p>
                {c.client && (
                  <p className="text-xs text-gray-400">{c.client}</p>
                )}
                <div className="flex gap-3 mt-1 text-xs text-gray-500">
                  {c.startDate && <span>{c.startDate}</span>}
                  {c.endDate && <span>→ {c.endDate}</span>}
                  {c.value > 0 && (
                    <span>{c.value.toLocaleString("de-DE")} €</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[c.status]}`}
                >
                  {statusLabels[c.status]}
                </span>
                <button
                  onClick={() => remove(c.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
