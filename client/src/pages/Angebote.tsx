import { useState } from "react";
import { FileText, Plus, Trash2 } from "lucide-react";

interface LineItem {
  id: number;
  description: string;
  qty: number;
  price: number;
}

interface Quote {
  id: number;
  client: string;
  date: string;
  items: LineItem[];
}

const emptyItem = (): LineItem => ({
  id: Date.now(),
  description: "",
  qty: 1,
  price: 0,
});

export default function Angebote() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [client, setClient] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [items, setItems] = useState<LineItem[]>([emptyItem()]);

  const updateItem = (
    id: number,
    field: keyof LineItem,
    value: string | number
  ) =>
    setItems(prev =>
      prev.map(i => (i.id === id ? { ...i, [field]: value } : i))
    );

  const removeItem = (id: number) =>
    setItems(prev => prev.filter(i => i.id !== id));

  const total = items.reduce((sum, i) => sum + i.qty * i.price, 0);

  const save = () => {
    if (!client.trim()) return;
    setQuotes(prev => [...prev, { id: Date.now(), client, date, items }]);
    setClient("");
    setItems([emptyItem()]);
  };

  const deleteQuote = (id: number) =>
    setQuotes(prev => prev.filter(q => q.id !== id));

  return (
    <div className="p-6 max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <FileText className="w-6 h-6 text-blue-600" />
        <h1 className="text-2xl font-semibold text-gray-900">Angebote</h1>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">
          Neues Angebot
        </h2>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <input
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Kunde / Firma"
            value={client}
            onChange={e => setClient(e.target.value)}
          />
          <input
            type="date"
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={date}
            onChange={e => setDate(e.target.value)}
          />
        </div>

        <div className="space-y-2 mb-3">
          {items.map(item => (
            <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
              <input
                className="col-span-6 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Leistung / Beschreibung"
                value={item.description}
                onChange={e =>
                  updateItem(item.id, "description", e.target.value)
                }
              />
              <input
                type="number"
                className="col-span-2 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Menge"
                value={item.qty}
                onChange={e =>
                  updateItem(item.id, "qty", Number(e.target.value))
                }
              />
              <input
                type="number"
                className="col-span-3 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Preis (€)"
                value={item.price}
                onChange={e =>
                  updateItem(item.id, "price", Number(e.target.value))
                }
              />
              <button
                onClick={() => removeItem(item.id)}
                className="col-span-1 text-gray-400 hover:text-red-500 flex justify-center"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={() => setItems(prev => [...prev, emptyItem()])}
          className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm mb-4"
        >
          <Plus className="w-4 h-4" /> Position hinzufügen
        </button>

        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-800">
            Gesamt: {total.toFixed(2)} €
          </span>
          <button
            onClick={save}
            disabled={!client.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Angebot speichern
          </button>
        </div>
      </div>

      {quotes.length > 0 && (
        <div className="space-y-3">
          {quotes.map(q => (
            <div
              key={q.id}
              className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex justify-between items-start"
            >
              <div>
                <p className="font-medium text-gray-900">{q.client}</p>
                <p className="text-xs text-gray-400">
                  {q.date} ·{" "}
                  {q.items.reduce((s, i) => s + i.qty * i.price, 0).toFixed(2)}{" "}
                  €
                </p>
              </div>
              <button
                onClick={() => deleteQuote(q.id)}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
