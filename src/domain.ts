export type EntityType="user"|"club"|"event"|"opportunity"|"resource"|"task"|"deadline"|"project"|"person"|"notice"|"competition";
export type RelationType="member_of"|"organizes"|"has_deadline"|"requires"|"derived_from"|"references"|"interested_in"|"uses"|"assigned_to"|"participates_in";
export type Entity={id:string;type:EntityType;name:string;meta?:string};
export type Relationship={from:string;relation:RelationType;to:string;reason?:string};
export type Post={id:number;type:string;title:string;body:string;author:string;club:string;time:string;votes:number;comments:number;tags:string[];deadline?:string;linked?:string;sourceText?:string};
export type Task={id:number;title:string;meta:string;done:boolean;source:string};
export type AnnouncementInput={title:string;body:string;type:string;author:string;club:string};
export type ExtractedAnnouncement={input:AnnouncementInput;event?:{name:string;date?:string};organization?:{name:string};opportunity?:{name:string};deadlines:Array<{label:string;date:string}>;requirements:string[];entities:Entity[];relationships:Relationship[];tasks:Task[];confidence:number;reasons:string[]};
export type CampusState={entities:Entity[];relationships:Relationship[];posts:Post[];tasks:Task[]};
export interface ExtractionProvider{understand(input:AnnouncementInput):Promise<ExtractedAnnouncement>}
export type ExtractionValidation={valid:boolean;errors:string[]};
export function validateExtraction(result:ExtractedAnnouncement):ExtractionValidation{
const errors:string[]=[];
if(!result.input.title.trim()||!result.input.body.trim())errors.push("Announcement title and body are required");
if(result.confidence<0||result.confidence>1)errors.push("Confidence must be between 0 and 1");
const entityIds=new Set<string>();
for(const entity of result.entities){if(!entity.id||!entity.name)errors.push("Every entity needs an id and name");if(entityIds.has(entity.id))errors.push("Duplicate entity id: "+entity.id);entityIds.add(entity.id)}
for(const relation of result.relationships){
if(!entityIds.has(relation.from)&&!result.entities.some(e=>e.id===relation.from))errors.push("Relationship source is missing: "+relation.from);
if(!entityIds.has(relation.to)&&!result.entities.some(e=>e.id===relation.to))errors.push("Relationship target is missing: "+relation.to);
}
for(const task of result.tasks)if(!task.title.trim()||!task.source)errors.push("Every generated task needs a title and source");
return {valid:errors.length===0,errors};
}
export function normalizeExtraction(result:ExtractedAnnouncement):ExtractedAnnouncement{
const entities=[...new Map(result.entities.map(e=>[e.id,e])).values()];
const relationships=[...new Map(result.relationships.map(r=>[r.from+"|"+r.relation+"|"+r.to,r])).values()].filter(r=>entities.some(e=>e.id===r.from)&&entities.some(e=>e.id===r.to));
const deadlines=[...new Map(result.deadlines.map(d=>[d.label+"|"+d.date,d])).values()];
const requirements=[...new Set(result.requirements)];
const tasks=[...new Map(result.tasks.map(t=>[t.title+"|"+t.source,t])).values()];
return {...result,entities,relationships,deadlines,requirements,tasks,reasons:[...new Set(result.reasons)]};
}
export const deterministicExtractionProvider:ExtractionProvider={understand:async(input)=>normalizeExtraction(extractAnnouncement(input))};
export const entities:Entity[]=[
{id:"ai-club",type:"club",name:"AI Club",meta:"Student organization"},
{id:"ai-hackathon",type:"event",name:"AI Hackathon",meta:"24-hour · Oct 15"},
{id:"hack-deadline",type:"deadline",name:"Registration · Oct 10",meta:"Deadline"},
{id:"hack-team",type:"project",name:"Team of 2–4",meta:"Participation requirement"},
{id:"ms-ambassador",type:"opportunity",name:"Microsoft Ambassador",meta:"Career opportunity"},
{id:"figma",type:"event",name:"Figma Workshop",meta:"Design Club event"},
{id:"cn-notes",type:"resource",name:"CN Viva Notes",meta:"Academic resource"}];
export const relationships:Relationship[]=[
{from:"ai-club",relation:"organizes",to:"ai-hackathon"},
{from:"ai-hackathon",relation:"has_deadline",to:"hack-deadline"},
{from:"ai-hackathon",relation:"requires",to:"hack-team"},
{from:"ms-ambassador",relation:"references",to:"ai-hackathon"}];
export const posts:Post[]=[
{id:1,type:"EVENT",title:"24-Hour AI Hackathon — registrations are open",body:"Build anything with AI. Teams of 2–4. Registration closes October 10 and idea submissions close October 13.",author:"AI Club",club:"AI Club",time:"2h",votes:128,comments:24,tags:["AI/ML","Hackathon","Teams"],deadline:"Oct 10",linked:"AI Hackathon"},
{id:2,type:"OPPORTUNITY",title:"Microsoft is opening applications for the student ambassador program",body:"Applications are open to students interested in developer communities, events and technology advocacy.",author:"Tech Society",club:"Tech Society",time:"5h",votes:91,comments:18,tags:["Career","Microsoft"],deadline:"Oct 18",linked:"Microsoft Ambassador"},
{id:3,type:"EVENT",title:"Design Club: Figma crash course this Saturday",body:"A practical two-hour session covering components, auto-layout and prototyping. Bring your laptop.",author:"Design Club",club:"Design Club",time:"1d",votes:64,comments:11,tags:["Design","Workshop"],linked:"Figma Workshop"},
{id:4,type:"RESOURCE",title:"Seniors uploaded the complete CN lab viva notes",body:"Routing, transport layer, socket programming and common viva questions in one place.",author:"B-30 Community",club:"B-30",time:"1d",votes:52,comments:9,tags:["Academics","CN"],linked:"CN Viva Notes"}];
export const initialTasks:Task[]=[
{id:1,title:"Register for AI Hackathon",meta:"AI Club · due Oct 10",done:false,source:"ai-hackathon"},
{id:2,title:"Find 1–3 hackathon teammates",meta:"Derived from team size 2–4",done:false,source:"AI Hackathon"},
{id:3,title:"Prepare hackathon idea submission",meta:"AI Club · due Oct 13",done:false,source:"AI Hackathon"},
{id:4,title:"Apply for Microsoft Ambassador",meta:"Tech Society · due Oct 18",done:false,source:"ms-ambassador"}];

export const initialState:CampusState={entities,relationships,posts,tasks:initialTasks};

export function createCampusStore(seed:CampusState=initialState){
let state:CampusState={entities:[...seed.entities],relationships:[...seed.relationships],posts:[...seed.posts],tasks:[...seed.tasks]};
let nextId=Math.max(99,...state.posts.map(p=>p.id),...state.tasks.map(t=>t.id))+1;
return {
getState:()=>state,
addPost:(post:Post)=>{state={...state,posts:[post,...state.posts]}},
addEntities:(items:Entity[])=>{state={...state,entities:[...state.entities,...items]}},
addRelationships:(items:Relationship[])=>{state={...state,relationships:[...state.relationships,...items]}},
addTasks:(items:Task[])=>{state={...state,tasks:[...state.tasks,...items]}},
toggleTask:(id:number)=>{state={...state,tasks:state.tasks.map(t=>t.id===id?{...t,done:!t.done}:t)}},
nextId:()=>nextId++
};
}

export function taskSourceName(state:CampusState,task:Task){return state.entities.find(e=>e.id===task.source)?.name||task.source}

function slug(value:string){return value.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"")}
function firstMatch(text:string,patterns:RegExp[]){for(const pattern of patterns){const match=text.match(pattern);if(match)return match}return undefined}
function cleanName(value:string){return value.replace(/[“”"']/g,"").replace(/[.!?]+$/,"").trim()}
function dateText(value:string){return value.replace(/\bthe\b/gi,"").replace(/\s+/g," ").trim()}

export function extractAnnouncement(input:AnnouncementInput):ExtractedAnnouncement{
const text=(input.title+" "+input.body).replace(/\s+/g," ").trim();
const lower=text.toLowerCase();
const isOpportunity=input.type==="OPPORTUNITY"||/\b(opportunity|applications?|ambassador|internship|scholarship)\b/i.test(text);
const normalizedType=input.type.toUpperCase();
const specialType=normalizedType==="RESOURCE"?"resource":normalizedType==="NOTICE"?"notice":normalizedType==="COMPETITION"?"competition":normalizedType==="PROJECT"?"project":undefined;
const isEventLike=!isOpportunity&&!specialType||specialType==="competition";
const eventMatch=firstMatch(text,[/\b(?:conducting|hosting|organizing|running)\s+(?:a\s+)?(?:\d+[- ]hour\s+)?([^.!?]+?\s+(?:hackathon|workshop|event|meetup|session))\b/i,/\b([A-Z][A-Za-z0-9 -]+(?:hackathon|workshop|event|meetup|session))\b/i]);
const organizerPatterns=[/\b([A-Z][A-Za-z0-9& ]+?)\s+(?:is\s+)?(?:conducting|hosting|organizing|running)\b/i,/^([A-Z][A-Za-z0-9& ]+)\s+(?:is\s+)?(?:opening|announcing|inviting)\b/i];
const organizerMatch=firstMatch(input.body,organizerPatterns)||firstMatch(text,organizerPatterns);
const dateMatch=firstMatch(text,[/\bon\s+([A-Z][a-z]+\s+\d{1,2})\b/i,/\b(?:on|this)\s+(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)\b/i]);
const deadlineMatches=[...text.matchAll(/\b(?:registration|register|applications?|application|idea submission|submit(?:ting)?(?:\s+(?:the|their|your))?\s+idea|submission)\b[^.!?]{0,45}?\b(?:closes?|close|ends?|end|due|before)\s+([A-Z][a-z]+\s+\d{1,2}|\d{1,2}(?:st|nd|rd|th)?\s+[A-Z][a-z]+)\b/gi)];
const deadlineSeen=new Set<string>();
const deadlines=deadlineMatches.map(match=>({label:cleanName(match[0].split(/\s+(?:closes?|close|ends?|end|due|before)\s+/i)[0]),date:dateText(match[1])})).filter(item=>{const key=item.label+"|"+item.date;if(deadlineSeen.has(key))return false;deadlineSeen.add(key);return true});
const teamMatch=firstMatch(text,[/\bteams?\s+(?:of\s+)?(\d+)\s*(?:-|–|—|to)\s*(\d+)\b/i,/\b(\d+)\s*(?:-|to)\s*(\d+)\s+(?:members?|participants?)\b/i]);
const requirements:string[]=[];
if(teamMatch)requirements.push("Team size "+teamMatch[1]+"–"+teamMatch[2]);
if(/\bbring your laptop\b/i.test(text))requirements.push("Bring a laptop");
if(/\bsubmit (?:your|the|their) idea\b/i.test(text))requirements.push("Submit an idea");
const eventName=eventMatch?cleanName(eventMatch[1]):input.title;
const organizationName=organizerMatch?cleanName(organizerMatch[1]):input.club;
const baseId=slug(eventName||input.title)||"announcement";
const eventId=baseId;
const orgId=slug(organizationName)||"campus-source";
const extractedEntities:Entity[]=[];
const extractedRelationships:Relationship[]=[];
if(isOpportunity){
const opportunityName=cleanName(input.title.replace(/^opportunity[:\-]?/i,""));
extractedEntities.push({id:baseId,type:"opportunity",name:opportunityName,meta:"Extracted from announcement"});
if(organizationName)extractedEntities.push({id:orgId,type:"club",name:organizationName,meta:"Announcement source"});
extractedRelationships.push({from:orgId,relation:"organizes",to:baseId,reason:"Announcement source"});
}else{
const entityType= specialType||"event";
const entityName=specialType==="resource"?cleanName(input.title):specialType==="notice"?cleanName(input.title):eventName;
const entityMeta=specialType?("Extracted "+specialType+" announcement"):(dateMatch?"Event · "+dateText(dateMatch[1]):"Extracted from announcement");
extractedEntities.push({id:eventId,type:entityType as EntityType,name:entityName,meta:entityMeta});
if(organizationName)extractedEntities.push({id:orgId,type:"club",name:organizationName,meta:"Announcement source"});
if(organizationName)extractedRelationships.push({from:orgId,relation:"organizes",to:eventId,reason:"Announcement states the source organization"});
}
const tasks:Task[]=[];
let taskId=Date.now();
if(isEventLike&&teamMatch)tasks.push({id:taskId++,title:"Find "+Math.max(1,Number(teamMatch[1])-1)+"–"+Math.max(1,Number(teamMatch[2])-1)+" teammates",meta:"Derived from "+requirements[0],done:false,source:eventId});
for(const deadline of deadlines){
const label=deadline.label.toLowerCase();
let title=label.includes("registration")||label.includes("register")?"Register for "+eventName:label.includes("idea")||label.includes("submission")?"Prepare and submit idea":"Complete "+deadline.label;
tasks.push({id:taskId++,title,meta:"Derived deadline · "+deadline.date,done:false,source:eventId});
const deadlineId=slug(eventId+"-"+deadline.label+"-"+deadline.date);
extractedEntities.push({id:deadlineId,type:"deadline",name:deadline.label+" · "+deadline.date,meta:"Extracted deadline"});
extractedRelationships.push({from:eventId,relation:"has_deadline",to:deadlineId,reason:"Deadline extracted from announcement"});
}
if(isEventLike&&/\bidea\b/i.test(text)&&!tasks.some(t=>/idea/i.test(t.title)))tasks.push({id:taskId++,title:"Prepare hackathon idea",meta:"Derived from announcement requirement",done:false,source:eventId});
if(isOpportunity&&deadlines.length===0)tasks.push({id:taskId++,title:"Review and apply",meta:"Derived from opportunity announcement",done:false,source:baseId});
if(teamMatch){
const reqId=slug(eventId+"-team-"+teamMatch[1]+"-"+teamMatch[2]);
extractedEntities.push({id:reqId,type:"project",name:"Team of "+teamMatch[1]+"–"+teamMatch[2],meta:"Participation requirement"});
extractedRelationships.push({from:eventId,relation:"requires",to:reqId,reason:"Team constraint extracted from announcement"});
}
const reasons:string[]=[];
if(eventMatch)reasons.push("Detected an event name from event/hackathon language");
if(organizerMatch)reasons.push("Detected the publishing organization from organizer language");
if(dateMatch)reasons.push("Detected an event date");
if(deadlines.length)reasons.push("Detected "+deadlines.length+" deadline statement"+(deadlines.length===1?"":"s"));
if(teamMatch)reasons.push("Detected a team-size requirement");
const confidence=Math.min(0.98,0.45+reasons.length*0.09);
return {input,event:isOpportunity?undefined:{name:eventName,date:dateMatch?dateText(dateMatch[1]):undefined},organization:organizationName?{name:organizationName}:undefined,opportunity:isOpportunity?{name:eventName}:undefined,deadlines,requirements,entities:extractedEntities,relationships:extractedRelationships,tasks,confidence,reasons};
}

export function commitExtraction(store:ReturnType<typeof createCampusStore>,rawResult:ExtractedAnnouncement){
const result=normalizeExtraction(rawResult);
const validation=validateExtraction(result);
if(!validation.valid)throw new Error("Invalid extraction: "+validation.errors.join("; "));
const ids=new Set(store.getState().entities.map(e=>e.id));
store.addEntities(result.entities.filter(e=>!ids.has(e.id)));
store.addRelationships(result.relationships.filter(r=>!store.getState().relationships.some(x=>x.from===r.from&&x.relation===r.relation&&x.to===r.to)));
const mainName=result.event?.name||result.opportunity?.name||result.input.title;
const post:Post={id:store.nextId(),type:result.input.type||"NOTICE",title:result.input.title,body:result.input.body,author:result.input.author,club:result.input.club,time:"now",votes:0,comments:0,tags:["Campus OS","Understood"],deadline:result.deadlines[0]?.date,linked:mainName,sourceText:result.input.body};
store.addPost(post);
const existingTasks=store.getState().tasks;
store.addTasks(result.tasks.filter(t=>!existingTasks.some(x=>x.title===t.title&&x.source===t.source)));
return post;
}

export function generateWorkflow(source:string):Task[]{return initialTasks.filter(t=>t.source===source)}

export interface CampusPersistence{load():CampusState;save(state:CampusState):void;}
export interface CampusRepository extends CampusPersistence{sync?(state:CampusState):Promise<void>;}
const STORAGE_KEY="campus-os-state-v1";
export const localCampusPersistence:CampusPersistence={
load:()=>{
if(typeof window==="undefined")return initialState;
try{
const raw=window.localStorage.getItem(STORAGE_KEY);
if(!raw)return initialState;
const parsed=JSON.parse(raw) as CampusState;
if(!parsed||!Array.isArray(parsed.entities)||!Array.isArray(parsed.relationships)||!Array.isArray(parsed.posts)||!Array.isArray(parsed.tasks))return initialState;
return parsed;
}catch{return initialState}
},
save:(state)=>{if(typeof window==="undefined")return;try{window.localStorage.setItem(STORAGE_KEY,JSON.stringify(state))}catch{}}
};
export function createCampusRepository(persistence:CampusPersistence=localCampusPersistence):CampusRepository{return persistence;}
export function loadCampusState(){return localCampusPersistence.load();}
export function saveCampusState(state:CampusState){localCampusPersistence.save(state);}


export type UserProfile={id:string;name:string;branch:string;year:number;interests:string[];clubs:string[];activeProjects:string[]};
export const demoProfile:UserProfile={id:"user-shiv",name:"Shiv",branch:"CSE",year:2,interests:["AI/ML","Hackathon","Development","Career"],clubs:["AI Club"],activeProjects:["Campus OS"]};
const PROFILE_STORAGE_KEY="campus-os-profile-v1";
export function loadUserProfile():UserProfile{
if(typeof window==="undefined")return demoProfile;
try{const raw=window.localStorage.getItem(PROFILE_STORAGE_KEY);if(!raw)return demoProfile;const parsed=JSON.parse(raw) as UserProfile;if(!parsed||!parsed.name||!Array.isArray(parsed.interests)||!Array.isArray(parsed.clubs)||!Array.isArray(parsed.activeProjects))return demoProfile;return {...demoProfile,...parsed}}catch{return demoProfile}
}
export function saveUserProfile(profile:UserProfile){if(typeof window==="undefined")return;try{window.localStorage.setItem(PROFILE_STORAGE_KEY,JSON.stringify(profile))}catch{}}
export function relevanceForUser(post:Post,user:UserProfile=demoProfile){
const hay=(post.title+" "+post.body+" "+post.tags.join(" ")+" "+post.club).toLowerCase();
const matches=user.interests.filter(x=>hay.includes(x.toLowerCase()));
const clubMatch=user.clubs.some(x=>post.club.toLowerCase().includes(x.toLowerCase()));
const projectMatch=user.activeProjects.some(x=>hay.includes(x.toLowerCase()));
const score=matches.length+(clubMatch?2:0)+(projectMatch?2:0)+(post.type==="OPPORTUNITY"&&user.year>=2?1:0);
const reasons:string[]=[];
if(matches.length)reasons.push("matches "+matches.slice(0,2).join(" and "));
if(clubMatch)reasons.push("from a club you follow");
if(projectMatch)reasons.push("connected to an active project");
if(post.type==="OPPORTUNITY"&&user.year>=2)reasons.push("career opportunity for your year");
return {score,reasons};
}

export type DeadlineStatus="upcoming"|"due_soon"|"overdue"|"today";
export function deadlineStatus(dateText:string,now=new Date()):DeadlineStatus{
const match=dateText.match(/([A-Z][a-z]+)\s+(\d{1,2})/);if(!match)return "upcoming";
const due=new Date(now.getFullYear(),new Date(match[1]+" 1, "+now.getFullYear()).getMonth(),Number(match[2]),23,59,59);
if(due.getTime()<now.getTime())return "overdue";
const days=Math.ceil((due.getTime()-now.getTime())/86400000);if(days<=1)return "today";if(days<=7)return "due_soon";return "upcoming";
}
export function campusDeadlines(state:CampusState,now=new Date()){
const rank:Record<DeadlineStatus,number>={overdue:0,today:1,due_soon:2,upcoming:3};
return state.entities.filter(e=>e.type==="deadline").map(entity=>{
const relation=state.relationships.find(r=>r.to===entity.id&&r.relation==="has_deadline");
const source=relation?state.entities.find(e=>e.id===relation.from):undefined;
const task=source?state.tasks.find(t=>t.source===source.id&&!t.done):undefined;
const date=entity.name.match(/[A-Z][a-z]+\s+\d{1,2}/)?.[0]||"";
return {entity,source,task,date,status:deadlineStatus(date,now)};
}).sort((a,b)=>rank[a.status]-rank[b.status]);
}
