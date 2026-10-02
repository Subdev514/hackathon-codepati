import React from "react";
import{createRoot}from"react-dom/client";
import"./styles.css";
import{AnnouncementInput,ExtractedAnnouncement,Post,Task,createCampusStore,extractAnnouncement,commitExtraction,createCampusRepository,initialState,loadUserProfile,saveUserProfile,relevanceForUser,UserProfile,campusDeadlines,answerCampusQuery,demoProfile}from"./domain";

const repository=createCampusRepository();
const store=createCampusStore(repository.load());

const navItems=[["01","Home","⌂"],["02","For You","✦"],["03","Explore","◌"],["04","My Tasks","✓"],["05","Network","◎"]];

function App(){
const[tab,setTab]=React.useState("Home");
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
const state=store.getState();
const filtered=state.posts.filter(p=>(p.title+" "+p.body+" "+p.tags.join(" ")).toLowerCase().includes(query.toLowerCase()));
const sync=()=>{repository.save(store.getState());setTasks([...store.getState().tasks]);refresh(x=>x+1)};
const toggle=(id:number)=>{store.toggleTask(id);sync()};
const submitAnnouncement=()=>{if(!form.title.trim()||!form.body.trim())return;try{setError("");setPreview(extractAnnouncement(form))}catch(e){setError(e instanceof Error?e.message:"Could not understand announcement")}};
const confirmAnnouncement=()=>{if(!preview)return;try{setError("");commitExtraction(store,preview)}catch(e){setError(e instanceof Error?e.message:"Could not connect announcement");return}setPreview(null);setShowCreate(false);setForm({title:"",body:"",type:"EVENT",author:"AI Club",club:"AI Club"});setTab("Home");sync()};
const hour=new Date().getHours();
const greeting=hour<12?"Good morning":hour<18?"Good afternoon":"Good evening";
return <div className="app-shell">
<aside className="sidebar">
<div className="brand-mark"><div className="brand-symbol">C</div><div><strong>Campus OS</strong><span>CONNECTED CAMPUS</span></div></div>
<nav className="nav-list">{navItems.map(([num,name,icon])=><button key={name} className={"nav-item "+(tab===name?"active":"")} onClick={()=>setTab(name)}><span className="nav-num">{num}</span><span className="nav-icon">{icon}</span><span>{name}</span></button>)}</nav>
<div className="sidebar-pulse"><span className="pulse-dot"/><div><small>LIVE CAMPUS GRAPH</small><b>{state.entities.length} connected objects</b></div></div>
<div className="sidebar-bottom"><button className="profile-chip" onClick={()=>setShowProfile(true)}><span className="avatar">{profile.name.slice(0,1).toUpperCase()}</span><span><b>{profile.name}</b><small>{profile.branch} · Year {profile.year}</small></span><i>↗</i></button></div>
</aside>
<main className="main-stage">
<header className="topbar"><div className="crumb"><span>CAMPUS OS</span><b>/</b><strong>{tab}</strong></div><div className="top-actions"><label className="command-search"><span>⌕</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search campus"/></label><button className="icon-button" aria-label="Notifications">◌</button><button className="create-button" onClick={()=>setShowCreate(true)}><span>+</span> Create</button></div></header>
{tab==="Home"&&<Home state={state} profile={profile} filtered={filtered} tasks={tasks} toggle={toggle} liked={liked} setLiked={setLiked} copilotQuery={copilotQuery} setCopilotQuery={setCopilotQuery} openCreate={()=>setShowCreate(true)}/>}
{tab==="For You"&&<ForYou state={state} profile={profile} filtered={filtered} tasks={tasks} toggle={toggle} editProfile={()=>setShowProfile(true)}/>}
{tab==="Explore"&&<Explore filtered={filtered} liked={liked} setLiked={setLiked}/>}
{tab==="My Tasks"&&<TasksPage state={state} tasks={tasks} toggle={toggle}/>}
{tab==="Network"&&<Relationship state={state}/>}
</main>
{error&&<div className="error-toast" role="alert">{error}<button onClick={()=>setError("")}>×</button></div>}
{showProfile&&<ProfileEditor profile={profile} save={next=>{setProfile(next);saveUserProfile(next);setShowProfile(false)}} close={()=>setShowProfile(false)}/>}
{showCreate&&<CreateAnnouncement form={form} setForm={setForm} preview={preview} submit={submitAnnouncement} confirm={confirmAnnouncement} close={()=>{setShowCreate(false);setPreview(null)}}/>}
</div>
}

function Home({state,profile,filtered,tasks,toggle,liked,setLiked,copilotQuery,setCopilotQuery,openCreate}:{state:ReturnType<typeof store.getState>;profile:UserProfile;filtered:Post[];tasks:Task[];toggle:(id:number)=>void;liked:number[];setLiked:React.Dispatch<React.SetStateAction<number[]>>;copilotQuery:string;setCopilotQuery:(v:string)=>void;openCreate:()=>void}){
const open=tasks.filter(t=>!t.done).length;
return <div className="page home-page">
<section className="hero-command">
<div className="hero-copy"><div className="signal-line"><span className="live-dot"/> PERSONAL CAMPUS OPERATING SYSTEM</div><h1>{profile.name},<br/><em>your campus is moving.</em></h1><p>Campus OS turns scattered announcements into connected context, deadlines and actions — continuously.</p><div className="hero-actions"><button className="create-button large" onClick={openCreate}>Ingest campus information <span>↗</span></button><button className="text-button" onClick={()=>document.getElementById("campus-feed")?.scrollIntoView({behavior:"smooth"})}>Explore signals ↓</button></div><div className="hero-metrics"><Metric value={String(state.entities.length).padStart(2,"0")} label="CONNECTED OBJECTS"/><Metric value={String(open).padStart(2,"0")} label="OPEN ACTIONS"/><Metric value={String(campusDeadlines(state).length).padStart(2,"0")} label="DEADLINES"/></div></div>
<CampusTerrain state={state}/>
</section>
<DeadlineTimeline state={state}/>
<section className="copilot-strip"><div className="copilot-copy"><div className="signal-line">CAMPUS COPILOT <span className="mini-tag">GRAPH-GROUNDED</span></div><h2>Ask the campus.</h2><p>Get answers from the relationships, deadlines and workflow already stored in your Campus OS.</p></div><div className="copilot-query"><span>⌘</span><input value={copilotQuery} onChange={e=>setCopilotQuery(e.target.value)} placeholder="What do I need to do for the hackathon?"/><span className="enter">ENTER ↵</span>{copilotQuery.trim()&&<div className="copilot-result">{answerCampusQuery(state,profile,copilotQuery).answer}</div>}</div></section>
<div className="content-grid" id="campus-feed"><section><SectionHeading kicker="LIVE CAMPUS SIGNALS" title="What is happening" action="Explore all"/>{filtered.map((p,i)=><PostCard key={p.id} p={p} liked={liked.includes(p.id)} onLike={()=>setLiked(l=>l.includes(p.id)?l.filter(x=>x!==p.id):[...l,p.id])} index={i}/>)}</section><Workflow tasks={tasks} toggle={toggle}/></div>
</div>
}

function Metric({value,label}:{value:string;label:string}){return <div className="metric"><b>{value}</b><span>{label}</span></div>}

function CampusTerrain({state}:{state:ReturnType<typeof store.getState>}){
const blocks=Array.from({length:49},(_,i)=>{const x=i%7,y=Math.floor(i/7);const center=Math.max(0,5-Math.abs(x-3)-Math.abs(y-3));return {x,y,h:1+((x*7+y*3)%4)+center*2}});
return <div className="terrain-wrap"><div className="terrain-label"><span>01</span><b>LIVE GRAPH</b><small>{state.entities.length} nodes / {state.relationships.length} links</small></div><div className="terrain" aria-hidden="true">{blocks.map((b,i)=><i key={i} style={{"--x":b.x,"--y":b.y,"--h":b.h,"--delay":(i%9)*70+"ms"} as React.CSSProperties}/>)}</div><div className="terrain-orbit orbit-a"/><div className="terrain-orbit orbit-b"/><div className="terrain-node node-main">YOU<span/></div><div className="terrain-node node-event">EVENT<span/></div><div className="terrain-node node-task">TASK<span/></div></div>
}

function DeadlineTimeline({state}:{state:ReturnType<typeof store.getState>}){
const deadlines=campusDeadlines(state);
return <section className="deadline-section"><SectionHeading kicker="ATTENTION LAYER" title="Deadlines in your orbit" action={deadlines.length+" connected"}/><div className="deadline-track">{deadlines.slice(0,5).map((d,i)=><article className={"deadline-card "+d.status} key={d.entity.id}><div className="deadline-index">0{i+1}</div><div><small>{d.status.replace("_"," ").toUpperCase()}</small><h3>{d.entity.name}</h3><p>{d.source?.name||"Campus information"}{d.task?" · "+d.task.title:""}</p></div><span className="deadline-arrow">↗</span></article>)}</div></section>
}

function SectionHeading({kicker,title,action}:{kicker:string;title:string;action:string}){return <div className="section-heading"><div><span>{kicker}</span><h2>{title}</h2></div><button>{action} ↗</button></div>}

function PostCard({p,liked,onLike,index}:{p:Post;liked:boolean;onLike:()=>void;index:number}){
return <article className="signal-card" style={{"--delay":index*70+"ms"} as React.CSSProperties}><div className="signal-number">0{index+1}</div><div className="signal-main"><div className="signal-meta"><span className={"type-badge "+p.type.toLowerCase()}>{p.type}</span><span>{p.club}</span><span>·</span><span>{p.time==="now"?"JUST NOW":p.time.toUpperCase()+" AGO"}</span></div><h3>{p.title}</h3><p>{p.body}</p><div className="signal-footer"><button onClick={onLike}>{liked?"▲":"△"} {p.votes+(liked?1:0)}</button><span>{p.comments} comments</span>{p.deadline&&<b>DEADLINE {p.deadline}</b>}<span className="linked">CONNECTED ↗</span></div></div></article>
}

function Workflow({tasks,toggle}:{tasks:Task[];toggle:(id:number)=>void}){
const done=tasks.filter(t=>t.done).length;
return <section className="workflow-panel"><div className="panel-kicker"><span>YOUR WORKFLOW</span><b>{done}/{tasks.length}</b></div><h2>Next actions</h2><div className="workflow-progress"><i style={{width:(tasks.length?done/tasks.length*100:0)+"%"}}/></div><p>Generated from the campus graph.</p>{tasks.slice(0,6).map(t=><label className={"action-row "+(t.done?"done":"")} key={t.id}><input type="checkbox" checked={t.done} onChange={()=>toggle(t.id)}/><span className="action-check"/><span className="action-copy"><b>{t.title}</b><small>{t.meta}</small></span><span className="action-arrow">↗</span></label>)}<button className="outline-button">OPEN FULL WORKFLOW</button></section>
}

function ForYou({state,profile,filtered,tasks,toggle,editProfile}:{state:ReturnType<typeof store.getState>;profile:UserProfile;filtered:Post[];tasks:Task[];toggle:(id:number)=>void;editProfile:()=>void}){
const ranked=[...filtered].sort((a,b)=>relevanceForUser(b,profile).score-relevanceForUser(a,profile).score);
return <div className="page inner-page"><div className="page-intro"><div><span className="signal-line">PERSONALIZATION ENGINE</span><h1>Signals tuned to <em>{profile.name}.</em></h1><p>Your profile changes what rises to the surface. Every reason remains visible.</p></div><button className="outline-button" onClick={editProfile}>EDIT CONTEXT ↗</button></div><div className="content-grid"><section>{ranked.map((p,i)=>{const r=relevanceForUser(p,profile);return <article className="relevance-card" key={p.id}><span>0{i+1}</span><div><small>{r.score>0?"RELEVANT SIGNAL":"GENERAL SIGNAL"}</small><h3>{p.title}</h3><p>{r.reasons.join(" · ")||"General campus information"}</p></div><b>{r.score>0?"MATCH":"OPEN"}</b></article>})}</section><Workflow tasks={tasks} toggle={toggle}/></div></div>
}

function Explore({filtered,liked,setLiked}:{filtered:Post[];liked:number[];setLiked:React.Dispatch<React.SetStateAction<number[]>>}){return <div className="page inner-page"><div className="page-intro"><div><span className="signal-line">CAMPUS INDEX</span><h1>Explore the <em>signal.</em></h1><p>Events, opportunities, resources, notices and projects — all connected.</p></div></div><div className="explore-grid">{filtered.map((p,i)=><PostCard key={p.id} p={p} liked={liked.includes(p.id)} onLike={()=>setLiked(l=>l.includes(p.id)?l.filter(x=>x!==p.id):[...l,p.id])} index={i}/>)}</div></div>}

function TasksPage({state,tasks,toggle}:{state:ReturnType<typeof store.getState>;tasks:Task[];toggle:(id:number)=>void}){return <div className="page inner-page"><div className="page-intro"><div><span className="signal-line">WORKFLOW ENGINE</span><h1>Turn context into <em>motion.</em></h1><p>Every task points back to the campus object that caused it.</p></div></div><div className="task-layout"><Workflow tasks={tasks} toggle={toggle}/><section className="context-panel"><div className="panel-kicker"><span>CONTEXT CHAIN</span><b>{tasks.length} ACTIONS</b></div><h2>Why these exist</h2>{tasks.map(t=><div className="chain-row" key={t.id}><span>{state.entities.find(e=>e.id===t.source)?.name||t.source}</span><i>→</i><b>{t.title}</b></div>)}</section></div></div>}

function Relationship({state}:{state:ReturnType<typeof store.getState>}){
const event=state.entities.find(e=>e.type==="event")||state.entities[0];const[selected,setSelected]=React.useState(event?.id);const entity=state.entities.find(e=>e.id===selected)||event;const links=entity?state.relationships.filter(r=>r.from===entity.id||r.to===entity.id):[];const connected=links.map(r=>r.from===entity?.id?r.to:r.from).map(id=>state.entities.find(e=>e.id===id)).filter(Boolean);const source=entity&&state.posts.find(p=>p.linked===entity.name);const entityTasks=entity?state.tasks.filter(t=>t.source===entity.id):[];
return <div className="page network-page"><div className="page-intro"><div><span className="signal-line">RELATIONSHIP GRAPH</span><h1>The campus is <em>connected.</em></h1><p>Select an object to reveal its context, source and next actions.</p></div></div><section className="network-stage"><div className="network-grid"/><div className="network-core"><span>{entity?.type?.toUpperCase()}</span><b>{entity?.name}</b></div>{connected.slice(0,6).map((e,i)=><button className={"network-node nn"+i} key={e!.id} onClick={()=>setSelected(e!.id)}><small>{e!.type}</small><b>{e!.name}</b></button>)}{connected.slice(0,6).map((_,i)=><i className={"network-line nl"+i} key={"l"+i}/>)}<div className="network-scan"/></section><div className="entity-strip">{state.entities.map(e=><button key={e.id} className={e.id===entity?.id?"selected":""} onClick={()=>setSelected(e.id)}>{e.type} / {e.name}</button>)}</div>{entity&&<section className="entity-detail"><div><span className="signal-line">SELECTED OBJECT</span><h2>{entity.name}</h2><p>{entity.meta||"Connected campus entity"}</p></div><div className="detail-column">{links.map(r=>{const other=state.entities.find(e=>e.id===(r.from===entity.id?r.to:r.from));return <div className="detail-link" key={r.from+r.relation+r.to}><span>{r.from===entity.id?entity.name:other?.name}</span><b>{r.relation.replaceAll("_"," ")}</b><span>{r.from===entity.id?other?.name:entity.name}</span></div>})}{source&&<div className="source-box"><small>SOURCE ANNOUNCEMENT</small><b>{source.title}</b><p>{source.body}</p></div>}{entityTasks.length>0&&<div className="source-box"><small>GENERATED ACTIONS</small>{entityTasks.map(t=><p key={t.id}>→ {t.title}</p>)}</div>}</div></section>}</div>
}

function CreateAnnouncement({form,setForm,preview,submit,confirm,close}:{form:AnnouncementInput;setForm:React.Dispatch<React.SetStateAction<AnnouncementInput>>;preview:ExtractedAnnouncement|null;submit:()=>void;confirm:()=>void;close:()=>void}){
return <div className="modal-backdrop" onMouseDown={close}><div className="modal" onMouseDown={e=>e.stopPropagation()}>{!preview?<><div className="modal-top"><div><span className="signal-line">INGEST CAMPUS INFORMATION</span><h2>Feed the system.</h2><p>Paste a messy campus announcement. Campus OS will map the objects, relationships and actions.</p></div><button onClick={close}>×</button></div><div className="form-grid"><label>TYPE<select value={form.type} onChange={e=>setForm({...form,type:e.target.value})}><option>EVENT</option><option>OPPORTUNITY</option><option>RESOURCE</option><option>NOTICE</option><option>COMPETITION</option><option>PROJECT</option></select></label><label>SOURCE<input value={form.author} onChange={e=>setForm({...form,author:e.target.value})}/></label></div><label>TITLE<input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="24-Hour AI Hackathon — registrations are open"/></label><label>RAW ANNOUNCEMENT<textarea value={form.body} onChange={e=>setForm({...form,body:e.target.value})} placeholder="AI Club is conducting a 24-hour hackathon on October 15..."/></label><div className="modal-actions"><button className="text-button" onClick={close}>Cancel</button><button className="create-button" onClick={submit} disabled={!form.title.trim()||!form.body.trim()}>UNDERSTAND ↗</button></div></>:<Understanding result={preview} back={()=>setPreview(null)} confirm={confirm}/>}</div></div>
}

function Understanding({result,back,confirm}:{result:ExtractedAnnouncement;back:()=>void;confirm:()=>void}){return <><div className="modal-top"><div><span className="signal-line">SYSTEM INTERPRETATION</span><h2>We found the structure.</h2><p>The announcement is now a connected campus object.</p></div><span className="confidence-ring">{Math.round(result.confidence*100)}%</span></div><div className="understanding-grid"><div><SectionHeading kicker="OBJECTS" title="Entities" action={result.entities.length+" found"}/><div className="entity-chips">{result.entities.map(e=><span key={e.id}><small>{e.type}</small>{e.name}</span>)}</div><SectionHeading kicker="RELATIONSHIPS" title="Connections" action={result.relationships.length+" links"}/>{result.relationships.map((r,i)=><div className="chain-row" key={i}><b>{r.from}</b><i>→ {r.relation.replaceAll("_"," ")} →</i><b>{r.to}</b></div>)}</div><div className="generated-panel"><div className="panel-kicker"><span>GENERATED WORKFLOW</span><b>{result.tasks.length} ACTIONS</b></div>{result.tasks.map(t=><div className="generated-action" key={t.id}><span>✓</span><div><b>{t.title}</b><small>{t.meta}</small></div></div>)}<div className="reasons">{result.reasons.map(r=><p key={r}>+ {r}</p>)}</div></div></div><div className="modal-actions"><button className="text-button" onClick={back}>← Edit source</button><button className="create-button" onClick={confirm}>CONFIRM & CONNECT ↗</button></div></>}

function ProfileEditor({profile,save,close}:{profile:UserProfile;save:(p:UserProfile)=>void;close:()=>void}){const[draft,setDraft]=React.useState(profile);const split=(v:string)=>v.split(",").map(x=>x.trim()).filter(Boolean);return <div className="modal-backdrop" onMouseDown={close}><div className="modal profile-modal" onMouseDown={e=>e.stopPropagation()}><div className="modal-top"><div><span className="signal-line">PERSONAL CONTEXT</span><h2>Shape your orbit.</h2></div><button onClick={close}>×</button></div><label>NAME<input value={draft.name} onChange={e=>setDraft({...draft,name:e.target.value})}/></label><div className="form-grid"><label>BRANCH<input value={draft.branch} onChange={e=>setDraft({...draft,branch:e.target.value})}/></label><label>YEAR<input type="number" min="1" max="8" value={draft.year} onChange={e=>setDraft({...draft,year:Number(e.target.value)})}/></label></div><label>INTERESTS<input value={draft.interests.join(", ")} onChange={e=>setDraft({...draft,interests:split(e.target.value)})}/></label><label>CLUBS<input value={draft.clubs.join(", ")} onChange={e=>setDraft({...draft,clubs:split(e.target.value)})}/></label><label>ACTIVE PROJECTS<input value={draft.activeProjects.join(", ")} onChange={e=>setDraft({...draft,activeProjects:split(e.target.value)})}/></label><div className="modal-actions"><button className="text-button" onClick={close}>Cancel</button><button className="outline-button" onClick={()=>{repository.save(initialState);saveUserProfile(demoProfile);window.location.reload()}}>Reset demo</button><button className="create-button" onClick={()=>save(draft)}>SAVE CONTEXT ↗</button></div></div></div>}

createRoot(document.getElementById("root")!).render(<App/>);
