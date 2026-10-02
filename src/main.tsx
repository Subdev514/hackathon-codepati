import React from "react";
import{createRoot}from"react-dom/client";
import"./styles.css";
import{AnnouncementInput,ExtractedAnnouncement,Post,Task,createCampusStore,extractAnnouncement,commitExtraction,createCampusRepository,initialState,loadUserProfile,saveUserProfile,relevanceForUser,UserProfile,campusDeadlines,answerCampusQuery,demoProfile}from"./domain";\nimport{EventsPage,SocietyOpsPage,FeedbackPage}from"./society";

const repository=createCampusRepository();
const store=createCampusStore(repository.load());

const navItems=[["01","Home","⌂"],["02","For You","✦"],["03","Explore","◌"],["04","Events","▦"],["05","My Tasks","✓"],["06","Network","◎"],["07","Society Ops","▤"],["08","Feedback","◍"],["09","Settings","⚙"]];

function App(){
const pathname=window.location.pathname.replace(/\/+$/, "")||"/";
if(pathname!=="/")return <NotFoundPage/>;
const[tab,setTab]=React.useState("Home");
const[loading,setLoading]=React.useState(true);
const[settingsView,setSettingsView]=React.useState<"settings"|"privacy"|"terms">("settings");
const[theme,setTheme]=React.useState<"dark"|"light">(()=>window.localStorage.getItem("campus-os-theme")==="light"?"light":"dark");
React.useEffect(()=>{document.documentElement.dataset.theme=theme;window.localStorage.setItem("campus-os-theme",theme);document.querySelector('meta[name="theme-color"]')?.setAttribute("content",theme==="light"?"#f4f6f1":"#080908")},[theme]);
const[networkEntityId,setNetworkEntityId]=React.useState<string|undefined>();
React.useEffect(()=>{const handler=(event:Event)=>{const detail=(event as CustomEvent<string>).detail;if(navItems.some(([,name])=>name===detail))setTab(detail)};window.addEventListener("campus:navigate",handler);return()=>window.removeEventListener("campus:navigate",handler)},[]);
const[,refresh]=React.useState(0);
const[tasks,setTasks]=React.useState(store.getState().tasks);
const[query,setQuery]=React.useState("");
const[liked,setLiked]=React.useState<number[]>([]);
const[showCreate,setShowCreate]=React.useState(false);
const[showProfile,setShowProfile]=React.useState(false);
const[profile,setProfile]=React.useState<UserProfile>(loadUserProfile());
const[error,setError]=React.useState("");
const[copilotQuery,setCopilotQuery]=React.useState("");
const[preview,setPreview]=React.useState<ExtractedAnnouncement|null>(null);
const[form,setForm]=React.useState<AnnouncementInput>({title:"",body:"",type:"EVENT",author:"AI Club",club:"AI Club"});
const pageMeta:{title:string;description:string}={
Home:{title:"Campus OS — Connected Campus",description:"Campus OS turns scattered campus information into connected context, deadlines and actionable workflows."},
"For You":{title:"For You — Campus OS",description:"Personalized campus signals ranked around your interests, clubs, projects and context."},
Explore:{title:"Explore — Campus OS",description:"Explore campus events, opportunities, resources, notices, competitions and projects in one connected index."},
"My Tasks":{title:"My Tasks — Campus OS",description:"Manage actionable campus workflows and trace every task back to the campus information that created it."},
Network:{title:"Network — Campus OS",description:"Explore relationships between campus people, events, opportunities, resources, projects, deadlines and tasks."},
Events:{title:"Events — Campus OS",description:"Structured campus events with society, dates, eligibility, venues, deadlines and progress."},
"Society Ops":{title:"Society Operations — Campus OS",description:"Private society event operations, tasks, budgets, promotion and resources."},
Feedback:{title:"Feedback — Campus OS",description:"Categorical feedback and suggestions for campus events and societies."},
Settings:{title:"Settings — Campus OS",description:"Manage Campus OS appearance, privacy documentation, terms and product data-protection context."}
}[tab as "Home"|"For You"|"Explore"|"My Tasks"|"Network"|"Settings"];
React.useEffect(()=>{const id=requestAnimationFrame(()=>setLoading(false));return()=>cancelAnimationFrame(id)},[]);
React.useEffect(()=>{document.title=pageMeta.title;document.querySelector('meta[name="description"]')?.setAttribute("content",pageMeta.description);document.querySelector('meta[property="og:title"]')?.setAttribute("content",pageMeta.title);document.querySelector('meta[property="og:description"]')?.setAttribute("content",pageMeta.description);document.querySelector('meta[name="twitter:title"]')?.setAttribute("content",pageMeta.title);document.querySelector('meta[name="twitter:description"]')?.setAttribute("content",pageMeta.description);document.querySelector('link[rel="canonical"]')?.setAttribute("href",window.location.origin+"/");document.querySelector('meta[name="robots"]')?.setAttribute("content","index,follow")},[pageMeta.title,pageMeta.description]);
const state=store.getState();
const filtered=state.posts.filter(p=>(p.title+" "+p.body+" "+p.tags.join(" ")).toLowerCase().includes(query.toLowerCase()));
const sync=()=>{repository.save(store.getState());setTasks([...store.getState().tasks]);refresh(x=>x+1)};
const toggle=(id:number)=>{store.toggleTask(id);sync()};
const submitAnnouncement=()=>{if(!form.title.trim()||!form.body.trim())return;try{setError("");setPreview(extractAnnouncement(form))}catch(e){setError(e instanceof Error?e.message:"Could not understand announcement")}};
const confirmAnnouncement=()=>{if(!preview)return;try{setError("");commitExtraction(store,preview)}catch(e){setError(e instanceof Error?e.message:"Could not connect announcement");return}setPreview(null);setShowCreate(false);setForm({title:"",body:"",type:"EVENT",author:"AI Club",club:"AI Club"});setTab("Home");sync()};
const hour=new Date().getHours();
const greeting=hour<12?"Good morning":hour<18?"Good afternoon":"Good evening";
if(loading)return <LoadingScreen/>;
return <div className="app-shell">
<aside className="sidebar">
<div className="brand-mark"><div className="brand-symbol">C</div><div><strong>Campus OS</strong><span>CONNECTED CAMPUS</span></div></div>
<nav className="nav-list">{navItems.map(([num,name,icon])=><button key={name} className={"nav-item "+(tab===name?"active":"")} onClick={()=>setTab(name)}><span className="nav-num">{num}</span><span className="nav-icon">{icon}</span><span>{name}</span></button>)}</nav>
<div className="sidebar-pulse"><span className="pulse-dot"/><div><small>LIVE CAMPUS GRAPH</small><b>{state.entities.length} connected objects</b></div></div>
<div className="sidebar-bottom"><button className="profile-chip" onClick={()=>setShowProfile(true)}><span className="avatar">{profile.name.slice(0,1).toUpperCase()}</span><span><b>{profile.name}</b><small>{profile.branch} · Year {profile.year}</small></span><i>↗</i></button></div>
</aside>
<main className="main-stage">
<header className="topbar"><div className="crumb"><span>CAMPUS OS</span><b>/</b><strong>{tab}</strong></div><div className="top-actions"><label className="command-search"><span>⌕</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search campus"/></label><button className="icon-button" aria-label="Open personalized signals" onClick={()=>setTab("For You")}>◌</button><button className="create-button" onClick={()=>setShowCreate(true)}><span>+</span> Create</button></div></header>
{tab==="Home"&&<Home state={state} profile={profile} filtered={filtered} tasks={tasks} toggle={toggle} liked={liked} setLiked={setLiked} copilotQuery={copilotQuery} setCopilotQuery={setCopilotQuery} openCreate={()=>setShowCreate(true)} openTasks={()=>setTab("My Tasks")} openNetwork={id=>{setNetworkEntityId(id);setTab("Network")}}/>}
{tab==="For You"&&<ForYou state={state} profile={profile} filtered={filtered} tasks={tasks} toggle={toggle} editProfile={()=>setShowProfile(true)}/>}
{tab==="Explore"&&<Explore filtered={filtered} liked={liked} setLiked={setLiked}/>}
{tab==="My Tasks"&&<TasksPage state={state} tasks={tasks} toggle={toggle}/>}
{tab==="Network"&&<Relationship state={state} selectedId={networkEntityId}/>}\n{tab==="Events"&&<EventsPage state={state} mutate={fn=>{fn(store);sync()}}/>}\n{tab==="Society Ops"&&<SocietyOpsPage state={state} profile={profile} mutate={fn=>{fn(store);sync()}}/>}\n{tab==="Feedback"&&<FeedbackPage state={state} profile={profile} mutate={fn=>{fn(store);sync()}}/>}
{tab==="Settings"&&<SettingsPage view={settingsView} setView={setSettingsView} theme={theme} setTheme={setTheme} profile={profile} editProfile={()=>setShowProfile(true)}/>}
</main>
{error&&<div className="error-toast" role="alert">{error}<button onClick={()=>setError("")}>×</button></div>}
{showProfile&&<ProfileEditor profile={profile} save={next=>{setProfile(next);saveUserProfile(next);setShowProfile(false)}} close={()=>setShowProfile(false)}/>}
{showCreate&&<CreateAnnouncement form={form} setForm={setForm} preview={preview} submit={submitAnnouncement} confirm={confirmAnnouncement} close={()=>{setShowCreate(false);setPreview(null)}}/>}
</div>
}


function LoadingScreen(){
return <div className="loading-screen" role="status" aria-live="polite"><div className="loading-grid"/><div className="loading-core"><div className="loading-mark">C</div><span>INITIALIZING CAMPUS OS</span><b>CONNECTING CONTEXT</b><i><em/><em/><em/></i></div><small>LOCAL GRAPH · READYING WORKSPACE</small></div>
}
function NotFoundPage(){
React.useEffect(()=>{document.title="404 — Campus OS";document.querySelector('meta[name="description"]')?.setAttribute("content","The requested Campus OS route does not exist.");document.querySelector('meta[name="robots"]')?.setAttribute("content","noindex,nofollow");document.querySelector('link[rel="canonical"]')?.remove()},[]);
const[theme,setTheme]=React.useState<"dark"|"light">(()=>window.localStorage.getItem("campus-os-theme")==="light"?"light":"dark");
React.useEffect(()=>{document.documentElement.dataset.theme=theme;document.querySelector('meta[name="theme-color"]')?.setAttribute("content",theme==="light"?"#f4f6f1":"#080908")},[theme]);
return <div className="not-found-page"><div className="not-found-grid"/><div className="not-found-orbit orbit-a"/><div className="not-found-orbit orbit-b"/><div className="not-found-core"><span>ERROR / 404</span><b>Signal not found.</b><i>THE CAMPUS GRAPH HAS NO ROUTE FOR THIS LOCATION.</i></div><div className="not-found-copy"><div className="brand-mark compact"><div className="brand-symbol">C</div><div><strong>Campus OS</strong><span>CONNECTED CAMPUS</span></div></div><span className="signal-line">404 · LOST IN THE CAMPUS GRAPH</span><h1>This page<br/><em>doesn't exist.</em></h1><p>The route you requested is outside the current Campus OS workspace. Return to the command center and continue from there.</p><div className="not-found-actions"><a className="create-button large" href="/">RETURN TO CAMPUS <span>↗</span></a><button className="text-button" onClick={()=>setTheme(theme==="dark"?"light":"dark")}>{theme==="dark"?"Switch to light mode":"Switch to dark mode"}</button></div></div><div className="not-found-code">ERR_404 / NO_CONNECTED_OBJECT / {window.location.pathname}</div></div>
}

function Home({state,profile,filtered,tasks,toggle,liked,setLiked,copilotQuery,setCopilotQuery,openCreate,openTasks,openNetwork}:{state:ReturnType<typeof store.getState>;profile:UserProfile;filtered:Post[];tasks:Task[];toggle:(id:number)=>void;liked:number[];setLiked:React.Dispatch<React.SetStateAction<number[]>>;copilotQuery:string;setCopilotQuery:(v:string)=>void;openCreate:()=>void;openTasks:()=>void;openNetwork:(id:string)=>void}){
const open=tasks.filter(t=>!t.done).length;
return <div className="page home-page">
<section className="hero-command">
<div className="hero-copy"><div className="signal-line"><span className="live-dot"/> PERSONAL CAMPUS OPERATING SYSTEM</div><h1>{profile.name},<br/><em>your campus is moving.</em></h1><p>Campus OS turns scattered announcements into connected context, deadlines and actions — continuously.</p><div className="hero-actions"><button className="create-button large" onClick={openCreate}>Ingest campus information <span>↗</span></button><button className="text-button" onClick={()=>document.getElementById("campus-feed")?.scrollIntoView({behavior:"smooth"})}>Explore signals ↓</button></div><div className="hero-metrics"><Metric value={String(state.entities.length).padStart(2,"0")} label="CONNECTED OBJECTS"/><Metric value={String(open).padStart(2,"0")} label="OPEN ACTIONS"/><Metric value={String(campusDeadlines(state).length).padStart(2,"0")} label="DEADLINES"/></div></div>
<CampusTerrain state={state}/>
</section>
<DeadlineTimeline state={state} openNetwork={openNetwork}/>
<section className="copilot-strip"><div className="copilot-copy"><div className="signal-line">CAMPUS COPILOT <span className="mini-tag">GRAPH-GROUNDED</span></div><h2>Ask the campus.</h2><p>Get answers from the relationships, deadlines and workflow already stored in your Campus OS.</p></div><div className="copilot-query"><span>⌘</span><input value={copilotQuery} onChange={e=>setCopilotQuery(e.target.value)} placeholder="What do I need to do for the hackathon?"/><span className="enter">ENTER ↵</span>{copilotQuery.trim()&&<CopilotResult result={answerCampusQuery(state,profile,copilotQuery)}/>}</div></section>
<div className="content-grid" id="campus-feed"><section><SectionHeading kicker="LIVE CAMPUS SIGNALS" title="What is happening" action="Explore all" onAction={()=>window.dispatchEvent(new CustomEvent("campus:navigate",{detail:"Explore"}))}/>{filtered.map((p,i)=><PostCard key={p.id} p={p} liked={liked.includes(p.id)} onLike={()=>setLiked(l=>l.includes(p.id)?l.filter(x=>x!==p.id):[...l,p.id])} index={i}/>)}</section><Workflow tasks={tasks} toggle={toggle} openTasks={openTasks}/></div>
</div>
}


function SettingsPage({view,setView,theme,setTheme,profile,editProfile}:{view:"settings"|"privacy"|"terms";setView:React.Dispatch<React.SetStateAction<"settings"|"privacy"|"terms">>;theme:"dark"|"light";setTheme:React.Dispatch<React.SetStateAction<"dark"|"light">>;profile:UserProfile;editProfile:()=>void}){
if(view==="privacy")return <PolicyPage type="privacy" back={()=>setView("settings")}/>;
if(view==="terms")return <PolicyPage type="terms" back={()=>setView("settings")}/>;
return <div className="page inner-page settings-page"><div className="page-intro"><div><span className="signal-line">SYSTEM SETTINGS</span><h1>Control your <em>campus OS.</em></h1><p>Appearance, compliance references and legal documents for the Campus OS experience.</p></div></div><div className="settings-layout"><aside className="settings-menu"><button className="settings-menu-item active">GENERAL<span>Appearance & preferences</span></button><button className="settings-menu-item" onClick={()=>setView("privacy")}>PRIVACY<span>Privacy policy</span></button><button className="settings-menu-item" onClick={()=>setView("terms")}>TERMS<span>Terms & conditions</span></button></aside><div className="settings-content"><section className="settings-card personal-context-card"><div className="settings-card-head"><div><span className="signal-line">PERSONAL CONTEXT</span><h2>{profile.name}, shape your orbit.</h2><p>This context drives personalized campus signals, relevance and workflow suggestions. It stays on this device in the current local-first build.</p></div><button className="outline-button settings-edit-context" onClick={editProfile}>EDIT CONTEXT ↗</button></div><div className="context-summary"><div><span>BRANCH</span><b>{profile.branch||"Not set"}</b></div><div><span>YEAR</span><b>{profile.year}</b></div><div><span>CLUBS</span><b>{profile.clubs.length?profile.clubs.join(", "):"None"}</b></div><div><span>INTERESTS</span><b>{profile.interests.length?profile.interests.join(", "):"None"}</b></div><div><span>ACTIVE PROJECTS</span><b>{profile.activeProjects.length?profile.activeProjects.join(", "):"None"}</b></div></div></section><section className="settings-card"><div className="settings-card-head"><div><span className="signal-line">APPEARANCE</span><h2>Interface theme</h2><p>Choose how Campus OS renders across the entire application.</p></div><span className="settings-status">{theme.toUpperCase()}</span></div><div className="theme-control"><div><b>{theme==="dark"?"Dark mode":"Light mode"}</b><small>Your preference is saved on this device.</small></div><button className={"theme-toggle "+(theme==="light"?"on":"")} role="switch" aria-checked={theme==="light"} aria-label="Toggle light mode" onClick={()=>setTheme(theme==="dark"?"light":"dark")}><span/></button></div></section><section className="settings-card"><div className="settings-card-head"><div><span className="signal-line">COMPLIANCE</span><h2>Data protection posture</h2><p>Frameworks the product is designed to account for. This is documentation, not a certification.</p></div><span className="settings-status">DOCUMENTED</span></div><div className="compliance-grid"><article><span>01</span><b>India · DPDP</b><p>Campus OS privacy design is aligned to principles relevant to the Digital Personal Data Protection Act, 2023 and the Digital Personal Data Protection Rules, 2025.</p><small>Review against your deployment, data flows and role as a Data Fiduciary before making a compliance claim.</small></article><article><span>02</span><b>Healthcare · HIPAA</b><p>HIPAA protections are relevant to covered entities and business associates handling protected health information in covered contexts.</p><small>Campus OS is not represented here as HIPAA-certified or as a covered entity.</small></article></div></section><section className="settings-card"><div className="settings-card-head"><div><span className="signal-line">LEGAL</span><h2>Policies & terms</h2><p>Read the documents that describe the current product behavior and user responsibilities.</p></div></div><div className="legal-links"><button onClick={()=>setView("privacy")}><span>Privacy Policy</span><b>↗</b></button><button onClick={()=>setView("terms")}><span>Terms & Conditions</span><b>↗</b></button></div></section></div></div></div>
}

function PolicyPage({type,back}:{type:"privacy"|"terms";back:()=>void}){
const privacy=type==="privacy";
const title=privacy?"Privacy Policy.":"Terms & Conditions.";
const subtitle=privacy?"How Campus OS currently handles information in this local-first prototype.":"The baseline terms governing use of the Campus OS prototype.";
return <div className="page inner-page policy-page">
<button className="back-link" onClick={back}>← SETTINGS</button>
<div className="policy-header">
<span className="signal-line">{privacy?"PRIVACY":"LEGAL"}</span>
<h1>{title}</h1>
<p>{subtitle}</p>
</div>
<article className="policy-document">
<div className="policy-meta">LAST UPDATED · 03 OCTOBER 2026</div>
{privacy ? <PrivacyDocument/> : <TermsDocument/>}
</article>
</div>
}

function PrivacyDocument(){
return <>
<h2>1. What Campus OS stores</h2>
<p>In the current local-first implementation, campus state and the editable user profile are stored in your browser's local storage. The application uses these records to render campus signals, relationships, deadlines, tasks and personalization.</p>
<h2>2. What is not currently represented</h2>
<p>This prototype does not currently provide an account system, server-side user profile, or external analytics service in the application code. If those capabilities are added later, this policy should be revised before production use.</p>
<h2>3. Personal information</h2>
<p>Do not enter sensitive personal information into announcements, profile fields or other free-form inputs unless the deployment has an appropriate lawful basis, security controls and documented data-handling process.</p>
<h2>4. Your controls</h2>
<p>You can edit your saved profile context, change the interface theme, and use the browser's site-data controls to clear locally stored Campus OS data.</p>
<h2>5. Compliance context</h2>
<p>For India-facing deployments, the relevant legal framework includes the Digital Personal Data Protection Act, 2023 and the notified Digital Personal Data Protection Rules, 2025. HIPAA may apply only in covered healthcare contexts; it is not a universal privacy law for every application.</p>
<h2>6. Changes</h2>
<p>This document should be updated whenever Campus OS gains accounts, remote synchronization, analytics, third-party integrations, or new categories of personal data.</p>
</>
}

function TermsDocument(){
return <>
<h2>1. Acceptance</h2>
<p>Campus OS is a software prototype for organizing campus information, relationships, deadlines and workflows. By using it, you agree to use the system lawfully and responsibly.</p>
<h2>2. User responsibilities</h2>
<p>You are responsible for the accuracy and appropriateness of information you enter, and for avoiding unauthorized disclosure of another person's private or confidential information.</p>
<h2>3. No legal or professional advice</h2>
<p>Campus OS does not provide legal, medical, compliance or security advice. Compliance pages describe product design intent and should not be treated as certification, legal advice or a substitute for professional review.</p>
<h2>4. Prototype availability</h2>
<p>The prototype may change, become unavailable, or contain defects. Production deployments should add appropriate authentication, authorization, backups, audit logging, security controls and operational policies before handling sensitive information.</p>
<h2>5. Third-party services</h2>
<p>If a future deployment integrates external identity, hosting, analytics, AI, messaging or other services, those services may have separate terms and privacy practices that must be reviewed.</p>
<h2>6. Updates</h2>
<p>These terms may be revised as Campus OS moves from a prototype into a production service. The effective date at the top of this page identifies the current version.</p>
</>
}

function Metric({value,label}:{value:string;label:string}){return <div className="metric"><b>{value}</b><span>{label}</span></div>}

function CopilotResult({result}:{result:ReturnType<typeof answerCampusQuery>}){return <div className="copilot-result"><p>{result.answer}</p>{result.entities.length>0&&<div className="copilot-links"><small>CONNECTED</small>{result.entities.slice(0,4).map(e=><span key={e.id}>{e.type} · {e.name}</span>)}</div>}{result.tasks.length>0&&<div className="copilot-links"><small>ACTIONS</small>{result.tasks.slice(0,3).map(t=><span key={t.id}>{t.done?"✓":"→"} {t.title}</span>)}</div>}{result.deadlines.length>0&&<div className="copilot-links"><small>DEADLINES</small>{result.deadlines.slice(0,3).map(d=><span key={d.entity.id}>{d.status.replace("_"," ")} · {d.entity.name}</span>)}</div>}</div>}

function CampusTerrain({state}:{state:ReturnType<typeof store.getState>}){
const blocks=Array.from({length:49},(_,i)=>{const x=i%7,y=Math.floor(i/7);const center=Math.max(0,5-Math.abs(x-3)-Math.abs(y-3));return {x,y,h:1+((x*7+y*3)%4)+center*2}});
return <div className="terrain-wrap"><div className="terrain-label"><span>01</span><b>LIVE GRAPH</b><small>{state.entities.length} nodes / {state.relationships.length} links</small></div><div className="terrain" aria-hidden="true">{blocks.map((b,i)=><i key={i} style={{"--x":b.x,"--y":b.y,"--h":b.h,"--delay":(i%9)*70+"ms"} as React.CSSProperties}/>)}</div><div className="terrain-orbit orbit-a"/><div className="terrain-orbit orbit-b"/><div className="terrain-node node-main">YOU<span/></div><div className="terrain-node node-event">EVENT<span/></div><div className="terrain-node node-task">TASK<span/></div></div>
}

function DeadlineTimeline({state,openNetwork}:{state:ReturnType<typeof store.getState>;openNetwork:(id:string)=>void}){
const deadlines=campusDeadlines(state);
return <section className="deadline-section"><SectionHeading kicker="ATTENTION LAYER" title="Deadlines in your orbit" action={deadlines.length+" connected"}/><div className="deadline-track">{deadlines.slice(0,5).map((d,i)=><article className={"deadline-card "+d.status} key={d.entity.id} role="button" tabIndex={0} onClick={()=>openNetwork(d.entity.id)} onKeyDown={e=>{if(e.key==="Enter"||e.key===" ")openNetwork(d.entity.id)}}><div className="deadline-index">0{i+1}</div><div><small>{d.status.replace("_"," ").toUpperCase()}</small><h3>{d.entity.name}</h3><p>{d.source?.name||"Campus information"}{d.task?" · "+d.task.title:""}</p></div><span className="deadline-arrow">↗</span></article>)}</div></section>
}

function SectionHeading({kicker,title,action,onAction}:{kicker:string;title:string;action:string;onAction?:()=>void}){return <div className="section-heading"><div><span>{kicker}</span><h2>{title}</h2></div>{onAction?<button onClick={onAction}>{action} ↗</button>:<span className="section-action">{action}</span>}</div>}

function PostCard({p,liked,onLike,index}:{p:Post;liked:boolean;onLike:()=>void;index:number}){
return <article className="signal-card" style={{"--delay":index*70+"ms"} as React.CSSProperties}><div className="signal-number">0{index+1}</div><div className="signal-main"><div className="signal-meta"><span className={"type-badge "+p.type.toLowerCase()}>{p.type}</span><span>{p.club}</span><span>·</span><span>{p.time==="now"?"JUST NOW":p.time.toUpperCase()+" AGO"}</span></div><h3>{p.title}</h3><p>{p.body}</p><div className="signal-footer"><button onClick={onLike}>{liked?"▲":"△"} {p.votes+(liked?1:0)}</button><span>{p.comments} comments</span>{p.deadline&&<b>DEADLINE {p.deadline}</b>}<span className="linked">CONNECTED ↗</span></div></div></article>
}

function Workflow({tasks,toggle,openTasks}:{tasks:Task[];toggle:(id:number)=>void;openTasks?:()=>void}){
const done=tasks.filter(t=>t.done).length;
return <section className="workflow-panel"><div className="panel-kicker"><span>YOUR WORKFLOW</span><b>{done}/{tasks.length}</b></div><h2>Next actions</h2><div className="workflow-progress"><i style={{width:(tasks.length?done/tasks.length*100:0)+"%"}}/></div><p>Generated from the campus graph.</p>{tasks.slice(0,6).map(t=><label className={"action-row "+(t.done?"done":"")} key={t.id}><input type="checkbox" checked={t.done} onChange={()=>toggle(t.id)}/><span className="action-check"/><span className="action-copy"><b>{t.title}</b><small>{t.meta}</small></span><span className="action-arrow">↗</span></label>)}{openTasks&&<button className="outline-button" onClick={openTasks}>OPEN FULL WORKFLOW</button>}</section>
}

function ForYou({state,profile,filtered,tasks,toggle,editProfile}:{state:ReturnType<typeof store.getState>;profile:UserProfile;filtered:Post[];tasks:Task[];toggle:(id:number)=>void;editProfile:()=>void}){
const ranked=[...filtered].sort((a,b)=>relevanceForUser(b,profile).score-relevanceForUser(a,profile).score);
return <div className="page inner-page"><div className="page-intro"><div><span className="signal-line">PERSONALIZATION ENGINE</span><h1>Signals tuned to <em>{profile.name}.</em></h1><p>Your profile changes what rises to the surface. Every reason remains visible.</p></div><button className="outline-button" onClick={editProfile}>EDIT CONTEXT ↗</button></div><div className="content-grid"><section>{ranked.map((p,i)=>{const r=relevanceForUser(p,profile);return <article className="relevance-card" key={p.id}><span>0{i+1}</span><div><small>{r.score>0?"RELEVANT SIGNAL":"GENERAL SIGNAL"}</small><h3>{p.title}</h3><p>{r.reasons.join(" · ")||"General campus information"}</p></div><b>{r.score>0?"MATCH":"OPEN"}</b></article>})}</section><Workflow tasks={tasks} toggle={toggle}/></div></div>
}

function Explore({filtered,liked,setLiked}:{filtered:Post[];liked:number[];setLiked:React.Dispatch<React.SetStateAction<number[]>>}){return <div className="page inner-page"><div className="page-intro"><div><span className="signal-line">CAMPUS INDEX</span><h1>Explore the <em>signal.</em></h1><p>Events, opportunities, resources, notices and projects — all connected.</p></div></div><div className="explore-grid">{filtered.map((p,i)=><PostCard key={p.id} p={p} liked={liked.includes(p.id)} onLike={()=>setLiked(l=>l.includes(p.id)?l.filter(x=>x!==p.id):[...l,p.id])} index={i}/>)}</div></div>}

function TasksPage({state,tasks,toggle}:{state:ReturnType<typeof store.getState>;tasks:Task[];toggle:(id:number)=>void}){return <div className="page inner-page"><div className="page-intro"><div><span className="signal-line">WORKFLOW ENGINE</span><h1>Turn context into <em>motion.</em></h1><p>Every task points back to the campus object that caused it.</p></div></div><div className="task-layout"><Workflow tasks={tasks} toggle={toggle}/><section className="context-panel"><div className="panel-kicker"><span>CONTEXT CHAIN</span><b>{tasks.length} ACTIONS</b></div><h2>Why these exist</h2>{tasks.map(t=><div className="chain-row" key={t.id}><span>{state.entities.find(e=>e.id===t.source)?.name||t.source}</span><i>→</i><b>{t.title}</b></div>)}</section></div></div>}

function Relationship({state,selectedId}:{state:ReturnType<typeof store.getState>;selectedId?:string}){
const event=state.entities.find(e=>e.type==="event")||state.entities[0];const[selected,setSelected]=React.useState(selectedId||event?.id);React.useEffect(()=>{if(selectedId)setSelected(selectedId)},[selectedId]);const entity=state.entities.find(e=>e.id===selected)||event;const links=entity?state.relationships.filter(r=>r.from===entity.id||r.to===entity.id):[];const connected=links.map(r=>r.from===entity?.id?r.to:r.from).map(id=>state.entities.find(e=>e.id===id)).filter(Boolean);const source=entity&&state.posts.find(p=>p.linked===entity.name);const entityTasks=entity?state.tasks.filter(t=>t.source===entity.id):[];
return <div className="page network-page"><div className="page-intro"><div><span className="signal-line">RELATIONSHIP GRAPH</span><h1>The campus is <em>connected.</em></h1><p>Select an object to reveal its context, source and next actions.</p></div></div><section className="network-stage"><div className="network-grid"/><div className="network-core"><span>{entity?.type?.toUpperCase()}</span><b>{entity?.name}</b></div>{connected.slice(0,6).map((e,i)=><button className={"network-node nn"+i} key={e!.id} onClick={()=>setSelected(e!.id)}><small>{e!.type}</small><b>{e!.name}</b></button>)}{connected.slice(0,6).map((_,i)=><i className={"network-line nl"+i} key={"l"+i}/>)}<div className="network-scan"/></section><div className="entity-strip">{state.entities.map(e=><button key={e.id} className={e.id===entity?.id?"selected":""} onClick={()=>setSelected(e.id)}>{e.type} / {e.name}</button>)}</div>{entity&&<section className="entity-detail"><div><span className="signal-line">SELECTED OBJECT</span><h2>{entity.name}</h2><p>{entity.meta||"Connected campus entity"}</p></div><div className="detail-column">{links.map(r=>{const other=state.entities.find(e=>e.id===(r.from===entity.id?r.to:r.from));return <div className="detail-link" key={r.from+r.relation+r.to}><span>{r.from===entity.id?entity.name:other?.name}</span><b>{r.relation.replaceAll("_"," ")}</b><span>{r.from===entity.id?other?.name:entity.name}</span></div>})}{source&&<div className="source-box"><small>SOURCE ANNOUNCEMENT</small><b>{source.title}</b><p>{source.body}</p></div>}{entityTasks.length>0&&<div className="source-box"><small>GENERATED ACTIONS</small>{entityTasks.map(t=><p key={t.id}>→ {t.title}</p>)}</div>}</div></section>}</div>
}

function CreateAnnouncement({form,setForm,preview,submit,confirm,close}:{form:AnnouncementInput;setForm:React.Dispatch<React.SetStateAction<AnnouncementInput>>;preview:ExtractedAnnouncement|null;submit:()=>void;confirm:()=>void;close:()=>void}){
return <div className="modal-backdrop" onMouseDown={close}><div className="modal" onMouseDown={e=>e.stopPropagation()}>{!preview?<><div className="modal-top"><div><span className="signal-line">INGEST CAMPUS INFORMATION</span><h2>Feed the system.</h2><p>Paste a messy campus announcement. Campus OS will map the objects, relationships and actions.</p></div><button onClick={close}>×</button></div><div className="form-grid"><label>TYPE<select value={form.type} onChange={e=>setForm({...form,type:e.target.value})}><option>EVENT</option><option>OPPORTUNITY</option><option>RESOURCE</option><option>NOTICE</option><option>COMPETITION</option><option>PROJECT</option></select></label><label>SOURCE<input value={form.author} onChange={e=>setForm({...form,author:e.target.value})}/></label></div><label>TITLE<input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="24-Hour AI Hackathon — registrations are open"/></label><label>RAW ANNOUNCEMENT<textarea value={form.body} onChange={e=>setForm({...form,body:e.target.value})} placeholder="AI Club is conducting a 24-hour hackathon on October 15..."/></label><div className="modal-actions"><button className="text-button" onClick={close}>Cancel</button><button className="create-button" onClick={submit} disabled={!form.title.trim()||!form.body.trim()}>UNDERSTAND ↗</button></div></>:<Understanding result={preview} back={()=>setPreview(null)} confirm={confirm}/>}</div></div>
}

function Understanding({result,back,confirm}:{result:ExtractedAnnouncement;back:()=>void;confirm:()=>void}){return <><div className="modal-top"><div><span className="signal-line">SYSTEM INTERPRETATION</span><h2>We found the structure.</h2><p>The announcement is now a connected campus object.</p></div><span className="confidence-ring">{Math.round(result.confidence*100)}%</span></div><div className="understanding-grid"><div><SectionHeading kicker="OBJECTS" title="Entities" action={result.entities.length+" found"}/><div className="entity-chips">{result.entities.map(e=><span key={e.id}><small>{e.type}</small>{e.name}</span>)}</div><SectionHeading kicker="RELATIONSHIPS" title="Connections" action={result.relationships.length+" links"}/>{result.relationships.map((r,i)=><div className="chain-row" key={i}><b>{r.from}</b><i>→ {r.relation.replaceAll("_"," ")} →</i><b>{r.to}</b></div>)}</div><div className="generated-panel"><div className="panel-kicker"><span>GENERATED WORKFLOW</span><b>{result.tasks.length} ACTIONS</b></div>{result.tasks.map(t=><div className="generated-action" key={t.id}><span>✓</span><div><b>{t.title}</b><small>{t.meta}</small></div></div>)}<div className="reasons">{result.reasons.map(r=><p key={r}>+ {r}</p>)}</div></div></div><div className="modal-actions"><button className="text-button" onClick={back}>← Edit source</button><button className="create-button" onClick={confirm}>CONFIRM & CONNECT ↗</button></div></>}

function ProfileEditor({profile,save,close}:{profile:UserProfile;save:(p:UserProfile)=>void;close:()=>void}){const[draft,setDraft]=React.useState(profile);const split=(v:string)=>v.split(",").map(x=>x.trim()).filter(Boolean);return <div className="modal-backdrop" onMouseDown={close}><div className="modal profile-modal" onMouseDown={e=>e.stopPropagation()}><div className="modal-top"><div><span className="signal-line">PERSONAL CONTEXT</span><h2>Shape your orbit.</h2></div><button onClick={close}>×</button></div><label>NAME<input value={draft.name} onChange={e=>setDraft({...draft,name:e.target.value})}/></label><div className="form-grid"><label>BRANCH<input value={draft.branch} onChange={e=>setDraft({...draft,branch:e.target.value})}/></label><label>YEAR<input type="number" min="1" max="8" value={draft.year} onChange={e=>setDraft({...draft,year:Number(e.target.value)})}/></label></div><label>INTERESTS<input value={draft.interests.join(", ")} onChange={e=>setDraft({...draft,interests:split(e.target.value)})}/></label><label>CLUBS<input value={draft.clubs.join(", ")} onChange={e=>setDraft({...draft,clubs:split(e.target.value)})}/></label><label>ACTIVE PROJECTS<input value={draft.activeProjects.join(", ")} onChange={e=>setDraft({...draft,activeProjects:split(e.target.value)})}/></label><div className="modal-actions"><button className="text-button" onClick={close}>Cancel</button><button className="outline-button" onClick={()=>{repository.save(initialState);saveUserProfile(demoProfile);window.location.reload()}}>Reset demo</button><button className="create-button" onClick={()=>save(draft)}>SAVE CONTEXT ↗</button></div></div></div>}

createRoot(document.getElementById("root")!).render(<App/>);
