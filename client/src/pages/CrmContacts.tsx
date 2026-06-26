/* =============================================================
   CrmContacts.tsx
   Design: Neue Sachlichkeit
   Features: Client CRM, contact list, deal pipeline,
   revenue per client, communication history
   ============================================================= */
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  Plus,
  Search,
  Building2,
  Mail,
  Phone,
  MapPin,
  Euro,
  FileText,
  MoreHorizontal,
  Star,
  StarOff,
  TrendingUp,
  Users,
  Filter,
  ChevronRight,
  Edit,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { nanoid } from "nanoid";

interface Contact {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  city: string;
  status: "active" | "prospect" | "inactive";
  totalRevenue: number;
  invoiceCount: number;
  lastContact: string;
  starred: boolean;
  tags: string[];
  ustIdNr?: string;
}

const sampleContacts: Contact[] = [
  {
    id: "1",
    name: "Thomas Müller",
    company: "Müller GmbH",
    email: "t.mueller@mueller-gmbh.de",
    phone: "+49 30 12345678",
    city: "Berlin",
    status: "active",
    totalRevenue: 12480.0,
    invoiceCount: 8,
    lastContact: "2024-11-28",
    starred: true,
    tags: ["Stammkunde", "Webentwicklung"],
    ustIdNr: "DE123456789",
  },
  {
    id: "2",
    name: "Anna Schmidt",
    company: "Schmidt & Partner",
    email: "a.schmidt@sp-consulting.de",
    phone: "+49 89 98765432",
    city: "München",
    status: "active",
    totalRevenue: 7650.0,
    invoiceCount: 5,
    lastContact: "2024-11-20",
    starred: true,
    tags: ["Beratung", "Langzeitkunde"],
    ustIdNr: "DE987654321",
  },
  {
    id: "3",
    name: "Klaus Weber",
    company: "Weber Consulting",
    email: "k.weber@weber-consulting.de",
    phone: "+49 40 55443322",
    city: "Hamburg",
    status: "active",
    totalRevenue: 9240.0,
    invoiceCount: 6,
    lastContact: "2024-11-15",
    starred: false,
    tags: ["IT-Beratung"],
  },
  {
    id: "4",
    name: "Maria Fischer",
    company: "Fischer IT GmbH",
    email: "m.fischer@fischer-it.de",
    phone: "+49 221 77665544",
    city: "Köln",
    status: "active",
    totalRevenue: 3810.0,
    invoiceCount: 3,
    lastContact: "2024-11-25",
    starred: false,
    tags: ["Neukunde", "Frontend"],
  },
  {
    id: "5",
    name: "Stefan Bauer",
    company: "Bauer Digital",
    email: "s.bauer@bauer-digital.de",
    phone: "+49 711 33221100",
    city: "Stuttgart",
    status: "prospect",
    totalRevenue: 0,
    invoiceCount: 0,
    lastContact: "2024-11-10",
    starred: false,
    tags: ["Interessent", "E-Commerce"],
  },
  {
    id: "6",
    name: "Julia Hoffmann",
    company: "Hoffmann Marketing",
    email: "j.hoffmann@hoffmann-marketing.de",
    phone: "+49 30 99887766",
    city: "Berlin",
    status: "inactive",
    totalRevenue: 2380.0,
    invoiceCount: 2,
    lastContact: "2024-08-15",
    starred: false,
    tags: ["Marketing"],
  },
];

const statusConfig = {
  active: {
    label: "Aktiv",
    className:
      "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  },
  prospect: {
    label: "Interessent",
    className: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  },
  inactive: { label: "Inaktiv", className: "bg-muted text-muted-foreground" },
};

export default function CrmContacts() {
  const [contacts, setContacts] = useState<Contact[]>(sampleContacts);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [newContact, setNewContact] = useState<Partial<Contact>>({
    status: "active",
    starred: false,
    tags: [],
    totalRevenue: 0,
    invoiceCount: 0,
    lastContact: new Date().toISOString().split("T")[0],
  });

  const formatEuro = (amount: number) =>
    new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
    }).format(amount);

  const filteredContacts = contacts.filter(c => {
    const matchesSearch =
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.company.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.city.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === "all" || c.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalRevenue = contacts.reduce((sum, c) => sum + c.totalRevenue, 0);
  const activeCount = contacts.filter(c => c.status === "active").length;

  const toggleStar = (id: string) => {
    setContacts(
      contacts.map(c => (c.id === id ? { ...c, starred: !c.starred } : c))
    );
  };

  const addContact = () => {
    if (!newContact.name || !newContact.company) {
      toast.error("Name und Firma sind Pflichtfelder");
      return;
    }
    const contact: Contact = {
      id: nanoid(),
      name: newContact.name || "",
      company: newContact.company || "",
      email: newContact.email || "",
      phone: newContact.phone || "",
      city: newContact.city || "",
      status: (newContact.status as Contact["status"]) || "active",
      totalRevenue: 0,
      invoiceCount: 0,
      lastContact: new Date().toISOString().split("T")[0],
      starred: false,
      tags: [],
    };
    setContacts([contact, ...contacts]);
    setShowAddForm(false);
    setNewContact({
      status: "active",
      starred: false,
      tags: [],
      totalRevenue: 0,
      invoiceCount: 0,
      lastContact: new Date().toISOString().split("T")[0],
    });
    toast.success("Kontakt hinzugefügt");
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">CRM Kontakte</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Kundenverwaltung für Freelancer — Kontakte, Umsätze, Kommunikation
          </p>
        </div>
        <Button
          className="bg-amber-gold hover:bg-amber-gold/90 text-white"
          size="sm"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Kontakt hinzufügen
        </Button>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 animate-stagger">
        {[
          {
            label: "Kontakte gesamt",
            value: String(contacts.length),
            sub: `${activeCount} aktiv`,
            icon: Users,
          },
          {
            label: "Gesamtumsatz",
            value: formatEuro(totalRevenue),
            sub: "alle Kunden",
            icon: Euro,
          },
          {
            label: "Ø Umsatz/Kunde",
            value: formatEuro(totalRevenue / activeCount),
            sub: "aktive Kunden",
            icon: TrendingUp,
          },
          {
            label: "Interessenten",
            value: String(contacts.filter(c => c.status === "prospect").length),
            sub: "in Pipeline",
            icon: ChevronRight,
          },
        ].map(kpi => (
          <div
            key={kpi.label}
            className="bg-card border border-border rounded p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <kpi.icon className="w-4 h-4 text-amber-gold" />
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                {kpi.label}
              </span>
            </div>
            <div className="text-xl font-bold financial-value">{kpi.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{kpi.sub}</div>
          </div>
        ))}
      </div>

      {/* Add Contact Form */}
      {showAddForm && (
        <div className="bg-card border border-amber-gold/30 rounded p-5 mb-6 animate-fade-in-up">
          <h3 className="text-sm font-semibold mb-4">Neuen Kontakt anlegen</h3>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label className="text-xs">Name *</Label>
              <Input
                value={newContact.name || ""}
                onChange={e =>
                  setNewContact({ ...newContact, name: e.target.value })
                }
                className="mt-1 h-8 text-sm"
                placeholder="Vor- und Nachname"
              />
            </div>
            <div>
              <Label className="text-xs">Firma *</Label>
              <Input
                value={newContact.company || ""}
                onChange={e =>
                  setNewContact({ ...newContact, company: e.target.value })
                }
                className="mt-1 h-8 text-sm"
                placeholder="Firmenname"
              />
            </div>
            <div>
              <Label className="text-xs">E-Mail</Label>
              <Input
                type="email"
                value={newContact.email || ""}
                onChange={e =>
                  setNewContact({ ...newContact, email: e.target.value })
                }
                className="mt-1 h-8 text-sm"
                placeholder="email@firma.de"
              />
            </div>
            <div>
              <Label className="text-xs">Telefon</Label>
              <Input
                value={newContact.phone || ""}
                onChange={e =>
                  setNewContact({ ...newContact, phone: e.target.value })
                }
                className="mt-1 h-8 text-sm"
                placeholder="+49 ..."
              />
            </div>
            <div>
              <Label className="text-xs">Stadt</Label>
              <Input
                value={newContact.city || ""}
                onChange={e =>
                  setNewContact({ ...newContact, city: e.target.value })
                }
                className="mt-1 h-8 text-sm"
                placeholder="Berlin"
              />
            </div>
            <div>
              <Label className="text-xs">Status</Label>
              <Select
                value={newContact.status}
                onValueChange={v =>
                  setNewContact({
                    ...newContact,
                    status: v as Contact["status"],
                  })
                }
              >
                <SelectTrigger className="mt-1 h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Aktiv</SelectItem>
                  <SelectItem value="prospect">Interessent</SelectItem>
                  <SelectItem value="inactive">Inaktiv</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button
              onClick={addContact}
              className="bg-amber-gold hover:bg-amber-gold/90 text-white h-8 text-xs"
            >
              Kontakt speichern
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
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contact List */}
        <div
          className={cn(
            "space-y-4",
            selectedContact ? "lg:col-span-2" : "lg:col-span-3"
          )}
        >
          {/* Search & Filter */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Kontakte durchsuchen..."
                className="pl-9 h-8 text-sm"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="h-8 text-xs w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Status</SelectItem>
                <SelectItem value="active">Aktiv</SelectItem>
                <SelectItem value="prospect">Interessenten</SelectItem>
                <SelectItem value="inactive">Inaktiv</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="bg-card border border-border rounded overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/20">
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide w-8"></th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Kontakt
                  </th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden lg:table-cell">
                    Stadt
                  </th>
                  <th className="text-right px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Umsatz
                  </th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Status
                  </th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden lg:table-cell">
                    Letzter Kontakt
                  </th>
                  <th className="w-16"></th>
                </tr>
              </thead>
              <tbody>
                {filteredContacts.map(contact => (
                  <tr
                    key={contact.id}
                    className={cn(
                      "border-b border-border/50 hover:bg-muted/10 transition-colors cursor-pointer",
                      selectedContact?.id === contact.id &&
                        "bg-amber-gold/5 border-l-2 border-l-amber-gold"
                    )}
                    onClick={() =>
                      setSelectedContact(
                        selectedContact?.id === contact.id ? null : contact
                      )
                    }
                  >
                    <td className="px-3 py-3">
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          toggleStar(contact.id);
                        }}
                        className="text-muted-foreground hover:text-amber-gold transition-colors"
                      >
                        {contact.starred ? (
                          <Star className="w-3.5 h-3.5 fill-amber-gold text-amber-gold" />
                        ) : (
                          <StarOff className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-amber-gold/10 border border-amber-gold/20 flex items-center justify-center shrink-0">
                          <span className="text-xs font-bold text-amber-gold">
                            {contact.name
                              .split(" ")
                              .map(n => n[0])
                              .join("")
                              .slice(0, 2)}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-semibold">
                            {contact.name}
                          </div>
                          <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <Building2 className="w-3 h-3" />
                            {contact.company}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {contact.city}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="financial-value font-semibold text-sm">
                        {formatEuro(contact.totalRevenue)}
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        {contact.invoiceCount} Rechnungen
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "text-[10px] px-2 py-0.5 rounded font-medium",
                          statusConfig[contact.status].className
                        )}
                      >
                        {statusConfig[contact.status].label}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="text-xs text-muted-foreground">
                        {new Date(contact.lastContact).toLocaleDateString(
                          "de-DE"
                        )}
                      </span>
                    </td>
                    <td className="px-2 py-3">
                      <div className="flex items-center gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="w-6 h-6"
                          onClick={e => {
                            e.stopPropagation();
                            toast.success(
                              `Rechnung für ${contact.company} erstellt`
                            );
                          }}
                        >
                          <FileText className="w-3 h-3" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="w-6 h-6 text-muted-foreground hover:text-destructive"
                          onClick={e => {
                            e.stopPropagation();
                            setContacts(
                              contacts.filter(c => c.id !== contact.id)
                            );
                            if (selectedContact?.id === contact.id)
                              setSelectedContact(null);
                            toast.success("Kontakt gelöscht");
                          }}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredContacts.length === 0 && (
              <div className="py-12 text-center text-muted-foreground text-sm">
                Keine Kontakte gefunden
              </div>
            )}
          </div>
        </div>

        {/* Contact Detail Panel */}
        {selectedContact && (
          <div className="lg:col-span-1 space-y-4 animate-fade-in-up">
            <div className="bg-card border border-border rounded p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded bg-amber-gold/10 border border-amber-gold/20 flex items-center justify-center">
                    <span className="text-base font-bold text-amber-gold">
                      {selectedContact.name
                        .split(" ")
                        .map(n => n[0])
                        .join("")
                        .slice(0, 2)}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold">
                      {selectedContact.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {selectedContact.company}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedContact(null)}
                  className="text-muted-foreground hover:text-foreground text-xs"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-2.5">
                {selectedContact.email && (
                  <div className="flex items-center gap-2 text-xs">
                    <Mail className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    <a
                      href={`mailto:${selectedContact.email}`}
                      className="text-amber-gold hover:underline truncate"
                    >
                      {selectedContact.email}
                    </a>
                  </div>
                )}
                {selectedContact.phone && (
                  <div className="flex items-center gap-2 text-xs">
                    <Phone className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    <span>{selectedContact.phone}</span>
                  </div>
                )}
                {selectedContact.city && (
                  <div className="flex items-center gap-2 text-xs">
                    <MapPin className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    <span>{selectedContact.city}, Deutschland</span>
                  </div>
                )}
                {selectedContact.ustIdNr && (
                  <div className="flex items-center gap-2 text-xs">
                    <Building2 className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    <span className="financial-value">
                      {selectedContact.ustIdNr}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-border grid grid-cols-2 gap-3">
                <div className="bg-muted/30 rounded p-3 text-center">
                  <div className="text-base font-bold financial-value text-amber-gold">
                    {formatEuro(selectedContact.totalRevenue)}
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    Gesamtumsatz
                  </div>
                </div>
                <div className="bg-muted/30 rounded p-3 text-center">
                  <div className="text-base font-bold financial-value">
                    {selectedContact.invoiceCount}
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    Rechnungen
                  </div>
                </div>
              </div>

              {selectedContact.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {selectedContact.tags.map(tag => (
                    <span
                      key={tag}
                      className="text-[10px] px-2 py-0.5 rounded bg-amber-gold/10 text-amber-gold border border-amber-gold/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-4 space-y-2">
                <Button
                  className="w-full bg-amber-gold hover:bg-amber-gold/90 text-white h-8 text-xs"
                  onClick={() =>
                    toast.success(
                      `Neue Rechnung für ${selectedContact.company}`
                    )
                  }
                >
                  <FileText className="w-3.5 h-3.5 mr-1.5" />
                  Rechnung erstellen
                </Button>
                <Button
                  variant="outline"
                  className="w-full h-8 text-xs"
                  onClick={() => toast.success("E-Mail geöffnet")}
                >
                  <Mail className="w-3.5 h-3.5 mr-1.5" />
                  E-Mail senden
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
