/* =============================================================
   VatReminders.tsx
   Design: Neue Sachlichkeit
   Features: USt-Voranmeldung deadlines, Jahreserklärung,
   countdown timers, notification settings
   ============================================================= */
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  Bell,
  BellOff,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  ChevronRight,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Deadline {
  id: string;
  title: string;
  titleDe: string;
  dueDate: string;
  type: "monthly" | "quarterly" | "annual" | "other";
  status: "upcoming" | "due-soon" | "overdue" | "completed";
  description: string;
  penalty?: string;
}

const currentYear = new Date().getFullYear();

const deadlines: Deadline[] = [
  {
    id: "1",
    title: "USt-Voranmeldung November",
    titleDe: "Umsatzsteuer-Voranmeldung",
    dueDate: `${currentYear}-12-10`,
    type: "monthly",
    status: "due-soon",
    description: "Monatliche Umsatzsteuer-Voranmeldung für November via ELSTER",
    penalty: "Verspätungszuschlag bis 10% der festgesetzten Steuer",
  },
  {
    id: "2",
    title: "USt-Voranmeldung Dezember",
    titleDe: "Umsatzsteuer-Voranmeldung",
    dueDate: `${currentYear + 1}-01-10`,
    type: "monthly",
    status: "upcoming",
    description: "Monatliche Umsatzsteuer-Voranmeldung für Dezember via ELSTER",
    penalty: "Verspätungszuschlag bis 10% der festgesetzten Steuer",
  },
  {
    id: "3",
    title: "Umsatzsteuer-Jahreserklärung",
    titleDe: "USt-Jahreserklärung",
    dueDate: `${currentYear + 1}-07-31`,
    type: "annual",
    status: "upcoming",
    description: `Umsatzsteuer-Jahreserklärung ${currentYear} — Abgabe bis 31. Juli ${currentYear + 1}`,
    penalty: "Zwangsgeld und Schätzung durch Finanzamt möglich",
  },
  {
    id: "4",
    title: "Einkommensteuer-Vorauszahlung Q4",
    titleDe: "ESt-Vorauszahlung",
    dueDate: `${currentYear}-12-10`,
    type: "quarterly",
    status: "due-soon",
    description: "Einkommensteuer-Vorauszahlung für das 4. Quartal",
    penalty: "Säumniszuschlag 1% pro angefangenem Monat",
  },
  {
    id: "5",
    title: "Gewerbesteuer-Vorauszahlung Q4",
    titleDe: "GewSt-Vorauszahlung",
    dueDate: `${currentYear}-11-15`,
    type: "quarterly",
    status: "overdue",
    description:
      "Gewerbesteuer-Vorauszahlung für das 4. Quartal (nur bei Gewerbebetrieb)",
    penalty: "Säumniszuschlag 1% pro angefangenem Monat",
  },
  {
    id: "6",
    title: "USt-Voranmeldung Oktober",
    titleDe: "Umsatzsteuer-Voranmeldung",
    dueDate: `${currentYear}-11-10`,
    type: "monthly",
    status: "completed",
    description: "Monatliche Umsatzsteuer-Voranmeldung für Oktober — Erledigt",
  },
];

const statusConfig = {
  upcoming: {
    label: "Ausstehend",
    color: "text-blue-600",
    bg: "bg-blue-50 dark:bg-blue-950/30",
    icon: Calendar,
  },
  "due-soon": {
    label: "Bald fällig",
    color: "text-amber-600",
    bg: "bg-amber-50 dark:bg-amber-950/30",
    icon: Clock,
  },
  overdue: {
    label: "Überfällig",
    color: "text-red-600",
    bg: "bg-red-50 dark:bg-red-950/30",
    icon: AlertTriangle,
  },
  completed: {
    label: "Erledigt",
    color: "text-green-600",
    bg: "bg-green-50 dark:bg-green-950/30",
    icon: CheckCircle,
  },
};

const typeConfig = {
  monthly: {
    label: "Monatlich",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  },
  quarterly: {
    label: "Quartalsweise",
    color:
      "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
  },
  annual: {
    label: "Jährlich",
    color: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
  },
  other: {
    label: "Sonstig",
    color: "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300",
  },
};

function getDaysUntil(dateStr: string): number {
  const today = new Date();
  const due = new Date(dateStr);
  const diff = Math.ceil(
    (due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );
  return diff;
}

export default function VatReminders() {
  const [filter, setFilter] = useState<
    "all" | "upcoming" | "due-soon" | "overdue" | "completed"
  >("all");
  const [vatFrequency, setVatFrequency] = useState("monthly");
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: false,
    reminderDays: "7",
  });

  const filteredDeadlines = deadlines.filter(
    d => filter === "all" || d.status === filter
  );

  const overdueCount = deadlines.filter(d => d.status === "overdue").length;
  const dueSoonCount = deadlines.filter(d => d.status === "due-soon").length;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            USt-Erinnerungen
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Steuerfristen im Blick behalten — Voranmeldungen & Jahreserklärungen
          </p>
        </div>
        <Button
          className="bg-amber-gold hover:bg-amber-gold/90 text-white"
          onClick={() => toast.success("Erinnerungen aktualisiert")}
        >
          <Bell className="w-4 h-4 mr-2" />
          Erinnerungen einrichten
        </Button>
      </div>

      {/* Alert Banner */}
      {(overdueCount > 0 || dueSoonCount > 0) && (
        <div
          className={cn(
            "mb-6 rounded border p-4 flex items-start gap-3",
            overdueCount > 0
              ? "bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-800"
              : "bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-800"
          )}
        >
          <AlertTriangle
            className={cn(
              "w-5 h-5 shrink-0 mt-0.5",
              overdueCount > 0 ? "text-red-600" : "text-amber-600"
            )}
          />
          <div>
            <p className="text-sm font-semibold">
              {overdueCount > 0
                ? `${overdueCount} Frist${overdueCount > 1 ? "en" : ""} überfällig!`
                : `${dueSoonCount} Frist${dueSoonCount > 1 ? "en" : ""} bald fällig`}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {overdueCount > 0
                ? "Handeln Sie sofort — Verspätungszuschläge können anfallen."
                : "Bitte rechtzeitig einreichen, um Strafen zu vermeiden."}
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Deadlines List */}
        <div className="lg:col-span-2 space-y-4">
          {/* Filter Tabs */}
          <div className="flex items-center gap-1 bg-muted/50 rounded p-1 w-fit">
            {(
              ["all", "overdue", "due-soon", "upcoming", "completed"] as const
            ).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "text-xs px-3 py-1.5 rounded transition-all duration-150 font-medium",
                  filter === f
                    ? "bg-card shadow-sm text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {f === "all"
                  ? "Alle"
                  : f === "overdue"
                    ? `Überfällig (${overdueCount})`
                    : f === "due-soon"
                      ? `Bald fällig (${dueSoonCount})`
                      : f === "upcoming"
                        ? "Ausstehend"
                        : "Erledigt"}
              </button>
            ))}
          </div>

          {/* Deadline Cards */}
          <div className="space-y-3 animate-stagger">
            {filteredDeadlines.map(deadline => {
              const daysUntil = getDaysUntil(deadline.dueDate);
              const StatusIcon = statusConfig[deadline.status].icon;

              return (
                <div
                  key={deadline.id}
                  className={cn(
                    "bg-card border rounded p-4 transition-all duration-150",
                    deadline.status === "overdue"
                      ? "border-red-200 dark:border-red-800"
                      : deadline.status === "due-soon"
                        ? "border-amber-200 dark:border-amber-800"
                        : "border-border",
                    "hover:shadow-sm"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        "p-2 rounded shrink-0",
                        statusConfig[deadline.status].bg
                      )}
                    >
                      <StatusIcon
                        className={cn(
                          "w-4 h-4",
                          statusConfig[deadline.status].color
                        )}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="text-sm font-semibold leading-tight">
                            {deadline.title}
                          </h4>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {deadline.description}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <div
                            className={cn(
                              "text-sm font-bold financial-value",
                              deadline.status === "overdue"
                                ? "text-red-600"
                                : deadline.status === "due-soon"
                                  ? "text-amber-600"
                                  : deadline.status === "completed"
                                    ? "text-green-600"
                                    : "text-foreground"
                            )}
                          >
                            {deadline.status === "completed"
                              ? "✓ Erledigt"
                              : daysUntil < 0
                                ? `${Math.abs(daysUntil)} Tage überfällig`
                                : daysUntil === 0
                                  ? "Heute fällig!"
                                  : `${daysUntil} Tage`}
                          </div>
                          <div className="text-xs text-muted-foreground mt-0.5">
                            {new Date(deadline.dueDate).toLocaleDateString(
                              "de-DE",
                              {
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                              }
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <span
                          className={cn(
                            "text-[10px] px-2 py-0.5 rounded font-medium",
                            typeConfig[deadline.type].color
                          )}
                        >
                          {typeConfig[deadline.type].label}
                        </span>
                        <span
                          className={cn(
                            "text-[10px] px-2 py-0.5 rounded font-medium",
                            statusConfig[deadline.status].bg,
                            statusConfig[deadline.status].color
                          )}
                        >
                          {statusConfig[deadline.status].label}
                        </span>
                        {deadline.status !== "completed" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-5 text-[10px] ml-auto text-amber-gold hover:text-amber-gold/80"
                            onClick={() =>
                              toast.success(
                                `${deadline.title} als erledigt markiert`
                              )
                            }
                          >
                            Als erledigt markieren
                            <ChevronRight className="w-3 h-3 ml-0.5" />
                          </Button>
                        )}
                      </div>
                      {deadline.penalty && deadline.status !== "completed" && (
                        <p className="text-[10px] text-muted-foreground mt-1.5 flex items-center gap-1">
                          <Info className="w-3 h-3 shrink-0" />
                          {deadline.penalty}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Settings Panel */}
        <div className="lg:col-span-1 space-y-4">
          {/* VAT Filing Frequency */}
          <div className="bg-card border border-border rounded p-5">
            <h3 className="text-sm font-semibold mb-4">Voranmeldungsturnus</h3>
            <div className="space-y-3">
              <div>
                <Label className="text-xs">Mein Turnus</Label>
                <Select value={vatFrequency} onValueChange={setVatFrequency}>
                  <SelectTrigger className="mt-1 h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monatlich</SelectItem>
                    <SelectItem value="quarterly">Quartalsweise</SelectItem>
                    <SelectItem value="annual">
                      Jährlich (Kleinunternehmer)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="text-xs text-muted-foreground bg-muted/50 rounded p-3">
                {vatFrequency === "monthly" &&
                  "Monatliche Voranmeldung: Fällig am 10. des Folgemonats. Dauerfristverlängerung möglich (+1 Monat)."}
                {vatFrequency === "quarterly" &&
                  "Quartalsweise Voranmeldung: Fällig am 10. des auf das Quartal folgenden Monats."}
                {vatFrequency === "annual" &&
                  "Keine Voranmeldung erforderlich (§19 UStG Kleinunternehmer). Nur Jahreserklärung."}
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-card border border-border rounded p-5">
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-gold" />
              Benachrichtigungen
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-xs font-medium">E-Mail</Label>
                  <p className="text-[10px] text-muted-foreground">
                    Erinnerungen per E-Mail
                  </p>
                </div>
                <Switch
                  checked={notifications.email}
                  onCheckedChange={v => {
                    setNotifications({ ...notifications, email: v });
                    toast.success(
                      v
                        ? "E-Mail-Benachrichtigungen aktiviert"
                        : "E-Mail-Benachrichtigungen deaktiviert"
                    );
                  }}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-xs font-medium">
                    Push-Benachrichtigungen
                  </Label>
                  <p className="text-[10px] text-muted-foreground">
                    Browser-Benachrichtigungen
                  </p>
                </div>
                <Switch
                  checked={notifications.push}
                  onCheckedChange={v => {
                    setNotifications({ ...notifications, push: v });
                    toast.success(
                      v
                        ? "Push-Benachrichtigungen aktiviert"
                        : "Push-Benachrichtigungen deaktiviert"
                    );
                  }}
                />
              </div>
              <div>
                <Label className="text-xs font-medium">
                  Erinnerung im Voraus
                </Label>
                <Select
                  value={notifications.reminderDays}
                  onValueChange={v =>
                    setNotifications({ ...notifications, reminderDays: v })
                  }
                >
                  <SelectTrigger className="mt-1 h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3 Tage vorher</SelectItem>
                    <SelectItem value="7">7 Tage vorher</SelectItem>
                    <SelectItem value="14">14 Tage vorher</SelectItem>
                    <SelectItem value="30">30 Tage vorher</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-card border border-border rounded p-5">
            <h3 className="text-sm font-semibold mb-3">
              Jahresübersicht {currentYear}
            </h3>
            <div className="space-y-2">
              {[
                {
                  label: "Voranmeldungen gesamt",
                  value: "12",
                  sub: "monatlich",
                },
                { label: "Erledigt", value: "10", sub: "von 12" },
                { label: "Ausstehend", value: "2", sub: "Nov + Dez" },
                {
                  label: "Jahreserklärung",
                  value: `31.07.${currentYear + 1}`,
                  sub: "Fälligkeitsdatum",
                },
              ].map(stat => (
                <div
                  key={stat.label}
                  className="flex items-center justify-between py-1 border-b border-border/50 last:border-0"
                >
                  <span className="text-xs text-muted-foreground">
                    {stat.label}
                  </span>
                  <div className="text-right">
                    <span className="text-xs font-semibold financial-value">
                      {stat.value}
                    </span>
                    <span className="text-[10px] text-muted-foreground ml-1">
                      {stat.sub}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
