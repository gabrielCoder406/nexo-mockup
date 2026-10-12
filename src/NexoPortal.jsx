/**
 * NEXO · Plataforma de Ayuda
 * TRAMA Soluciones Digitales — Programa Piloto de Innovación
 * Prototipo académico · ISPC · Tecnicatura Superior en Desarrollo de Software
 * Competencias Comunicacionales II · Grupo 5 · Ciclo lectivo 2026
 *
 * Mockup interactivo en un único componente React.
 * Stack: React 18 + Tailwind CSS 3 + lucide-react.
 * Los colores salen de variables CSS (ver nexo-tokens.css) para modo claro y oscuro.
 *
 * Alcance del MVP según el dossier: registro de solicitudes, número de ticket (#TK),
 * consulta del estado general y visualización de la solución aplicada al cierre.
 */
import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Plus, Search, Lock, ChevronLeft, ChevronRight, RotateCw, X, Upload, Paperclip,
  CheckCircle2, Loader2, Monitor, Wifi, KeyRound, Receipt, Lightbulb, Clock, Bell,
  ChevronDown, Copy, Check, ArrowUpDown, FileText, Camera, Inbox, Info, MoreVertical,
  CheckCheck, MessageSquare, UserCheck, BellOff, GraduationCap, ListChecks, History,
  Timer, Star, Phone, Mail, BookOpen, CalendarClock,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Datos del dominio (Dossier de Implementación — Proyecto NEXO)       */
/* ------------------------------------------------------------------ */

const ORG = "Cooperativa La Huella"; // organización piloto de ejemplo
const USER = { name: "Rocío Paz", role: "Administración" };

/* Programa piloto: 10 organizaciones, 12 semanas */
const PILOT = { week: 3, total: 12 };
const PILOT_STAGES = [
  { n: 1, name: "Preparación y habilitación de accesos", from: 0, to: 0 },
  { n: 2, name: "Capacitación inicial", from: 1, to: 1 },
  { n: 3, name: "Inicio de uso y operación", from: 2, to: 11 },
  { n: 4, name: "Evaluación de la experiencia", from: 12, to: 12 },
];

const CATEGORIES = [
  { id: "Equipos", icon: Monitor },
  { id: "Conectividad", icon: Wifi },
  { id: "Accesos", icon: KeyRound },
  { id: "Facturación", icon: Receipt },
  { id: "Sugerencia", icon: Lightbulb },
];
/* Categoría usada en la práctica en vivo del taller */
const PRACTICE_CATEGORY = { id: "Capacitación inicial", icon: GraduationCap };
const CAT_ICON = Object.fromEntries([...CATEGORIES, PRACTICE_CATEGORY].map((c) => [c.id, c.icon]));

/* Semáforo de Prioridades (Paso 4 del taller) */
const PRIORITIES = {
  critica: {
    key: "critica", light: "Rojo", label: "Crítica", name: "Bloqueo total",
    desc: "Detiene el trabajo de toda la organización.", example: "Servidor caído, nadie puede facturar",
    dot: "bg-crit-dot", text: "text-crit", soft: "bg-crit-soft", border: "border-crit",
    glow: "shadow-[0_0_16px_3px_rgb(var(--crit-dot)/0.55)]",
    glowSm: "shadow-[0_0_6px_1px_rgb(var(--crit-dot)/0.75)]",
  },
  media: {
    key: "media", light: "Amarillo", label: "Media", name: "Falla parcial",
    desc: "Falla funcional importante, pero existe una alternativa temporal.", example: "Impresora principal sin tóner, se usa la secundaria",
    dot: "bg-mid-dot", text: "text-mid", soft: "bg-mid-soft", border: "border-mid",
    glow: "shadow-[0_0_16px_3px_rgb(var(--mid-dot)/0.55)]",
    glowSm: "shadow-[0_0_6px_1px_rgb(var(--mid-dot)/0.75)]",
  },
  baja: {
    key: "baja", light: "Verde", label: "Baja", name: "Consulta minoritaria",
    desc: "Inconveniente individual o consulta. No detiene la labor cotidiana.", example: "Cambio de teclado o consulta general",
    dot: "bg-low-dot", text: "text-low", soft: "bg-low-soft", border: "border-low",
    glow: "shadow-[0_0_16px_3px_rgb(var(--low-dot)/0.55)]",
    glowSm: "shadow-[0_0_6px_1px_rgb(var(--low-dot)/0.75)]",
  },
};
const PRIORITY_ORDER = ["critica", "media", "baja"];

/* Trazabilidad: ¿Qué ocurre tras enviar tu caso? */
const STATUS = {
  "Recibido": { step: 0, cls: "bg-surface-2 text-ink", desc: "El ticket ingresó a la mesa de ayuda y se asigna un analista." },
  "En proceso": { step: 1, cls: "bg-cta/15 text-cta-text", desc: "Soporte Técnico investiga, prueba y aplica la solución." },
  "Esperando info": { step: 2, cls: "bg-mid-soft text-mid", desc: "El analista necesita más datos o que confirmes una prueba." },
  "Resuelto": { step: 3, cls: "bg-low-soft text-low", desc: "Caso cerrado con el detalle de la solución aplicada." },
};
const STEPS = ["Recibido", "En proceso", "Esperando info", "Resuelto"];

/* Analistas de TRAMA por área (organigrama) */
const ANALYSTS = {
  "Lucía Ferreyra": "Soporte Tecnológico",
  "Cristian Guzmán": "Infraestructura y Redes",
  "Micaela Sosa": "Experiencia y Vinculación",
};
const analystFor = (category) =>
  category === "Conectividad" || category === "Accesos"
    ? "Cristian Guzmán"
    : category === "Capacitación inicial"
    ? "Micaela Sosa"
    : "Lucía Ferreyra";

/* Hablemos el mismo idioma: redacción vaga vs. efectiva */
const WRITING_EXAMPLES = [
  ["Se rompió el sistema.", "Al hacer clic en ‘Descargar reporte’, la pantalla se queda en blanco y no genera el archivo."],
  ["No anda internet.", "Mi equipo no conecta al Wi-Fi de la oficina desde las 10 h; al resto del área sí le funciona."],
  ["Urgente ayuda.", "Necesitamos emitir la nómina antes de las 14:00 y da error de clave en la pantalla de firmas."],
];

const PRACTICE = {
  asunto: "[PRUEBA] Alta de Capacitación - Organización X",
  categoria: "Capacitación inicial",
  descripcion: "Ticket de prueba creado durante la práctica en vivo del taller de capacitación inicial. No requiere intervención técnica.",
};

const SENDING_STEPS = [
  "Validando los datos…",
  "Generando número de ticket…",
  "Notificando a la mesa de ayuda…",
];

const MIN = 60 * 1000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;

function seedTickets(now) {
  const active = [
    {
      id: 1047, subject: "Servidor caído: nadie puede facturar",
      category: "Equipos", priority: "critica", status: "En proceso", tech: "Cristian Guzmán",
      createdAt: now - 34 * MIN, updatedAt: now - 3 * MIN, attachments: 2,
      description: "Desde las 9:10 ninguna PC abre el sistema de facturación ni la carpeta compartida del servidor. Aparece “No se encontró la ruta de acceso de red”. Afecta a todas las áreas.",
    },
    {
      id: 1042, subject: "Impresora red de administración sin tóner",
      category: "Equipos", priority: "media", status: "En proceso", tech: "Lucía Ferreyra",
      createdAt: now - 130 * MIN, updatedAt: now - 8 * MIN, attachments: 1,
      description: "La impresora principal del primer piso marca “Tóner agotado” y no imprime. Mientras tanto usamos la secundaria de recepción.",
    },
    {
      id: 1045, subject: "Factura de abril con el abono de soporte cobrado dos veces",
      category: "Facturación", priority: "baja", status: "Recibido", tech: null,
      createdAt: now - 12 * MIN, updatedAt: now - 12 * MIN, attachments: 1,
      description: "En la factura B 0003-00001287 figura dos veces el abono mensual de soporte. Adjuntamos el PDF.",
    },
    {
      id: 1044, subject: "Cambio de teclado en recepción",
      category: "Equipos", priority: "baja", status: "Esperando info", tech: "Lucía Ferreyra",
      createdAt: now - 26 * HOUR, updatedAt: now - 50 * MIN, attachments: 0,
      description: "Varias teclas quedan trabadas (la E y la barra espaciadora) en la PC de recepción.",
      question: "¿Prefieren un teclado con cable USB o inalámbrico? Tenemos los dos modelos disponibles.",
    },
  ];
  const r = (id, subject, category, priority, tech, daysAgo, hoursToSolve, solution, rating, description) => {
    const closedAt = now - daysAgo * DAY - 2 * HOUR;
    return {
      id, subject, category, priority, status: "Resuelto", tech, attachments: 0,
      createdAt: closedAt - hoursToSolve * HOUR, updatedAt: closedAt, closedAt, solution, rating, description,
    };
  };
  const resolved = [
    r(1041, "Restablecer la contraseña del correo de tesorería", "Accesos", "baja", "Cristian Guzmán", 1, 3,
      "Se desbloqueó la cuenta tesoreria@ y se envió una clave provisoria al responsable. Se activó la verificación en dos pasos.", 5,
      "La cuenta tesoreria@ quedó bloqueada después de varios intentos fallidos de inicio de sesión."),
    r(1040, "Wi-Fi intermitente en el salón de capacitación", "Conectividad", "media", "Cristian Guzmán", 1, 20,
      "Se reubicó el punto de acceso y se pasó la red a 5 GHz para evitar interferencias. Se midió la señal en todo el salón.", 4,
      "La señal se cortaba cada 10 a 15 minutos en el salón del fondo; los equipos por cable funcionaban bien."),
    r(1039, "Mouse inalámbrico de caja no responde", "Equipos", "baja", "Lucía Ferreyra", 2, 1.5,
      "Se reemplazaron las pilas y se volvió a emparejar el receptor USB.", 0,
      "El puntero no se mueve aunque el mouse tiene la luz encendida."),
    r(1038, "Alta de usuario para la nueva voluntaria de secretaría", "Accesos", "baja", "Cristian Guzmán", 3, 5,
      "Se creó el usuario con perfil Secretaría y acceso solo a la carpeta compartida de Socios.", 5,
      "Necesitamos un usuario para Valeria, que se suma a secretaría los martes y jueves."),
    r(1036, "La PC de contaduría se reinicia sola", "Equipos", "media", "Lucía Ferreyra", 4, 26,
      "El procesador se sobrecalentaba: se limpió el gabinete y se cambió la pasta térmica. Quedó un monitoreo de temperatura activo.", 5,
      "La PC se reinicia sin aviso dos o tres veces por día, sobre todo a la tarde. Contaduría usa la notebook de presidencia mientras tanto."),
    r(1035, "Consulta por el detalle del abono mensual", "Facturación", "baja", "Lucía Ferreyra", 5, 6,
      "Se envió por correo formal el desglose del abono, con el detalle de cada servicio incluido.", 4,
      "Queremos entender qué servicios incluye el abono mensual de soporte."),
    r(1033, "Sin internet en toda la sede", "Conectividad", "critica", "Cristian Guzmán", 6, 2.2,
      "El proveedor tenía un corte en la zona. Se activó el enlace de respaldo 4G hasta que volvió el servicio (2 h 10 min).", 5,
      "Ningún equipo navega desde las 8:30. No funcionan el correo ni el sistema de socios."),
    r(1032, "Exportar el historial de tickets a PDF", "Sugerencia", "baja", "Lucía Ferreyra", 7, 4,
      "Se registró como pedido de “Fase 2 · Expansión”. Se va a evaluar al cierre del programa piloto, en la semana 12.", 0,
      "Nos serviría poder descargar el historial para las reuniones de comisión directiva."),
    r(1030, "Cambio de teclado en administración", "Equipos", "baja", "Lucía Ferreyra", 8, 22,
      "Se entregó un teclado USB nuevo y se retiró el anterior para reciclaje.", 5,
      "Al teclado de administración le falta la tecla Ñ."),
    r(1029, "No podemos entrar al sistema de socios", "Accesos", "media", "Cristian Guzmán", 9, 3,
      "Se renovó el certificado de seguridad vencido del servidor web. El acceso quedó restablecido para todos los usuarios.", 4,
      "El navegador muestra “La conexión no es privada” al abrir el sistema de socios. Mientras tanto cargamos las cuotas en planilla."),
    r(1027, "La impresora secundaria atasca las hojas", "Equipos", "media", "Lucía Ferreyra", 10, 28,
      "Se cambió el rodillo de alimentación y se calibró la bandeja de papel.", 0,
      "Cada tres o cuatro hojas se traba el papel. Imprimimos en la principal mientras tanto."),
    r(1026, "La notebook de presidencia no ve la red Wi-Fi", "Conectividad", "baja", "Cristian Guzmán", 12, 5,
      "Se actualizó el controlador de la placa inalámbrica y se borró la red guardada con datos viejos.", 5,
      "La notebook no muestra ninguna red disponible; el celular sí se conecta."),
    r(1024, "Pedido de factura A en lugar de B", "Facturación", "baja", "Lucía Ferreyra", 13, 24,
      "Se anuló la factura B y se emitió la factura A con los datos fiscales actualizados.", 5,
      "Nos llegó factura B pero la cooperativa necesita factura A."),
    r(1021, "El servidor no enciende después del corte de luz", "Equipos", "critica", "Cristian Guzmán", 15, 4,
      "Se reemplazó la fuente del servidor y se verificó la integridad de los respaldos. Se recomendó instalar una UPS.", 5,
      "Después del corte de luz de anoche el servidor no prende. Nadie puede acceder a los archivos ni facturar."),
  ];
  return [...active, ...resolved];
}

function seedNotices(now) {
  return [
    { id: "n1", ticketId: 1047, kind: "update", title: "#TK-1047 · En proceso", body: "Cristian Guzmán está cambiando la fuente del servidor. El acceso a facturación vuelve en breve.", at: now - 3 * MIN, read: false },
    { id: "n2", ticketId: 1042, kind: "update", title: "#TK-1042 · En proceso", body: "Lucía Ferreyra está gestionando el tóner de reemplazo.", at: now - 8 * MIN, read: true },
    { id: "n3", ticketId: 1044, kind: "question", title: "#TK-1044 · Esperando info", body: "Lucía Ferreyra necesita que confirmes qué modelo de teclado prefieren.", at: now - 50 * MIN, read: false },
    { id: "n4", ticketId: 1041, kind: "resolved", title: "#TK-1041 · Resuelto", body: "Ya podés ver la solución aplicada y calificar la atención.", at: now - DAY - 2 * HOUR, read: true },
  ];
}
const NOTICE_ICON = { update: Bell, assign: UserCheck, question: MessageSquare, new: Inbox, resolved: CheckCircle2 };

/* ------------------------------------------------------------------ */
/* Utilidades                                                          */
/* ------------------------------------------------------------------ */

function relTime(ts, now) {
  const diff = Math.max(0, now - ts);
  const m = Math.floor(diff / MIN);
  if (m < 1) return "hace instantes";
  if (m < 60) return `hace ${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `hace ${h} h`;
  const d = Math.floor(h / 24);
  return d === 1 ? "hace 1 día" : `hace ${d} días`;
}

function duration(ms) {
  const totalMin = Math.round(ms / MIN);
  const d = Math.floor(totalMin / (60 * 24));
  const h = Math.floor((totalMin % (60 * 24)) / 60);
  const m = totalMin % 60;
  if (d) return h ? `${d} d ${h} h` : `${d} d`;
  if (h) return m ? `${h} h ${m} min` : `${h} h`;
  return `${m} min`;
}

const initials = (name) => name.split(" ").map((w) => w[0]).slice(0, 2).join("");
const shortName = (name) => { const [a, b] = name.split(" "); return b ? `${a} ${b[0]}.` : a; };
const uid = () => Math.random().toString(36).slice(2, 10);
const norm = (s) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();

const GENERIC_SUBJECTS = new Set(["ayuda", "urgente", "urgente ayuda", "ayuda urgente", "problema", "problemas", "consulta", "no anda", "no funciona", "error", "falla", "help", "sos"]);
const VAGUE_DESCRIPTIONS = new Set(["se rompio el sistema", "no anda internet", "urgente ayuda", "ayuda urgente", "no anda", "no funciona", "no anda nada", "no funciona nada", "ayuda"]);

function formatSize(bytes) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toLocaleString("es-AR", { maximumFractionDigits: 1 })} MB`;
}

function prefersReducedMotion() {
  try { return window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch { return false; }
}

/* Captura de pantalla simulada (para la demo sin archivos reales) */
function fakeScreenshot() {
  try {
    const c = document.createElement("canvas");
    c.width = 320; c.height = 200;
    const g = c.getContext("2d");
    if (!g) return null;
    g.fillStyle = "#E7ECEA"; g.fillRect(0, 0, 320, 200);
    g.fillStyle = "#FFFFFF"; g.fillRect(36, 34, 248, 132);
    g.fillStyle = "#24343F"; g.fillRect(36, 34, 248, 22);
    g.fillStyle = "#FFFFFF"; g.font = "bold 11px sans-serif"; g.fillText("Error de red", 46, 49);
    g.fillStyle = "#D9483B"; g.beginPath(); g.arc(76, 102, 16, 0, Math.PI * 2); g.fill();
    g.strokeStyle = "#FFFFFF"; g.lineWidth = 3.5; g.lineCap = "round";
    g.beginPath(); g.moveTo(69, 95); g.lineTo(83, 109); g.moveTo(83, 95); g.lineTo(69, 109); g.stroke();
    g.fillStyle = "#33414C"; g.font = "12px sans-serif";
    g.fillText("No se encontró la ruta", 102, 98); g.fillText("de acceso de red.", 102, 114);
    g.fillStyle = "#C7D1D6"; g.fillRect(206, 138, 64, 18);
    return c.toDataURL("image/png");
  } catch { return null; }
}

/* ------------------------------------------------------------------ */
/* Marcas                                                              */
/* ------------------------------------------------------------------ */

function NexoMark({ className = "" }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <rect x="0" y="0" width="32" height="32" rx="9" className="fill-cta" />
      <g className="stroke-on-cta" strokeWidth="2.2" strokeLinecap="round">
        <path d="M9.5 9.5 L22.5 22.5 M22.5 9.5 L9.5 22.5" />
      </g>
      <g className="fill-on-cta">
        <circle cx="9.5" cy="9.5" r="2.6" />
        <circle cx="22.5" cy="9.5" r="2.6" />
        <circle cx="9.5" cy="22.5" r="2.6" />
        <circle cx="22.5" cy="22.5" r="2.6" />
      </g>
      <circle cx="16" cy="16" r="3.6" className="fill-cta stroke-on-cta" strokeWidth="2.2" />
    </svg>
  );
}

/* Trama y urdimbre: hilos que pasan por arriba y por debajo */
function TramaMark({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path d="M8 2.5V21.5 M16 2.5V21.5" className="stroke-brand-ink" strokeWidth="3" />
      <path d="M2.5 8H21.5 M2.5 16H21.5" className="stroke-weft" strokeWidth="3" />
      <path d="M5 8H11 M13 16H19" className="stroke-brand" strokeWidth="7" />
      <path d="M8 4.5V11.5 M16 12.5V19.5" className="stroke-brand-ink" strokeWidth="3" />
      <path d="M13.5 8H18.5 M5.5 16H10.5" className="stroke-brand" strokeWidth="7" />
      <path d="M12.5 8H19.5 M4.5 16H11.5" className="stroke-weft" strokeWidth="3" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Piezas del semáforo                                                 */
/* ------------------------------------------------------------------ */

function Lamp({ priority, size = "h-8 w-8", lit = true, glow = false, small = false }) {
  const p = PRIORITIES[priority];
  return (
    <span
      className={`relative block shrink-0 rounded-full transition duration-300 ${size} ${lit ? p.dot : "bg-lamp-off"} ${glow ? (small ? p.glowSm : p.glow) : ""}`}
    >
      {lit && (
        <span className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_34%_30%,rgb(255_255_255/0.55),transparent_48%)]" />
      )}
    </span>
  );
}

function MiniSemaforo({ priority }) {
  const p = PRIORITIES[priority];
  return (
    <span
      role="img"
      aria-label={`Prioridad ${p.label}`}
      className="mt-0.5 flex w-4 shrink-0 flex-col items-center gap-[3px] rounded-full bg-housing py-[5px]"
    >
      {PRIORITY_ORDER.map((k) => (
        <Lamp key={k} priority={k} size="h-[7px] w-[7px]" lit={k === priority} glow={k === priority} small />
      ))}
    </span>
  );
}

function PriorityTag({ priority }) {
  const p = PRIORITIES[priority];
  return (
    <span className={`rounded-[5px] px-1.5 py-px text-[11px] font-bold uppercase tracking-[0.08em] ${p.soft} ${p.text}`}>
      {p.label}
    </span>
  );
}

function SemaforoPanel({ counts, active, onSelect }) {
  return (
    <section aria-labelledby="semaforo-title" className="rounded-[14px] border border-line bg-surface p-5">
      <h2 id="semaforo-title" className="font-display text-[17px] font-bold text-ink">
        Semáforo de prioridades
      </h2>
      <p className="mt-1 text-[13px] leading-snug text-muted">
        Cada solicitud se clasifica según cuánto afecta a tu organización. Tocá un nivel para filtrar.
      </p>

      <div className="relative mt-4">
        <div aria-hidden="true" className="absolute inset-y-0 left-0 w-14 rounded-[18px] bg-housing" />
        <ul className="relative flex flex-col gap-1 py-1.5">
          {PRIORITY_ORDER.map((k) => {
            const p = PRIORITIES[k];
            const isActive = active === k;
            const dim = active && !isActive;
            return (
              <li key={k}>
                <button
                  type="button"
                  onClick={() => onSelect(isActive ? null : k)}
                  aria-pressed={isActive}
                  className="group grid w-full grid-cols-[56px_minmax(0,1fr)] items-center rounded-[12px] text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-text/50"
                >
                  <span className="grid place-items-center py-2">
                    <span className={`rounded-full ring-4 ring-black/25 transition ${dim ? "opacity-25" : ""}`}>
                      <Lamp priority={k} glow={isActive} />
                    </span>
                  </span>
                  <span className={`ml-3 block rounded-[10px] px-3 py-2.5 transition ${isActive ? p.soft : "group-hover:bg-surface-2"}`}>
                    <span className="flex items-center justify-between gap-2">
                      <span className={`text-[11px] font-bold uppercase tracking-[0.12em] ${p.text}`}>
                        {p.light} · {p.label}
                      </span>
                      <span className="font-mono text-[12px] tabular-nums text-muted">
                        {counts[k]} {counts[k] === 1 ? "activa" : "activas"}
                      </span>
                    </span>
                    <span className="mt-0.5 block font-display text-[15.5px] font-bold text-ink">{p.name}</span>
                    <span className="mt-0.5 block text-[13px] leading-snug text-muted">
                      {p.desc} <span className="text-ink/80">Ej.: {p.example}.</span>
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
      <p className="mt-3 border-t border-line pt-3 text-[12.5px] leading-snug text-muted">
        Clasificar bien nos permite atender primero las emergencias reales sin desatender tus consultas cotidianas.
      </p>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Acompañamiento (Soporte continuo)                                   */
/* ------------------------------------------------------------------ */

function HelpPanel() {
  return (
    <section aria-labelledby="ayuda-title" className="rounded-[14px] border border-line bg-surface p-5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">Acompañamiento</p>
      <h2 id="ayuda-title" className="mt-1 font-display text-[17px] font-bold text-ink">¿Dudas sobre cómo usar NEXO?</h2>

      <div className="mt-4 flex items-center gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand text-[14px] font-bold text-brand-ink">MS</span>
        <div className="min-w-0">
          <p className="text-[14.5px] font-semibold text-ink">Micaela Sosa</p>
          <p className="text-[12.5px] leading-snug text-muted">Experiencia y Vinculación · Referente oficial del grupo piloto</p>
        </div>
      </div>

      <ul className="mt-4 flex flex-col gap-2.5 text-[13px]">
        <li className="flex items-start gap-2.5">
          <Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand-text" aria-hidden="true" />
          <span className="min-w-0"><span className="text-muted">WhatsApp exclusivo piloto: </span><span className="select-all font-mono text-[12.5px] text-ink">+54 9 351 XXX-XXXX</span></span>
        </li>
        <li className="flex items-start gap-2.5">
          <Mail className="mt-0.5 h-4 w-4 shrink-0 text-brand-text" aria-hidden="true" />
          <span className="min-w-0 break-words"><span className="text-muted">Correo: </span><span className="select-all font-mono text-[12.5px] text-ink">nexo-ayuda@tramasoluciones.com</span></span>
        </li>
        <li className="flex items-start gap-2.5">
          <CalendarClock className="mt-0.5 h-4 w-4 shrink-0 text-brand-text" aria-hidden="true" />
          <span className="text-ink">Lunes a viernes de 9:00 a 18:00 h</span>
        </li>
        <li className="flex items-start gap-2.5">
          <BookOpen className="mt-0.5 h-4 w-4 shrink-0 text-brand-text" aria-hidden="true" />
          <span className="text-ink">Manual básico de usuario en PDF, con capturas paso a paso</span>
        </li>
      </ul>

      <p className="mt-4 rounded-[10px] bg-brand-soft/60 px-3.5 py-3 text-[12.5px] leading-snug text-ink">
        Para reportar un incidente usá siempre <span className="font-semibold">“+ Nueva Solicitud”</span>: así queda registrado con su número de ticket y no se traspapela.
      </p>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Tickets                                                             */
/* ------------------------------------------------------------------ */

function StepBar({ step }) {
  return (
    <span className="flex items-center gap-1" role="img" aria-label={`Paso ${step + 1} de ${STEPS.length}: ${STEPS[step]}`}>
      {STEPS.map((s, i) => (
        <span key={s} className={`h-1.5 w-6 rounded-full ${i <= step ? "bg-cta" : "bg-line"}`} />
      ))}
    </span>
  );
}

function StepList({ step }) {
  return (
    <ol className="grid max-w-[480px] grid-cols-4 gap-2">
      {STEPS.map((label, i) => (
        <li key={label} className="min-w-0">
          <span className={`block h-1.5 rounded-full ${i <= step ? "bg-cta" : "bg-line"}`} />
          <span className={`mt-1.5 block truncate text-[12px] ${i === step ? "font-semibold text-ink" : "text-muted"}`}>{label}</span>
        </li>
      ))}
    </ol>
  );
}

function Avatar({ name }) {
  return (
    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-soft text-[10.5px] font-bold text-brand-text" title={`${name} · ${ANALYSTS[name] || "TRAMA"}`}>
      {initials(name)}
    </span>
  );
}

function Stars({ value, size = "h-3.5 w-3.5" }) {
  return (
    <span className="inline-flex items-center gap-0.5" role="img" aria-label={`Calificado ${value} de 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} aria-hidden="true" className={`${size} ${n <= value ? "fill-mid-dot text-mid-dot" : "text-muted/40"}`} />
      ))}
    </span>
  );
}

function StarRating({ value, onChange }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
      <span className="text-[13.5px] font-semibold text-ink">{value ? "Tu calificación" : "¿Cómo resolvimos tu caso?"}</span>
      <div role="radiogroup" aria-label="Calificá la atención de 1 a 5" className="flex" onMouseLeave={() => setHover(0)}>
        {[1, 2, 3, 4, 5].map((n) => {
          const on = (hover || value) >= n;
          return (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={value === n}
              aria-label={`${n} de 5`}
              onMouseEnter={() => setHover(n)}
              onClick={() => onChange(n)}
              className="grid h-8 w-8 place-items-center rounded-[8px] transition hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-text/40"
            >
              <Star aria-hidden="true" className={`h-5 w-5 transition ${on ? "fill-mid-dot text-mid-dot" : "text-muted/50"}`} />
            </button>
          );
        })}
      </div>
      {value > 0 && <span className="text-[12.5px] font-medium text-cta-text">¡Gracias! Tu opinión nos ayuda a mejorar NEXO.</span>}
    </div>
  );
}

function CardShell({ t, open, onToggle, highlight, meta, children, detail }) {
  const Icon = CAT_ICON[t.category] || FileText;
  return (
    <article className={`rounded-[12px] border bg-surface transition-colors ${highlight ? "animate-flash border-cta" : "border-line hover:border-muted/40"}`}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={`tk-det-${t.id}`}
        className="flex w-full items-start gap-4 rounded-[12px] p-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-text/50 sm:p-5"
      >
        <MiniSemaforo priority={t.priority} />
        <span className="block min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="font-mono text-[13px] font-semibold text-ink">#TK-{t.id}</span>
            <PriorityTag priority={t.priority} />
            <span className="inline-flex items-center gap-1.5 text-[13px] text-muted">
              <Icon className="h-3.5 w-3.5" aria-hidden="true" />
              {t.category}
            </span>
            <span className="ml-auto inline-flex items-center gap-1 font-mono text-[12px] text-muted">
              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
              {meta}
            </span>
          </span>
          <span className="mt-1.5 block font-display text-[17px] font-bold leading-snug text-ink">{t.subject}</span>
          <span className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px]">{children}</span>
        </span>
        <ChevronDown
          aria-hidden="true"
          className={`mt-0.5 h-5 w-5 shrink-0 text-muted transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div id={`tk-det-${t.id}`} className="border-t border-line px-4 pb-5 pt-4 sm:pl-[52px] sm:pr-5">
          {detail}
        </div>
      )}
    </article>
  );
}

function StatusPill({ status }) {
  const s = STATUS[status] || STATUS["Recibido"];
  return <span className={`rounded-full px-2.5 py-0.5 font-semibold ${s.cls}`}>{status}</span>;
}

function AnalystLine({ tech }) {
  return (
    <span className="inline-flex items-center gap-2 text-muted">
      {tech ? (
        <>
          <Avatar name={tech} />
          {shortName(tech)}
        </>
      ) : (
        <span className="italic">Asignando analista…</span>
      )}
    </span>
  );
}

function ActiveCard({ t, now, open, onToggle, highlight }) {
  const s = STATUS[t.status] || STATUS["Recibido"];
  return (
    <CardShell
      t={t}
      open={open}
      onToggle={onToggle}
      highlight={highlight}
      meta={relTime(t.updatedAt, now)}
      detail={
        <>
          {t.question && t.status === "Esperando info" && (
            <div className="mb-4 rounded-[10px] border border-mid/30 bg-mid-soft/60 p-3.5">
              <p className="flex items-center gap-2 text-[11.5px] font-bold uppercase tracking-[0.1em] text-mid">
                <MessageSquare className="h-4 w-4" aria-hidden="true" /> El analista necesita más información
              </p>
              <p className="mt-1.5 text-[14px] leading-relaxed text-ink">{t.question}</p>
            </div>
          )}
          <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-muted">Descripción</p>
          <p className="mt-1 max-w-[62ch] text-[14px] leading-relaxed text-ink/90">{t.description}</p>
          <div className="mt-4">
            <StepList step={s.step} />
            <p className="mt-2 text-[12.5px] text-muted">{s.desc}</p>
          </div>
          <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-[13px]">
            <div className="flex gap-1.5"><dt className="text-muted">Creado</dt><dd className="text-ink">{relTime(t.createdAt, now)}</dd></div>
            <div className="flex gap-1.5"><dt className="text-muted">Adjuntos</dt><dd className="text-ink">{t.attachments}</dd></div>
            <div className="flex gap-1.5">
              <dt className="text-muted">Analista</dt>
              <dd className="text-ink">{t.tech ? `${t.tech} · ${ANALYSTS[t.tech]}` : "Pendiente de asignación"}</dd>
            </div>
          </dl>
        </>
      }
    >
      <span className="inline-flex items-center gap-2 text-muted">
        Estado: <StatusPill status={t.status} />
      </span>
      <StepBar step={s.step} />
      <AnalystLine tech={t.tech} />
    </CardShell>
  );
}

function ResolvedCard({ t, now, open, onToggle, highlight, onRate }) {
  return (
    <CardShell
      t={t}
      open={open}
      onToggle={onToggle}
      highlight={highlight}
      meta={relTime(t.closedAt, now)}
      detail={
        <>
          <div className="rounded-[10px] border border-low/30 bg-low-soft/60 p-4">
            <p className="flex items-center gap-2 text-[11.5px] font-bold uppercase tracking-[0.1em] text-low">
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> Solución aplicada
            </p>
            <p className="mt-1.5 max-w-[62ch] text-[14px] leading-relaxed text-ink">{t.solution}</p>
            <p className="mt-2 text-[12.5px] text-muted">
              {t.tech} · {ANALYSTS[t.tech]} · resuelto en {duration(t.closedAt - t.createdAt)}
            </p>
          </div>
          <p className="mt-4 text-[12px] font-semibold uppercase tracking-[0.1em] text-muted">Problema reportado</p>
          <p className="mt-1 max-w-[62ch] text-[13.5px] leading-relaxed text-ink/85">{t.description}</p>
          <div className="mt-4 border-t border-line pt-4">
            <StarRating value={t.rating || 0} onChange={(n) => onRate(t.id, n)} />
          </div>
        </>
      }
    >
      <span className="inline-flex items-center gap-2 text-muted">
        Estado: <StatusPill status="Resuelto" />
      </span>
      <span className="inline-flex items-center gap-1.5 text-muted">
        <Timer className="h-3.5 w-3.5" aria-hidden="true" /> en {duration(t.closedAt - t.createdAt)}
      </span>
      <AnalystLine tech={t.tech} />
      {t.rating ? <Stars value={t.rating} /> : <span className="font-medium text-brand-text">Calificar</span>}
    </CardShell>
  );
}

/* ------------------------------------------------------------------ */
/* Formulario de carga (4 campos + semáforo)                           */
/* ------------------------------------------------------------------ */

const inputCls = (err) =>
  `w-full rounded-[10px] border bg-page px-3.5 text-[15px] text-ink placeholder:text-muted/70 transition focus:outline-none focus:ring-4 ${
    err ? "border-crit focus:ring-crit/15" : "border-line focus:border-brand-text focus:ring-brand-text/15"
  }`;

const btnPrimary =
  "inline-flex h-11 items-center justify-center gap-2 rounded-[10px] bg-cta px-5 text-[15px] font-semibold text-on-cta transition hover:bg-cta-hover focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cta/30 active:translate-y-px disabled:cursor-wait disabled:opacity-80";
const btnSecondary =
  "inline-flex h-11 items-center justify-center gap-2 rounded-[10px] border border-line bg-surface px-4 text-[14.5px] font-semibold text-ink transition hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-text/20 disabled:opacity-50";

function FieldLabel({ n, htmlFor, children, optional, aside }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <label htmlFor={htmlFor} className="flex items-center gap-2 text-[14px] font-semibold text-ink">
        <span className="grid h-5 w-5 place-items-center rounded-full bg-brand-soft font-mono text-[11px] font-semibold text-brand-text">
          {n}
        </span>
        {children}
        {optional ? (
          <span className="text-[12px] font-normal text-muted">(opcional)</span>
        ) : (
          <span className="text-crit" aria-hidden="true">*</span>
        )}
      </label>
      {aside}
    </div>
  );
}

function FieldError({ id, children }) {
  if (!children) return null;
  return (
    <p id={id} className="mt-1.5 flex items-start gap-1.5 text-[12.5px] font-medium text-crit">
      <Info className="mt-px h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      {children}
    </p>
  );
}

function validate(f) {
  const e = {};
  const asunto = f.asunto.trim();
  const desc = f.descripcion.trim();
  if (!asunto) e.asunto = "Escribí un asunto breve.";
  else if (GENERIC_SUBJECTS.has(norm(asunto))) e.asunto = "Evitá títulos genéricos como “Ayuda” o “Urgente”: contá qué falla y dónde.";
  else if (asunto.length < 6) e.asunto = "El asunto necesita al menos 6 caracteres.";
  if (!f.categoria) e.categoria = "Elegí una categoría.";
  if (!desc) e.descripcion = "Describí qué pasó.";
  else if (VAGUE_DESCRIPTIONS.has(norm(desc))) e.descripcion = "Es muy general. Contá qué intentabas hacer, qué error apareció y si afecta solo a tu equipo o a todos.";
  else if (desc.length < 20) e.descripcion = "Contanos un poco más: al menos 20 caracteres.";
  if (!f.prioridad) e.prioridad = "Marcá el nivel del semáforo.";
  return e;
}
const FIELD_FOCUS = { asunto: "asunto", categoria: "categoria", descripcion: "descripcion", prioridad: "prioridad-critica" };

function NewTicketDrawer({ takenIds, onClose, onCreated, onViewTicket, setPath }) {
  const empty = { asunto: "", categoria: "", descripcion: "", prioridad: "" };
  const [form, setForm] = useState(empty);
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [tried, setTried] = useState(false);
  const [phase, setPhase] = useState("form"); // form | sending | done
  const [stepMsg, setStepMsg] = useState(0);
  const [created, setCreated] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [fileError, setFileError] = useState("");
  const [copied, setCopied] = useState(false);
  const firstRef = useRef(null);
  const fileRef = useRef(null);
  const timers = useRef([]);
  const sending = phase === "sending";

  useEffect(() => {
    firstRef.current?.focus();
    const t = timers.current;
    return () => t.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape" && !sending) onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sending, onClose]);

  const later = (fn, ms) => timers.current.push(setTimeout(fn, ms));

  const setFields = (patch) => {
    const next = { ...form, ...patch };
    setForm(next);
    if (tried) setErrors(validate(next));
  };
  const update = (k, v) => setFields({ [k]: v });
  const fillPractice = () => setFields(PRACTICE);

  const addFiles = (list) => {
    const arr = Array.from(list || []);
    if (!arr.length) return;
    setFileError("");
    const room = 5 - files.length;
    if (room <= 0) { setFileError("Ya cargaste el máximo de 5 archivos."); return; }
    const ok = [];
    let rejected = 0;
    arr.slice(0, room).forEach((f) => {
      const isImg = (f.type || "").startsWith("image/");
      const isPdf = f.type === "application/pdf";
      if ((!isImg && !isPdf) || f.size > 10 * 1024 * 1024) { rejected++; return; }
      let url = null;
      if (isImg) { try { url = URL.createObjectURL(f); } catch { url = null; } }
      ok.push({ id: uid(), name: f.name, size: f.size, url, kind: isPdf ? "pdf" : "img" });
    });
    if (arr.length > room) setFileError(`Se agregaron ${room} de ${arr.length}: el máximo es 5 archivos.`);
    else if (rejected) setFileError("Algunos archivos no se agregaron. Usá imágenes o PDF de hasta 10 MB.");
    setFiles((fs) => [...fs, ...ok]);
  };

  const simulateCapture = () => {
    if (files.length >= 5) { setFileError("Ya cargaste el máximo de 5 archivos."); return; }
    setFileError("");
    const url = fakeScreenshot();
    const n = files.length + 1;
    setFiles((fs) => [
      ...fs,
      { id: uid(), name: `captura_error_${String(n).padStart(2, "0")}.png`, size: url ? Math.round(url.length * 0.75) : 48200, url, kind: "img" },
    ]);
  };

  const removeFile = (id) => {
    setFiles((fs) => {
      const f = fs.find((x) => x.id === id);
      if (f?.url?.startsWith("blob:")) { try { URL.revokeObjectURL(f.url); } catch { /* sin acción */ } }
      return fs.filter((x) => x.id !== id);
    });
  };

  const submit = (e) => {
    e.preventDefault();
    setTried(true);
    const errs = validate(form);
    setErrors(errs);
    const firstBad = ["asunto", "categoria", "descripcion", "prioridad"].find((k) => errs[k]);
    if (firstBad) { document.getElementById(FIELD_FOCUS[firstBad])?.focus(); return; }

    setPhase("sending");
    setStepMsg(0);
    later(() => setStepMsg(1), 650);
    later(() => setStepMsg(2), 1300);
    later(() => {
      let n;
      do { n = 1000 + Math.floor(Math.random() * 9000); } while (takenIds.includes(n));
      const ts = Date.now();
      const ticket = {
        id: n,
        subject: form.asunto.trim(),
        category: form.categoria,
        priority: form.prioridad,
        status: "Recibido",
        tech: null,
        createdAt: ts,
        updatedAt: ts,
        attachments: files.length,
        description: form.descripcion.trim(),
      };
      onCreated(ticket);
      setCreated(ticket);
      setPhase("done");
      setPath(`/solicitudes/TK-${n}`);
    }, 1950);
  };

  const reset = () => {
    setForm(empty); setFiles([]); setErrors({}); setTried(false); setFileError("");
    setCreated(null); setCopied(false); setPhase("form"); setPath("/solicitudes/nueva");
    setTimeout(() => firstRef.current?.focus(), 0);
  };

  const copyNumber = (text) => {
    const select = () => {
      const el = document.getElementById("ticket-num");
      if (!el) return;
      const r = document.createRange(); r.selectNodeContents(el);
      const sel = window.getSelection(); sel?.removeAllRanges(); sel?.addRange(r);
    };
    try {
      const p = navigator.clipboard?.writeText(text);
      if (p && p.then) {
        p.then(() => { setCopied(true); setTimeout(() => setCopied(false), 1800); }).catch(select);
      } else select();
    } catch { select(); }
  };

  const SelectedCatIcon = CAT_ICON[form.categoria];

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="drawer-title" className="absolute inset-0 z-30 flex justify-end">
      <div aria-hidden="true" onClick={sending ? undefined : onClose} className="absolute inset-0 animate-fade bg-scrim/40 backdrop-blur-[2px]" />

      <div className="relative flex h-full w-full max-w-[600px] animate-slide flex-col bg-surface shadow-drawer">
        {/* Encabezado del panel */}
        <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4 sm:px-7">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">Mesa de ayuda · {ORG}</p>
            <h2 id="drawer-title" className="mt-1 font-display text-[22px] font-bold leading-tight text-ink">
              {phase === "done" ? "Solicitud registrada" : "Nueva solicitud"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={sending}
            aria-label="Cerrar"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-[10px] text-muted transition hover:bg-surface-2 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-text/40 disabled:opacity-40"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {phase === "done" && created ? (
          /* ---------- Éxito ---------- */
          <div className="flex min-h-0 flex-1 flex-col items-center overflow-y-auto px-5 py-9 text-center sm:px-7">
            <span className="grid h-16 w-16 animate-pop place-items-center rounded-full bg-cta/15 text-cta-text">
              <CheckCircle2 className="h-9 w-9" />
            </span>
            <h3 className="mt-5 font-display text-[24px] font-bold text-ink">¡Solicitud enviada!</h3>
            <p className="mt-1.5 max-w-[44ch] text-[14px] leading-relaxed text-muted">
              Tu caso tiene un número de ticket único y no se traspapela. Te avisamos en NEXO cada vez que cambie de estado.
            </p>

            <div className="mt-6 w-full max-w-[420px] rounded-[12px] border border-line bg-page p-4 text-left">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">Número de ticket</div>
                  <div id="ticket-num" className="mt-1 select-all font-mono text-[30px] font-semibold leading-none tracking-tight text-ink">
                    #TK-{created.id}
                  </div>
                </div>
                <button type="button" onClick={() => copyNumber(`#TK-${created.id}`)} className={`${btnSecondary} h-9 px-3 text-[13px]`}>
                  {copied ? <Check className="h-4 w-4 text-cta-text" /> : <Copy className="h-4 w-4" />}
                  {copied ? "Copiado" : "Copiar"}
                </button>
              </div>
              <dl className="mt-4 grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-2 border-t border-line pt-4 text-[13.5px]">
                <dt className="text-muted">Asunto</dt>
                <dd className="text-ink">{created.subject}</dd>
                <dt className="text-muted">Categoría</dt>
                <dd className="text-ink">{created.category}</dd>
                <dt className="text-muted">Prioridad</dt>
                <dd className="flex flex-wrap items-center gap-2 text-ink">
                  <PriorityTag priority={created.priority} /> {PRIORITIES[created.priority].name}
                </dd>
                <dt className="text-muted">Adjuntos</dt>
                <dd className="text-ink">{created.attachments === 1 ? "1 archivo" : `${created.attachments} archivos`}</dd>
              </dl>
            </div>

            <div className="mt-5 w-full max-w-[420px] text-left">
              <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-muted">¿Qué ocurre ahora?</p>
              <ol className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {STEPS.map((label, i) => (
                  <li key={label} className={`rounded-[10px] border p-2.5 ${i === 0 ? "border-cta bg-cta/10" : "border-line"}`}>
                    <span className="font-mono text-[11px] text-muted">0{i + 1}</span>
                    <span className={`block text-[12.5px] font-semibold ${i === 0 ? "text-cta-text" : "text-ink"}`}>{label}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="mt-6 flex w-full max-w-[420px] flex-col gap-2 sm:flex-row">
              <button type="button" onClick={() => onViewTicket(created.id)} className={`${btnPrimary} flex-1`}>
                Ver en solicitudes activas
              </button>
              <button type="button" onClick={reset} className={`${btnSecondary} flex-1`}>
                Cargar otra
              </button>
            </div>
          </div>
        ) : (
          /* ---------- Formulario ---------- */
          <form onSubmit={submit} noValidate className="flex min-h-0 flex-1 flex-col">
            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-6 sm:px-7">
              <fieldset disabled={sending} className="min-w-0">
                <legend className="sr-only">Datos de la solicitud</legend>
                <div className="mb-6 flex flex-col items-start gap-3">
                  <p className="text-[13.5px] leading-relaxed text-muted">
                    Cargá tu solicitud en 4 campos y marcá la prioridad con el semáforo. Mientras más específico sea el
                    detalle del error, más rápida y certera será la solución de Soporte.
                  </p>
                  <button
                    type="button"
                    onClick={fillPractice}
                    className="inline-flex items-center gap-2 rounded-[10px] border border-dashed border-brand-text/40 bg-brand-soft/50 px-3 py-2 text-[13px] font-semibold text-brand-text transition hover:bg-brand-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-text/40"
                  >
                    <GraduationCap className="h-4 w-4" aria-hidden="true" /> Completar con la práctica del taller
                  </button>
                </div>

                <div className="flex flex-col gap-6">
                  {/* Campo 1 */}
                  <div>
                    <FieldLabel
                      n="1"
                      htmlFor="asunto"
                      aside={<span className="font-mono text-[12px] tabular-nums text-muted">{form.asunto.length}/80</span>}
                    >
                      Asunto directo
                    </FieldLabel>
                    <input
                      ref={firstRef}
                      id="asunto"
                      type="text"
                      maxLength={80}
                      value={form.asunto}
                      onChange={(e) => update("asunto", e.target.value)}
                      placeholder="Ej.: La impresora de recepción no imprime"
                      aria-invalid={!!errors.asunto}
                      aria-describedby={errors.asunto ? "asunto-error" : "asunto-hint"}
                      className={`${inputCls(errors.asunto)} mt-2 h-11`}
                    />
                    {errors.asunto ? (
                      <FieldError id="asunto-error">{errors.asunto}</FieldError>
                    ) : (
                      <p id="asunto-hint" className="mt-1.5 text-[12.5px] text-muted">
                        Título breve que resuma el foco. Evitá títulos genéricos como “Ayuda” o “Urgente”.
                      </p>
                    )}
                  </div>

                  {/* Campo 2 */}
                  <div>
                    <FieldLabel n="2" htmlFor="categoria">Categoría</FieldLabel>
                    <div className="relative mt-2">
                      {SelectedCatIcon && (
                        <SelectedCatIcon aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-text" />
                      )}
                      <select
                        id="categoria"
                        value={form.categoria}
                        onChange={(e) => update("categoria", e.target.value)}
                        aria-invalid={!!errors.categoria}
                        aria-describedby={errors.categoria ? "categoria-error" : undefined}
                        className={`${inputCls(errors.categoria)} h-11 cursor-pointer appearance-none pr-10 ${SelectedCatIcon ? "pl-10" : ""} ${form.categoria ? "" : "text-muted"}`}
                      >
                        <option value="" disabled>Elegí una categoría</option>
                        {CATEGORIES.map((c) => (
                          <option key={c.id} value={c.id}>{c.id}</option>
                        ))}
                        <optgroup label="Programa piloto">
                          <option value={PRACTICE_CATEGORY.id}>{PRACTICE_CATEGORY.id}</option>
                        </optgroup>
                      </select>
                      <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                    </div>
                    <FieldError id="categoria-error">{errors.categoria}</FieldError>
                  </div>

                  {/* Campo 3 */}
                  <div>
                    <FieldLabel n="3" htmlFor="descripcion">Descripción clara</FieldLabel>
                    <p id="descripcion-hint" className="mt-1 text-[12.5px] text-muted">
                      ¿Qué intentabas hacer? ¿Qué mensaje de error apareció? ¿Afecta solo a tu equipo o a todos?
                    </p>
                    <textarea
                      id="descripcion"
                      rows={5}
                      value={form.descripcion}
                      onChange={(e) => update("descripcion", e.target.value)}
                      placeholder="Ej.: Mi equipo no conecta al Wi-Fi de la oficina desde las 10 h; al resto del área sí le funciona."
                      aria-invalid={!!errors.descripcion}
                      aria-describedby={errors.descripcion ? "descripcion-error" : "descripcion-hint"}
                      className={`${inputCls(errors.descripcion)} mt-2 resize-y py-3 leading-relaxed`}
                    />
                    <FieldError id="descripcion-error">{errors.descripcion}</FieldError>
                    <details className="group mt-2 rounded-[10px] border border-line bg-page">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-2 rounded-[10px] px-3.5 py-2.5 text-[13px] font-semibold text-brand-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-text/40 [&::-webkit-details-marker]:hidden">
                        Hablemos el mismo idioma: redacción vaga vs. efectiva
                        <ChevronDown className="h-4 w-4 shrink-0 transition group-open:rotate-180" aria-hidden="true" />
                      </summary>
                      <div className="border-t border-line px-3.5 py-3">
                        <ul className="flex flex-col gap-3">
                          {WRITING_EXAMPLES.map(([vague, good]) => (
                            <li key={vague} className="grid gap-1.5 sm:grid-cols-[minmax(0,0.55fr)_minmax(0,1.45fr)] sm:gap-3">
                              <span className="flex gap-1.5 text-[13px] text-crit">
                                <X className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />“{vague}”
                              </span>
                              <span className="flex gap-1.5 text-[13px] text-ink">
                                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-cta-text" aria-hidden="true" />“{good}”
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </details>
                  </div>

                  {/* Campo 4 */}
                  <div>
                    <FieldLabel n="4" htmlFor="adjunto" optional>Adjunto</FieldLabel>
                    <p className="mt-1 text-[12.5px] text-muted">Una captura de pantalla o foto del error ahorra horas de diagnóstico.</p>
                    <div
                      onDragOver={(e) => { e.preventDefault(); if (!dragging) setDragging(true); }}
                      onDragLeave={() => setDragging(false)}
                      onDrop={(e) => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer?.files); }}
                      className={`mt-2 rounded-[12px] border-2 border-dashed px-4 py-6 text-center transition ${dragging ? "border-cta bg-cta/5" : "border-line bg-page"}`}
                    >
                      <Upload className={`mx-auto h-7 w-7 ${dragging ? "text-cta-text" : "text-muted"}`} aria-hidden="true" />
                      <p className="mt-2 text-[14px] font-medium text-ink">
                        {dragging ? "Soltá los archivos para adjuntarlos" : "Arrastrá capturas o fotos del error acá"}
                      </p>
                      <p className="mt-0.5 text-[12.5px] text-muted">PNG, JPG o PDF · hasta 10 MB · máximo 5 archivos</p>
                      <div className="mt-3 flex flex-wrap justify-center gap-2">
                        <button type="button" onClick={() => fileRef.current?.click()} className={`${btnSecondary} h-9 px-3 text-[13px]`}>
                          <Paperclip className="h-4 w-4" aria-hidden="true" /> Elegir archivos
                        </button>
                        <button
                          type="button"
                          onClick={simulateCapture}
                          className="inline-flex h-9 items-center gap-2 rounded-[10px] px-3 text-[13px] font-semibold text-brand-text transition hover:bg-brand-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-text/40"
                        >
                          <Camera className="h-4 w-4" aria-hidden="true" /> Simular captura
                        </button>
                      </div>
                      <input
                        ref={fileRef}
                        id="adjunto"
                        type="file"
                        accept="image/*,application/pdf"
                        multiple
                        className="sr-only"
                        onChange={(e) => { addFiles(e.target.files); e.target.value = ""; }}
                      />
                    </div>
                    <FieldError id="adjunto-error">{fileError}</FieldError>
                    {files.length > 0 && (
                      <ul className="mt-3 flex flex-col gap-2">
                        {files.map((f) => (
                          <li key={f.id} className="flex items-center gap-3 rounded-[10px] border border-line bg-surface p-2 pr-2.5">
                            {f.url ? (
                              <img src={f.url} alt="" className="h-10 w-14 shrink-0 rounded-[6px] border border-line object-cover" />
                            ) : (
                              <span className="grid h-10 w-14 shrink-0 place-items-center rounded-[6px] bg-surface-2 text-muted">
                                <FileText className="h-5 w-5" aria-hidden="true" />
                              </span>
                            )}
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-[13.5px] font-medium text-ink">{f.name}</span>
                              <span className="block font-mono text-[11.5px] text-muted">{formatSize(f.size)}</span>
                            </span>
                            <button
                              type="button"
                              onClick={() => removeFile(f.id)}
                              aria-label={`Quitar ${f.name}`}
                              className="grid h-8 w-8 shrink-0 place-items-center rounded-[8px] text-muted transition hover:bg-surface-2 hover:text-crit focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-text/40"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Prioridad según el semáforo */}
                  <fieldset aria-describedby={errors.prioridad ? "prioridad-error" : "prioridad-hint"}>
                    <legend className="flex items-center gap-2 text-[14px] font-semibold text-ink">
                      <span className="flex h-5 w-[34px] items-center justify-center gap-[3px] rounded-full bg-housing" aria-hidden="true">
                        {PRIORITY_ORDER.map((k) => (
                          <Lamp key={k} priority={k} size="h-[6px] w-[6px]" />
                        ))}
                      </span>
                      Prioridad según el semáforo
                      <span className="text-crit" aria-hidden="true">*</span>
                    </legend>
                    <p id="prioridad-hint" className="mt-1 text-[12.5px] text-muted">
                      Elegí el nivel que mejor describe el impacto en tu organización.
                    </p>
                    <div className="mt-2 grid gap-2 sm:grid-cols-3">
                      {PRIORITY_ORDER.map((k) => {
                        const p = PRIORITIES[k];
                        const sel = form.prioridad === k;
                        return (
                          <label
                            key={k}
                            htmlFor={`prioridad-${k}`}
                            className={`relative flex cursor-pointer gap-3 rounded-[12px] border p-3 transition has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-brand-text/20 sm:flex-col sm:gap-2 ${
                              sel ? `${p.border} ${p.soft}` : errors.prioridad ? "border-crit/60 bg-page" : "border-line bg-page hover:border-muted/50"
                            }`}
                          >
                            <input
                              type="radio"
                              id={`prioridad-${k}`}
                              name="prioridad"
                              value={k}
                              checked={sel}
                              onChange={() => update("prioridad", k)}
                              className="sr-only"
                            />
                            <span className={`mt-0.5 transition ${sel ? "" : "opacity-60"}`}>
                              <Lamp priority={k} size="h-4 w-4" glow={sel} small />
                            </span>
                            <span className="block min-w-0">
                              <span className={`block text-[11px] font-bold uppercase tracking-[0.1em] ${p.text}`}>
                                {p.light} · {p.label}
                              </span>
                              <span className="mt-0.5 block text-[14px] font-semibold text-ink">{p.name}</span>
                              <span className="mt-0.5 block text-[12px] leading-snug text-muted">{p.desc}</span>
                              <span className="mt-1 block text-[12px] text-ink/75">Ej.: {p.example}</span>
                            </span>
                            {sel && <Check aria-hidden="true" className={`absolute right-2.5 top-2.5 h-4 w-4 ${p.text}`} />}
                          </label>
                        );
                      })}
                    </div>
                    <FieldError id="prioridad-error">{errors.prioridad}</FieldError>
                  </fieldset>
                </div>
              </fieldset>
            </div>

            {/* Pie del formulario */}
            <div className="relative border-t border-line bg-surface px-5 py-4 sm:px-7">
              {sending && (
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-0 h-[3px] bg-cta transition-[width] duration-500 ease-out"
                  style={{ width: `${((stepMsg + 1) / SENDING_STEPS.length) * 100}%` }}
                />
              )}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <p aria-live="polite" className="min-w-0 flex-1 text-[12.5px] text-muted">
                  {sending ? SENDING_STEPS[stepMsg] : tried && Object.keys(errors).length ? (
                    <span className="font-medium text-crit">Revisá los campos marcados.</span>
                  ) : (
                    "Los campos con * son obligatorios."
                  )}
                </p>
                <div className="flex gap-2">
                  <button type="button" onClick={onClose} disabled={sending} className={`${btnSecondary} flex-1 sm:flex-none`}>
                    Cancelar
                  </button>
                  <button type="submit" disabled={sending} className={`${btnPrimary} flex-[2] sm:min-w-[180px] sm:flex-none`}>
                    {sending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Procesando…
                      </>
                    ) : (
                      "Enviar Solicitud"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Marco del navegador, encabezado y avisos                            */
/* ------------------------------------------------------------------ */

function BrowserChrome({ path, loading, onReload }) {
  return (
    <div className="relative shrink-0 border-b border-line bg-chrome">
      {/* Pestañas */}
      <div className="hidden items-end gap-3 px-3 pt-2.5 sm:flex">
        <div className="flex items-center gap-1.5 pb-3 pl-1" aria-hidden="true">
          <span className="h-3 w-3 rounded-full bg-muted/30" />
          <span className="h-3 w-3 rounded-full bg-muted/30" />
          <span className="h-3 w-3 rounded-full bg-muted/30" />
        </div>
        <div className="flex min-w-0 max-w-[280px] items-center gap-2 rounded-t-[10px] bg-chrome-2 px-3.5 py-2 text-[12.5px] text-ink">
          <NexoMark className="h-4 w-4 shrink-0" />
          <span className="truncate">NEXO · Plataforma de Ayuda</span>
          <X className="ml-2 h-3.5 w-3.5 shrink-0 text-muted" aria-hidden="true" />
        </div>
        <Plus className="mb-2.5 h-4 w-4 text-muted" aria-hidden="true" />
      </div>

      {/* Barra de direcciones */}
      <div className="flex items-center gap-1 bg-chrome-2 px-2 py-2 sm:px-2.5">
        <span className="grid h-8 w-8 place-items-center rounded-full text-muted/50" aria-hidden="true">
          <ChevronLeft className="h-[18px] w-[18px]" />
        </span>
        <span className="hidden h-8 w-8 place-items-center rounded-full text-muted/50 sm:grid" aria-hidden="true">
          <ChevronRight className="h-[18px] w-[18px]" />
        </span>
        <button
          type="button"
          onClick={onReload}
          aria-label="Recargar solicitudes"
          className="grid h-8 w-8 place-items-center rounded-full text-muted transition hover:bg-chrome hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-text/40"
        >
          <RotateCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
        </button>
        <div className="ml-1 flex h-9 min-w-0 flex-1 items-center gap-2 rounded-full bg-chrome px-3.5 text-[13.5px]">
          <Lock className="h-3.5 w-3.5 shrink-0 text-cta-text" aria-label="Conexión segura" />
          <span className="min-w-0 truncate">
            <span className="font-medium text-ink">portal.nexo.app</span>
            <span className="text-muted">{path}</span>
          </span>
        </div>
        <span className="grid h-8 w-8 place-items-center text-muted" aria-hidden="true">
          <MoreVertical className="h-4 w-4" />
        </span>
      </div>

      {loading && <span aria-hidden="true" className="absolute bottom-0 left-0 h-[2px] animate-load bg-cta" />}
    </div>
  );
}

function NotificationsMenu({ notices, now, onOpen, onMarkAll }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const btnRef = useRef(null);
  const unread = notices.filter((n) => !n.read).length;
  const sorted = [...notices].sort((a, b) => b.at - a.at);

  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === "Escape") { setOpen(false); btnRef.current?.focus(); } };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("touchstart", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("touchstart", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="panel-notificaciones"
        aria-label={unread ? `Notificaciones, ${unread} sin leer` : "Notificaciones"}
        className={`relative grid h-9 w-9 place-items-center rounded-full text-brand-ink transition hover:bg-brand-ink/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-weft/70 ${open ? "bg-brand-ink/15" : ""}`}
      >
        <Bell className="h-[18px] w-[18px]" aria-hidden="true" />
        {unread > 0 && (
          <span className="absolute -right-0.5 -top-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-weft px-1 font-mono text-[10.5px] font-bold leading-none text-brand ring-2 ring-brand">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <div
          id="panel-notificaciones"
          role="region"
          aria-label="Notificaciones"
          className="absolute right-0 top-full z-30 mt-2 w-[min(360px,calc(100vw-64px))] animate-toast overflow-hidden rounded-[12px] border border-line bg-surface text-ink shadow-drawer"
        >
          <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
            <p className="font-display text-[15px] font-bold">
              Notificaciones
              {unread > 0 && <span className="ml-2 font-mono text-[12px] font-medium text-muted">{unread} sin leer</span>}
            </p>
            <button
              type="button"
              onClick={onMarkAll}
              disabled={!unread}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-[8px] px-2 py-1 text-[12.5px] font-semibold text-brand-text transition hover:bg-brand-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-text/40 disabled:cursor-default disabled:opacity-40 disabled:hover:bg-transparent"
            >
              <CheckCheck className="h-4 w-4" aria-hidden="true" /> Marcar leídas
            </button>
          </div>

          {sorted.length ? (
            <ul className="max-h-[min(380px,60vh)] overflow-y-auto py-1">
              {sorted.map((n) => {
                const Icon = NOTICE_ICON[n.kind] || Bell;
                return (
                  <li key={n.id}>
                    <button
                      type="button"
                      onClick={() => { setOpen(false); onOpen(n); }}
                      className={`flex w-full items-start gap-3 px-4 py-3 text-left transition hover:bg-surface-2 focus-visible:bg-surface-2 focus-visible:outline-none ${n.read ? "" : "bg-brand-soft/40"}`}
                    >
                      <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-soft text-brand-text">
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <span className="block min-w-0 flex-1">
                        <span className={`block truncate text-[13.5px] text-ink ${n.read ? "font-medium" : "font-semibold"}`}>{n.title}</span>
                        <span className="mt-0.5 block text-[12.5px] leading-snug text-muted">{n.body}</span>
                        <span className="mt-1 block font-mono text-[11.5px] text-muted">{relTime(n.at, now)}</span>
                      </span>
                      {!n.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-cta" aria-label="Sin leer" role="img" />}
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="flex flex-col items-center px-6 py-8 text-center">
              <BellOff className="h-6 w-6 text-muted" aria-hidden="true" />
              <p className="mt-2 text-[13.5px] text-muted">No tenés notificaciones.</p>
            </div>
          )}
          <p className="border-t border-line px-4 py-2.5 text-[12px] text-muted">Tocá una notificación para ver la solicitud.</p>
        </div>
      )}
    </div>
  );
}

function AppHeader({ notices, now, onOpenNotice, onMarkAll, onNew }) {
  return (
    <header className="sticky top-0 z-20 bg-brand text-brand-ink">
      <div className="mx-auto flex max-w-[1120px] items-center gap-4 px-4 py-3 sm:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <NexoMark className="h-9 w-9 shrink-0" />
          <div className="min-w-0 leading-none">
            <div className="font-display text-[20px] font-extrabold tracking-[0.16em]">NEXO</div>
            <div className="mt-1 hidden text-[11.5px] text-brand-ink/70 md:block">Plataforma de Ayuda</div>
            <div className="mt-1 truncate text-[11.5px] text-brand-ink/70 md:hidden">por TRAMA Soluciones Digitales</div>
          </div>
        </div>

        <span className="hidden h-8 w-px bg-brand-ink/20 md:block" aria-hidden="true" />

        <div className="hidden items-center gap-2.5 md:flex">
          <TramaMark className="h-6 w-6" />
          <div className="leading-tight">
            <div className="text-[12px] font-bold tracking-[0.24em]">TRAMA</div>
            <div className="text-[11px] text-brand-ink/70">Soluciones Digitales</div>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <span className="hidden items-center gap-2 rounded-full border border-brand-ink/20 px-3 py-1 text-[12.5px] xl:inline-flex">
            {ORG}
            <span className="rounded-full bg-weft/20 px-1.5 py-px text-[10.5px] font-bold uppercase tracking-[0.1em] text-weft">Piloto</span>
          </span>
          <button
            type="button"
            onClick={onNew}
            className="hidden h-9 items-center gap-1.5 rounded-[10px] bg-cta px-3.5 text-[13.5px] font-semibold text-on-cta ring-1 ring-white/15 transition hover:bg-cta-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-weft/70 sm:inline-flex"
          >
            <Plus className="h-4 w-4" strokeWidth={2.6} aria-hidden="true" /> Nueva
          </button>
          <NotificationsMenu notices={notices} now={now} onOpen={onOpenNotice} onMarkAll={onMarkAll} />
          <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-ink/15 text-[12.5px] font-bold" title={`${USER.name} · ${USER.role}`}>
            {initials(USER.name)}
          </span>
        </div>
      </div>
    </header>
  );
}

function PilotBanner() {
  const stage = PILOT_STAGES.find((s) => PILOT.week >= s.from && PILOT.week <= s.to) || PILOT_STAGES[2];
  return (
    <div className="border-b border-line bg-surface">
      <div className="mx-auto flex max-w-[1120px] flex-col gap-2 px-4 py-2.5 sm:px-8 md:flex-row md:items-center md:gap-5">
        <div className="flex shrink-0 flex-wrap items-center gap-x-3 gap-y-1.5">
          <span className="rounded-full bg-brand-soft px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-[0.1em] text-brand-text">
            Programa Piloto
          </span>
          <span className="flex items-center gap-[3px]" role="img" aria-label={`Semana ${PILOT.week} de ${PILOT.total}`}>
            {Array.from({ length: PILOT.total }, (_, i) => (
              <span key={i} className={`h-1.5 w-2.5 rounded-full ${i < PILOT.week ? "bg-cta" : "bg-line"}`} />
            ))}
          </span>
          <span className="font-mono text-[12px] tabular-nums text-muted">Semana {PILOT.week} de {PILOT.total}</span>
        </div>
        <p className="min-w-0 text-[13px] leading-snug text-muted">
          <span className="font-semibold text-ink">Etapa {stage.n}: {stage.name}.</span> NEXO es el canal único para
          reportar incidentes: tu consulta tiene un número de ticket y no se traspapela.
        </p>
      </div>
    </div>
  );
}

function Toasts({ toasts, onDismiss }) {
  return (
    <div aria-live="polite" className="pointer-events-none absolute inset-x-4 bottom-4 z-40 flex flex-col items-end gap-2 sm:left-auto">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="pointer-events-auto flex w-full max-w-[360px] animate-toast items-start gap-3 rounded-[12px] border border-line bg-surface p-3.5 shadow-drawer"
        >
          <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-cta/15 text-cta-text">
            <Bell className="h-4 w-4" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[14px] font-semibold text-ink">{t.title}</p>
            <p className="mt-0.5 text-[13px] leading-snug text-muted">{t.body}</p>
          </div>
          <button
            type="button"
            onClick={() => onDismiss(t.id)}
            aria-label="Cerrar aviso"
            className="grid h-7 w-7 shrink-0 place-items-center rounded-[8px] text-muted hover:bg-surface-2 hover:text-ink"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}

function SummaryTile({ icon: Icon, label, value, sub, onClick, active }) {
  const Tag = onClick ? "button" : "div";
  return (
    <Tag
      {...(onClick ? { type: "button", onClick, "aria-pressed": active } : {})}
      className={`flex min-w-0 items-start gap-3 rounded-[12px] border bg-surface p-4 text-left transition ${
        onClick ? "hover:border-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-text/40" : ""
      } ${active ? "border-brand-text/50" : "border-line"}`}
    >
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[10px] bg-brand-soft text-brand-text">
        <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
      </span>
      <span className="block min-w-0">
        <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">{label}</span>
        <span className="mt-1 block font-display text-[22px] font-extrabold leading-tight text-ink tabular-nums">{value}</span>
        <span className="mt-0.5 block truncate text-[12.5px] text-muted">{sub}</span>
      </span>
    </Tag>
  );
}

/* ------------------------------------------------------------------ */
/* Aplicación                                                          */
/* ------------------------------------------------------------------ */

export default function NexoPortal() {
  const [now, setNow] = useState(() => Date.now());
  const [tickets, setTickets] = useState(() => seedTickets(Date.now()));
  const [notices, setNotices] = useState(() => seedNotices(Date.now()));
  const [tab, setTab] = useState("activas"); // activas | historial
  const [filter, setFilter] = useState(null);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("prioridad");
  const [expanded, setExpanded] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [path, setPath] = useState("/solicitudes");
  const [highlight, setHighlight] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [loading, setLoading] = useState(false);
  const timers = useRef([]);
  const lastCreated = useRef(null);
  const newBtnRef = useRef(null);

  const later = (fn, ms) => timers.current.push(setTimeout(fn, ms));

  const pushNotice = (ticketId, kind, title, body) =>
    setNotices((ns) => [{ id: uid(), ticketId, kind, title, body, at: Date.now(), read: false }, ...ns]);

  // Aviso emergente + entrada en la bandeja de notificaciones
  const pushToast = (title, body, ticketId, kind = "update") => {
    const id = uid();
    setToasts((ts) => [...ts, { id, title, body }]);
    if (ticketId) pushNotice(ticketId, kind, title, body);
    later(() => setToasts((ts) => ts.filter((x) => x.id !== id)), 6000);
  };

  const changeTab = (next) => {
    setTab(next);
    setExpanded(null);
    if (!drawerOpen) setPath(next === "historial" ? "/historial" : "/solicitudes");
  };

  // Lleva la vista a una solicitud: cambia de pestaña, la abre, la resalta y hace scroll
  const focusTicket = (id, toTab) => {
    setTab(toTab);
    setPath(toTab === "historial" ? "/historial" : "/solicitudes");
    setFilter(null);
    setQuery("");
    setExpanded(id);
    setHighlight(id);
    later(() => setHighlight((h) => (h === id ? null : h)), 4200);
    requestAnimationFrame(() =>
      document.getElementById(`tk-${id}`)?.scrollIntoView({ block: "center", behavior: prefersReducedMotion() ? "auto" : "smooth" })
    );
  };

  const openNotice = (n) => {
    setNotices((ns) => ns.map((x) => (x.id === n.id ? { ...x, read: true } : x)));
    const t = tickets.find((x) => x.id === n.ticketId);
    if (t) focusTicket(t.id, t.status === "Resuelto" ? "historial" : "activas");
  };
  const markAllRead = () => setNotices((ns) => ns.map((x) => ({ ...x, read: true })));

  // Reloj para los "hace X min" y un evento simulado en vivo
  useEffect(() => {
    const tick = setInterval(() => setNow(Date.now()), 15000);
    const t = timers.current;
    t.push(
      setTimeout(() => {
        setTickets((ts) => ts.map((x) => (x.id === 1045 ? { ...x, status: "En proceso", tech: "Lucía Ferreyra", updatedAt: Date.now() } : x)));
        setNow(Date.now());
        pushToast("#TK-1045 · En proceso", "Lucía Ferreyra está revisando la factura duplicada con Administración.", 1045);
      }, 45000)
    );
    return () => { clearInterval(tick); t.forEach(clearTimeout); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const active = useMemo(() => tickets.filter((t) => t.status !== "Resuelto"), [tickets]);
  const resolved = useMemo(() => tickets.filter((t) => t.status === "Resuelto"), [tickets]);
  const inProcess = active.filter((t) => t.status === "En proceso");
  const counts = useMemo(
    () => Object.fromEntries(PRIORITY_ORDER.map((k) => [k, active.filter((t) => t.priority === k).length])),
    [active]
  );
  const latest = Math.max(...active.map((t) => t.updatedAt), 0);

  const base = tab === "activas" ? active : resolved;
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = base.filter((t) => !filter || t.priority === filter);
    if (q) {
      list = list.filter((t) =>
        `tk-${t.id} #tk-${t.id} ${t.subject} ${t.category} ${t.status} ${t.tech || ""}`.toLowerCase().includes(q)
      );
    }
    const rank = { critica: 0, media: 1, baja: 2 };
    if (tab === "historial") return [...list].sort((a, b) => b.closedAt - a.closedAt);
    return [...list].sort((a, b) =>
      sort === "prioridad" ? rank[a.priority] - rank[b.priority] || b.updatedAt - a.updatedAt : b.createdAt - a.createdAt
    );
  }, [base, tab, filter, query, sort]);

  const openDrawer = () => { setDrawerOpen(true); setPath("/solicitudes/nueva"); };

  const closeDrawer = () => {
    setDrawerOpen(false);
    const id = lastCreated.current;
    if (id) {
      lastCreated.current = null;
      focusTicket(id, "activas");
    } else {
      setPath(tab === "historial" ? "/historial" : "/solicitudes");
      setTimeout(() => newBtnRef.current?.focus(), 0);
    }
  };

  const handleCreated = (ticket) => {
    setTickets((ts) => [ticket, ...ts]);
    setFilter(null);
    setQuery("");
    setNow(Date.now());
    lastCreated.current = ticket.id;
    pushNotice(ticket.id, "new", `#TK-${ticket.id} · Recibido`, "Tu solicitud ingresó a la mesa de ayuda.");

    // Recibido: se asigna un analista según el área
    later(() => {
      const tech = analystFor(ticket.category);
      setTickets((ts) => ts.map((t) => (t.id === ticket.id ? { ...t, tech, updatedAt: Date.now() } : t)));
      setNow(Date.now());
      pushToast(`#TK-${ticket.id} · Analista asignado`, `${tech} (${ANALYSTS[tech]}) tomó tu caso.`, ticket.id, "assign");
    }, 6000);

    // Crítica: pasa enseguida a En proceso
    if (ticket.priority === "critica") {
      later(() => {
        setTickets((ts) => ts.map((t) => (t.id === ticket.id ? { ...t, status: "En proceso", updatedAt: Date.now() } : t)));
        setNow(Date.now());
        pushToast(`#TK-${ticket.id} · En proceso`, "Prioridad crítica: Soporte ya está trabajando en el bloqueo.", ticket.id);
      }, 11000);
    }
  };

  const rateTicket = (id, n) => setTickets((ts) => ts.map((t) => (t.id === id ? { ...t, rating: n } : t)));

  const viewTicket = () => closeDrawer();

  const reload = () => {
    if (loading) return;
    setLoading(true);
    later(() => { setLoading(false); setNow(Date.now()); }, 750);
  };

  const filterChips = [{ key: null, label: "Todas", n: base.length }].concat(
    PRIORITY_ORDER.map((k) => ({ key: k, label: PRIORITIES[k].label, n: base.filter((t) => t.priority === k).length }))
  );

  const tabs = [
    { key: "activas", label: "Solicitudes activas", icon: ListChecks, n: active.length },
    { key: "historial", label: "Historial", icon: History, n: resolved.length },
  ];

  return (
    <div className="h-full min-h-[640px] px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
      <div className="mx-auto flex h-full max-w-[1320px] flex-col overflow-hidden rounded-[14px] border border-line bg-page shadow-frame">
        <BrowserChrome path={path} loading={loading} onReload={reload} />

        <div className="relative min-h-0 flex-1">
          <div className="absolute inset-0 overflow-y-auto overscroll-contain">
            <AppHeader notices={notices} now={now} onOpenNotice={openNotice} onMarkAll={markAllRead} onNew={openDrawer} />
            <PilotBanner />

            <main className="mx-auto max-w-[1120px] px-4 pb-12 pt-7 sm:px-8 sm:pt-9">
              {/* Encabezado de la página */}
              <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <div className="min-w-0">
                  <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-muted">
                    {ORG} · {USER.name}
                  </p>
                  <h1 className="mt-2 font-display text-[30px] font-extrabold leading-[1.05] tracking-[-0.02em] text-ink [text-wrap:balance] sm:text-[38px]">
                    Tu espacio de trabajo
                  </h1>
                  <p className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[14px] text-muted">
                    <span className="inline-flex items-center gap-2 font-semibold text-cta-text">
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inset-0 animate-ping rounded-full bg-cta opacity-60" />
                        <span className="relative h-2 w-2 rounded-full bg-cta" />
                      </span>
                      En vivo
                    </span>
                    <span>Última novedad {relTime(latest, now)}</span>
                  </p>
                </div>
                <button
                  ref={newBtnRef}
                  type="button"
                  onClick={openDrawer}
                  className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-[12px] bg-cta px-6 text-[15.5px] font-semibold text-on-cta shadow-cta transition hover:-translate-y-px hover:bg-cta-hover focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cta/30 active:translate-y-0"
                >
                  <Plus className="h-5 w-5" strokeWidth={2.6} aria-hidden="true" />
                  Nueva Solicitud
                </button>
              </div>

              {/* Resumen (Paso 2 del taller) */}
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <SummaryTile
                  icon={ListChecks}
                  label="Mis solicitudes activas"
                  value={`${inProcess.length} en proceso`}
                  sub={inProcess.length ? inProcess.slice(0, 2).map((t) => `#TK-${t.id}`).join(" · ") + ` · ${active.length} activas` : `${active.length} activas`}
                  onClick={() => changeTab("activas")}
                  active={tab === "activas"}
                />
                <SummaryTile
                  icon={History}
                  label="Tickets resueltos"
                  value={`${resolved.length} cerrados`}
                  sub="Historial disponible"
                  onClick={() => changeTab("historial")}
                  active={tab === "historial"}
                />
                <SummaryTile icon={Timer} label="Tiempo de respuesta" value="< 24 horas" sub="Compromiso TRAMA" />
              </div>

              <div className="mt-7 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
                {/* Lista */}
                <section className="order-2 min-w-0 lg:order-1">
                  <div role="tablist" aria-label="Vistas de solicitudes" className="flex gap-1 border-b border-line">
                    {tabs.map((tb) => {
                      const on = tab === tb.key;
                      return (
                        <button
                          key={tb.key}
                          id={`tab-${tb.key}`}
                          type="button"
                          role="tab"
                          aria-selected={on}
                          aria-controls="panel-lista"
                          onClick={() => changeTab(tb.key)}
                          className={`-mb-px inline-flex items-center gap-2 border-b-2 px-3 pb-2.5 pt-1 text-[14.5px] font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-text/40 ${
                            on ? "border-cta text-ink" : "border-transparent text-muted hover:text-ink"
                          }`}
                        >
                          <tb.icon className="h-4 w-4" aria-hidden="true" />
                          {tb.label}
                          <span className={`rounded-full px-1.5 font-mono text-[11.5px] tabular-nums ${on ? "bg-brand-soft text-brand-text" : "bg-surface-2 text-muted"}`}>
                            {tb.n}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <div id="panel-lista" role="tabpanel" aria-labelledby={`tab-${tab}`} className="pt-4">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center">
                      <div className="relative min-w-0 flex-1">
                        <label htmlFor="buscar" className="sr-only">Buscar solicitudes</label>
                        <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                        <input
                          id="buscar"
                          type="search"
                          value={query}
                          onChange={(e) => setQuery(e.target.value)}
                          placeholder={tab === "activas" ? "Buscar por número, asunto o categoría" : "Buscar en soluciones anteriores"}
                          className="h-10 w-full rounded-[10px] border border-line bg-surface pl-9 pr-3 text-[14px] text-ink placeholder:text-muted/80 focus:border-brand-text focus:outline-none focus:ring-4 focus:ring-brand-text/15"
                        />
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <div role="group" aria-label="Filtrar por prioridad" className="flex rounded-[10px] border border-line bg-surface p-0.5">
                          {filterChips.map((c) => {
                            const on = filter === c.key;
                            return (
                              <button
                                key={c.label}
                                type="button"
                                onClick={() => setFilter(c.key)}
                                aria-pressed={on}
                                className={`inline-flex h-8 items-center gap-1.5 rounded-[8px] px-2.5 text-[13px] font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-text/40 ${
                                  on ? "bg-brand text-brand-ink" : "text-muted hover:text-ink"
                                }`}
                              >
                                {c.key && <span className={`h-2 w-2 rounded-full ${PRIORITIES[c.key].dot}`} aria-hidden="true" />}
                                {c.label}
                                <span className={`font-mono text-[11.5px] tabular-nums ${on ? "text-brand-ink/75" : "text-muted/80"}`}>{c.n}</span>
                              </button>
                            );
                          })}
                        </div>
                        {tab === "activas" && (
                          <div className="relative">
                            <label htmlFor="orden" className="sr-only">Ordenar solicitudes</label>
                            <ArrowUpDown aria-hidden="true" className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
                            <select
                              id="orden"
                              value={sort}
                              onChange={(e) => setSort(e.target.value)}
                              className="h-9 cursor-pointer appearance-none rounded-[10px] border border-line bg-surface pl-8 pr-7 text-[13px] font-medium text-ink focus:border-brand-text focus:outline-none focus:ring-4 focus:ring-brand-text/15"
                            >
                              <option value="prioridad">Por prioridad</option>
                              <option value="recientes">Más recientes</option>
                            </select>
                            <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
                          </div>
                        )}
                      </div>
                    </div>

                    {tab === "historial" && (
                      <p className="mt-3 text-[13px] text-muted">
                        Consultá en cualquier momento cómo se resolvió cada caso y calificá la atención.
                      </p>
                    )}

                    {visible.length ? (
                      <ul className="mt-4 flex flex-col gap-3">
                        {visible.map((t) => (
                          <li key={t.id} id={`tk-${t.id}`} className={t.id === highlight ? "animate-enter" : ""}>
                            {t.status === "Resuelto" ? (
                              <ResolvedCard
                                t={t}
                                now={now}
                                open={expanded === t.id}
                                onToggle={() => setExpanded((e) => (e === t.id ? null : t.id))}
                                highlight={t.id === highlight}
                                onRate={rateTicket}
                              />
                            ) : (
                              <ActiveCard
                                t={t}
                                now={now}
                                open={expanded === t.id}
                                onToggle={() => setExpanded((e) => (e === t.id ? null : t.id))}
                                highlight={t.id === highlight}
                              />
                            )}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="mt-4 flex flex-col items-center rounded-[12px] border border-dashed border-line bg-surface px-6 py-12 text-center">
                        <Inbox className="h-8 w-8 text-muted" aria-hidden="true" />
                        <p className="mt-3 font-display text-[16px] font-bold text-ink">No hay solicitudes con este filtro</p>
                        <p className="mt-1 text-[13.5px] text-muted">Probá con otra prioridad o borrá la búsqueda.</p>
                        <button
                          type="button"
                          onClick={() => { setFilter(null); setQuery(""); }}
                          className={`${btnSecondary} mt-4 h-9 px-3 text-[13px]`}
                        >
                          Ver todas
                        </button>
                      </div>
                    )}
                  </div>
                </section>

                {/* Semáforo + acompañamiento */}
                <aside className="order-1 flex flex-col gap-4 lg:order-2">
                  <SemaforoPanel counts={counts} active={filter} onSelect={setFilter} />
                  <div className="hidden lg:block">
                    <HelpPanel />
                  </div>
                </aside>
                <div className="order-3 lg:hidden">
                  <HelpPanel />
                </div>
              </div>
            </main>

            <footer className="border-t border-line">
              <div className="mx-auto flex max-w-[1120px] flex-col gap-1 px-4 py-5 text-[12.5px] text-muted sm:px-8 md:flex-row md:justify-between">
                <span>© 2026 TRAMA Soluciones Digitales · Proyecto NEXO · Programa Piloto de Innovación</span>
                <span>Prototipo académico · ISPC · Tecnicatura Superior en Desarrollo de Software</span>
              </div>
            </footer>
          </div>

          {drawerOpen && (
            <NewTicketDrawer
              takenIds={tickets.map((t) => t.id)}
              onClose={closeDrawer}
              onCreated={handleCreated}
              onViewTicket={viewTicket}
              setPath={setPath}
            />
          )}

          <Toasts toasts={toasts} onDismiss={(id) => setToasts((ts) => ts.filter((x) => x.id !== id))} />
        </div>
      </div>
    </div>
  );
}
