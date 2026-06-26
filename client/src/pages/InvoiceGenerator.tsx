/* =============================================================
   InvoiceGenerator.tsx
   Design: Neue Sachlichkeit — functional, precise, German
   Features: Line items, tax calculation, PDF print, invoice list
   ============================================================= */
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  Plus,
  Trash2,
  Printer,
  Download,
  Eye,
  FileText,
  ChevronRight,
  Copy,
  Send,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { nanoid } from "nanoid";

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  taxRate: number;
}

interface Invoice {
  id: string;
  number: string;
  client: string;
  date: string;
  dueDate: string;
  status: "draft" | "sent" | "paid" | "overdue";
  total: number;
}

const sampleInvoices: Invoice[] = [
  {
    id: "1",
    number: "RE-2024-001",
    client: "Müller GmbH",
    date: "2024-11-01",
    dueDate: "2024-11-15",
    status: "paid",
    total: 2380.0,
  },
  {
    id: "2",
    number: "RE-2024-002",
    client: "Schmidt & Partner",
    date: "2024-11-10",
    dueDate: "2024-11-24",
    status: "sent",
    total: 1190.0,
  },
  {
    id: "3",
    number: "RE-2024-003",
    client: "Weber Consulting",
    date: "2024-11-20",
    dueDate: "2024-12-04",
    status: "overdue",
    total: 3570.0,
  },
  {
    id: "4",
    number: "RE-2024-004",
    client: "Fischer IT GmbH",
    date: "2024-12-01",
    dueDate: "2024-12-15",
    status: "draft",
    total: 952.0,
  },
];

const statusConfig = {
  draft: { label: "Entwurf", className: "bg-muted text-muted-foreground" },
  sent: {
    label: "Versendet",
    className: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  },
  paid: { label: "Bezahlt", className: "badge-paid" },
  overdue: { label: "Überfällig", className: "badge-overdue" },
};

export default function InvoiceGenerator() {
  const [activeTab, setActiveTab] = useState<"list" | "create">("list");
  const [lineItems, setLineItems] = useState<LineItem[]>([
    {
      id: nanoid(),
      description: "Webentwicklung — React Frontend",
      quantity: 8,
      unit: "Std.",
      unitPrice: 95,
      taxRate: 19,
    },
    {
      id: nanoid(),
      description: "Projektmanagement & Beratung",
      quantity: 2,
      unit: "Std.",
      unitPrice: 85,
      taxRate: 19,
    },
  ]);
  const [isKleinunternehmer, setIsKleinunternehmer] = useState(false);
  const [invoiceData, setInvoiceData] = useState({
    number: "RE-2024-005",
    date: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    senderName: "Max Mustermann",
    senderAddress: "Musterstraße 1, 10115 Berlin",
    senderTaxId: "DE123456789",
    clientName: "Beispiel GmbH",
    clientAddress: "Hauptstraße 42, 80331 München",
    notes:
      "Zahlbar innerhalb von 14 Tagen ohne Abzug.\nVielen Dank für Ihren Auftrag.",
  });

  const addLineItem = () => {
    setLineItems([
      ...lineItems,
      {
        id: nanoid(),
        description: "",
        quantity: 1,
        unit: "Std.",
        unitPrice: 0,
        taxRate: 19,
      },
    ]);
  };

  const removeLineItem = (id: string) => {
    if (lineItems.length === 1) return;
    setLineItems(lineItems.filter(item => item.id !== id));
  };

  const updateLineItem = (
    id: string,
    field: keyof LineItem,
    value: string | number
  ) => {
    setLineItems(
      lineItems.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const calculateTotals = () => {
    const subtotal = lineItems.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0
    );
    const taxAmount = isKleinunternehmer
      ? 0
      : lineItems.reduce(
          (sum, item) =>
            sum + (item.quantity * item.unitPrice * item.taxRate) / 100,
          0
        );
    return { subtotal, taxAmount, total: subtotal + taxAmount };
  };

  const { subtotal, taxAmount, total } = calculateTotals();

  const formatEuro = (amount: number) =>
    new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
    }).format(amount);

  const handlePrint = () => {
    window.print();
    toast.success("Druckvorschau geöffnet");
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("In Zwischenablage kopiert");
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Rechnungsgenerator
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Professionelle Rechnungen nach deutschem Steuerrecht erstellen
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={activeTab === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab("list")}
            className={
              activeTab === "list"
                ? "bg-amber-gold hover:bg-amber-gold/90 text-white"
                : ""
            }
          >
            <FileText className="w-4 h-4 mr-1.5" />
            Rechnungsliste
          </Button>
          <Button
            variant={activeTab === "create" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab("create")}
            className={
              activeTab === "create"
                ? "bg-amber-gold hover:bg-amber-gold/90 text-white"
                : ""
            }
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Neue Rechnung
          </Button>
        </div>
      </div>

      {activeTab === "list" ? (
        /* Invoice List */
        <div className="space-y-4">
          {/* Summary KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-stagger">
            {[
              {
                label: "Offen",
                value: formatEuro(4760),
                count: 2,
                color: "text-blue-600",
              },
              {
                label: "Bezahlt (Nov)",
                value: formatEuro(2380),
                count: 1,
                color: "text-success",
              },
              {
                label: "Überfällig",
                value: formatEuro(3570),
                count: 1,
                color: "text-destructive",
              },
              {
                label: "Entwürfe",
                value: formatEuro(952),
                count: 1,
                color: "text-muted-foreground",
              },
            ].map(kpi => (
              <div
                key={kpi.label}
                className="bg-card border border-border rounded p-4"
              >
                <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">
                  {kpi.label}
                </div>
                <div
                  className={cn("text-xl font-bold financial-value", kpi.color)}
                >
                  {kpi.value}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {kpi.count} Rechnung{kpi.count !== 1 ? "en" : ""}
                </div>
              </div>
            ))}
          </div>

          {/* Invoice Table */}
          <div className="bg-card border border-border rounded overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <h3 className="text-sm font-semibold">Alle Rechnungen</h3>
              <Button size="sm" variant="outline" className="text-xs h-7">
                Filter
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Nummer
                    </th>
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Kunde
                    </th>
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Datum
                    </th>
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Fällig
                    </th>
                    <th className="text-right px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Betrag
                    </th>
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Status
                    </th>
                    <th className="px-4 py-2.5"></th>
                  </tr>
                </thead>
                <tbody>
                  {sampleInvoices.map((inv, i) => (
                    <tr
                      key={inv.id}
                      className="border-b border-border/50 hover:bg-muted/20 transition-colors cursor-pointer"
                      style={{ animationDelay: `${i * 40}ms` }}
                    >
                      <td className="px-4 py-3">
                        <span className="financial-value text-xs font-medium">
                          {inv.number}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-medium">{inv.client}</td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">
                        {new Date(inv.date).toLocaleDateString("de-DE")}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">
                        {new Date(inv.dueDate).toLocaleDateString("de-DE")}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="financial-value font-semibold">
                          {formatEuro(inv.total)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            "text-xs px-2 py-0.5 rounded font-medium",
                            statusConfig[inv.status].className
                          )}
                        >
                          {statusConfig[inv.status].label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 justify-end">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="w-7 h-7"
                            onClick={() => setActiveTab("create")}
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="w-7 h-7"
                            onClick={() => toast.success("Rechnung kopiert")}
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="w-7 h-7"
                            onClick={() => toast.success("Rechnung versendet")}
                          >
                            <Send className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Invoice Creator */
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Form — left 2/3 */}
          <div className="xl:col-span-2 space-y-5">
            {/* Kleinunternehmer Toggle */}
            <div className="bg-amber-gold/8 border border-amber-gold/25 rounded p-4 flex items-start gap-3">
              <div className="mt-0.5">
                <input
                  type="checkbox"
                  id="kleinunternehmer"
                  checked={isKleinunternehmer}
                  onChange={e => setIsKleinunternehmer(e.target.checked)}
                  className="w-4 h-4 accent-amber-gold"
                />
              </div>
              <div>
                <label
                  htmlFor="kleinunternehmer"
                  className="text-sm font-semibold cursor-pointer"
                >
                  Kleinunternehmer (§19 UStG)
                </label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Kein Umsatzsteuerausweis. Pflichthinweis wird automatisch
                  eingefügt.
                </p>
              </div>
            </div>

            {/* Invoice Meta */}
            <div className="bg-card border border-border rounded p-5">
              <h3 className="text-sm font-semibold mb-4">Rechnungsdaten</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-xs">Rechnungsnummer</Label>
                  <Input
                    value={invoiceData.number}
                    onChange={e =>
                      setInvoiceData({ ...invoiceData, number: e.target.value })
                    }
                    className="mt-1 h-8 text-sm financial-value"
                  />
                </div>
                <div>
                  <Label className="text-xs">Rechnungsdatum</Label>
                  <Input
                    type="date"
                    value={invoiceData.date}
                    onChange={e =>
                      setInvoiceData({ ...invoiceData, date: e.target.value })
                    }
                    className="mt-1 h-8 text-sm"
                  />
                </div>
                <div>
                  <Label className="text-xs">Zahlungsziel</Label>
                  <Input
                    type="date"
                    value={invoiceData.dueDate}
                    onChange={e =>
                      setInvoiceData({
                        ...invoiceData,
                        dueDate: e.target.value,
                      })
                    }
                    className="mt-1 h-8 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Sender & Client */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-card border border-border rounded p-5">
                <h3 className="text-sm font-semibold mb-4">
                  Absender (Rechnungssteller)
                </h3>
                <div className="space-y-3">
                  <div>
                    <Label className="text-xs">Name / Firma</Label>
                    <Input
                      value={invoiceData.senderName}
                      onChange={e =>
                        setInvoiceData({
                          ...invoiceData,
                          senderName: e.target.value,
                        })
                      }
                      className="mt-1 h-8 text-sm"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Adresse</Label>
                    <Input
                      value={invoiceData.senderAddress}
                      onChange={e =>
                        setInvoiceData({
                          ...invoiceData,
                          senderAddress: e.target.value,
                        })
                      }
                      className="mt-1 h-8 text-sm"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Steuernummer / USt-IdNr.</Label>
                    <Input
                      value={invoiceData.senderTaxId}
                      onChange={e =>
                        setInvoiceData({
                          ...invoiceData,
                          senderTaxId: e.target.value,
                        })
                      }
                      className="mt-1 h-8 text-sm financial-value"
                    />
                  </div>
                </div>
              </div>
              <div className="bg-card border border-border rounded p-5">
                <h3 className="text-sm font-semibold mb-4">
                  Empfänger (Auftraggeber)
                </h3>
                <div className="space-y-3">
                  <div>
                    <Label className="text-xs">Name / Firma</Label>
                    <Input
                      value={invoiceData.clientName}
                      onChange={e =>
                        setInvoiceData({
                          ...invoiceData,
                          clientName: e.target.value,
                        })
                      }
                      className="mt-1 h-8 text-sm"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Adresse</Label>
                    <Input
                      value={invoiceData.clientAddress}
                      onChange={e =>
                        setInvoiceData({
                          ...invoiceData,
                          clientAddress: e.target.value,
                        })
                      }
                      className="mt-1 h-8 text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Line Items */}
            <div className="bg-card border border-border rounded overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 border-b border-border">
                <h3 className="text-sm font-semibold">Positionen</h3>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={addLineItem}
                  className="h-7 text-xs"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  Position hinzufügen
                </Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/20">
                      <th className="text-left px-4 py-2 text-xs text-muted-foreground font-medium w-[40%]">
                        Beschreibung
                      </th>
                      <th className="text-right px-3 py-2 text-xs text-muted-foreground font-medium w-16">
                        Menge
                      </th>
                      <th className="text-left px-3 py-2 text-xs text-muted-foreground font-medium w-16">
                        Einheit
                      </th>
                      <th className="text-right px-3 py-2 text-xs text-muted-foreground font-medium w-24">
                        Einzelpreis
                      </th>
                      {!isKleinunternehmer && (
                        <th className="text-right px-3 py-2 text-xs text-muted-foreground font-medium w-16">
                          MwSt.
                        </th>
                      )}
                      <th className="text-right px-3 py-2 text-xs text-muted-foreground font-medium w-24">
                        Gesamt
                      </th>
                      <th className="w-8"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {lineItems.map(item => (
                      <tr key={item.id} className="border-b border-border/50">
                        <td className="px-4 py-2">
                          <Input
                            value={item.description}
                            onChange={e =>
                              updateLineItem(
                                item.id,
                                "description",
                                e.target.value
                              )
                            }
                            className="h-7 text-xs border-0 bg-transparent focus-visible:ring-1 p-0 px-1"
                            placeholder="Leistungsbeschreibung..."
                          />
                        </td>
                        <td className="px-3 py-2">
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={e =>
                              updateLineItem(
                                item.id,
                                "quantity",
                                parseFloat(e.target.value) || 0
                              )
                            }
                            className="h-7 text-xs text-right financial-value border-0 bg-transparent focus-visible:ring-1 p-0 px-1"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <Select
                            value={item.unit}
                            onValueChange={v =>
                              updateLineItem(item.id, "unit", v)
                            }
                          >
                            <SelectTrigger className="h-7 text-xs w-16 border-0 bg-transparent focus:ring-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Std.">Std.</SelectItem>
                              <SelectItem value="Tag">Tag</SelectItem>
                              <SelectItem value="Stk.">Stk.</SelectItem>
                              <SelectItem value="Psch.">Psch.</SelectItem>
                              <SelectItem value="km">km</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="px-3 py-2">
                          <Input
                            type="number"
                            value={item.unitPrice}
                            onChange={e =>
                              updateLineItem(
                                item.id,
                                "unitPrice",
                                parseFloat(e.target.value) || 0
                              )
                            }
                            className="h-7 text-xs text-right financial-value border-0 bg-transparent focus-visible:ring-1 p-0 px-1"
                          />
                        </td>
                        {!isKleinunternehmer && (
                          <td className="px-3 py-2">
                            <Select
                              value={String(item.taxRate)}
                              onValueChange={v =>
                                updateLineItem(item.id, "taxRate", parseInt(v))
                              }
                            >
                              <SelectTrigger className="h-7 text-xs w-16 border-0 bg-transparent focus:ring-1">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="19">19%</SelectItem>
                                <SelectItem value="7">7%</SelectItem>
                                <SelectItem value="0">0%</SelectItem>
                              </SelectContent>
                            </Select>
                          </td>
                        )}
                        <td className="px-3 py-2 text-right">
                          <span className="financial-value text-xs font-medium">
                            {formatEuro(item.quantity * item.unitPrice)}
                          </span>
                        </td>
                        <td className="px-2 py-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="w-6 h-6 text-muted-foreground hover:text-destructive"
                            onClick={() => removeLineItem(item.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="px-5 py-4 bg-muted/10 border-t border-border">
                <div className="flex justify-end">
                  <div className="w-64 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Nettobetrag</span>
                      <span className="financial-value font-medium">
                        {formatEuro(subtotal)}
                      </span>
                    </div>
                    {!isKleinunternehmer && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Umsatzsteuer
                        </span>
                        <span className="financial-value font-medium">
                          {formatEuro(taxAmount)}
                        </span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between text-base font-bold">
                      <span>Gesamtbetrag</span>
                      <span className="financial-value text-amber-gold">
                        {formatEuro(total)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="bg-card border border-border rounded p-5">
              <Label className="text-xs font-semibold">
                Hinweise / Zahlungsbedingungen
              </Label>
              <Textarea
                value={invoiceData.notes}
                onChange={e =>
                  setInvoiceData({ ...invoiceData, notes: e.target.value })
                }
                className="mt-2 text-sm resize-none"
                rows={3}
              />
              {isKleinunternehmer && (
                <p className="text-xs text-amber-gold mt-2 font-medium">
                  ✓ Pflichthinweis §19 UStG wird automatisch eingefügt
                </p>
              )}
            </div>
          </div>

          {/* Preview / Actions — right 1/3 */}
          <div className="xl:col-span-1 space-y-4">
            {/* Actions */}
            <div className="bg-card border border-border rounded p-5 space-y-3">
              <h3 className="text-sm font-semibold">Aktionen</h3>
              <Button
                className="w-full bg-amber-gold hover:bg-amber-gold/90 text-white"
                onClick={handlePrint}
              >
                <Printer className="w-4 h-4 mr-2" />
                Als PDF drucken
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() =>
                  toast.success("Rechnung als Entwurf gespeichert")
                }
              >
                <Download className="w-4 h-4 mr-2" />
                Entwurf speichern
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => toast.success("Rechnung per E-Mail versendet")}
              >
                <Send className="w-4 h-4 mr-2" />
                Per E-Mail versenden
              </Button>
            </div>

            {/* Invoice Preview Card */}
            <div className="bg-card border border-border rounded p-5">
              <h3 className="text-sm font-semibold mb-4">Vorschau</h3>
              <div className="bg-white border border-border rounded p-4 text-xs space-y-3 shadow-sm">
                {/* Mini preview */}
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-bold text-sm">
                      {invoiceData.senderName}
                    </div>
                    <div className="text-muted-foreground text-[10px]">
                      {invoiceData.senderAddress}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-amber-gold financial-value">
                      {invoiceData.number}
                    </div>
                    <div className="text-muted-foreground text-[10px]">
                      {new Date(invoiceData.date).toLocaleDateString("de-DE")}
                    </div>
                  </div>
                </div>
                <Separator />
                <div>
                  <div className="text-muted-foreground text-[10px] mb-1">
                    An:
                  </div>
                  <div className="font-medium">{invoiceData.clientName}</div>
                  <div className="text-muted-foreground text-[10px]">
                    {invoiceData.clientAddress}
                  </div>
                </div>
                <Separator />
                <div className="space-y-1">
                  {lineItems.slice(0, 2).map(item => (
                    <div key={item.id} className="flex justify-between">
                      <span className="text-[10px] truncate max-w-[60%]">
                        {item.description || "—"}
                      </span>
                      <span className="financial-value text-[10px]">
                        {formatEuro(item.quantity * item.unitPrice)}
                      </span>
                    </div>
                  ))}
                  {lineItems.length > 2 && (
                    <div className="text-[10px] text-muted-foreground">
                      +{lineItems.length - 2} weitere...
                    </div>
                  )}
                </div>
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Gesamt</span>
                  <span className="financial-value text-amber-gold">
                    {formatEuro(total)}
                  </span>
                </div>
                {isKleinunternehmer && (
                  <p className="text-[9px] text-muted-foreground italic">
                    Gemäß §19 UStG wird keine Umsatzsteuer berechnet.
                  </p>
                )}
              </div>
            </div>

            {/* Tax Info */}
            <div className="bg-card border border-border rounded p-5">
              <h3 className="text-sm font-semibold mb-3">Steuerinfo</h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Steuernummer</span>
                  <button
                    className="financial-value font-medium hover:text-amber-gold transition-colors"
                    onClick={() => handleCopy(invoiceData.senderTaxId)}
                  >
                    {invoiceData.senderTaxId}
                  </button>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">MwSt.-Typ</span>
                  <span className="font-medium">
                    {isKleinunternehmer ? "§19 UStG" : "Regelbesteuerung"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Zahlungsziel</span>
                  <span className="financial-value font-medium">
                    {new Date(invoiceData.dueDate).toLocaleDateString("de-DE")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
