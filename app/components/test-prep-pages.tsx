"use client";

import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { BackButton } from "@/app/components/back-button";
import { LottieMascot } from "@/app/components/lottie-mascot";
import { cn, Icon, PrimaryButton, SecondaryButton } from "@/app/components/ui";
import { ApiError } from "@/services/apiClient";
import type { ReusableTestPrepMaterial, TestPrepMaterial, TestPrepMaterialType } from "@/services/dtos/test-prep";
import { testPrepReusableKey, useCreateTestPrepTrack, useReusableTestPrepMaterials, useStartTestPrepPractice, useTestPrepExams, useTestPrepTrack, useToggleTestPrepTask } from "@/services/hooks/useTestPrep";
import { getReusableTestPrepMaterials, uploadTestPrepFile } from "@/services/modules/test-prep";

type SubjectParams = { examId?: string; customSubject?: string; examName: string };

function queryFor(params: Record<string, string | undefined>) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => { if (value) query.set(key, value); });
  return query.toString();
}

function readSubject(search: ReturnType<typeof useSearchParams>): SubjectParams {
  return { examId: search.get("examId") ?? undefined, customSubject: search.get("customSubject") ?? undefined, examName: search.get("examName") ?? "your exam" };
}

function errorMessage(error: unknown) {
  if (error instanceof ApiError && error.data && typeof error.data === "object" && "detail" in error.data) return String(error.data.detail);
  return error instanceof Error ? error.message : "Something went wrong. Please try again.";
}

function isPremiumRequired(error: unknown) { return error instanceof ApiError && (error.status === 402 || error.status === 403); }
function isRateLimited(error: unknown) { return error instanceof ApiError && error.status === 429; }

function PageHeader({ title }: { title: string }) {
  return <header className="flex items-center gap-3"><BackButton /><h1 className="text-2xl font-black">{title}</h1></header>;
}

function Skeleton({ className }: { className?: string }) {
  return <span aria-hidden="true" className={cn("inline-block animate-pulse rounded-md bg-slate-200", className)} />;
}

export function TestPrepPicker() {
  const router = useRouter();
  const client = useQueryClient();
  const exams = useTestPrepExams();
  const [probing, setProbing] = useState<string>();
  const [customOpen, setCustomOpen] = useState(false);

  async function routeAfterProbe(subject: SubjectParams) {
    const key = subject.examId ?? `custom:${subject.customSubject}`;
    setProbing(key);
    let hasReusable = false;
    try {
      const data = await client.fetchQuery({ queryKey: testPrepReusableKey(subject), queryFn: () => getReusableTestPrepMaterials(subject) });
      hasReusable = data.items.length > 0;
    } catch {
      client.setQueryData(testPrepReusableKey(subject), { items: [] });
    }
    router.push(`/test-prep/${hasReusable ? "reuse" : "create"}?${queryFor(subject)}`);
  }

  return <div className="space-y-8">
    <PageHeader title="Test Prep" />
    <section className="rounded-3xl bg-gradient-to-br from-[#312E81] to-[#1E1B4B] p-6 text-white sm:p-8">
      <div className="flex items-center gap-4"><LottieMascot className="h-24 w-24 shrink-0" /><div><p className="text-sm font-bold text-white/65">Hi 👋</p><p className="mt-1 text-xl font-black">Let&apos;s build a focused plan.</p><p className="mt-1 text-sm text-white/75">Your exam date and materials shape every session.</p></div></div>
    </section>
    <section><h2 className="text-2xl font-black">Which exam are we prepping for today?</h2>
      {exams.isLoading ? <div className="mt-5 flex flex-wrap gap-3" aria-label="Loading exams">{["w-24","w-32","w-20","w-28","w-24","w-32"].map((width, i) => <Skeleton className={cn("h-12 rounded-full", width)} key={i} />)}</div> : exams.isError ? <p className="mt-4 rounded-xl bg-red-50 p-4 text-sm font-semibold text-red-700">Couldn&apos;t load the exam catalog. <button className="underline" onClick={() => void exams.refetch()}>Try again</button></p> :
      <div className="mt-5 flex flex-wrap gap-3">{exams.data?.map((exam) => <button className="inline-flex min-h-12 items-center gap-2 rounded-full border border-slate-200 bg-white px-5 text-sm font-black shadow-sm hover:border-[#818CF8] disabled:opacity-50" disabled={Boolean(probing)} key={exam.id} onClick={() => void routeAfterProbe({ examId: exam.id, examName: exam.name })}>{probing === exam.id && <Skeleton className="h-4 w-4 rounded-full bg-slate-300" />}{exam.name}</button>)}
        <button className="min-h-12 rounded-full border border-dashed border-[#818CF8] bg-[#EEF2FF] px-5 text-sm font-black text-[#312E81] disabled:opacity-50" disabled={Boolean(probing)} onClick={() => setCustomOpen(true)}>+ Something else</button>
      </div>}
    </section>
    {customOpen && <CustomSubjectModal onClose={() => setCustomOpen(false)} onSubmit={(value) => void routeAfterProbe({ customSubject: value, examName: value })} />}
  </div>;
}

function CustomSubjectModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (value: string) => void }) {
  const [value, setValue] = useState(""); const valid = value.trim().length >= 2 && value.trim().length <= 80;
  return <div className="fixed inset-0 z-50 flex items-end bg-slate-950/40 p-3 sm:items-center sm:justify-center" role="dialog" aria-modal="true"><form className="w-full rounded-3xl bg-white p-6 shadow-xl sm:max-w-md" onSubmit={(e) => { e.preventDefault(); if (valid) onSubmit(value.trim()); }}><h2 className="text-xl font-black">What are you preparing for?</h2><p className="mt-2 text-sm font-semibold text-slate-500">Enter a subject or exam name.</p><input autoFocus className="mt-5 h-12 w-full rounded-xl border border-slate-300 px-4 outline-none focus:border-[#312E81]" maxLength={80} minLength={2} onChange={(e) => setValue(e.target.value)} placeholder="e.g. UK driving theory" value={value} /><p className="mt-2 text-right text-xs text-slate-400">{value.length}/80</p><div className="mt-5 flex gap-3"><SecondaryButton className="flex-1" onClick={onClose}>Cancel</SecondaryButton><PrimaryButton className="flex-1" disabled={!valid} type="submit">Continue</PrimaryButton></div></form></div>;
}

export function TestPrepReuse() {
  const router = useRouter(); const search = useSearchParams(); const subject = readSubject(search);
  const query = useReusableTestPrepMaterials(subject); const [excluded, setExcluded] = useState<Set<number>>(new Set());
  const items = query.data?.items ?? [];
  const selectedCount = items.length - excluded.size;
  function continueToCreate(chosen: ReusableTestPrepMaterial[]) { router.replace(`/test-prep/create?${queryFor({ ...subject, preselected: JSON.stringify(chosen.map((item) => item.material)) })}`); }
  return <div className="space-y-7 pb-24"><PageHeader title={subject.examName} /><section><p className="text-xs font-black tracking-[.18em] text-[#CA8A04]">WE FOUND SOMETHING</p><h2 className="mt-2 text-2xl font-black">You&apos;ve used {items.length} material{items.length === 1 ? "" : "s"} for {subject.examName} before.</h2></section>
    {query.isLoading ? <div className="space-y-3">{[0,1,2].map(i => <div className="h-20 animate-pulse rounded-2xl bg-slate-200" key={i} />)}</div> : query.isError ? <p className="rounded-2xl bg-amber-50 p-5 font-semibold text-amber-800">Couldn&apos;t load your past materials — you can still continue.</p> : <div className="space-y-3">{items.map((item, index) => { const material = item.material; return <label className="flex cursor-pointer items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm" key={item.id ?? `${material.ref}-${index}`}><Icon name={materialIcon(material.type)} className="h-6 w-6 text-[#312E81]" /><span className="min-w-0 flex-1"><b className="block truncate">{material.label ?? item.label ?? material.ref}</b><small className="text-slate-500">{material.type.toUpperCase()} · used {timeAgo(item.used_at)} · {item.track_count ?? 1} tracks</small></span><input checked={!excluded.has(index)} className="h-5 w-5 accent-[#312E81]" onChange={() => setExcluded(prev => { const next = new Set(prev); if (next.has(index)) next.delete(index); else next.add(index); return next; })} type="checkbox" /></label>; })}</div>}
    <div className="fixed inset-x-0 bottom-[73px] z-20 border-t border-slate-200 bg-white/95 p-3 backdrop-blur lg:bottom-0 lg:left-72"><div className="mx-auto flex max-w-3xl gap-3"><SecondaryButton className="flex-1" onClick={() => continueToCreate([])}>Upload something new instead</SecondaryButton><PrimaryButton className="flex-1" disabled={!selectedCount} onClick={() => continueToCreate(items.filter((_, i) => !excluded.has(i)))}>Use {selectedCount} materials</PrimaryButton></div></div>
  </div>;
}

const SOURCE_OPTIONS: { type: TestPrepMaterialType; label: string; icon: Parameters<typeof Icon>[0]["name"] }[] = [
  { type: "url", label: "URL", icon: "upload" }, { type: "pdf", label: "PDF", icon: "file" }, { type: "scan", label: "Scan", icon: "scan" }, { type: "photo", label: "Photo", icon: "image" }, { type: "text", label: "Text", icon: "notes" }, { type: "youtu", label: "YouTube", icon: "play" },
];

export function TestPrepCreate() {
  const router = useRouter(); const search = useSearchParams(); const subject = readSubject(search);
  const [examDate, setExamDate] = useState(""); const [materials, setMaterials] = useState<TestPrepMaterial[]>(() => parseMaterials(search.get("preselected"))); const [pending, setPending] = useState<string[]>([]); const [inputType, setInputType] = useState<TestPrepMaterialType>(); const [error, setError] = useState("");
  async function upload(file: File, type: TestPrepMaterialType) { setError(""); setPending(p => [...p, file.name]); try { const id = await uploadTestPrepFile(file); setMaterials(p => [...p, { type, ref: id, label: file.name }]); } catch (err) { setError(errorMessage(err)); } finally { setPending(p => p.filter(name => name !== file.name)); } }
  function choose(type: TestPrepMaterialType) { if (["url","text","youtu"].includes(type)) setInputType(type); }
  const canGenerate = materials.length > 0 && Boolean(examDate) && pending.length === 0;
  return <div className="space-y-8 pb-24"><PageHeader title="Test Prep" /><section><p className="text-xs font-black tracking-[.18em] text-[#CA8A04]">PREP TRACK</p><h2 className="mt-2 text-3xl font-black">Set up your {subject.examName} plan.</h2></section><section><label className="text-xs font-black tracking-[.16em] text-slate-500">EXAM DATE</label><input className="mt-3 h-12 w-full rounded-xl border border-slate-300 bg-white px-4 font-semibold" min={new Date().toISOString().slice(0,10)} onChange={e => setExamDate(e.target.value)} required type="date" value={examDate} /></section>
    <section><p className="text-xs font-black tracking-[.16em] text-slate-500">MATERIALS</p><p className="mt-2 text-sm font-semibold text-slate-500">Optional. Skip and we&apos;ll build a standard curriculum sprint.</p><div className="mt-4 space-y-2">{materials.map((m,i) => <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3" key={`${m.ref}-${i}`}><Icon name={materialIcon(m.type)} className="h-5 w-5" /><span className="min-w-0 flex-1 truncate font-semibold">{m.label ?? m.ref}</span><small className="rounded-full bg-slate-100 px-2 py-1 font-bold">{m.type.toUpperCase()}</small><button aria-label={`Remove ${m.label ?? "material"}`} onClick={() => setMaterials(p => p.filter((_,x) => x !== i))}><Icon name="x" className="h-4 w-4" /></button></div>)}{pending.map(name => <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 text-slate-500" key={name}><Skeleton className="h-8 w-8 rounded-lg" /><span className="flex-1"><span className="block truncate text-sm font-semibold">{name}</span><Skeleton className="mt-1 h-2.5 w-24" /></span><small className="font-black">UPLOADING…</small></div>)}</div>
      <div className="mt-4 flex flex-wrap gap-2">{SOURCE_OPTIONS.map(option => option.type === "pdf" || option.type === "photo" || option.type === "scan" ? <label className="cursor-pointer rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-black shadow-sm" key={option.type}><input accept={option.type === "pdf" ? "application/pdf" : "image/*"} capture={option.type === "scan" ? "environment" : undefined} className="hidden" onChange={e => { const f=e.target.files?.[0]; if(f) void upload(f, option.type); e.target.value=""; }} type="file"/><Icon name={option.icon} className="mr-2 inline h-4 w-4" />{option.label}</label> : <button className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-black shadow-sm" key={option.type} onClick={() => choose(option.type)}><Icon name={option.icon} className="mr-2 inline h-4 w-4" />{option.label}</button>)}</div>{error && <p className="mt-3 rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p>}</section>
    {inputType && <MaterialInputModal type={inputType} onClose={() => setInputType(undefined)} onSubmit={m => { setMaterials(p => [...p,m]); setInputType(undefined); }} />}
    <div className="fixed inset-x-0 bottom-[73px] z-20 border-t border-slate-200 bg-white/95 p-3 lg:bottom-0 lg:left-72"><PrimaryButton className="mx-auto flex w-full max-w-3xl" disabled={!canGenerate} onClick={() => router.push(`/test-prep/generating?${queryFor({ ...subject, examDate, materials: JSON.stringify(materials) })}`)}>Generate plan</PrimaryButton></div>
  </div>;
}

function MaterialInputModal({ type, onClose, onSubmit }: { type: TestPrepMaterialType; onClose: () => void; onSubmit: (m: TestPrepMaterial) => void }) {
  const [value,setValue]=useState(""); const label=type === "text" ? "Paste your notes" : type === "youtu" ? "YouTube URL" : "Web URL";
  return <div className="fixed inset-0 z-50 flex items-end bg-slate-950/40 p-3 sm:items-center sm:justify-center"><form className="w-full rounded-3xl bg-white p-6 sm:max-w-lg" onSubmit={e => {e.preventDefault(); if(value.trim()) onSubmit({type,ref:value.trim(),label:type === "text" ? "Pasted notes" : value.trim()});}}><h2 className="text-xl font-black">{label}</h2>{type === "text" ? <textarea autoFocus className="mt-4 min-h-40 w-full rounded-xl border p-4" onChange={e=>setValue(e.target.value)} value={value}/> : <input autoFocus className="mt-4 h-12 w-full rounded-xl border px-4" onChange={e=>setValue(e.target.value)} placeholder="https://…" type="url" value={value}/>}<div className="mt-4 flex gap-3"><SecondaryButton className="flex-1" onClick={onClose}>Cancel</SecondaryButton><PrimaryButton className="flex-1" disabled={!value.trim()} type="submit">Attach</PrimaryButton></div></form></div>;
}

const GENERATING_STAGES = [["Reading your material","Finding the ideas that matter."],["Connecting the dots","Building links between each topic."],["Tuning to your level","Balancing challenge and confidence."],["Assembling your practice","Putting your prep track together."]] as const;

export function TestPrepGenerating() {
  const router=useRouter(); const search=useSearchParams(); const subject=readSubject(search); const examDate=search.get("examDate") ?? ""; const materials=parseMaterials(search.get("materials")); const mutation=useCreateTestPrepTrack(); const fired=useRef(false); const [stage,setStage]=useState(0);
  useEffect(() => { const timer=window.setInterval(()=>setStage(s=>Math.min(3,s+1)),2600); return()=>window.clearInterval(timer); },[]);
  useEffect(() => { if(fired.current) return; fired.current=true; if(!examDate || (!subject.examId && !subject.customSubject)){ window.alert("Missing details"); router.back(); return; } mutation.mutate({exam_id:subject.examId,custom_subject:subject.customSubject,exam_date:examDate,materials},{onSuccess:track=>router.replace(`/test-prep/ready?${queryFor({trackId:track.id,examName:track.exam_name || subject.examName})}`),onError:error=>{if(isPremiumRequired(error)) router.replace("/paywall"); else {window.alert(isRateLimited(error)?"Slow down a moment":"Couldn't build your track"); router.back();}}}); },[examDate, materials, mutation, router, subject]);
  return <div className="mx-auto max-w-xl py-8 text-center"><div className="relative mx-auto h-36 w-36 rounded-full bg-[#EEF2FF]"><LottieMascot className="h-full w-full" /></div><h1 className="mt-6 text-3xl font-black">{GENERATING_STAGES[stage][0]}</h1><p className="mt-2 font-semibold text-slate-500">{GENERATING_STAGES[stage][1]}</p><section className="mt-8 rounded-2xl bg-white p-6 text-left shadow-sm"><p className="text-xs font-black tracking-[.16em] text-slate-500">PROGRESS {stage+1}/4</p><div className="mt-4 space-y-4">{GENERATING_STAGES.map(([title],i)=><div className="flex items-center gap-3" key={title}><span className={cn("grid h-7 w-7 place-items-center rounded-full",i<stage?"bg-emerald-500 text-white":i===stage?"bg-[#FACC15]":"bg-slate-100 text-slate-400")}>{i<stage?<Icon name="check" className="h-4 w-4"/>:i===stage?<Skeleton className="h-3 w-3 rounded-full bg-white/80"/>:i+1}</span><b>{title}</b></div>)}</div></section><p className="mt-6 text-sm font-semibold text-slate-500">We&apos;ll let you know the moment it&apos;s ready.</p></div>;
}

export function TestPrepReady() { const router=useRouter(); const s=useSearchParams(); const id=s.get("trackId")??""; const name=s.get("examName")??"your exam"; return <div className="mx-auto max-w-xl py-10 text-center"><LottieMascot className="mx-auto h-40 w-40"/><p className="mt-4 text-xs font-black tracking-[.18em] text-[#CA8A04]">YOUR PREP TRACK</p><h1 className="mt-2 text-4xl font-black">It&apos;s ready!</h1><p className="mt-3 font-semibold text-slate-500">Your {name} practice plan is waiting.</p><div className="mt-8 grid gap-3 sm:grid-cols-2"><SecondaryButton onClick={()=>router.replace(`/test-prep/detail?id=${encodeURIComponent(id)}`)}>Review questions</SecondaryButton><PrimaryButton onClick={()=>router.replace(`/test-prep/practice?${queryFor({trackId:id,subject:name})}`)}>Practice now!</PrimaryButton></div></div>; }

export function TestPrepDetail() {
  const router=useRouter(); const id=useSearchParams().get("id")??""; const track=useTestPrepTrack(id); const toggle=useToggleTestPrepTask(id); const practice=useStartTestPrepPractice();
  if(track.isLoading) return <div className="space-y-6" aria-label="Loading prep track"><div className="flex items-center gap-3"><Skeleton className="h-11 w-11 rounded-full"/><Skeleton className="h-8 w-48"/></div><Skeleton className="h-40 w-full rounded-3xl bg-slate-300"/><Skeleton className="h-7 w-36"/><div className="space-y-3">{[0,1,2].map(i=><Skeleton className="h-20 w-full rounded-2xl" key={i}/>)}</div></div>; if(track.isError||!track.data) return <div className="rounded-2xl bg-white p-8 text-center"><h1 className="text-xl font-black">Track not found</h1></div>;
  const data=track.data; const readiness=Math.round(Math.max(0,Math.min(1,data.readiness))*100);
  function start(){practice.mutate(id,{onSuccess:r=>router.push(`/quiz?${queryFor({quizId:r.quiz_id,attemptId:r.attempt_id,subject:data.exam_name})}`),onError:e=>{if(isPremiumRequired(e))router.replace("/paywall");else window.alert(isRateLimited(e)?"Slow down a moment":errorMessage(e));}});}
  return <div className="space-y-7"><PageHeader title={data.title || data.exam_name}/><section className="rounded-3xl bg-gradient-to-br from-[#312E81] to-[#1E1B4B] p-6 text-white"><div className="flex items-center justify-between"><div><p className="text-4xl font-black">{daysUntil(data.exam_date)}</p><p className="font-bold text-white/70">days to go · {formatDate(data.exam_date)}</p></div><div className="grid h-24 w-24 place-items-center rounded-full border-8 border-[#FACC15]"><b>{readiness}%</b></div></div></section><section><h2 className="text-xl font-black">Today&apos;s tasks</h2><div className="mt-3 space-y-2">{data.today_tasks.map(task=>{const done=task.done??task.completed;return <button className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm" disabled={toggle.isPending} key={task.id} onClick={()=>toggle.mutate(task.id)}><Icon name={task.kind==="quiz"?"bolt":task.kind==="revision"?"reset":"book"} className="h-5 w-5"/><span className="flex-1"><b className="block">{task.title}</b><small className="uppercase text-slate-500">{task.kind}</small></span><span className={cn("grid h-8 w-8 place-items-center rounded-full",done?"bg-emerald-500 text-white":"bg-[#FACC15]")}><Icon name={done?"check":"play"} className="h-4 w-4"/></span></button>})}</div></section>{data.materials.length>0&&<section><h2 className="text-xl font-black">Materials</h2><div className="mt-3 space-y-2">{data.materials.map((m,i)=><div className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm" key={`${m.ref}-${i}`}><Icon name={materialIcon(m.type)} className="h-5 w-5"/><span className="flex-1 truncate font-semibold">{m.label??m.ref}</span><small className="rounded-full bg-slate-100 px-2 py-1 font-bold">{m.type.toUpperCase()}</small></div>)}</div></section>}<div className="grid gap-3 sm:grid-cols-2"><PrimaryButton disabled={practice.isPending} onClick={start}>{practice.isPending?<Skeleton className="h-4 w-20 bg-white/50"/>:"Take a practice quiz"}</PrimaryButton><SecondaryButton onClick={()=>router.push("/focus")}>Start today&apos;s session</SecondaryButton></div></div>;
}

export function TestPrepPractice() {
  const router=useRouter(); const s=useSearchParams(); const id=s.get("trackId")??""; const subject=s.get("subject")??""; const review=s.get("view")==="review"; const mutation=useStartTestPrepPractice(); const fired=useRef(false); const [line,setLine]=useState(0); const lines=["Finding the right questions","Balancing the difficulty","Preparing your practice"];
  useEffect(()=>{if(review)return;const timer=window.setInterval(()=>setLine(i=>(i+1)%lines.length),2200);return()=>window.clearInterval(timer);},[review,lines.length]);
  useEffect(()=>{if(review||fired.current)return;fired.current=true;if(!id){router.back();return;}mutation.mutate(id,{onSuccess:r=>router.replace(`/quiz?${queryFor({quizId:r.quiz_id,attemptId:r.attempt_id,subject})}`),onError:e=>{if(isPremiumRequired(e))router.replace("/paywall");else{window.alert(isRateLimited(e)?"Slow down a moment":errorMessage(e));router.back();}}});},[id,mutation,review,router,subject]);
  if(review)return <div className="mx-auto max-w-lg rounded-2xl bg-white p-8 text-center shadow-sm"><h1 className="text-2xl font-black">Review isn&apos;t available yet</h1><p className="mt-2 text-slate-500">Attempt-level review is coming soon.</p></div>;
  return <div className="mx-auto max-w-xl py-10 text-center"><span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-[#FACC15]"><Icon name="bolt" className="h-8 w-8"/></span><h1 className="mt-5 text-2xl font-black">{lines[line]}</h1><div className="mx-auto mt-4 flex w-28 gap-2" aria-label="Preparing practice"><Skeleton className="h-2 flex-1"/><Skeleton className="h-2 flex-1 [animation-delay:150ms]"/><Skeleton className="h-2 flex-1 [animation-delay:300ms]"/></div><div className="mt-8 space-y-3">{[0,1,2].map(i=><div className="h-20 animate-pulse rounded-2xl bg-slate-200" key={i}/>)}</div></div>;
}

function parseMaterials(raw: string | null): TestPrepMaterial[] { if(!raw)return[];try{const value=JSON.parse(raw);return Array.isArray(value)?value:[];}catch{return[];} }
function materialIcon(type: TestPrepMaterialType): Parameters<typeof Icon>[0]["name"] { return type==="pdf"?"file":type==="scan"?"scan":type==="photo"?"image":type==="text"?"notes":type==="youtu"?"play":"upload"; }
function timeAgo(value?: string){if(!value)return"recently";const days=Math.max(0,Math.floor((Date.now()-new Date(value).getTime())/86400000));return days===0?"today":days===1?"yesterday":`${days} days ago`;}
function daysUntil(value:string){return Math.max(0,Math.ceil((new Date(`${value}T00:00:00`).getTime()-Date.now())/86400000));}
function formatDate(value:string){return new Intl.DateTimeFormat(undefined,{day:"numeric",month:"short",year:"numeric"}).format(new Date(`${value}T00:00:00`));}
