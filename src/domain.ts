export type EntityType="user"|"club"|"event"|"opportunity"|"resource"|"task"|"deadline"|"project";
export type RelationType="member_of"|"organizes"|"has_deadline"|"requires"|"derived_from"|"references"|"interested_in"|"uses";
export type Entity={id:string;type:EntityType;name:string;meta?:string};
export type Relationship={from:string;relation:RelationType;to:string};
export type Post={id:number;type:string;title:string;body:string;author:string;club:string;time:string;votes:number;comments:number;tags:string[];deadline?:string;linked?:string};
export type Task={id:number;title:string;meta:string;done:boolean;source:string};
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
{from:"ai-hackathon",relation:"derived_from",to:"hack-deadline"},
{from:"ms-ambassador",relation:"references",to:"ai-hackathon"}];
export const posts:Post[]=[
{id:1,type:"EVENT",title:"24-Hour AI Hackathon — registrations are open",body:"Build anything with AI. Teams of 2–4. Registration closes October 10 and idea submissions close October 13.",author:"AI Club",club:"AI Club",time:"2h",votes:128,comments:24,tags:["AI/ML","Hackathon","Teams"],deadline:"Oct 10",linked:"AI Hackathon"},
{id:2,type:"OPPORTUNITY",title:"Microsoft is opening applications for the student ambassador program",body:"Applications are open to students interested in developer communities, events and technology advocacy.",author:"Tech Society",club:"Tech Society",time:"5h",votes:91,comments:18,tags:["Career","Microsoft"],deadline:"Oct 18",linked:"Microsoft Ambassador"},
{id:3,type:"EVENT",title:"Design Club: Figma crash course this Saturday",body:"A practical two-hour session covering components, auto-layout and prototyping. Bring your laptop.",author:"Design Club",club:"Design Club",time:"1d",votes:64,comments:11,tags:["Design","Workshop"],linked:"Figma Workshop"},
{id:4,type:"RESOURCE",title:"Seniors uploaded the complete CN lab viva notes",body:"Routing, transport layer, socket programming and common viva questions in one place.",author:"B-30 Community",club:"B-30",time:"1d",votes:52,comments:9,tags:["Academics","CN"],linked:"CN Viva Notes"}];
export const initialTasks:Task[]=[
{id:1,title:"Register for AI Hackathon",meta:"AI Club · due Oct 10",done:false,source:"AI Hackathon"},
{id:2,title:"Find 1–3 hackathon teammates",meta:"Derived from team size 2–4",done:false,source:"AI Hackathon"},
{id:3,title:"Prepare hackathon idea submission",meta:"AI Club · due Oct 13",done:false,source:"AI Hackathon"},
{id:4,title:"Apply for Microsoft Ambassador",meta:"Tech Society · due Oct 18",done:false,source:"Microsoft Ambassador"}];
export function generateWorkflow(source:string):Task[]{if(source==="AI Hackathon")return initialTasks.filter(t=>t.source===source);if(source==="Microsoft Ambassador")return initialTasks.filter(t=>t.source===source);return []}