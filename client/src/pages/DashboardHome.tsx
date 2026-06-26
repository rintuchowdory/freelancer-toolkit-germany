/* =============================================================
   DashboardHome.tsx
   Design: Neue Sachlichkeit
   Features: KPI strip, revenue chart, recent invoices,
   upcoming deadlines, quick actions
   ============================================================= */
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  TrendingDown,
  FileText,
  Bell,
  CheckCircle,
  Receipt,
  Users,
  ArrowRight,
  AlertTriangle,
  Plus,
  Euro,
  Calendar,
  Activity,
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
  BarChart,
  Bar,
  Legend,
} from "recharts";

const revenueData = [
  { month: "Jun", umsatz: 3200, ausgaben: 890 },
  { month: "Jul", umsatz: 4100, ausgaben: 1020 },
  { month: "Aug", umsatz: 3750, ausgaben: 950 },
  { month: "Sep", umsatz: 5200, ausgaben: 1180 },
  { month: "Okt", umsatz: 4800, ausgaben: 1050 },
  { month: "Nov", umsatz: 6100, ausgaben: 1340 },
];

const recentInvoices = [
  {
    number: "RE-2024-003",
    client: "Weber Consulting",
    amount: 3570.0,
    status: "overdue",
    daysOverdue: 9,
  },
  {
    number: "RE-2024-002",
    client: "Schmidt & Partner",
    amount: 1190.0,
    status: "sent",
    daysSent: 4,
  },
  {
    number: "RE-2024-004",
    client: "Fischer IT GmbH",
    amount: 952.0,
    status: "draft",
    daysAgo: 1,
  },
];

const upcomingDeadlines = [
  {
    title: "USt-Voranmeldung Nov",
    date: "10.12.2024",
    daysLeft: 16,
    type: "urgent",
  },
  {
    title: "ESt-Vorauszahlung Q4",
    date: "10.12.2024",
    daysLeft: 16,
    type: "urgent",
  },
  {
    title: "USt-Voranmeldung Dez",
    date: "10.01.2025",
    daysLeft: 47,
    type: "normal",
  },
];

const quickActions = [
  {
    label: "Neue Rechnung",
    icon: FileText,
    href: "/invoices",
    color: "bg-amber-gold/10 text-amber-gold border-amber-gold/20",
  },
  {
    label: "Ausgabe erfassen",
    icon: Receipt,
    href: "/expenses",
    color:
      "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950/30 dark:border-blue-800",
  },
  {
    label: "Kontakt hinzufügen",
    icon: Users,
    href: "/contacts",
    color:
      "bg-purple-50 text-purple-600 border-purple-200 dark:bg-purple-950/30 dark:border-purple-800",
  },
  {
    label: "ELSTER-Frage stellen",
    icon: Bell,
    href: "/elster",
    color:
      "bg-green-50 text-green-600 border-green-200 dark:bg-green-950/30 dark:border-green-800",
  },
];

export default function DashboardHome() {
  const formatEuro = (amount: number) =>
    new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
    }).format(amount);

  const currentMonth = revenueData[revenueData.length - 1];
  const prevMonth = revenueData[revenueData.length - 2];
  const revenueChange = (
    ((currentMonth.umsatz - prevMonth.umsatz) / prevMonth.umsatz) *
    100
  ).toFixed(1);
  const isPositive = parseFloat(revenueChange) >= 0;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Welcome Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Guten Morgen, Freelancer
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {new Date().toLocaleDateString("de-DE", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/invoices">
            <Button
              className="bg-amber-gold hover:bg-amber-gold/90 text-white"
              size="sm"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Neue Rechnung
            </Button>
          </Link>
        </div>
      </div>

      {/* Alert Banner */}
      <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-semibold text-red-700 dark:text-red-400">
            1 überfällige Rechnung · 2 Steuerfristen in 16 Tagen
          </p>
          <p className="text-xs text-red-600/80 dark:text-red-400/80 mt-0.5">
            RE-2024-003 (Weber Consulting, 3.570 €) ist 9 Tage überfällig.
            USt-Voranmeldung November fällig am 10.12.
          </p>
        </div>
        <Link href="/vat-reminders">
          <Button
            size="sm"
            variant="outline"
            className="border-red-300 text-red-700 hover:bg-red-100 dark:border-red-700 dark:text-red-400 h-7 text-xs shrink-0"
          >
            Fristen ansehen
          </Button>
        </Link>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-stagger">
        {[
          {
            label: "Umsatz November",
            value: formatEuro(currentMonth.umsatz),
            change: `+${revenueChange}%`,
            positive: true,
            sub: "vs. Oktober",
            icon: Euro,
            iconBg: "bg-amber-gold/10",
            iconColor: "text-amber-gold",
          },
          {
            label: "Offene Rechnungen",
            value: formatEuro(4760),
            change: "3 Rechnungen",
            positive: null,
            sub: "davon 1 überfällig",
            icon: FileText,
            iconBg: "bg-blue-50 dark:bg-blue-950/30",
            iconColor: "text-blue-600",
          },
          {
            label: "Betriebsausgaben",
            value: formatEuro(currentMonth.ausgaben),
            change: "+27.6%",
            positive: false,
            sub: "vs. Oktober",
            icon: Receipt,
            iconBg: "bg-red-50 dark:bg-red-950/30",
            iconColor: "text-red-500",
          },
          {
            label: "Gewinn November",
            value: formatEuro(currentMonth.umsatz - currentMonth.ausgaben),
            change: "+22.1%",
            positive: true,
            sub: "vor Steuern",
            icon: TrendingUp,
            iconBg: "bg-green-50 dark:bg-green-950/30",
            iconColor: "text-green-600",
          },
        ].map(kpi => (
          <div
            key={kpi.label}
            className="bg-card border border-border rounded p-4 card-interactive"
          >
            <div className="flex items-start justify-between mb-3">
              <div className={cn("p-2 rounded", kpi.iconBg)}>
                <kpi.icon className={cn("w-4 h-4", kpi.iconColor)} />
              </div>
              {kpi.positive !== null && (
                <span
                  className={cn(
                    "text-xs font-semibold flex items-center gap-0.5",
                    kpi.positive ? "text-green-600" : "text-red-500"
                  )}
                >
                  {kpi.positive ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  {kpi.change}
                </span>
              )}
            </div>
            <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">
              {kpi.label}
            </div>
            <div className="text-xl font-bold financial-value">{kpi.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{kpi.sub}</div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-card border border-border rounded p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold">Umsatz & Ausgaben</h3>
              <p className="text-xs text-muted-foreground">Letzte 6 Monate</p>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-amber-gold inline-block rounded" />
                Umsatz
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-red-400 inline-block rounded" />
                Ausgaben
              </span>
            </div>
          </div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={revenueData}
                margin={{ top: 5, right: 5, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="umsatzGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="oklch(0.62 0.14 65)"
                      stopOpacity={0.25}
                    />
                    <stop
                      offset="95%"
                      stopColor="oklch(0.62 0.14 65)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                  <linearGradient id="ausgabenGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="oklch(0.577 0.245 27.325)"
                      stopOpacity={0.2}
                    />
                    <stop
                      offset="95%"
                      stopColor="oklch(0.577 0.245 27.325)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="oklch(0.9 0.005 80)"
                />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis
                  tick={{ fontSize: 11 }}
                  tickFormatter={v => `${(v / 1000).toFixed(0)}k€`}
                />
                <Tooltip
                  formatter={(value: number, name: string) => [
                    formatEuro(value),
                    name === "umsatz" ? "Umsatz" : "Ausgaben",
                  ]}
                  contentStyle={{ fontSize: 11, borderRadius: 4 }}
                />
                <Area
                  type="monotone"
                  dataKey="umsatz"
                  stroke="oklch(0.62 0.14 65)"
                  strokeWidth={2}
                  fill="url(#umsatzGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="ausgaben"
                  stroke="oklch(0.577 0.245 27.325)"
                  strokeWidth={2}
                  fill="url(#ausgabenGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Kleinunternehmer Status */}
        <div className="bg-card border border-border rounded p-5">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            §19 UStG Status
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-muted-foreground">
                  Vorjahresumsatz 2023
                </span>
                <span className="financial-value font-semibold">18.500 €</span>
              </div>
              <Progress value={(18500 / 22000) * 100} className="h-2" />
              <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                <span>0 €</span>
                <span className="text-green-600 font-medium">
                  Grenze: 22.000 €
                </span>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-muted-foreground">Prognose 2024</span>
                <span className="financial-value font-semibold">27.150 €</span>
              </div>
              <Progress value={(27150 / 50000) * 100} className="h-2" />
              <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                <span>0 €</span>
                <span className="font-medium">Grenze: 50.000 €</span>
              </div>
            </div>
            <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded p-3">
              <p className="text-xs font-semibold text-green-700 dark:text-green-400">
                ✓ Kleinunternehmer-Status aktiv
              </p>
              <p className="text-[10px] text-green-600/80 dark:text-green-400/80 mt-0.5">
                Kein Umsatzsteuerausweis erforderlich
              </p>
            </div>
            <Link href="/kleinunternehmer">
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs h-7"
              >
                Detailprüfung
                <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Invoices */}
        <div className="lg:col-span-1 bg-card border border-border rounded p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold">Letzte Rechnungen</h3>
            <Link href="/invoices">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 text-xs text-amber-gold hover:text-amber-gold/80"
              >
                Alle anzeigen
                <ArrowRight className="w-3 h-3 ml-0.5" />
              </Button>
            </Link>
          </div>
          <div className="space-y-3">
            {recentInvoices.map(inv => (
              <div
                key={inv.number}
                className="flex items-center gap-3 py-2 border-b border-border/50 last:border-0"
              >
                <div
                  className={cn(
                    "w-2 h-2 rounded-full shrink-0",
                    inv.status === "overdue"
                      ? "bg-red-500"
                      : inv.status === "sent"
                        ? "bg-blue-500"
                        : "bg-muted-foreground"
                  )}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold financial-value">
                    {inv.number}
                  </div>
                  <div className="text-[10px] text-muted-foreground truncate">
                    {inv.client}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-semibold financial-value">
                    {formatEuro(inv.amount)}
                  </div>
                  <div
                    className={cn(
                      "text-[10px]",
                      inv.status === "overdue"
                        ? "text-red-500"
                        : inv.status === "sent"
                          ? "text-blue-500"
                          : "text-muted-foreground"
                    )}
                  >
                    {inv.status === "overdue"
                      ? `${inv.daysOverdue}d überfällig`
                      : inv.status === "sent"
                        ? `vor ${inv.daysSent}d versendet`
                        : "Entwurf"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div className="lg:col-span-1 bg-card border border-border rounded p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold">Nächste Fristen</h3>
            <Link href="/vat-reminders">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 text-xs text-amber-gold hover:text-amber-gold/80"
              >
                Alle Fristen
                <ArrowRight className="w-3 h-3 ml-0.5" />
              </Button>
            </Link>
          </div>
          <div className="space-y-3">
            {upcomingDeadlines.map(dl => (
              <div
                key={dl.title}
                className="flex items-center gap-3 py-2 border-b border-border/50 last:border-0"
              >
                <div
                  className={cn(
                    "p-1.5 rounded shrink-0",
                    dl.type === "urgent"
                      ? "bg-amber-50 dark:bg-amber-950/30"
                      : "bg-muted"
                  )}
                >
                  <Calendar
                    className={cn(
                      "w-3.5 h-3.5",
                      dl.type === "urgent"
                        ? "text-amber-600"
                        : "text-muted-foreground"
                    )}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium">{dl.title}</div>
                  <div className="text-[10px] text-muted-foreground">
                    {dl.date}
                  </div>
                </div>
                <div
                  className={cn(
                    "text-xs font-bold financial-value",
                    dl.daysLeft <= 20
                      ? "text-amber-600"
                      : "text-muted-foreground"
                  )}
                >
                  {dl.daysLeft}d
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="lg:col-span-1 bg-card border border-border rounded p-5">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-amber-gold" />
            Schnellaktionen
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {quickActions.map(action => (
              <Link key={action.label} href={action.href}>
                <div
                  className={cn(
                    "p-3 rounded border cursor-pointer transition-all duration-150 hover:shadow-sm hover:-translate-y-0.5",
                    action.color
                  )}
                >
                  <action.icon className="w-4 h-4 mb-2" />
                  <div className="text-xs font-semibold leading-tight">
                    {action.label}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-border">
            <div className="text-xs text-muted-foreground mb-2 font-medium">
              Monatszusammenfassung
            </div>
            <div className="space-y-1.5">
              {[
                { label: "Rechnungen erstellt", value: "4" },
                { label: "Ausgaben erfasst", value: "10" },
                { label: "Steuerquote (geschätzt)", value: "~28%" },
              ].map(stat => (
                <div key={stat.label} className="flex justify-between text-xs">
                  <span className="text-muted-foreground">{stat.label}</span>
                  <span className="font-semibold financial-value">
                    {stat.value}
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
