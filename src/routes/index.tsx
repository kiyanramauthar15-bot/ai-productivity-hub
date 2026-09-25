import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  Bot,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Clock3,
  Copy,
  FileText,
  Inbox,
  LayoutDashboard,
  Menu,
  PenLine,
  Plus,
  RefreshCw,
  Send,
  Settings,
  Sparkles,
  Target,
  WandSparkles,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AI Workplace Productivity Assistant" },
      { name: "description", content: "Draft emails, summarize meetings, and plan focused work with an intelligent productivity workspace." },
      { property: "og:title", content: "AI Workplace Productivity Assistant" },
      { property: "og:description", content: "A focused workspace for smarter emails, clearer meetings, and practical plans." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type View = "dashboard" | "email" | "meeting" | "planner" | "settings";
type Activity = { title: string; meta: string; type: View };
type PlanItem = { id: number; time: string; title: string; detail: string; priority: string; done: boolean };

const navItems = [
  { id: "dashboard" as View, label: "Dashboard", icon: LayoutDashboard },
  { id: "email" as View, label: "Email Generator", icon: Send },
  { id: "meeting" as View, label: "Meeting Summarizer", icon: FileText },
  { id: "planner" as View, label: "Task Planner", icon: CalendarDays },
  { id: "settings" as View, label: "Settings", icon: Settings },
];

function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  useEffect(() => {
    const saved = localStorage.getItem(key);
    if (saved) {
      try { setValue(JSON.parse(saved)); } catch { /* keep initial value */ }
    }
  }, [key]);
  useEffect(() => { localStorage.setItem(key, JSON.stringify(value)); }, [key, value]);
  return [value, setValue] as const;
}

function Index() {
  const [view, setView] = useState<View>("dashboard");
  const [menuOpen, setMenuOpen] = useState(false);
  const [activities, setActivities] = useLocalStorage<Activity[]>("workwise-activity", []);
  const [copied, setCopied] = useState("");

  const go = (next: View) => { setView(next); setMenuOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const addActivity = (activity: Activity) => setActivities((items) => [activity, ...items].slice(0, 5));
  const copyText = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    window.setTimeout(() => setCopied(""), 1800);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Sidebar view={view} go={go} open={menuOpen} close={() => setMenuOpen(false)} />
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-surface/90 px-5 backdrop-blur-xl lg:px-10">
          <button className="icon-button lg:hidden" onClick={() => setMenuOpen(true)} aria-label="Open navigation"><Menu size={21} /></button>
          <div className="hidden text-sm text-muted-foreground lg:block">Your intelligent workspace</div>
          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-2 rounded-full bg-success-soft px-3 py-1.5 text-xs font-semibold text-success sm:flex"><span className="h-2 w-2 rounded-full bg-success" />AI assistant ready</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">KR</div>
          </div>
        </header>
        <main className="mx-auto max-w-[1440px] p-5 pb-24 md:p-8 lg:p-10">
          {view === "dashboard" && <Dashboard go={go} activities={activities} />}
          {view === "email" && <EmailGenerator addActivity={addActivity} copyText={copyText} copied={copied} />}
          {view === "meeting" && <MeetingSummarizer addActivity={addActivity} copyText={copyText} copied={copied} />}
          {view === "planner" && <TaskPlanner addActivity={addActivity} />}
          {view === "settings" && <SettingsPage />}
        </main>
      </div>
    </div>
  );
}

function Sidebar({ view, go, open, close }: { view: View; go: (v: View) => void; open: boolean; close: () => void }) {
  return <>
    {open && <button aria-label="Close navigation" className="fixed inset-0 z-40 bg-overlay lg:hidden" onClick={close} />}
    <aside className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-sidebar-border bg-sidebar px-4 py-5 transition-transform duration-300 lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
      <div className="mb-8 flex items-center justify-between px-2">
        <button onClick={() => go("dashboard")} className="flex items-center gap-3 text-left">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-brand"><WandSparkles size={21} /></span>
          <span><strong className="block text-base leading-none">Workwise AI</strong><span className="mt-1 block text-[11px] font-medium text-muted-foreground">Productivity assistant</span></span>
        </button>
        <button className="icon-button lg:hidden" onClick={close} aria-label="Close navigation"><X size={19} /></button>
      </div>
      <nav className="space-y-1">
        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">Workspace</p>
        {navItems.map((item) => <button key={item.id} onClick={() => go(item.id)} className={`nav-item ${view === item.id ? "nav-item-active" : ""}`}><item.icon size={19} /><span>{item.label}</span>{view === item.id && <ChevronRight className="ml-auto" size={16} />}</button>)}
      </nav>
      <div className="mt-auto rounded-xl border border-sidebar-border bg-sidebar-accent p-4">
        <div className="mb-2 flex items-center gap-2 text-xs font-bold text-sidebar-foreground"><Bot size={16} className="text-primary" />Responsible AI</div>
        <p className="text-[11px] leading-relaxed text-muted-foreground">Always review AI-generated content before sharing or acting on it.</p>
      </div>
    </aside>
  </>;
}

function PageIntro({ eyebrow, title, description, icon }: { eyebrow: string; title: string; description: string; icon: ReactNode }) {
  return <div className="mb-8 flex items-start gap-4"><div className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">{icon}</div><div><p className="mb-1 text-xs font-bold uppercase tracking-[0.15em] text-primary">{eyebrow}</p><h1 className="text-2xl font-bold tracking-tight md:text-3xl">{title}</h1><p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">{description}</p></div></div>;
}

function Dashboard({ go, activities }: { go: (v: View) => void; activities: Activity[] }) {
  const stats = [
    { label: "Emails drafted", value: activities.filter(a => a.type === "email").length, icon: Send, color: "text-primary", bg: "bg-primary-soft" },
    { label: "Meetings summarized", value: activities.filter(a => a.type === "meeting").length, icon: FileText, color: "text-accent", bg: "bg-accent-soft" },
    { label: "Plans created", value: activities.filter(a => a.type === "planner").length, icon: CalendarDays, color: "text-success", bg: "bg-success-soft" },
  ];
  return <div className="animate-enter">
    <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><p className="mb-2 text-sm font-semibold text-primary">Friday, 25 September</p><h1 className="text-3xl font-bold tracking-tight md:text-4xl">Good afternoon, Kiyan</h1><p className="mt-2 text-muted-foreground">Turn busywork into focused progress.</p></div><button className="primary-button" onClick={() => go("email")}><Sparkles size={17} />Create with AI</button></div>
    <section className="mb-8 grid gap-4 md:grid-cols-3">
      {stats.map(s => <div className="metric-card" key={s.label}><div className={`metric-icon ${s.bg} ${s.color}`}><s.icon size={20} /></div><div><p className="text-3xl font-bold">{s.value}</p><p className="mt-1 text-sm text-muted-foreground">{s.label}</p></div></div>)}
    </section>
    <section className="mb-8"><div className="mb-4 flex items-center justify-between"><h2 className="section-title">Quick actions</h2><span className="text-xs text-muted-foreground">Choose a tool to begin</span></div><div className="grid gap-4 md:grid-cols-3">
      <QuickCard icon={<Send size={23} />} title="Write an email" text="Create polished messages in the right tone." label="Start drafting" onClick={() => go("email")} tone="primary" />
      <QuickCard icon={<FileText size={23} />} title="Summarize notes" text="Find decisions and next steps instantly." label="Add meeting notes" onClick={() => go("meeting")} tone="accent" />
      <QuickCard icon={<CalendarDays size={23} />} title="Plan your workload" text="Build a realistic, prioritized schedule." label="Create a plan" onClick={() => go("planner")} tone="success" />
    </div></section>
    <section className="panel"><div className="flex items-center justify-between border-b border-border px-5 py-4 md:px-6"><h2 className="section-title">Recent activity</h2><Clock3 size={18} className="text-muted-foreground" /></div>
      {activities.length ? <div className="divide-y divide-border">{activities.map((a, i) => { const N = navItems.find(n => n.id === a.type)?.icon ?? Sparkles; return <button key={`${a.title}-${i}`} onClick={() => go(a.type)} className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-muted/50 md:px-6"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-muted-foreground"><N size={17} /></span><span className="min-w-0 flex-1"><strong className="block truncate text-sm">{a.title}</strong><span className="text-xs text-muted-foreground">{a.meta}</span></span><ChevronRight size={16} className="text-muted-foreground" /></button>})}</div> : <EmptyState icon={<Inbox size={28} />} title="Your work will appear here" text="Generate an email, summary, or plan to start building your activity history." />}
    </section>
  </div>;
}

function QuickCard({ icon, title, text, label, onClick, tone }: { icon: ReactNode; title: string; text: string; label: string; onClick: () => void; tone: string }) {
  return <button onClick={onClick} className="quick-card group"><span className={`quick-icon quick-${tone}`}>{icon}</span><h3 className="mt-5 text-lg font-bold">{title}</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p><span className="mt-5 flex items-center gap-2 text-sm font-bold text-primary">{label}<ArrowRight size={16} className="transition-transform group-hover:translate-x-1" /></span></button>;
}

function EmailGenerator({ addActivity, copyText, copied }: { addActivity: (a: Activity) => void; copyText: (t: string, k: string) => void; copied: string }) {
  const [recipient, setRecipient] = useState(""); const [purpose, setPurpose] = useState(""); const [points, setPoints] = useState(""); const [tone, setTone] = useState("Formal"); const [output, setOutput] = useLocalStorage("workwise-email", ""); const [loading, setLoading] = useState(false); const [error, setError] = useState(""); const [version, setVersion] = useState(0);
  const generate = () => { if (!recipient.trim() || !purpose.trim() || !points.trim()) { setError("Add a recipient, purpose, and at least one key point."); return; } setError(""); setLoading(true); window.setTimeout(() => { const name = (recipient.trim().split(/[,@]/)[0] ?? "there").replace(/[._-]/g, " ").replace(/\b\w/g, c => c.toUpperCase()); const list = points.split(/\n|,/).map(p => p.trim()).filter(Boolean); const openings: Record<string,string[]> = { Formal: ["I hope this message finds you well.", "I’m writing to follow up regarding"], Friendly: ["I hope you’re having a great week!", "It was great connecting recently."], Persuasive: ["I’d like to share an opportunity that can create immediate value.", "I’m reaching out with a focused proposal regarding"] }; const close: Record<string,string> = { Formal: "Please let me know if you require any additional information. I look forward to your response.", Friendly: "Let me know what you think—I’d be happy to chat through the details.", Persuasive: "If this aligns with your priorities, I’d welcome 20 minutes this week to agree on the next step." }; const opener = openings[tone]?.[version % 2] ?? openings.Formal?.[0] ?? "I’m writing regarding"; const signoff = close[tone] ?? close.Formal ?? "I look forward to your response."; const body = list.map((p, i) => `${i + 1}. ${p.charAt(0).toUpperCase()}${p.slice(1)}`).join("\n"); const text = `Subject: ${purpose.trim()}\n\nHi ${name},\n\n${opener} ${version % 2 ? purpose.trim().toLowerCase() : "I’d like to discuss " + purpose.trim().toLowerCase()}.\n\nTo keep things clear, here are the key points:\n${body}\n\n${signoff}\n\nBest regards,\nKiyan`; setOutput(text); setVersion(v => v + 1); setLoading(false); addActivity({ title: `Email: ${purpose}`, meta: `${tone} tone · Just now`, type: "email" }); }, 900); };
  return <div className="animate-enter"><PageIntro eyebrow="Smart writing" title="Email Generator" description="Turn your key points into a clear, polished email that sounds like you." icon={<Send size={22} />} /><div className="tool-grid"><section className="panel p-5 md:p-7"><Field label="Recipient" hint="Name or email"><input value={recipient} onChange={e => setRecipient(e.target.value)} className="field" placeholder="e.g. Sarah Chen" /></Field><Field label="Subject or purpose"><input value={purpose} onChange={e => setPurpose(e.target.value)} className="field" placeholder="e.g. Project timeline follow-up" /></Field><Field label="Key points" hint="Separate ideas with a new line"><textarea value={points} onChange={e => setPoints(e.target.value)} className="field min-h-36 resize-y" placeholder={'Confirm revised launch date\nRequest final design approval\nSchedule a check-in'} /></Field><Field label="Tone"><div className="segmented">{["Formal","Friendly","Persuasive"].map(t => <button key={t} className={tone === t ? "segmented-active" : ""} onClick={() => setTone(t)}>{t}</button>)}</div></Field>{error && <p className="mb-4 text-sm font-medium text-destructive">{error}</p>}<button onClick={generate} disabled={loading} className="primary-button w-full">{loading ? <><RefreshCw className="animate-spin" size={17} />Writing your email…</> : <><Sparkles size={17} />Generate email</>}</button></section><ResultPanel title="Generated email" empty={!output} loading={loading} emptyIcon={<PenLine size={29} />} emptyText="Your professional email will appear here, ready to edit.">{output && !loading && <><textarea aria-label="Generated email" value={output} onChange={e => setOutput(e.target.value)} className="result-editor min-h-[400px]" /><div className="result-actions"><button className="secondary-button" onClick={() => copyText(output, "email")} >{copied === "email" ? <Check size={16} /> : <Copy size={16} />}{copied === "email" ? "Copied" : "Copy"}</button><button className="secondary-button" onClick={generate}><RefreshCw size={16} />Regenerate</button></div></>}</ResultPanel></div></div>;
}

function MeetingSummarizer({ addActivity, copyText, copied }: { addActivity: (a: Activity) => void; copyText: (t: string, k: string) => void; copied: string }) {
  const [notes, setNotes] = useState(""); const [loading, setLoading] = useState(false); const [sections, setSections] = useState<Record<string,string>>({});
  const generate = () => { if (notes.trim().length < 30) return; setLoading(true); window.setTimeout(() => { const sentences = notes.split(/\n|(?<=[.!?])\s+/).map(x => x.trim()).filter(Boolean); const actions = sentences.filter(s => /will|need to|action|follow up|send|prepare|complete|owner/i.test(s)); const decisions = sentences.filter(s => /decided|agreed|approved|confirmed|choose|selected/i.test(s)); const deadlines = sentences.filter(s => /monday|tuesday|wednesday|thursday|friday|week|tomorrow|deadline|by \w+|date/i.test(s)); setSections({ Summary: `The team discussed ${sentences.slice(0, 2).join(" ").replace(/^./, c => c.toLowerCase())}${sentences.length > 2 ? ` The conversation covered ${sentences.length} key discussion points with a focus on alignment and next steps.` : ""}`, "Action Items": actions.length ? actions.map(a => `• ${a}`).join("\n") : "• Confirm owners for the next steps discussed.\n• Share a written progress update with the team.", Decisions: decisions.length ? decisions.map(d => `• ${d}`).join("\n") : "• No explicit final decisions were recorded; confirm outcomes with attendees.", Deadlines: deadlines.length ? deadlines.map(d => `• ${d}`).join("\n") : "• No firm deadlines were mentioned; assign dates to each action item." }); setLoading(false); addActivity({ title: "Meeting notes summary", meta: `${sentences.length} points processed · Just now`, type: "meeting" }); }, 1000); };
  const all = Object.entries(sections).map(([k,v]) => `${k}\n${v}`).join("\n\n");
  return <div className="animate-enter"><PageIntro eyebrow="Meeting intelligence" title="Meeting Notes Summarizer" description="Extract the signal from raw notes and turn discussion into accountable next steps." icon={<FileText size={22} />} /><div className="tool-grid"><section className="panel p-5 md:p-7"><Field label="Meeting notes" hint={`${notes.length} characters`}><textarea value={notes} onChange={e => setNotes(e.target.value)} className="field min-h-[390px] resize-y" placeholder="Paste your meeting transcript or notes here…" /></Field><button disabled={loading || notes.trim().length < 30} onClick={generate} className="primary-button w-full">{loading ? <><RefreshCw className="animate-spin" size={17} />Finding the important parts…</> : <><Sparkles size={17} />Summarize meeting</>}</button>{notes.length > 0 && notes.trim().length < 30 && <p className="mt-3 text-xs text-muted-foreground">Add a little more detail for an accurate summary.</p>}</section><ResultPanel title="Structured summary" empty={!Object.keys(sections).length} loading={loading} emptyIcon={<ClipboardCheck size={30} />} emptyText="Add your notes to reveal decisions, actions, and deadlines.">{Object.keys(sections).length > 0 && !loading && <><div className="space-y-3">{Object.entries(sections).map(([key,value]) => <div key={key} className="summary-section"><div className="mb-2 flex items-center gap-2"><span className="summary-dot" /><h3 className="text-sm font-bold">{key}</h3></div><textarea aria-label={key} value={value} onChange={e => setSections(s => ({...s,[key]:e.target.value}))} className="summary-editor" rows={Math.max(2, value.split("\n").length)} /></div>)}</div><div className="result-actions"><button className="secondary-button" onClick={() => copyText(all,"summary")}>{copied === "summary" ? <Check size={16}/> : <Copy size={16}/>}{copied === "summary" ? "Copied" : "Copy all"}</button><button className="secondary-button" onClick={generate}><RefreshCw size={16}/>Regenerate</button></div></>}</ResultPanel></div></div>;
}

function TaskPlanner({ addActivity }: { addActivity: (a: Activity) => void }) {
  const [tasks, setTasks] = useState(""); const [hours, setHours] = useState(6); const [period, setPeriod] = useState("Daily"); const [loading, setLoading] = useState(false); const [plan, setPlan] = useLocalStorage<PlanItem[]>("workwise-plan", []);
  const generate = () => { if (!tasks.trim()) return; setLoading(true); window.setTimeout(() => { const parsed = tasks.split(/\n|,/).map(x => x.trim()).filter(Boolean); const start = 9; const block = Math.max(.5, Math.min(2, hours / Math.max(parsed.length, 1))); const days = ["Monday","Tuesday","Wednesday","Thursday","Friday"]; const built: PlanItem[] = parsed.map((task,i) => { const priority = /urgent|today|asap|critical/i.test(task) ? "Urgent" : i < Math.ceil(parsed.length / 2) ? "High" : "Normal"; const h = start + Math.floor(i * block); const mins = (i * block) % 1 ? "30" : "00"; return { id: Date.now()+i, time: period === "Daily" ? `${String(h).padStart(2,"0")}:${mins}` : days[i%5] ?? "Monday", title: task.replace(/urgent|asap/gi, "").trim(), detail: `${block}h focus block · ${priority === "Urgent" ? "Do first" : "Focused work"}`, priority, done: false }; }); setPlan(built); setLoading(false); addActivity({ title: `${period} task plan`, meta: `${built.length} tasks scheduled · Just now`, type: "planner" }); }, 950); };
  const updateTask = (id:number, value:string) => setPlan(p => p.map(x => x.id === id ? {...x,title:value}:x));
  return <div className="animate-enter"><PageIntro eyebrow="Focus planning" title="AI Task Planner" description="Balance urgency, importance, and available time in a schedule you can actually follow." icon={<CalendarDays size={22} />} /><div className="tool-grid"><section className="panel p-5 md:p-7"><Field label="Tasks and priorities" hint="One task per line"><textarea value={tasks} onChange={e => setTasks(e.target.value)} className="field min-h-56 resize-y" placeholder={'Urgent: Send client proposal\nReview campaign analytics\nPrepare Friday presentation'} /></Field><div className="grid grid-cols-2 gap-4"><Field label="Plan type"><div className="segmented">{["Daily","Weekly"].map(p => <button key={p} className={period===p?"segmented-active":""} onClick={()=>setPeriod(p)}>{p}</button>)}</div></Field><Field label="Available hours"><div className="stepper"><button onClick={()=>setHours(h=>Math.max(1,h-1))}>−</button><strong>{hours}h</strong><button onClick={()=>setHours(h=>Math.min(12,h+1))}>+</button></div></Field></div><button disabled={loading || !tasks.trim()} onClick={generate} className="primary-button mt-2 w-full">{loading ? <><RefreshCw className="animate-spin" size={17}/>Building your schedule…</> : <><Zap size={17}/>Create my plan</>}</button></section><ResultPanel title={`${period} schedule`} empty={!plan.length} loading={loading} emptyIcon={<Target size={30}/>} emptyText="Your prioritized schedule will appear here with focused time blocks.">{plan.length > 0 && !loading && <div className="timeline">{plan.map((item,i) => <div key={item.id} className={`timeline-item ${item.done?"opacity-55":""}`}><button aria-label="Mark complete" onClick={()=>setPlan(p=>p.map(x=>x.id===item.id?{...x,done:!x.done}:x))} className={`check-button ${item.done?"check-button-done":""}`}>{item.done && <Check size={14}/>}</button><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><span className="text-xs font-bold text-primary">{item.time}</span><span className={`priority ${item.priority.toLowerCase()}`}>{item.priority}</span></div><input aria-label={`Task ${i+1}`} className={`task-title ${item.done?"line-through":""}`} value={item.title} onChange={e=>updateTask(item.id,e.target.value)} /><p className="text-xs text-muted-foreground">{item.detail}</p></div></div>)}</div>}</ResultPanel></div></div>;
}

function SettingsPage() { const [saving,setSaving]=useState(false); const [prefs,setPrefs]=useLocalStorage("workwise-prefs",{name:"Kiyan",role:"Productivity lead",compact:false,autosave:true}); const save=()=>{setSaving(true);setTimeout(()=>setSaving(false),700)}; return <div className="animate-enter max-w-3xl"><PageIntro eyebrow="Workspace" title="Settings" description="Personalize how your assistant addresses you and keeps your work." icon={<Settings size={22}/>} /><section className="panel p-5 md:p-7"><h2 className="section-title mb-5">Profile</h2><div className="grid gap-4 sm:grid-cols-2"><Field label="Display name"><input className="field" value={prefs.name} onChange={e=>setPrefs({...prefs,name:e.target.value})}/></Field><Field label="Role"><input className="field" value={prefs.role} onChange={e=>setPrefs({...prefs,role:e.target.value})}/></Field></div><div className="my-6 border-t border-border"/><h2 className="section-title mb-4">Preferences</h2><Toggle label="Save drafts in this browser" text="Keep generated work available when you return." checked={prefs.autosave} set={v=>setPrefs({...prefs,autosave:v})}/><Toggle label="Compact results" text="Show more information in less space." checked={prefs.compact} set={v=>setPrefs({...prefs,compact:v})}/><button className="primary-button mt-6" onClick={save}>{saving?<><RefreshCw className="animate-spin" size={16}/>Saving…</>:<><CheckCircle2 size={16}/>Save preferences</>}</button></section></div>; }

function Toggle({label,text,checked,set}:{label:string;text:string;checked:boolean;set:(v:boolean)=>void}) { return <div className="flex items-center justify-between gap-4 border-b border-border py-4"><div><p className="text-sm font-semibold">{label}</p><p className="mt-1 text-xs text-muted-foreground">{text}</p></div><button role="switch" aria-checked={checked} onClick={()=>set(!checked)} className={`toggle ${checked?"toggle-on":""}`}><span /></button></div>; }
function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) { return <label className="mb-5 block"><span className="mb-2 flex items-center justify-between text-sm font-semibold"><span>{label}</span>{hint && <span className="text-xs font-normal text-muted-foreground">{hint}</span>}</span>{children}</label>; }
function ResultPanel({ title, empty, loading, emptyIcon, emptyText, children }: { title:string; empty:boolean; loading:boolean; emptyIcon:ReactNode; emptyText:string; children:ReactNode }) { return <section className="panel overflow-hidden"><div className="flex items-center justify-between border-b border-border px-5 py-4 md:px-6"><h2 className="section-title">{title}</h2><span className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground"><Sparkles size={14} className="text-primary"/>AI generated</span></div><div className="min-h-[420px] p-5 md:p-6">{loading?<LoadingState/>:empty?<EmptyState icon={emptyIcon} title="Ready when you are" text={emptyText}/>:children}</div></section>; }
function LoadingState() { return <div className="flex min-h-[360px] flex-col items-center justify-center text-center"><div className="relative mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-soft text-primary"><Sparkles size={24}/><span className="absolute inset-0 animate-ping rounded-2xl border border-primary/30"/></div><p className="font-semibold">Thinking through your input</p><p className="mt-2 text-sm text-muted-foreground">Structuring a useful, contextual result…</p><div className="mt-6 flex gap-1.5"><span className="loading-dot"/><span className="loading-dot [animation-delay:150ms]"/><span className="loading-dot [animation-delay:300ms]"/></div></div>; }
function EmptyState({icon,title,text}:{icon:ReactNode;title:string;text:string}) { return <div className="flex min-h-56 flex-col items-center justify-center px-5 text-center"><span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-muted text-muted-foreground">{icon}</span><h3 className="text-sm font-bold">{title}</h3><p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">{text}</p></div>; }