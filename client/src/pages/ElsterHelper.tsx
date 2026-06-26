/* =============================================================
   ElsterHelper.tsx
   Design: Neue Sachlichkeit
   Features: AI-powered ELSTER tax assistant, FAQ knowledge base,
   form field explanations, chat interface
   ============================================================= */
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Send,
  Bot,
  User,
  Lightbulb,
  BookOpen,
  ExternalLink,
  RefreshCw,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface FaqItem {
  question: string;
  answer: string;
  category: string;
  tags: string[];
}

const faqs: FaqItem[] = [
  {
    question: "Was ist die Anlage EÜR und wer muss sie ausfüllen?",
    answer:
      "Die Anlage EÜR (Einnahmen-Überschuss-Rechnung) ist die vereinfachte Gewinnermittlungsmethode für Freiberufler und Kleingewerbetreibende, deren Umsatz unter 800.000 € liegt. Sie müssen die Anlage EÜR zusammen mit Ihrer Einkommensteuererklärung über ELSTER elektronisch einreichen. Darin erfassen Sie alle Betriebseinnahmen und Betriebsausgaben des Steuerjahres.",
    category: "Einkommensteuer",
    tags: ["EÜR", "Gewinnermittlung", "Freiberufler"],
  },
  {
    question: "Wie berechne ich die Umsatzsteuer-Vorauszahlung?",
    answer:
      "Die Umsatzsteuer-Vorauszahlung berechnet sich aus der Differenz zwischen Umsatzsteuer auf Ihre Ausgangsrechnungen (Umsatzsteuer) und der Vorsteuer auf Ihre Eingangsrechnungen. Formel: Zahllast = Umsatzsteuer (19% auf Nettoumsatz) - Vorsteuer (aus Eingangsrechnungen). Bei negativem Ergebnis erhalten Sie eine Erstattung vom Finanzamt.",
    category: "Umsatzsteuer",
    tags: ["Voranmeldung", "Vorsteuer", "Zahllast"],
  },
  {
    question: "Was kann ich als Betriebsausgaben absetzen?",
    answer:
      "Als Freiberufler können Sie folgende typische Betriebsausgaben absetzen: Büromaterial und Software, Fachliteratur und Weiterbildung, Reisekosten (0,30 €/km für Pkw), Arbeitszimmer (anteilig, wenn ausschließlich beruflich genutzt), Telefon und Internet (anteilig), Berufskleidung (nur wenn ausschließlich beruflich), Beiträge zu Berufsverbänden, Steuerberatungskosten.",
    category: "Betriebsausgaben",
    tags: ["Absetzung", "Ausgaben", "Steuertipps"],
  },
  {
    question:
      "Wie funktioniert die Dauerfristverlängerung bei der USt-Voranmeldung?",
    answer:
      "Mit einer Dauerfristverlängerung erhalten Sie automatisch einen Monat mehr Zeit für die Abgabe Ihrer USt-Voranmeldungen. Voraussetzung: Sie müssen bis zum 10. Februar eine Sondervorauszahlung in Höhe von 1/11 der Vorjahres-Zahllast leisten. Der Antrag wird einmalig gestellt und gilt dann dauerhaft. Beantragung über ELSTER unter 'Umsatzsteuer-Voranmeldung' → 'Dauerfristverlängerung'.",
    category: "Umsatzsteuer",
    tags: ["Dauerfristverlängerung", "Frist", "Voranmeldung"],
  },
  {
    question: "Was ist der Unterschied zwischen Steuernummer und USt-IdNr.?",
    answer:
      "Die Steuernummer (z.B. 12/345/67890) wird vom Finanzamt vergeben und ist für nationale Steuerzwecke. Die Umsatzsteuer-Identifikationsnummer (USt-IdNr., z.B. DE123456789) wird für EU-Geschäfte benötigt. Als Kleinunternehmer brauchen Sie keine USt-IdNr. Für Rechnungen an EU-Unternehmen ist sie jedoch Pflicht. Beantragung beim Bundeszentralamt für Steuern.",
    category: "Allgemein",
    tags: ["Steuernummer", "USt-IdNr.", "EU"],
  },
];

const suggestedQuestions = [
  "Was muss auf einer deutschen Rechnung stehen?",
  "Wie beantrage ich eine Steuernummer als Freiberufler?",
  "Wann bin ich zur Buchführung verpflichtet?",
  "Wie funktioniert die Ist-Versteuerung?",
  "Was ist die Kleinunternehmerregelung §19 UStG?",
  "Kann ich Homeoffice-Kosten absetzen?",
];

const aiResponses: Record<string, string> = {
  default:
    "Das ist eine gute Frage zum deutschen Steuerrecht. Als KI-Assistent gebe ich Ihnen allgemeine Informationen — für verbindliche Steuerberatung wenden Sie sich bitte an einen Steuerberater.\n\nBasierend auf den §§ des deutschen Steuerrechts: {answer}\n\n**Wichtiger Hinweis:** Diese Antwort dient nur zur allgemeinen Information und ersetzt keine professionelle Steuerberatung.",
  rechnung:
    "Eine gültige deutsche Rechnung muss gemäß §14 UStG folgende Pflichtangaben enthalten:\n\n1. **Vollständiger Name und Anschrift** des Leistenden und Empfängers\n2. **Steuernummer oder USt-IdNr.** des Rechnungsstellers\n3. **Ausstellungsdatum** der Rechnung\n4. **Fortlaufende Rechnungsnummer**\n5. **Menge und Art** der gelieferten Waren/Dienstleistungen\n6. **Zeitpunkt der Leistung**\n7. **Nettobetrag, Steuersatz und Steuerbetrag** (oder Hinweis auf Steuerbefreiung)\n8. **Bruttobetrag** (Gesamtbetrag)\n\nBei Kleinunternehmern (§19 UStG): Kein Steuerausweis, stattdessen Hinweis: *'Gemäß §19 UStG wird keine Umsatzsteuer berechnet.'*",
  steuernummer:
    "Als Freiberufler erhalten Sie Ihre Steuernummer automatisch nach der Anmeldung beim Finanzamt. So gehen Sie vor:\n\n1. **Fragebogen zur steuerlichen Erfassung** beim zuständigen Finanzamt einreichen (auch online über ELSTER möglich)\n2. **Angaben:** Persönliche Daten, Art der Tätigkeit, voraussichtliche Einnahmen\n3. **Bearbeitungszeit:** 2-6 Wochen\n4. **Zuständigkeit:** Das Finanzamt Ihres Wohnsitzes\n\nTipp: Über ELSTER Online können Sie den Fragebogen digital ausfüllen und einreichen.",
};

function getAIResponse(question: string): string {
  const lower = question.toLowerCase();
  if (lower.includes("rechnung") || lower.includes("pflichtangaben"))
    return aiResponses.rechnung;
  if (lower.includes("steuernummer") || lower.includes("anmeldung"))
    return aiResponses.steuernummer;

  // Find matching FAQ
  const matchingFaq = faqs.find(
    faq =>
      faq.tags.some(tag => lower.includes(tag.toLowerCase())) ||
      lower.includes(faq.category.toLowerCase())
  );

  if (matchingFaq) {
    return `**${matchingFaq.question}**\n\n${matchingFaq.answer}\n\n*Kategorie: ${matchingFaq.category}*`;
  }

  return "Ich habe Ihre Frage zum deutschen Steuerrecht erhalten. Für eine genaue Antwort empfehle ich:\n\n1. Die offizielle **ELSTER-Hilfe** unter elster.de\n2. Das **Bundesfinanzministerium** unter bundesfinanzministerium.de\n3. Einen **Steuerberater** für individuelle Beratung\n\nKann ich Ihnen mit einer spezifischeren Frage helfen? Zum Beispiel zu Umsatzsteuer, Betriebsausgaben oder ELSTER-Formularen?";
}

export default function ElsterHelper() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Willkommen beim ELSTER KI-Assistenten! Ich helfe Ihnen bei Fragen rund um deutsche Steuern, ELSTER-Formulare und Freelancer-spezifische Steuerregelungen.\n\n**Ich kann helfen bei:**\n- Umsatzsteuer & Voranmeldungen\n- Einkommensteuer & Anlage EÜR\n- Kleinunternehmerregelung §19 UStG\n- Betriebsausgaben & Absetzungen\n- ELSTER-Formulare & Fristen\n\n*Hinweis: Für verbindliche Steuerberatung wenden Sie sich an einen zugelassenen Steuerberater.*",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [activeTab, setActiveTab] = useState<"chat" | "faq">("chat");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageText,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(
      () => {
        const response = getAIResponse(messageText);
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: response,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, assistantMessage]);
        setIsTyping(false);
      },
      800 + Math.random() * 600
    );
  };

  const formatMessage = (content: string) => {
    return content.split("\n").map((line, i) => {
      if (line.startsWith("**") && line.endsWith("**")) {
        return (
          <p key={i} className="font-bold mt-2 first:mt-0">
            {line.slice(2, -2)}
          </p>
        );
      }
      if (line.match(/^\*\*(.+)\*\*/)) {
        return (
          <p key={i} className="mt-1">
            {line
              .replace(/\*\*(.+?)\*\*/g, (_, m) => m)
              .split("**")
              .map((part, j) =>
                j % 2 === 1 ? <strong key={j}>{part}</strong> : part
              )}
          </p>
        );
      }
      if (line.startsWith("- ") || line.match(/^\d+\./)) {
        return (
          <li key={i} className="ml-4 text-sm">
            {line
              .replace(/^[-\d.]\s*/, "")
              .replace(/\*\*(.+?)\*\*/g, (_, m) => m)}
          </li>
        );
      }
      if (line.startsWith("*") && line.endsWith("*")) {
        return (
          <p key={i} className="text-xs text-muted-foreground italic mt-1">
            {line.slice(1, -1)}
          </p>
        );
      }
      if (line.trim() === "") return <br key={i} />;
      return (
        <p key={i} className="text-sm mt-1 first:mt-0">
          {line.replace(/\*\*(.+?)\*\*/g, (_, m) => m)}
        </p>
      );
    });
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            ELSTER KI-Assistent
            <Badge className="bg-amber-gold/15 text-amber-gold border-amber-gold/30 text-xs">
              Beta
            </Badge>
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            KI-gestützte Hilfe für deutsche Steuerformulare und
            Freelancer-Steuerfragen
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={activeTab === "chat" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab("chat")}
            className={
              activeTab === "chat"
                ? "bg-amber-gold hover:bg-amber-gold/90 text-white"
                : ""
            }
          >
            <Bot className="w-4 h-4 mr-1.5" />
            KI-Chat
          </Button>
          <Button
            variant={activeTab === "faq" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab("faq")}
            className={
              activeTab === "faq"
                ? "bg-amber-gold hover:bg-amber-gold/90 text-white"
                : ""
            }
          >
            <BookOpen className="w-4 h-4 mr-1.5" />
            FAQ
          </Button>
        </div>
      </div>

      {activeTab === "chat" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat Interface */}
          <div
            className="lg:col-span-2 flex flex-col bg-card border border-border rounded overflow-hidden"
            style={{ height: "600px" }}
          >
            {/* Chat Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-muted/20">
              <div className="w-8 h-8 rounded bg-amber-gold/15 border border-amber-gold/30 flex items-center justify-center">
                <Bot className="w-4 h-4 text-amber-gold" />
              </div>
              <div>
                <div className="text-sm font-semibold">
                  ELSTER Steuer-Assistent
                </div>
                <div className="text-xs text-green-500 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                  Online
                </div>
              </div>
              <Button
                size="icon"
                variant="ghost"
                className="ml-auto w-7 h-7"
                onClick={() => {
                  setMessages([messages[0]]);
                  toast.success("Chat zurückgesetzt");
                }}
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map(msg => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex gap-3",
                    msg.role === "user" ? "flex-row-reverse" : "flex-row"
                  )}
                >
                  <div
                    className={cn(
                      "w-7 h-7 rounded shrink-0 flex items-center justify-center text-xs font-bold",
                      msg.role === "user"
                        ? "bg-amber-gold/15 border border-amber-gold/30 text-amber-gold"
                        : "bg-sidebar text-sidebar-foreground"
                    )}
                  >
                    {msg.role === "user" ? (
                      "FR"
                    ) : (
                      <Bot className="w-3.5 h-3.5" />
                    )}
                  </div>
                  <div
                    className={cn(
                      "max-w-[80%] rounded px-4 py-3 text-sm",
                      msg.role === "user"
                        ? "bg-amber-gold/10 border border-amber-gold/20"
                        : "bg-muted/40 border border-border"
                    )}
                  >
                    <div className="space-y-0.5">
                      {formatMessage(msg.content)}
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-2">
                      {msg.timestamp.toLocaleTimeString("de-DE", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-3">
                  <div className="w-7 h-7 rounded bg-sidebar text-sidebar-foreground flex items-center justify-center">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                  <div className="bg-muted/40 border border-border rounded px-4 py-3">
                    <div className="flex gap-1">
                      {[0, 1, 2].map(i => (
                        <div
                          key={i}
                          className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 animate-bounce"
                          style={{ animationDelay: `${i * 150}ms` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e =>
                    e.key === "Enter" && !e.shiftKey && sendMessage()
                  }
                  placeholder="Stellen Sie eine Steuerfrage..."
                  className="text-sm h-9"
                />
                <Button
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || isTyping}
                  className="bg-amber-gold hover:bg-amber-gold/90 text-white h-9 px-3"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-[10px] text-muted-foreground mt-2">
                KI-Antworten ersetzen keine professionelle Steuerberatung.
              </p>
            </div>
          </div>

          {/* Suggested Questions */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-card border border-border rounded p-5">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-gold" />
                Häufige Fragen
              </h3>
              <div className="space-y-2">
                {suggestedQuestions.map(q => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="w-full text-left text-xs px-3 py-2.5 rounded border border-border hover:border-amber-gold/40 hover:bg-amber-gold/5 transition-all duration-150 group"
                  >
                    <div className="flex items-center gap-2">
                      <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-amber-gold transition-colors shrink-0" />
                      <span className="group-hover:text-foreground text-muted-foreground transition-colors">
                        {q}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-card border border-border rounded p-5">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <ExternalLink className="w-4 h-4 text-amber-gold" />
                Offizielle Ressourcen
              </h3>
              <div className="space-y-2">
                {[
                  {
                    name: "ELSTER Online",
                    url: "https://www.elster.de",
                    desc: "Steuererklärungen online",
                  },
                  {
                    name: "Bundesfinanzministerium",
                    url: "https://www.bundesfinanzministerium.de",
                    desc: "Steuergesetze & Richtlinien",
                  },
                  {
                    name: "Bundeszentralamt für Steuern",
                    url: "https://www.bzst.de",
                    desc: "USt-IdNr. beantragen",
                  },
                  {
                    name: "IHK Steuerinfos",
                    url: "https://www.ihk.de",
                    desc: "Freelancer-Steuertipps",
                  },
                ].map(res => (
                  <a
                    key={res.name}
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs px-3 py-2 rounded border border-border hover:border-amber-gold/40 hover:bg-amber-gold/5 transition-all duration-150 group"
                  >
                    <div className="flex-1">
                      <div className="font-medium group-hover:text-amber-gold transition-colors">
                        {res.name}
                      </div>
                      <div className="text-muted-foreground text-[10px]">
                        {res.desc}
                      </div>
                    </div>
                    <ExternalLink className="w-3 h-3 text-muted-foreground shrink-0" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* FAQ Tab */
        <div className="space-y-4 animate-stagger">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-card border border-border rounded p-5">
              <div className="flex items-start justify-between gap-3 mb-3">
                <h3 className="text-sm font-semibold">{faq.question}</h3>
                <Badge variant="secondary" className="text-[10px] shrink-0">
                  {faq.category}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {faq.answer}
              </p>
              <div className="flex items-center gap-2 mt-3">
                {faq.tags.map(tag => (
                  <span
                    key={tag}
                    className="text-[10px] px-2 py-0.5 rounded bg-amber-gold/10 text-amber-gold border border-amber-gold/20"
                  >
                    {tag}
                  </span>
                ))}
                <Button
                  size="sm"
                  variant="ghost"
                  className="ml-auto h-6 text-[10px] text-amber-gold hover:text-amber-gold/80"
                  onClick={() => {
                    setActiveTab("chat");
                    sendMessage(faq.question);
                  }}
                >
                  Im Chat fragen
                  <ChevronRight className="w-3 h-3 ml-0.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
