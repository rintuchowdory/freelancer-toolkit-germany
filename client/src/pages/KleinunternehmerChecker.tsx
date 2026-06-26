/* =============================================================
   KleinunternehmerChecker.tsx
   Design: Neue Sachlichkeit
   Features: §19 UStG revenue threshold checker, year-over-year
   tracking, status indicator, legal notes
   ============================================================= */
import { useState, useMemo } from "react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  Info,
  TrendingUp,
  ChevronRight,
  Calculator,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

const THRESHOLD_CURRENT = 22000; // §19 UStG — Vorjahresumsatz
const THRESHOLD_FORECAST = 50000; // Prognosegrenze für laufendes Jahr

interface MonthlyRevenue {
  month: string;
  revenue: number;
}

const defaultMonthlyData: MonthlyRevenue[] = [
  { month: "Jan", revenue: 1800 },
  { month: "Feb", revenue: 2100 },
  { month: "Mar", revenue: 1950 },
  { month: "Apr", revenue: 2400 },
  { month: "Mai", revenue: 2200 },
  { month: "Jun", revenue: 1750 },
  { month: "Jul", revenue: 2600 },
  { month: "Aug", revenue: 2300 },
  { month: "Sep", revenue: 0 },
  { month: "Okt", revenue: 0 },
  { month: "Nov", revenue: 0 },
  { month: "Dez", revenue: 0 },
];

export default function KleinunternehmerChecker() {
  const [previousYearRevenue, setPreviousYearRevenue] = useState("18500");
  const [monthlyData, setMonthlyData] =
    useState<MonthlyRevenue[]>(defaultMonthlyData);
  const [activeMonth, setActiveMonth] = useState<number | null>(null);

  const prevRevenue = parseFloat(previousYearRevenue) || 0;
  const currentYearTotal = monthlyData.reduce((sum, m) => sum + m.revenue, 0);
  const completedMonths = monthlyData.filter(m => m.revenue > 0).length;
  const projectedAnnual =
    completedMonths > 0 ? (currentYearTotal / completedMonths) * 12 : 0;

  const prevYearStatus = useMemo(() => {
    if (prevRevenue <= THRESHOLD_CURRENT) return "eligible";
    return "ineligible";
  }, [prevRevenue]);

  const currentYearStatus = useMemo(() => {
    if (projectedAnnual <= THRESHOLD_FORECAST) return "safe";
    if (projectedAnnual <= THRESHOLD_FORECAST * 1.1) return "warning";
    return "exceeded";
  }, [projectedAnnual]);

  const overallStatus =
    prevYearStatus === "eligible" && currentYearStatus !== "exceeded"
      ? "eligible"
      : "ineligible";

  const formatEuro = (amount: number) =>
    new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
    }).format(amount);

  const StatusCard = () => {
    const configs = {
      eligible: {
        icon: CheckCircle,
        title: "Kleinunternehmer-Status aktiv",
        subtitle: "Sie erfüllen die Voraussetzungen des §19 UStG",
        bg: "bg-green-50 dark:bg-green-950/30",
        border: "border-green-200 dark:border-green-800",
        iconColor: "text-green-600",
        badge: "Berechtigt",
        badgeClass:
          "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
      },
      ineligible: {
        icon: XCircle,
        title: "Regelbesteuerung erforderlich",
        subtitle: "Sie überschreiten die Grenzen des §19 UStG",
        bg: "bg-red-50 dark:bg-red-950/30",
        border: "border-red-200 dark:border-red-800",
        iconColor: "text-red-600",
        badge: "Nicht berechtigt",
        badgeClass: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
      },
    };
    const config = configs[overallStatus];
    const Icon = config.icon;

    return (
      <div
        className={cn(
          "rounded border p-6 flex items-start gap-4",
          config.bg,
          config.border
        )}
      >
        <Icon className={cn("w-8 h-8 shrink-0 mt-0.5", config.iconColor)} />
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <h3 className="text-base font-bold">{config.title}</h3>
            <span
              className={cn(
                "text-xs px-2 py-0.5 rounded font-semibold",
                config.badgeClass
              )}
            >
              {config.badge}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">{config.subtitle}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight">
          Kleinunternehmer-Prüfer
        </h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          §19 UStG — Umsatzgrenzen prüfen und Berechtigung feststellen
        </p>
      </div>

      {/* Status Banner */}
      <div className="mb-6 animate-fade-in-up">
        <StatusCard />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Inputs & Thresholds */}
        <div className="lg:col-span-1 space-y-4">
          {/* Previous Year Revenue */}
          <div className="bg-card border border-border rounded p-5">
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
              <Calculator className="w-4 h-4 text-amber-gold" />
              Vorjahresumsatz (Brutto)
            </h3>
            <div className="space-y-3">
              <div>
                <Label className="text-xs">
                  Gesamtumsatz {new Date().getFullYear() - 1}
                </Label>
                <div className="relative mt-1">
                  <Input
                    type="number"
                    value={previousYearRevenue}
                    onChange={e => setPreviousYearRevenue(e.target.value)}
                    className="h-9 text-sm financial-value pr-8"
                    placeholder="0,00"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                    €
                  </span>
                </div>
              </div>

              {/* Threshold Progress */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Grenze §19 UStG</span>
                  <span className="financial-value font-semibold">
                    {formatEuro(THRESHOLD_CURRENT)}
                  </span>
                </div>
                <Progress
                  value={Math.min((prevRevenue / THRESHOLD_CURRENT) * 100, 100)}
                  className="h-2"
                />
                <div className="flex justify-between text-xs">
                  <span
                    className={cn(
                      "font-semibold financial-value",
                      prevYearStatus === "eligible"
                        ? "text-green-600"
                        : "text-red-600"
                    )}
                  >
                    {formatEuro(prevRevenue)}
                  </span>
                  <span className="text-muted-foreground">
                    {prevYearStatus === "eligible"
                      ? `${formatEuro(THRESHOLD_CURRENT - prevRevenue)} Spielraum`
                      : `${formatEuro(prevRevenue - THRESHOLD_CURRENT)} überschritten`}
                  </span>
                </div>
              </div>

              <div
                className={cn(
                  "text-xs px-3 py-2 rounded",
                  prevYearStatus === "eligible"
                    ? "bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-300"
                    : "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-300"
                )}
              >
                {prevYearStatus === "eligible"
                  ? "✓ Vorjahresumsatz unter der Grenze"
                  : "✗ Vorjahresumsatz überschreitet die Grenze"}
              </div>
            </div>
          </div>

          {/* Current Year Forecast */}
          <div className="bg-card border border-border rounded p-5">
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-amber-gold" />
              Prognose {new Date().getFullYear()}
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Bisheriger Umsatz</span>
                <span className="financial-value font-semibold">
                  {formatEuro(currentYearTotal)}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">
                  Hochrechnung (p.a.)
                </span>
                <span
                  className={cn(
                    "financial-value font-semibold",
                    currentYearStatus === "safe"
                      ? "text-green-600"
                      : currentYearStatus === "warning"
                        ? "text-amber-600"
                        : "text-red-600"
                  )}
                >
                  {formatEuro(projectedAnnual)}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Prognosegrenze</span>
                <span className="financial-value font-semibold">
                  {formatEuro(THRESHOLD_FORECAST)}
                </span>
              </div>
              <Progress
                value={Math.min(
                  (projectedAnnual / THRESHOLD_FORECAST) * 100,
                  100
                )}
                className="h-2"
              />
              <div
                className={cn(
                  "text-xs px-3 py-2 rounded flex items-start gap-2",
                  currentYearStatus === "safe"
                    ? "bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-300"
                    : currentYearStatus === "warning"
                      ? "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300"
                      : "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-300"
                )}
              >
                {currentYearStatus === "safe"
                  ? "✓ Prognose im sicheren Bereich"
                  : currentYearStatus === "warning"
                    ? "⚠ Prognose nähert sich der Grenze"
                    : "✗ Prognose überschreitet die Grenze"}
              </div>
            </div>
          </div>

          {/* Legal Info */}
          <div className="bg-amber-gold/8 border border-amber-gold/25 rounded p-4">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-amber-gold shrink-0 mt-0.5" />
              <div className="text-xs space-y-2">
                <p className="font-semibold text-amber-gold">
                  §19 UStG — Wichtige Hinweise
                </p>
                <p className="text-muted-foreground">
                  <strong>Grenze Vorjahr:</strong> Umsatz ≤{" "}
                  {formatEuro(THRESHOLD_CURRENT)} (brutto)
                </p>
                <p className="text-muted-foreground">
                  <strong>Grenze laufendes Jahr:</strong> Voraussichtlicher
                  Umsatz ≤ {formatEuro(THRESHOLD_FORECAST)}
                </p>
                <p className="text-muted-foreground">
                  Bei Überschreitung: Wechsel zur Regelbesteuerung im Folgejahr.
                  Finanzamt informieren!
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-6 text-[10px] mt-1 border-amber-gold/30 text-amber-gold hover:bg-amber-gold/10"
                  onClick={() => toast.info("Öffnet elster.de in neuem Tab")}
                >
                  Mehr auf elster.de
                  <ChevronRight className="w-3 h-3 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Monthly Revenue Input + Chart */}
        <div className="lg:col-span-2 space-y-4">
          {/* Monthly Input Grid */}
          <div className="bg-card border border-border rounded p-5">
            <h3 className="text-sm font-semibold mb-4">
              Monatliche Umsätze {new Date().getFullYear()}
            </h3>
            <div className="grid grid-cols-4 gap-3">
              {monthlyData.map((item, index) => (
                <div key={item.month}>
                  <Label className="text-[10px] text-muted-foreground">
                    {item.month}
                  </Label>
                  <div className="relative mt-1">
                    <Input
                      type="number"
                      value={item.revenue || ""}
                      onChange={e => {
                        const newData = [...monthlyData];
                        newData[index] = {
                          ...item,
                          revenue: parseFloat(e.target.value) || 0,
                        };
                        setMonthlyData(newData);
                      }}
                      className="h-8 text-xs financial-value pr-5"
                      placeholder="0"
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground">
                      €
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
              <div className="text-xs text-muted-foreground">
                Summe {completedMonths} Monate:{" "}
                <span className="financial-value font-semibold text-foreground">
                  {formatEuro(currentYearTotal)}
                </span>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-xs"
                onClick={() => {
                  setMonthlyData(defaultMonthlyData);
                  toast.success("Beispieldaten geladen");
                }}
              >
                Beispieldaten
              </Button>
            </div>
          </div>

          {/* Revenue Chart */}
          <div className="bg-card border border-border rounded p-5">
            <h3 className="text-sm font-semibold mb-4">
              Umsatzverlauf mit Grenzwerten
            </h3>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={monthlyData}
                  margin={{ top: 5, right: 5, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="revenueGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="oklch(0.62 0.14 65)"
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor="oklch(0.62 0.14 65)"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="oklch(0.9 0.005 80)"
                  />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                  <YAxis
                    tick={{ fontSize: 10 }}
                    tickFormatter={v => `${(v / 1000).toFixed(0)}k€`}
                  />
                  <Tooltip
                    formatter={(value: number) => [formatEuro(value), "Umsatz"]}
                    contentStyle={{ fontSize: 11, borderRadius: 4 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="oklch(0.62 0.14 65)"
                    strokeWidth={2}
                    fill="url(#revenueGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Cumulative Progress */}
            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-muted-foreground">
                  Kumulierter Jahresumsatz
                </span>
                <span className="financial-value font-semibold">
                  {formatEuro(currentYearTotal)} /{" "}
                  {formatEuro(THRESHOLD_FORECAST)}
                </span>
              </div>
              <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-500",
                    currentYearStatus === "safe"
                      ? "bg-green-500"
                      : currentYearStatus === "warning"
                        ? "bg-amber-500"
                        : "bg-red-500"
                  )}
                  style={{
                    width: `${Math.min((currentYearTotal / THRESHOLD_FORECAST) * 100, 100)}%`,
                  }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                <span>0 €</span>
                <span className="financial-value">
                  {formatEuro(THRESHOLD_CURRENT)} (Vorjahresgrenze)
                </span>
                <span className="financial-value">
                  {formatEuro(THRESHOLD_FORECAST)}
                </span>
              </div>
            </div>
          </div>

          {/* Checklist */}
          <div className="bg-card border border-border rounded p-5">
            <h3 className="text-sm font-semibold mb-4">
              Kleinunternehmer-Checkliste
            </h3>
            <div className="space-y-2">
              {[
                {
                  text: "Vorjahresumsatz ≤ 22.000 € (brutto)",
                  ok: prevRevenue <= THRESHOLD_CURRENT,
                },
                {
                  text: "Prognostizierter Umsatz ≤ 50.000 € im laufenden Jahr",
                  ok: projectedAnnual <= THRESHOLD_FORECAST,
                },
                {
                  text: "Keine Option zur Regelbesteuerung ausgeübt",
                  ok: true,
                },
                { text: "Pflichthinweis §19 UStG auf Rechnungen", ok: true },
                {
                  text: "Keine USt-Voranmeldung erforderlich",
                  ok: prevRevenue <= THRESHOLD_CURRENT,
                },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-sm">
                  {item.ok ? (
                    <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                  )}
                  <span
                    className={
                      item.ok
                        ? "text-foreground"
                        : "text-muted-foreground line-through"
                    }
                  >
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
