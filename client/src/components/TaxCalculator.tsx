/* =============================================================
   TaxCalculator.tsx - German Freelancer Tax Calculator
   Route: /steuerrechner
   ============================================================= */
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

function calcIncomeTax(income: number): number {
  if (income <= 11604) return 0;
  if (income <= 17005) {
    const y = (income - 11604) / 10000;
    return Math.round((979.18 * y + 1400) * y);
  }
  if (income <= 66760) {
    const z = (income - 17005) / 10000;
    return Math.round((192.59 * z + 2397) * z + 966.53);
  }
  if (income <= 277825) return Math.round(income * 0.42 - 10602.13);
  return Math.round(income * 0.45 - 18936.88);
}

export default function TaxCalculator() {
  const [revenue, setRevenue] = useState("");
  const [expenses, setExpenses] = useState("");
  const [churchTax, setChurchTax] = useState(false);
  const [kleinunternehmer, setKleinunternehmer] = useState(false);

  const rev = parseFloat(revenue) || 0;
  const exp = parseFloat(expenses) || 0;
  const profit = Math.max(0, rev - exp);

  // German freelancer tax calculation
  const incomeTax = calcIncomeTax(profit);
  const soli = incomeTax > 18130 ? Math.round(incomeTax * 0.055) : 0;
  const church = churchTax ? Math.round(incomeTax * 0.09) : 0;

  // Health insurance (gesetzliche KV ~14.6% + Zusatzbeitrag ~1.7%, half paid by freelancer = full)
  const healthInsurance = Math.round(Math.min(profit, 62100) * 0.148);

  // VAT (19%) only if not Kleinunternehmer
  const vat = kleinunternehmer ? 0 : Math.round(rev * 0.19);

  const totalTax = incomeTax + soli + church;
  const totalBurden = totalTax + healthInsurance;
  const netIncome = profit - totalBurden;
  const effectiveRate = profit > 0 ? ((totalBurden / profit) * 100).toFixed(1) : "0.0";

  const fmt = (n: number) =>
    n.toLocaleString("de-DE", { style: "currency", currency: "EUR" });

  return (
    <div className="max-w-3xl mx-auto space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Steuerrechner</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Schnelle Steuerübersicht für Freiberufler in Deutschland (2024)
        </p>
      </div>

      {/* Inputs */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Einnahmen & Ausgaben</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>Jahresumsatz (netto) €</Label>
              <Input
                type="number"
                placeholder="z.B. 80000"
                value={revenue}
                onChange={(e) => setRevenue(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label>Betriebsausgaben €</Label>
              <Input
                type="number"
                placeholder="z.B. 12000"
                value={expenses}
                onChange={(e) => setExpenses(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 pt-2">
            <div className="flex items-center gap-3">
              <Switch
                checked={churchTax}
                onCheckedChange={setChurchTax}
                id="church"
              />
              <Label htmlFor="church">Kirchensteuer (9%)</Label>
            </div>
            <div className="flex items-center gap-3">
              <Switch
                checked={kleinunternehmer}
                onCheckedChange={setKleinunternehmer}
                id="klein"
              />
              <Label htmlFor="klein">Kleinunternehmer (§19 UStG)</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Steuerübersicht</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <Row label="Jahresumsatz" value={fmt(rev)} />
            <Row label="Betriebsausgaben" value={`− ${fmt(exp)}`} />
            <Row label="Gewinn (zu versteuern)" value={fmt(profit)} bold />
            <hr className="my-2 border-border" />
            <Row label="Einkommensteuer" value={`− ${fmt(incomeTax)}`} />
            <Row label="Solidaritätszuschlag" value={`− ${fmt(soli)}`} />
            {churchTax && <Row label="Kirchensteuer" value={`− ${fmt(church)}`} />}
            <Row label="Krankenversicherung (ca.)" value={`− ${fmt(healthInsurance)}`} />
            <hr className="my-2 border-border" />
            <Row label="Gesamtbelastung" value={fmt(totalBurden)} bold />
            <Row
              label="Nettoeinkommen (ca.)"
              value={fmt(netIncome)}
              bold
              highlight
            />
            <Row label="Effektivsteuerquote" value={`${effectiveRate} %`} />
            {!kleinunternehmer && (
              <Row
                label="USt. auszuweisen auf Rechnungen (19%)"
                value={fmt(vat)}
              />
            )}
          </div>

          <p className="text-xs text-muted-foreground mt-4">
            * Schätzwerte basierend auf dem Steuertarif 2024. Kein Ersatz für
            steuerliche Beratung.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function Row({
  label,
  value,
  bold,
  highlight,
}: {
  label: string;
  value: string;
  bold?: boolean;
  highlight?: boolean;
}) {
  return (
    <div
      className={`flex justify-between ${bold ? "font-semibold" : ""} ${
        highlight ? "text-amber-600 dark:text-amber-400" : ""
      }`}
    >
      <span className="text-muted-foreground">{label}</span>
      <span>{value}</span>
    </div>
  );
}
