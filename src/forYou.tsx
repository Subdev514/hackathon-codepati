import React from "react";
import{eventFeed,isVideoUrl,createCampusStore,limitWords,wordCount,XFACTOR_WORD_LIMIT}from"./domain";
import type{CampusEvent,CampusState,FeedCard,UserProfile}from"./domain";
type Mutate=(fn:(store:ReturnType<typeof createCampusStore>)=>void)=>void;

// Only http(s) links are rendered, so a pasted "javascript:" URL can never run.
export function safeUrl(url?:string){if(!url)return undefined;try{const parsed=new URL(url.trim());return parsed.protocol==="https:"||parsed.protocol==="http:"?parsed.href:undefined}catch{return undefined}}

// Media and logos may also be images uploaded from the device, stored as data URLs.
export function safeMediaUrl(url?:string){if(url&&/^data:image\/(png|jpeg|webp|gif);base64,[a-z0-9+/=]+$/i.test(url.trim()))return url.trim();return safeUrl(url)}

export function embedUrl(url:string){
const youtube=url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{6,})/i);if(youtube)return "https://www.youtube.com/embed/"+youtube[1];
const vimeo=url.match(/vimeo\.com\/(\d+)/i);if(vimeo)return "https://player.vimeo.com/video/"+vimeo[1];
return undefined;
}

function initials(name:string){return name.split(/\s+/).filter(Boolean).slice(0,2).map(w=>w[0]).join("").toUpperCase()||"CS"}
function hue(name:string){let h=0;for(const c of name)h=(h*31+c.charCodeAt(0))%360;return h}

export function SocietyLogo({name,logo}:{name:string;logo?:string}){
const src=safeMediaUrl(logo);
const[broken,setBroken]=React.useState(false);
if(src&&!broken)return <img className="society-logo" src={src} alt={name+" logo"} onError={()=>setBroken(true)}/>;
return <span className="society-logo monogram" style={{"--logo-hue":hue(name)} as React.CSSProperties} aria-label={name+" logo"} role="img">{initials(name)}</span>;
}

function EventMedia({card}:{card:FeedCard}){
const media=card.media.map(safeMediaUrl).filter((u):u is string=>Boolean(u));
const[index,setIndex]=React.useState(0);
if(!media.length)return <div className="feed-media placeholder"><SocietyLogo name={card.societyName} logo={card.societyLogo}/><span>{card.event.nature||"Campus event"}</span></div>;
const url=media[Math.min(index,media.length-1)];
const embed=embedUrl(url);
return <div className="feed-media">
{embed?<iframe src={embed} title={card.event.name+" video"} loading="lazy" allow="accelerometer; encrypted-media; picture-in-picture; fullscreen" allowFullScreen/>:isVideoUrl(url)?<video src={url} controls preload="metadata" playsInline/>:<img src={url} alt={card.event.name} loading="lazy"/>}
{media.length>1&&<div className="feed-media-nav">{media.map((m,i)=><button key={m+i} className={i===index?"active":""} aria-label={"Show media "+(i+1)+" of "+media.length} onClick={()=>setIndex(i)}/>)}</div>}
</div>;
}

function timeAgo(iso:string){const s=Math.max(0,(Date.now()-Date.parse(iso))/1000);if(s<60)return "just now";if(s<3600)return Math.floor(s/60)+"m ago";if(s<86400)return Math.floor(s/3600)+"h ago";return Math.floor(s/86400)+"d ago"}

function Discussion({card,profile,mutate}:{card:FeedCard;profile:UserProfile;mutate:Mutate}){
const[open,setOpen]=React.useState(false);
const[draft,setDraft]=React.useState("");
const id="discussion-"+card.event.id;
const post=()=>{const text=draft.trim();if(!text)return;mutate(store=>store.addEventComment({id:"comment-"+Date.now(),eventId:card.event.id,userId:profile.id,author:profile.name,text:text.slice(0,1000),createdAt:new Date().toISOString()}));setDraft("")};
return <div className="feed-discussion">
<button className="feed-discussion-toggle" aria-expanded={open} aria-controls={id} onClick={()=>setOpen(o=>!o)}>DISCUSSION · {card.comments.length} {open?"−":"+"}</button>
{open&&<div id={id}>
{card.comments.length?<ul className="feed-comments">{card.comments.map(c=><li key={c.id}><div><b>{c.author}</b><small>{timeAgo(c.createdAt)}</small>{c.userId===profile.id&&<button onClick={()=>mutate(store=>store.removeEventComment(c.id))} aria-label="Delete your comment">DELETE</button>}</div><p>{c.text}</p></li>)}</ul>:<p className="feed-empty">No comments yet. Ask a question or start the conversation.</p>}
<div className="feed-composer"><textarea value={draft} maxLength={1000} placeholder={"Comment as "+profile.name+"…"} aria-label={"Comment on "+card.event.name} onChange={e=>setDraft(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&(e.ctrlKey||e.metaKey))post()}}/><button className="create-button" disabled={!draft.trim()} onClick={post}>POST</button></div>
</div>}
</div>;
}

function FeedEventCard({card,profile,mutate,preview=false}:{card:FeedCard;profile:UserProfile;mutate:Mutate;preview?:boolean}){
const{event}=card;
const register=safeUrl(card.registrationLink);
const vote=(value:1|-1)=>mutate(store=>store.voteEvent(event.id,profile.id,value));
return <article className={"feed-card"+(preview?" preview":"")}>
<header className="feed-card-head"><SocietyLogo name={card.societyName} logo={card.societyLogo}/><div><b>{card.societyName}</b><small>{event.nature||"Campus event"}{event.status==="in_progress"?" · IN PROGRESS":""}</small></div></header>
<EventMedia card={card}/>
<div className="feed-card-body">
<h3>{event.name}</h3>
{card.xfactor&&<p className="feed-xfactor"><span>X-FACTOR</span>{card.xfactor}</p>}
<p className="feed-description">{card.description}</p>
<dl className="feed-facts">
<div><dt>DATE</dt><dd>{event.date||"TBA"}</dd></div>
<div><dt>VENUE</dt><dd>{event.venue||"TBA"}</dd></div>
{card.specialGuests.length>0&&<div className="wide"><dt>SPECIAL GUESTS</dt><dd>{card.specialGuests.join(", ")}</dd></div>}
</dl>
<div className="feed-actions">
<div className="feed-votes" role="group" aria-label={"Vote on "+event.name}>
<button className={card.myVote===1?"active up":"up"} aria-pressed={card.myVote===1} aria-label={"Upvote ("+card.upvotes+")"} disabled={preview} onClick={()=>vote(1)}>▲ <span>{card.upvotes}</span></button>
<b aria-label="Score">{card.score}</b>
<button className={card.myVote===-1?"active down":"down"} aria-pressed={card.myVote===-1} aria-label={"Downvote ("+card.downvotes+")"} disabled={preview} onClick={()=>vote(-1)}>▼ <span>{card.downvotes}</span></button>
</div>
{register?<a className="create-button feed-register" href={register} target="_blank" rel="noreferrer">REGISTER ↗</a>:<span className="feed-register-closed">REGISTRATION LINK TBA</span>}
</div>
{!preview&&<Discussion card={card} profile={profile} mutate={mutate}/>}
</div>
</article>;
}

export function EventFeed({state,profile,mutate}:{state:CampusState;profile:UserProfile;mutate:Mutate}){
const cards=eventFeed(state,profile);
const[posting,setPosting]=React.useState(false);
return <section className="event-feed" aria-label="Upcoming events">
<div className="section-heading"><div><span>UPCOMING EVENTS · {cards.length}</span><h2>Happening around you</h2></div><button className="create-button" onClick={()=>setPosting(true)}><span>+</span>POST EVENT</button></div>
{cards.length?<div className="event-feed-grid">{cards.map(card=><FeedEventCard key={card.event.id} card={card} profile={profile} mutate={mutate}/>)}</div>:<p className="feed-empty">No upcoming events yet. Be the first to post one.</p>}
{posting&&<PostEventForm state={state} profile={profile} close={()=>setPosting(false)} save={event=>mutate(store=>store.addEvent(event))}/>}
</section>;
}

// ---- Post an event ------------------------------------------------------------------------

export const MAX_UPLOADED_PHOTOS=4;
export type EventDraft={societyId:string;societyName:string;societyLogo:string;name:string;nature:string;description:string;xfactor:string;date:string;venue:string;registrationLink:string;specialGuests:string;media:string[]};
export const OTHER_SOCIETY="__other__";
export const emptyDraft=(state:CampusState):EventDraft=>({societyId:state.societies[0]?.id||OTHER_SOCIETY,societyName:"",societyLogo:"",name:"",nature:"",description:"",xfactor:"",date:"",venue:"",registrationLink:"",specialGuests:"",media:[]});
const NATURES=["Workshop","Competition / Hackathon","Talk / Seminar","Cultural","Sports","Networking","Exhibition","Fest"];

function slugify(v:string){return v.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"")||"society"}
function draftSociety(state:CampusState,draft:EventDraft){return draft.societyId===OTHER_SOCIETY?undefined:state.societies.find(s=>s.id===draft.societyId)}
function draftSocietyName(state:CampusState,draft:EventDraft){return (draftSociety(state,draft)?.name||draft.societyName).trim()}
function localToday(){const d=new Date();return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")}

// "2026-10-15" → "October 15, 2026", matching the dates already stored on events.
export function formatEventDate(iso:string){const d=new Date(iso+"T00:00:00Z");return Number.isNaN(d.getTime())?iso:d.toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric",timeZone:"UTC"})}

export function validateEventDraft(state:CampusState,draft:EventDraft,today=localToday()){
const errors:Partial<Record<keyof EventDraft,string>>={};
if(!draftSocietyName(state,draft))errors.societyName="Choose or name the hosting society.";
if(!draft.name.trim())errors.name="Give the event a name.";
if(!draft.description.trim())errors.description="Describe the event.";
if(!draft.xfactor.trim())errors.xfactor="Add the X-factor line.";
else if(wordCount(draft.xfactor)>XFACTOR_WORD_LIMIT)errors.xfactor="Keep the X-factor to "+XFACTOR_WORD_LIMIT+" words.";
if(!/^\d{4}-\d{2}-\d{2}$/.test(draft.date))errors.date="Pick the event date.";
else if(draft.date<today)errors.date="The date has already passed.";
if(!draft.venue.trim())errors.venue="Add the venue.";
if(!draft.registrationLink.trim())errors.registrationLink="Add the registration link.";
else if(!safeUrl(draft.registrationLink))errors.registrationLink="Use a full link starting with https://";
if(draft.societyLogo&&!safeMediaUrl(draft.societyLogo))errors.societyLogo="Use an uploaded image or an https:// link.";
return errors;
}

export function buildEventFromDraft(state:CampusState,draft:EventDraft,id="event-"+Date.now()):CampusEvent{
const society=draftSociety(state,draft);
const societyName=draftSocietyName(state,draft);
return {id,name:draft.name.trim(),societyId:society?.id||slugify(societyName),societyName,date:formatEventDate(draft.date),nature:draft.nature.trim(),highlight:draft.xfactor.trim(),specialGuests:draft.specialGuests.split(",").map(x=>x.trim()).filter(Boolean),progress:0,venue:draft.venue.trim(),deadline:"",eligibility:"",status:"upcoming",description:draft.description.trim(),registrationLink:safeUrl(draft.registrationLink),xfactor:draft.xfactor.trim(),media:draft.media,societyLogo:draft.societyLogo||undefined};
}

// Downscale an uploaded image in the browser so it fits comfortably in local storage.
async function imageFileToDataUrl(file:File,maxSide:number,type:"image/jpeg"|"image/png"){
if(!file.type.startsWith("image/"))throw new Error(file.name+" is not an image. Add videos as a YouTube, Vimeo or .mp4 link.");
if(file.size>15*1024*1024)throw new Error(file.name+" is larger than 15 MB.");
const bitmap=await createImageBitmap(file);
const scale=Math.min(1,maxSide/Math.max(bitmap.width,bitmap.height));
const canvas=document.createElement("canvas");canvas.width=Math.round(bitmap.width*scale);canvas.height=Math.round(bitmap.height*scale);
canvas.getContext("2d")!.drawImage(bitmap,0,0,canvas.width,canvas.height);bitmap.close();
return canvas.toDataURL(type,0.82);
}

function Field({label,error,hint,children}:{label:string;error?:string;hint?:React.ReactNode;children:React.ReactNode}){
return <label className={"post-field"+(error?" invalid":"")}><span className="post-field-label">{label}{hint&&<small>{hint}</small>}</span>{children}{error&&<em role="alert">{error}</em>}</label>;
}

function PostEventForm({state,profile,close,save}:{state:CampusState;profile:UserProfile;close:()=>void;save:(event:CampusEvent)=>void}){
const[draft,setDraft]=React.useState<EventDraft>(()=>emptyDraft(state));
const[submitted,setSubmitted]=React.useState(false);
const[mediaLink,setMediaLink]=React.useState("");
const[uploadError,setUploadError]=React.useState("");
const[busy,setBusy]=React.useState(false);
const set=<K extends keyof EventDraft>(key:K,value:EventDraft[K])=>setDraft(d=>({...d,[key]:value}));
const errors=validateEventDraft(state,draft);
// Before the first submit, only the X-factor limit is flagged (live, as the user types).
const shown:typeof errors=submitted?errors:{xfactor:wordCount(draft.xfactor)>XFACTOR_WORD_LIMIT?errors.xfactor:undefined};
const society=draftSociety(state,draft);
const societyName=draftSocietyName(state,draft)||"Your society";
const logo=draft.societyLogo||society?.logo;
const words=wordCount(draft.xfactor);
const photoCount=draft.media.filter(m=>m.startsWith("data:")).length;
React.useEffect(()=>{const onKey=(e:KeyboardEvent)=>{if(e.key==="Escape")close()};window.addEventListener("keydown",onKey);return()=>window.removeEventListener("keydown",onKey)},[close]);

const upload=async(files:FileList|null,kind:"logo"|"media")=>{
if(!files?.length)return;setUploadError("");setBusy(true);
try{
if(kind==="logo")set("societyLogo",await imageFileToDataUrl(files[0],160,"image/png"));
else{
const room=MAX_UPLOADED_PHOTOS-photoCount;
if(files.length>room)setUploadError("You can upload up to "+MAX_UPLOADED_PHOTOS+" photos; add more as links.");
const added:string[]=[];for(const file of Array.from(files).slice(0,Math.max(0,room)))added.push(await imageFileToDataUrl(file,1280,"image/jpeg"));
setDraft(d=>({...d,media:[...d.media,...added]}));
}
}catch(e){setUploadError(e instanceof Error?e.message:"Could not read that file.")}
finally{setBusy(false)}
};
const addLink=()=>{const url=safeUrl(mediaLink);if(!url){setUploadError("Media links must start with https://");return}setUploadError("");setDraft(d=>({...d,media:[...d.media,url]}));setMediaLink("")};
const submit=()=>{setSubmitted(true);if(Object.keys(errors).length)return;save(buildEventFromDraft(state,draft));close()};

const previewEvent=buildEventFromDraft(state,{...draft,name:draft.name||"Your event name",venue:draft.venue||"Venue"},"preview");
const previewCard:FeedCard={event:{...previewEvent,date:draft.date?previewEvent.date:"Date"},societyName,societyLogo:logo,description:draft.description||"Your description appears here.",registrationLink:safeUrl(draft.registrationLink),specialGuests:previewEvent.specialGuests,xfactor:limitWords(draft.xfactor||"Your X-factor line appears here."),media:draft.media,score:0,upvotes:0,downvotes:0,myVote:0,comments:[],relevance:0};
const errorCount=Object.keys(errors).length;

return <div className="modal-backdrop" onMouseDown={close}><div className="modal post-event-modal" role="dialog" aria-modal="true" aria-labelledby="post-event-title" onMouseDown={e=>e.stopPropagation()}>
<div className="modal-top"><div><span className="signal-line">FOR YOU · NEW EVENT</span><h2 id="post-event-title">Post an event.</h2><p>Everything students see on the For You card. Posting as {profile.name}.</p></div><button onClick={close} aria-label="Close">×</button></div>
<div className="post-event-layout">
<div className="post-event-form">
<fieldset><legend>SOCIETY</legend>
<div className="form-grid">
<Field label="HOSTING SOCIETY" error={draft.societyId===OTHER_SOCIETY?undefined:shown.societyName}><select value={draft.societyId} onChange={e=>set("societyId",e.target.value)}>{state.societies.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}<option value={OTHER_SOCIETY}>Another society…</option></select></Field>
{draft.societyId===OTHER_SOCIETY&&<Field label="SOCIETY NAME" error={shown.societyName}><input value={draft.societyName} maxLength={80} placeholder="e.g. Robotics Society" onChange={e=>set("societyName",e.target.value)}/></Field>}
</div>
<div className="post-logo-row"><SocietyLogo name={societyName} logo={logo}/><div><span className="post-field-label">SOCIETY LOGO <small>optional · initials badge otherwise</small></span><div className="post-inline"><label className="outline-button post-upload">UPLOAD LOGO<input type="file" accept="image/*" onChange={e=>{upload(e.target.files,"logo");e.target.value=""}}/></label>{draft.societyLogo&&<button className="text-button" onClick={()=>set("societyLogo","")}>REMOVE</button>}</div>{shown.societyLogo&&<em className="post-error" role="alert">{shown.societyLogo}</em>}</div></div>
</fieldset>
<fieldset><legend>EVENT</legend>
<Field label="EVENT NAME" error={shown.name}><input value={draft.name} maxLength={120} placeholder="e.g. 24-Hour AI Hackathon" onChange={e=>set("name",e.target.value)}/></Field>
<Field label="TYPE OF EVENT" hint="optional"><input list="post-event-natures" value={draft.nature} maxLength={60} placeholder="Workshop, Hackathon, Talk…" onChange={e=>set("nature",e.target.value)}/><datalist id="post-event-natures">{NATURES.map(n=><option key={n} value={n}/>)}</datalist></Field>
<Field label="DESCRIPTION" error={shown.description}><textarea value={draft.description} maxLength={1500} placeholder="What happens, who it is for and what attendees take away." onChange={e=>set("description",e.target.value)}/></Field>
<Field label="X-FACTOR" error={shown.xfactor} hint={<span className={"word-counter"+(words>XFACTOR_WORD_LIMIT?" over":"")}>{words}/{XFACTOR_WORD_LIMIT} WORDS</span>}><input value={draft.xfactor} placeholder="Why this event is worth showing up for, in one line." aria-invalid={Boolean(shown.xfactor)} onChange={e=>set("xfactor",e.target.value)}/></Field>
<div className="form-grid">
<Field label="DATE" error={shown.date}><input type="date" value={draft.date} min={localToday()} onChange={e=>set("date",e.target.value)}/></Field>
<Field label="VENUE" error={shown.venue}><input value={draft.venue} maxLength={120} placeholder="e.g. Innovation Lab, Campus 15" onChange={e=>set("venue",e.target.value)}/></Field>
</div>
<Field label="REGISTRATION LINK" error={shown.registrationLink}><input type="url" inputMode="url" value={draft.registrationLink} placeholder="https://forms.gle/…" onChange={e=>set("registrationLink",e.target.value)}/></Field>
<Field label="SPECIAL GUESTS" hint="optional · separate with commas"><input value={draft.specialGuests} placeholder="e.g. Dr. A. Rao, Industry mentor panel" onChange={e=>set("specialGuests",e.target.value)}/></Field>
</fieldset>
<fieldset><legend>IMAGE / VIDEO</legend>
<div className="post-inline"><label className={"outline-button post-upload"+(photoCount>=MAX_UPLOADED_PHOTOS?" disabled":"")}>UPLOAD PHOTOS<input type="file" accept="image/*" multiple disabled={photoCount>=MAX_UPLOADED_PHOTOS} onChange={e=>{upload(e.target.files,"media");e.target.value=""}}/></label><small className="post-note">{photoCount}/{MAX_UPLOADED_PHOTOS} photos · resized automatically</small></div>
<div className="post-inline post-link"><input value={mediaLink} aria-label="Media link" placeholder="Or paste a YouTube, Vimeo, .mp4 or image link" onChange={e=>setMediaLink(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"){e.preventDefault();addLink()}}}/><button className="outline-button" disabled={!mediaLink.trim()} onClick={addLink}>ADD LINK</button></div>
{uploadError&&<em className="post-error" role="alert">{uploadError}</em>}
{busy&&<small className="post-note">Processing…</small>}
{draft.media.length>0&&<ul className="post-media-list">{draft.media.map((m,i)=><li key={i}>{m.startsWith("data:")?<img src={m} alt=""/>:<span>{embedUrl(m)||isVideoUrl(m)?"VIDEO":"LINK"}</span>}<small>{m.startsWith("data:")?"Uploaded photo":m}</small><button className="text-button" aria-label={"Remove media "+(i+1)} onClick={()=>setDraft(d=>({...d,media:d.media.filter((_,j)=>j!==i)}))}>REMOVE</button></li>)}</ul>}
</fieldset>
</div>
<aside className="post-event-preview" aria-label="Card preview"><span className="signal-line">LIVE PREVIEW</span><FeedEventCard card={previewCard} profile={profile} mutate={()=>{}} preview/></aside>
</div>
{submitted&&errorCount>0&&<p className="post-error" role="alert">Fix the {errorCount} highlighted field{errorCount>1?"s":""} to post.</p>}
<div className="modal-actions"><button className="text-button" onClick={close}>Cancel</button><button className="create-button" disabled={busy} onClick={submit}>POST EVENT ↗</button></div>
</div></div>;
}
