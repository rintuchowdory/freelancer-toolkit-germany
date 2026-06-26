/* =============================================================
   Settings.tsx
   Design: Neue Sachlichkeit
   Features: Profile settings, tax configuration, notification
   preferences, invoice defaults, export settings
   ============================================================= */
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  User,
  Building2,
  Receipt,
  Bell,
  Shield,
  Download,
  Github,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

const sections = [
  { id: "profile", label: "Profil", icon: User },
  { id: "tax", label: "Steuereinstellungen", icon: Receipt },
  { id: "notifications", label: "Benachrichtigungen", icon: Bell },
  { id: "export", label: "Export & Daten", icon: Download },
  { id: "about", label: "Über das Projekt", icon: Github },
];

export default function Settings() {
  const [activeSection, setActiveSection] = useState("profile");
  const [profile, setProfile] = useState({
    name: "Max Mustermann",
    email: "max@mustermann.de",
    phone: "+49 30 12345678",
    address: "Musterstraße 1",
    city: "Berlin",
    postalCode: "10115",
    website: "https://max-mustermann.de",
  });
  const [taxSettings, setTaxSettings] = useState({
    taxNumber: "12/345/67890",
    ustIdNr: "",
    isKleinunternehmer: true,
    vatRate: "19",
    fiscalYear: "calendar",
    bankName: "Deutsche Bank",
    iban: "DE89 3704 0044 0532 0130 00",
    bic: "COBADEFFXXX",
  });
  const [notifications, setNotifications] = useState({
    vatDeadlines: true,
    invoiceReminders: true,
    overdueAlerts: true,
    weeklyReport: false,
    emailNotifications: true,
    reminderDays: "7",
  });

  const handleSave = (section: string) => {
    toast.success(`${section} gespeichert`);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight">Einstellungen</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Profil, Steuereinstellungen und Benachrichtigungen konfigurieren
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <nav className="space-y-0.5">
            {sections.map(section => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded text-sm transition-all duration-150 text-left",
                  activeSection === section.id
                    ? "bg-amber-gold/10 text-amber-gold font-semibold border-l-2 border-amber-gold"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                )}
              >
                <section.icon className="w-4 h-4 shrink-0" />
                {section.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {activeSection === "profile" && (
            <div className="bg-card border border-border rounded p-6 space-y-6">
              <div>
                <h3 className="text-base font-semibold mb-1">
                  Persönliches Profil
                </h3>
                <p className="text-xs text-muted-foreground">
                  Diese Daten werden auf Ihren Rechnungen verwendet.
                </p>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label className="text-xs">
                    Vollständiger Name / Firmenname
                  </Label>
                  <Input
                    value={profile.name}
                    onChange={e =>
                      setProfile({ ...profile, name: e.target.value })
                    }
                    className="mt-1 h-9"
                  />
                </div>
                <div>
                  <Label className="text-xs">E-Mail</Label>
                  <Input
                    type="email"
                    value={profile.email}
                    onChange={e =>
                      setProfile({ ...profile, email: e.target.value })
                    }
                    className="mt-1 h-9"
                  />
                </div>
                <div>
                  <Label className="text-xs">Telefon</Label>
                  <Input
                    value={profile.phone}
                    onChange={e =>
                      setProfile({ ...profile, phone: e.target.value })
                    }
                    className="mt-1 h-9"
                  />
                </div>
                <div className="col-span-2">
                  <Label className="text-xs">Straße und Hausnummer</Label>
                  <Input
                    value={profile.address}
                    onChange={e =>
                      setProfile({ ...profile, address: e.target.value })
                    }
                    className="mt-1 h-9"
                  />
                </div>
                <div>
                  <Label className="text-xs">Postleitzahl</Label>
                  <Input
                    value={profile.postalCode}
                    onChange={e =>
                      setProfile({ ...profile, postalCode: e.target.value })
                    }
                    className="mt-1 h-9 financial-value"
                  />
                </div>
                <div>
                  <Label className="text-xs">Stadt</Label>
                  <Input
                    value={profile.city}
                    onChange={e =>
                      setProfile({ ...profile, city: e.target.value })
                    }
                    className="mt-1 h-9"
                  />
                </div>
                <div className="col-span-2">
                  <Label className="text-xs">Website (optional)</Label>
                  <Input
                    value={profile.website}
                    onChange={e =>
                      setProfile({ ...profile, website: e.target.value })
                    }
                    className="mt-1 h-9"
                    placeholder="https://..."
                  />
                </div>
              </div>
              <Button
                className="bg-amber-gold hover:bg-amber-gold/90 text-white"
                onClick={() => handleSave("Profil")}
              >
                Profil speichern
              </Button>
            </div>
          )}

          {activeSection === "tax" && (
            <div className="bg-card border border-border rounded p-6 space-y-6">
              <div>
                <h3 className="text-base font-semibold mb-1">
                  Steuereinstellungen
                </h3>
                <p className="text-xs text-muted-foreground">
                  Steuernummer, USt-IdNr. und Rechnungsstandards.
                </p>
              </div>
              <Separator />
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs">Steuernummer</Label>
                    <Input
                      value={taxSettings.taxNumber}
                      onChange={e =>
                        setTaxSettings({
                          ...taxSettings,
                          taxNumber: e.target.value,
                        })
                      }
                      className="mt-1 h-9 financial-value"
                      placeholder="12/345/67890"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">USt-IdNr. (optional)</Label>
                    <Input
                      value={taxSettings.ustIdNr}
                      onChange={e =>
                        setTaxSettings({
                          ...taxSettings,
                          ustIdNr: e.target.value,
                        })
                      }
                      className="mt-1 h-9 financial-value"
                      placeholder="DE123456789"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/30 rounded border border-border">
                  <div>
                    <Label className="text-sm font-medium">
                      Kleinunternehmer (§19 UStG)
                    </Label>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Kein Umsatzsteuerausweis auf Rechnungen. Pflichthinweis
                      wird eingefügt.
                    </p>
                  </div>
                  <Switch
                    checked={taxSettings.isKleinunternehmer}
                    onCheckedChange={v =>
                      setTaxSettings({ ...taxSettings, isKleinunternehmer: v })
                    }
                  />
                </div>

                {!taxSettings.isKleinunternehmer && (
                  <div>
                    <Label className="text-xs">
                      Standard-Mehrwertsteuersatz
                    </Label>
                    <Select
                      value={taxSettings.vatRate}
                      onValueChange={v =>
                        setTaxSettings({ ...taxSettings, vatRate: v })
                      }
                    >
                      <SelectTrigger className="mt-1 h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="19">
                          19% (Regelsteuersatz)
                        </SelectItem>
                        <SelectItem value="7">
                          7% (ermäßigter Steuersatz)
                        </SelectItem>
                        <SelectItem value="0">
                          0% (steuerfreie Leistungen)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <Separator />
                <h4 className="text-sm font-semibold">
                  Bankverbindung (für Rechnungen)
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label className="text-xs">Bank</Label>
                    <Input
                      value={taxSettings.bankName}
                      onChange={e =>
                        setTaxSettings({
                          ...taxSettings,
                          bankName: e.target.value,
                        })
                      }
                      className="mt-1 h-9"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">IBAN</Label>
                    <Input
                      value={taxSettings.iban}
                      onChange={e =>
                        setTaxSettings({ ...taxSettings, iban: e.target.value })
                      }
                      className="mt-1 h-9 financial-value"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">BIC</Label>
                    <Input
                      value={taxSettings.bic}
                      onChange={e =>
                        setTaxSettings({ ...taxSettings, bic: e.target.value })
                      }
                      className="mt-1 h-9 financial-value"
                    />
                  </div>
                </div>
              </div>
              <Button
                className="bg-amber-gold hover:bg-amber-gold/90 text-white"
                onClick={() => handleSave("Steuereinstellungen")}
              >
                Einstellungen speichern
              </Button>
            </div>
          )}

          {activeSection === "notifications" && (
            <div className="bg-card border border-border rounded p-6 space-y-6">
              <div>
                <h3 className="text-base font-semibold mb-1">
                  Benachrichtigungen
                </h3>
                <p className="text-xs text-muted-foreground">
                  Steuererinnerungen und Rechnungsbenachrichtigungen.
                </p>
              </div>
              <Separator />
              <div className="space-y-4">
                {[
                  {
                    key: "vatDeadlines",
                    label: "USt-Fristen",
                    desc: "Erinnerungen für Voranmeldungen und Jahreserklärungen",
                  },
                  {
                    key: "invoiceReminders",
                    label: "Rechnungserinnerungen",
                    desc: "Benachrichtigung bei ausstehenden Zahlungen",
                  },
                  {
                    key: "overdueAlerts",
                    label: "Überfälligkeitswarnungen",
                    desc: "Sofortige Benachrichtigung bei überfälligen Rechnungen",
                  },
                  {
                    key: "weeklyReport",
                    label: "Wochenbericht",
                    desc: "Wöchentliche Zusammenfassung Ihrer Finanzen",
                  },
                  {
                    key: "emailNotifications",
                    label: "E-Mail-Benachrichtigungen",
                    desc: "Alle Benachrichtigungen auch per E-Mail",
                  },
                ].map(item => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between py-3 border-b border-border/50 last:border-0"
                  >
                    <div>
                      <Label className="text-sm font-medium">
                        {item.label}
                      </Label>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {item.desc}
                      </p>
                    </div>
                    <Switch
                      checked={
                        notifications[
                          item.key as keyof typeof notifications
                        ] as boolean
                      }
                      onCheckedChange={v =>
                        setNotifications({ ...notifications, [item.key]: v })
                      }
                    />
                  </div>
                ))}
                <div>
                  <Label className="text-xs">
                    Erinnerung X Tage vor Fälligkeit
                  </Label>
                  <Select
                    value={notifications.reminderDays}
                    onValueChange={v =>
                      setNotifications({ ...notifications, reminderDays: v })
                    }
                  >
                    <SelectTrigger className="mt-1 h-9 w-48">
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
              <Button
                className="bg-amber-gold hover:bg-amber-gold/90 text-white"
                onClick={() => handleSave("Benachrichtigungen")}
              >
                Einstellungen speichern
              </Button>
            </div>
          )}

          {activeSection === "export" && (
            <div className="bg-card border border-border rounded p-6 space-y-6">
              <div>
                <h3 className="text-base font-semibold mb-1">
                  Export & Datenverwaltung
                </h3>
                <p className="text-xs text-muted-foreground">
                  Daten exportieren für Steuerberater oder ELSTER.
                </p>
              </div>
              <Separator />
              <div className="space-y-3">
                {[
                  {
                    label: "Rechnungen als CSV",
                    desc: "Alle Rechnungen im CSV-Format für Excel/DATEV",
                    format: "CSV",
                  },
                  {
                    label: "Ausgaben (EÜR)",
                    desc: "Betriebsausgaben für die Einnahmen-Überschuss-Rechnung",
                    format: "CSV",
                  },
                  {
                    label: "Kontakte exportieren",
                    desc: "CRM-Kontakte als vCard oder CSV",
                    format: "vCard",
                  },
                  {
                    label: "Jahresübersicht PDF",
                    desc: "Vollständige Jahresübersicht als PDF-Bericht",
                    format: "PDF",
                  },
                ].map(item => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between p-4 bg-muted/20 rounded border border-border"
                  >
                    <div>
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {item.desc}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-amber-gold/10 text-amber-gold border border-amber-gold/20 font-mono">
                        {item.format}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs"
                        onClick={() =>
                          toast.success(`${item.label} wird exportiert...`)
                        }
                      >
                        <Download className="w-3.5 h-3.5 mr-1" />
                        Export
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === "about" && (
            <div className="bg-card border border-border rounded p-6 space-y-6">
              <div>
                <h3 className="text-base font-semibold mb-1">
                  Über das Projekt
                </h3>
                <p className="text-xs text-muted-foreground">
                  Portfolio-Projekt für den deutschen Lebenslauf.
                </p>
              </div>
              <Separator />
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {[
                    { label: "Projekt", value: "Freelancer Toolkit Germany" },
                    { label: "Version", value: "1.0.0" },
                    { label: "Frontend", value: "React 19 + TypeScript" },
                    { label: "Styling", value: "Tailwind CSS 4 + shadcn/ui" },
                    { label: "Charts", value: "Recharts" },
                    { label: "Build Tool", value: "Vite 7" },
                    { label: "CI/CD", value: "GitHub Actions" },
                    { label: "Deployment", value: "GitHub Pages / Manus" },
                  ].map(item => (
                    <div
                      key={item.label}
                      className="flex justify-between py-2 border-b border-border/50"
                    >
                      <span className="text-muted-foreground">
                        {item.label}
                      </span>
                      <span className="font-medium financial-value">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  <a
                    href="https://github.com/rintuchowdory/freelancer-toolkit-germany"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded border border-border hover:border-amber-gold/40 hover:bg-amber-gold/5 transition-all duration-150 group"
                  >
                    <Github className="w-5 h-5 text-muted-foreground group-hover:text-amber-gold" />
                    <div>
                      <p className="text-sm font-medium group-hover:text-amber-gold transition-colors">
                        GitHub Repository
                      </p>
                      <p className="text-xs text-muted-foreground">
                        rintuchowdory/freelancer-toolkit-germany
                      </p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-muted-foreground ml-auto" />
                  </a>
                </div>
                <div className="bg-amber-gold/8 border border-amber-gold/25 rounded p-4 text-xs text-muted-foreground">
                  <p className="font-semibold text-amber-gold mb-1">
                    Portfolio-Hinweis
                  </p>
                  <p>
                    Dieses Projekt wurde als professionelles Portfolio-Projekt
                    für den deutschen Arbeitsmarkt entwickelt. Es demonstriert
                    moderne React-Entwicklung, TypeScript, CI/CD mit GitHub
                    Actions und professionelles UI/UX-Design nach dem
                    Neue-Sachlichkeit-Prinzip.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
