/* =============================================================
   ExpenseCategorization.tsx
   Design: Neue Sachlichkeit
   Features: Expense list, category assignment, tax deductibility
   indicator, monthly breakdown chart, EÜR summary
   ============================================================= */
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Plus,
  Trash2,
  Download,
  Filter,
  TrendingDown,
  PieChart,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { nanoid } from "nanoid";
import {
  PieChart as RechartsPie,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

interface Expense {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  deductible: number; // percentage 0-100
  receipt: boolean;
  notes: string;
}

const categories = [
  {
    value: "buero",
    label: "Büro & Arbeitsmittel",
    color: "#D4820A",
    deductible: 100,
  },
  {
    value: "software",
    label: "Software & Lizenzen",
    color: "#2563EB",
    deductible: 100,
  },
  {
    value: "reise",
    label: "Reise & Fahrtkosten",
    color: "#7C3AED",
    deductible: 100,
  },
  {
    value: "weiterbildung",
    label: "Weiterbildung & Fachliteratur",
    color: "#059669",
    deductible: 100,
  },
  {
    value: "kommunikation",
    label: "Telefon & Internet",
    color: "#DC2626",
    deductible: 50,
  },
  {
    value: "marketing",
    label: "Marketing & Werbung",
    color: "#D97706",
    deductible: 100,
  },
  {
    value: "versicherung",
    label: "Versicherungen",
    color: "#0891B2",
    deductible: 100,
  },
  {
    value: "steuerberatung",
    label: "Steuerberatung",
    color: "#4F46E5",
    deductible: 100,
  },
  {
    value: "homeoffice",
    label: "Homeoffice (anteilig)",
    color: "#64748B",
    deductible: 50,
  },
  { value: "sonstiges", label: "Sonstiges", color: "#94A3B8", deductible: 0 },
];

const sampleExpenses: Expense[] = [
  {
    id: "1",
    date: "2024-11-02",
    description: "Adobe Creative Cloud Jahresabo",
    amount: 71.99,
    category: "software",
    deductible: 100,
    receipt: true,
    notes: "",
  },
  {
    id: "2",
    date: "2024-11-05",
    description: "Bahnticket Berlin-München (Kundentermin)",
    amount: 89.0,
    category: "reise",
    deductible: 100,
    receipt: true,
    notes: "Kundentermin Müller GmbH",
  },
  {
    id: "3",
    date: "2024-11-08",
    description: "Druckerpatronen & Papier",
    amount: 34.5,
    category: "buero",
    deductible: 100,
    receipt: true,
    notes: "",
  },
  {
    id: "4",
    date: "2024-11-10",
    description: "Mobilfunkrechnung (50% beruflich)",
    amount: 49.99,
    category: "kommunikation",
    deductible: 50,
    receipt: true,
    notes: "",
  },
  {
    id: "5",
    date: "2024-11-12",
    description: "Fachbuch 'React Design Patterns'",
    amount: 39.9,
    category: "weiterbildung",
    deductible: 100,
    receipt: false,
    notes: "Beleg fehlt!",
  },
  {
    id: "6",
    date: "2024-11-15",
    description: "GitHub Pro Abo",
    amount: 4.0,
    category: "software",
    deductible: 100,
    receipt: true,
    notes: "",
  },
  {
    id: "7",
    date: "2024-11-18",
    description: "Berufshaftpflichtversicherung (monatlich)",
    amount: 28.0,
    category: "versicherung",
    deductible: 100,
    receipt: true,
    notes: "",
  },
  {
    id: "8",
    date: "2024-11-20",
    description: "Steuerberater Beratungsgespräch",
    amount: 180.0,
    category: "steuerberatung",
    deductible: 100,
    receipt: true,
    notes: "",
  },
  {
    id: "9",
    date: "2024-11-22",
    description: "Internetanschluss (50% beruflich)",
    amount: 29.99,
    category: "kommunikation",
    deductible: 50,
    receipt: true,
    notes: "",
  },
  {
    id: "10",
    date: "2024-11-25",
    description: "LinkedIn Premium (Kundenakquise)",
    amount: 39.99,
    category: "marketing",
    deductible: 100,
    receipt: true,
    notes: "",
  },
];

export default function ExpenseCategorization() {
  const [expenses, setExpenses] = useState<Expense[]>(sampleExpenses);
  const [showAddForm, setShowAddForm] = useState(false);
  const [filterCategory, setFilterCategory] = useState("all");
  const [newExpense, setNewExpense] = useState<Partial<Expense>>({
    date: new Date().toISOString().split("T")[0],
    description: "",
    amount: 0,
    category: "buero",
    deductible: 100,
    receipt: false,
    notes: "",
  });

  const formatEuro = (amount: number) =>
    new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
    }).format(amount);

  const filteredExpenses =
    filterCategory === "all"
      ? expenses
      : expenses.filter(e => e.category === filterCategory);

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalDeductible = expenses.reduce(
    (sum, e) => sum + (e.amount * e.deductible) / 100,
    0
  );
  const missingReceipts = expenses.filter(e => !e.receipt).length;

  // Category breakdown for pie chart
  const categoryData = categories
    .map(cat => ({
      name: cat.label,
      value: expenses
        .filter(e => e.category === cat.value)
        .reduce((sum, e) => sum + e.amount, 0),
      color: cat.color,
    }))
    .filter(d => d.value > 0);

  // Monthly breakdown
  const monthlyData = [
    { month: "Sep", ausgaben: 312, absetzbar: 287 },
    { month: "Okt", ausgaben: 445, absetzbar: 398 },
    { month: "Nov", ausgaben: totalExpenses, absetzbar: totalDeductible },
  ];

  const addExpense = () => {
    if (!newExpense.description || !newExpense.amount) {
      toast.error("Bitte Beschreibung und Betrag eingeben");
      return;
    }
    const cat = categories.find(c => c.value === newExpense.category);
    const expense: Expense = {
      id: nanoid(),
      date: newExpense.date || new Date().toISOString().split("T")[0],
      description: newExpense.description || "",
      amount: newExpense.amount || 0,
      category: newExpense.category || "sonstiges",
      deductible: cat?.deductible || 0,
      receipt: newExpense.receipt || false,
      notes: newExpense.notes || "",
    };
    setExpenses([expense, ...expenses]);
    setShowAddForm(false);
    setNewExpense({
      date: new Date().toISOString().split("T")[0],
      description: "",
      amount: 0,
      category: "buero",
      deductible: 100,
      receipt: false,
      notes: "",
    });
    toast.success("Ausgabe hinzugefügt");
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Ausgabenkategorisierung
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Betriebsausgaben erfassen, kategorisieren und steuerlich optimieren
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.success("EÜR-Export wird vorbereitet")}
          >
            <Download className="w-4 h-4 mr-1.5" />
            EÜR Export
          </Button>
          <Button
            size="sm"
            className="bg-amber-gold hover:bg-amber-gold/90 text-white"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Ausgabe hinzufügen
          </Button>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 animate-stagger">
        {[
          {
            label: "Gesamtausgaben",
            value: formatEuro(totalExpenses),
            sub: "November 2024",
            color: "text-foreground",
          },
          {
            label: "Steuerlich absetzbar",
            value: formatEuro(totalDeductible),
            sub: `${((totalDeductible / totalExpenses) * 100).toFixed(0)}% der Ausgaben`,
            color: "text-green-600",
          },
          {
            label: "Nicht absetzbar",
            value: formatEuro(totalExpenses - totalDeductible),
            sub: "Privatanteil",
            color: "text-muted-foreground",
          },
          {
            label: "Fehlende Belege",
            value: String(missingReceipts),
            sub:
              missingReceipts > 0
                ? "Achtung: Belege sammeln!"
                : "Alle Belege vorhanden",
            color: missingReceipts > 0 ? "text-red-600" : "text-green-600",
          },
        ].map(kpi => (
          <div
            key={kpi.label}
            className="bg-card border border-border rounded p-4"
          >
            <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">
              {kpi.label}
            </div>
            <div className={cn("text-xl font-bold financial-value", kpi.color)}>
              {kpi.value}
            </div>
            <div className="text-xs text-muted-foreground mt-1">{kpi.sub}</div>
          </div>
        ))}
      </div>

      {/* Add Expense Form */}
      {showAddForm && (
        <div className="bg-card border border-amber-gold/30 rounded p-5 mb-6 animate-fade-in-up">
          <h3 className="text-sm font-semibold mb-4">Neue Ausgabe erfassen</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label className="text-xs">Datum</Label>
              <Input
                type="date"
                value={newExpense.date}
                onChange={e =>
                  setNewExpense({ ...newExpense, date: e.target.value })
                }
                className="mt-1 h-8 text-sm"
              />
            </div>
            <div className="lg:col-span-2">
              <Label className="text-xs">Beschreibung</Label>
              <Input
                value={newExpense.description}
                onChange={e =>
                  setNewExpense({ ...newExpense, description: e.target.value })
                }
                className="mt-1 h-8 text-sm"
                placeholder="Ausgabenbeschreibung..."
              />
            </div>
            <div>
              <Label className="text-xs">Betrag (€)</Label>
              <Input
                type="number"
                value={newExpense.amount || ""}
                onChange={e =>
                  setNewExpense({
                    ...newExpense,
                    amount: parseFloat(e.target.value) || 0,
                  })
                }
                className="mt-1 h-8 text-sm financial-value"
                placeholder="0,00"
              />
            </div>
            <div>
              <Label className="text-xs">Kategorie</Label>
              <Select
                value={newExpense.category}
                onValueChange={v => {
                  const cat = categories.find(c => c.value === v);
                  setNewExpense({
                    ...newExpense,
                    category: v,
                    deductible: cat?.deductible || 0,
                  });
                }}
              >
                <SelectTrigger className="mt-1 h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end gap-3">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="receipt"
                  checked={newExpense.receipt}
                  onChange={e =>
                    setNewExpense({ ...newExpense, receipt: e.target.checked })
                  }
                  className="w-4 h-4 accent-amber-gold"
                />
                <Label htmlFor="receipt" className="text-xs cursor-pointer">
                  Beleg vorhanden
                </Label>
              </div>
            </div>
            <div className="flex items-end gap-2">
              <Button
                onClick={addExpense}
                className="bg-amber-gold hover:bg-amber-gold/90 text-white h-8 text-xs"
              >
                Hinzufügen
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowAddForm(false)}
                className="h-8 text-xs"
              >
                Abbrechen
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Expense Table */}
        <div className="xl:col-span-2 space-y-4">
          {/* Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="h-8 text-xs w-52">
                <SelectValue placeholder="Alle Kategorien" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Kategorien</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-xs text-muted-foreground ml-auto">
              {filteredExpenses.length} Ausgaben
            </span>
          </div>

          {/* Table */}
          <div className="bg-card border border-border rounded overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/20">
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Datum
                    </th>
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Beschreibung
                    </th>
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Kategorie
                    </th>
                    <th className="text-right px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Betrag
                    </th>
                    <th className="text-right px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Absetzbar
                    </th>
                    <th className="text-center px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Beleg
                    </th>
                    <th className="w-8"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredExpenses.map(expense => {
                    const cat = categories.find(
                      c => c.value === expense.category
                    );
                    const deductibleAmount =
                      (expense.amount * expense.deductible) / 100;
                    return (
                      <tr
                        key={expense.id}
                        className="border-b border-border/50 hover:bg-muted/10 transition-colors"
                      >
                        <td className="px-4 py-3 text-xs text-muted-foreground financial-value">
                          {new Date(expense.date).toLocaleDateString("de-DE")}
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm font-medium">
                            {expense.description}
                          </div>
                          {expense.notes && (
                            <div className="text-[10px] text-muted-foreground">
                              {expense.notes}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className="text-[10px] px-2 py-0.5 rounded font-medium"
                            style={{
                              backgroundColor: cat?.color + "20",
                              color: cat?.color,
                              border: `1px solid ${cat?.color}40`,
                            }}
                          >
                            {cat?.label || expense.category}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className="financial-value font-semibold text-sm">
                            {formatEuro(expense.amount)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div>
                            <span
                              className={cn(
                                "financial-value text-sm font-semibold",
                                expense.deductible === 100
                                  ? "text-green-600"
                                  : expense.deductible > 0
                                    ? "text-amber-600"
                                    : "text-muted-foreground"
                              )}
                            >
                              {formatEuro(deductibleAmount)}
                            </span>
                            {expense.deductible < 100 && (
                              <div className="text-[10px] text-muted-foreground">
                                {expense.deductible}%
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          {expense.receipt ? (
                            <CheckCircle className="w-4 h-4 text-green-500 mx-auto" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-red-500 mx-auto" />
                          )}
                        </td>
                        <td className="px-2 py-3">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="w-6 h-6 text-muted-foreground hover:text-destructive"
                            onClick={() => {
                              setExpenses(
                                expenses.filter(e => e.id !== expense.id)
                              );
                              toast.success("Ausgabe gelöscht");
                            }}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="bg-muted/20 border-t border-border">
                    <td colSpan={3} className="px-4 py-3 text-xs font-semibold">
                      Gesamt
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="financial-value font-bold">
                        {formatEuro(
                          filteredExpenses.reduce((s, e) => s + e.amount, 0)
                        )}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="financial-value font-bold text-green-600">
                        {formatEuro(
                          filteredExpenses.reduce(
                            (s, e) => s + (e.amount * e.deductible) / 100,
                            0
                          )
                        )}
                      </span>
                    </td>
                    <td colSpan={2}></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        {/* Charts & Summary */}
        <div className="xl:col-span-1 space-y-4">
          {/* Pie Chart */}
          <div className="bg-card border border-border rounded p-5">
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
              <PieChart className="w-4 h-4 text-amber-gold" />
              Ausgaben nach Kategorie
            </h3>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPie>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={35}
                    outerRadius={65}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => [formatEuro(value), ""]}
                    contentStyle={{ fontSize: 11, borderRadius: 4 }}
                  />
                </RechartsPie>
              </ResponsiveContainer>
            </div>
            <div className="space-y-1.5 mt-2">
              {categoryData.slice(0, 5).map(cat => (
                <div key={cat.name} className="flex items-center gap-2 text-xs">
                  <div
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="flex-1 text-muted-foreground truncate">
                    {cat.name}
                  </span>
                  <span className="financial-value font-medium">
                    {formatEuro(cat.value)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly Trend */}
          <div className="bg-card border border-border rounded p-5">
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-amber-gold" />
              Monatstrend
            </h3>
            <div className="h-36">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlyData}
                  margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="oklch(0.9 0.005 80)"
                  />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} tickFormatter={v => `${v}€`} />
                  <Tooltip
                    formatter={(value: number) => [formatEuro(value), ""]}
                    contentStyle={{ fontSize: 11, borderRadius: 4 }}
                  />
                  <Bar
                    dataKey="ausgaben"
                    fill="oklch(0.62 0.14 65)"
                    name="Ausgaben"
                    radius={[2, 2, 0, 0]}
                  />
                  <Bar
                    dataKey="absetzbar"
                    fill="oklch(0.42 0.12 145)"
                    name="Absetzbar"
                    radius={[2, 2, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* EÜR Summary */}
          <div className="bg-card border border-border rounded p-5">
            <h3 className="text-sm font-semibold mb-3">EÜR-Zusammenfassung</h3>
            <div className="space-y-2 text-xs">
              {categories
                .filter(cat => {
                  const total = expenses
                    .filter(e => e.category === cat.value)
                    .reduce((s, e) => s + e.amount, 0);
                  return total > 0;
                })
                .map(cat => {
                  const total = expenses
                    .filter(e => e.category === cat.value)
                    .reduce((s, e) => s + e.amount, 0);
                  const deductible = expenses
                    .filter(e => e.category === cat.value)
                    .reduce((s, e) => s + (e.amount * e.deductible) / 100, 0);
                  return (
                    <div
                      key={cat.value}
                      className="flex items-center justify-between py-1 border-b border-border/50 last:border-0"
                    >
                      <span className="text-muted-foreground truncate max-w-[55%]">
                        {cat.label}
                      </span>
                      <span className="financial-value font-semibold text-green-600">
                        {formatEuro(deductible)}
                      </span>
                    </div>
                  );
                })}
              <div className="flex items-center justify-between pt-2 border-t border-border font-bold">
                <span>Gesamt absetzbar</span>
                <span className="financial-value text-green-600">
                  {formatEuro(totalDeductible)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
