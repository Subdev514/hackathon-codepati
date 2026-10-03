export type EntityType="user"|"club"|"event"|"opportunity"|"resource"|"task"|"deadline"|"project"|"person"|"notice"|"competition"|"registration"|"milestone"|"volunteer_slot";
export type RelationType="member_of"|"organizes"|"has_deadline"|"requires"|"derived_from"|"references"|"interested_in"|"uses"|"assigned_to"|"participates_in"|"registration_for"|"volunteers_for"|"milestone_of"|"supports";
export type Entity={id:string;type:EntityType;name:string;meta?:string};
export type Relationship={from:string;relation:RelationType;to:string;reason?:string};
export type Post={id:number;type:string;title:string;body:string;author:string;club:string;time:string;votes:number;comments:number;tags:string[];deadline?:string;linked?:string;sourceText?:string};
export type Task={id:number;title:string;meta:string;done:boolean;source:string;dueDate?:string;kind?:"task"|"reminder"|"project_action"};
export type CampusEvent={id:string;name:string;societyId:string;societyName:string;date:string;nature:string;highlight:string;specialGuests:string[];progress:number;venue:string;deadline:string;eligibility:string;status:"upcoming"|"in_progress"|"completed"|"cancelled";description?:string;registrationLink?:string;xfactor?:string;media?:string[];societyLogo?:string;};
export type EventVote={eventId:string;userId:string;value:1|-1;};
export type EventComment={id:string;eventId:string;userId:string;author:string;text:string;createdAt:string;};
export type SocietyMember={userId:string;name:string;position:string;};
export type SocietyTimelineItem={id:string;date:string;title:string;description:string;};
export type Society={id:string;name:string;description:string;members:string[];leads:string[];fic:string;genre:string;xfactor:string;timeline:SocietyTimelineItem[];publicMembers:SocietyMember[];logo?:string;};
export type SocietyEventPost={id:string;societyId:string;eventId:string;title:string;postedBy:string;collaboratingSocieties:string[];description?:string;registrationLink?:string;prizes?:string;specialGuests:string[];joinReason:string;xfactor:string;media:string[];status:"upcoming"|"past";winners:string[];};
export type SocietyTask={id:number;eventId:string;societyId:string;title:string;assignee:string;role:"member"|"lead";done:boolean;dueDate:string;priority:"low"|"medium"|"high";};
export type SocietyBudget={eventId:string;societyId:string;estimated:number;actual:number;sponsorship:number;currency:string;};
export type PromotionItem={id:string;eventId:string;societyId:string;channel:string;owner:string;plannedDate:string;status:"planned"|"in_progress"|"done";};
export type ResourceRequirement={id:string;eventId:string;societyId:string;category:"equipment"|"room"|"volunteer"|"certificate"|"prize"|"technical"|"other";item:string;quantity:string;owner:string;status:"needed"|"requested"|"confirmed"|"done";};
export type SocietyAnalysis={eventId:string;registrations:number;attendees:number;winners:string[];participantFeedback:string[];guestFeedback:string[];whatWentWell:string[];problems:string[];suggestions:string[];finalExpenditure:number;photos:string[];sponsors:string[];eventReport:string;};
export type GuestRole="chief_guest"|"speaker"|"judge"|"mentor"|"performer";
export type GuestStatus="invited"|"tentative"|"confirmed"|"declined";
export type EventGuest={id:string;eventId:string;societyId:string;name:string;designation:string;role:GuestRole;status:GuestStatus;host:string;contact?:string;arrival?:string;needs:string[];honorarium:number;notes?:string;};
export type BudgetCategory="venue"|"food"|"prizes"|"marketing"|"travel"|"equipment"|"honorarium"|"sponsorship"|"other";
export type BudgetItem={id:string;eventId:string;societyId:string;label:string;category:BudgetCategory;kind:"expense"|"income";planned:number;actual:number;status:"planned"|"committed"|"paid"|"received";owner:string;};
export type PollOption={id:string;label:string;};
export type SocietyPoll={id:string;societyId:string;eventId?:string;question:string;options:PollOption[];createdBy:string;createdAt:string;closesAt?:string;status:"open"|"closed";allowMultiple:boolean;};
export type PollVote={pollId:string;userId:string;optionIds:string[];};
export type ConflictKind="venue"|"schedule"|"guest"|"member"|"resource"|"budget"|"readiness";
export type ConflictSeverity="high"|"medium"|"low";
export type Conflict={id:string;kind:ConflictKind;severity:ConflictSeverity;title:string;detail:string;eventIds:string[];societyIds:string[];source:"campus"|"notion";};
// An event row that exists only in the Notion events table (added there by hand), used as an external calendar.
export type ExternalEvent={id:string;name:string;date:string;venue:string;society?:string;url?:string;};
export type FeedbackCategory="event"|"venue"|"organization"|"promotion"|"content"|"volunteers"|"technical"|"budget"|"other";
export type FeedbackRecord={id:string;eventId?:string;societyId?:string;category:FeedbackCategory;priority:"low"|"medium"|"high";sentiment:"positive"|"neutral"|"negative";text:string;submitter:string;createdAt:string;};
export type SocietyMembership={societyId:string;userId:string;role:"member"|"lead"|"admin";};
export type SocietyWorkspace={societyId:string;private:boolean;};
export type UserRole="student"|"club_coordinator";
export type KnowledgeRecord={id:string;title:string;content:string;source:"campus"|"notion";notionPageId?:string;notionDatabaseId?:string;tags:string[];linkedEntityIds:string[];authorizedRoles:UserRole[];updatedAt:string;sourcePostId?:number;};
export type SavedOpportunity={id:string;entityId:string;title:string;sourcePostId?:number;savedAt:string;};
export type Reminder={id:string;taskId?:number;title:string;dueAt:string;done:boolean;};
export type NotionSyncState={status:"disconnected"|"connected"|"syncing"|"error";lastSyncedAt?:string;knowledgePages:number;databases:number;message?:string;};
export type AnnouncementInput={title:string;body:string;type:string;author:string;club:string};
export type ExtractedAnnouncement={input:AnnouncementInput;event?:{name:string;date?:string};organization?:{name:string};opportunity?:{name:string};deadlines:Array<{label:string;date:string}>;requirements:string[];entities:Entity[];relationships:Relationship[];tasks:Task[];confidence:number;reasons:string[]};
export type CampusState={entities:Entity[];relationships:Relationship[];posts:Post[];tasks:Task[];events:CampusEvent[];societies:Society[];societyEventPosts:SocietyEventPost[];societyTasks:SocietyTask[];budgets:SocietyBudget[];promotions:PromotionItem[];requirements:ResourceRequirement[];analyses:SocietyAnalysis[];feedback:FeedbackRecord[];memberships:SocietyMembership[];workspaces:SocietyWorkspace[];knowledge:KnowledgeRecord[];savedOpportunities:SavedOpportunity[];reminders:Reminder[];notionSync:NotionSyncState;eventVotes:EventVote[];eventComments:EventComment[];guests:EventGuest[];budgetItems:BudgetItem[];polls:SocietyPoll[];pollVotes:PollVote[];};
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
for(const task of result.tasks){if(!task.title.trim()||!task.source)errors.push("Every generated task needs a title and source");else if(!entityIds.has(task.source))errors.push("Task source is missing: "+task.source)}
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
{id:"design-club",type:"club",name:"Design Club",meta:"Student organization"},
{id:"tech-society",type:"club",name:"Tech Society",meta:"Student organization"},
{id:"rhythm-arts",type:"club",name:"Rhythm & Arts Society",meta:"Student organization"},
{id:"ai-hackathon",type:"event",name:"AI Hackathon",meta:"24-hour · Oct 15"},
{id:"hack-deadline",type:"deadline",name:"Registration · Oct 10",meta:"Deadline"},
{id:"hack-idea-deadline",type:"deadline",name:"Idea submission · Oct 13",meta:"Deadline"},
{id:"hack-team",type:"project",name:"Team of 2–4",meta:"Participation requirement"},
{id:"hack-registration",type:"registration",name:"AI Hackathon registration",meta:"Registration workflow"},
{id:"hack-volunteer",type:"volunteer_slot",name:"Hackathon volunteer crew",meta:"Event support role"},
{id:"campus-os-project",type:"project",name:"Campus OS",meta:"Connected campus product"},
{id:"campus-os-milestone",type:"milestone",name:"Knowledge layer milestone",meta:"Notion + discovery + workflow"},
{id:"user-shiv",type:"user",name:"Shiv",meta:"Student / Club Coordinator"},
{id:"ms-ambassador",type:"opportunity",name:"Microsoft Ambassador",meta:"Career opportunity"},
{id:"figma",type:"event",name:"Figma Workshop",meta:"Design Club event"},
{id:"cn-notes",type:"resource",name:"CN Viva Notes",meta:"Academic resource"},
{id:"utsav",type:"event",name:"Utsav 2026",meta:"Cultural night · Oct 25"},
{id:"utsav-auditions",type:"deadline",name:"Auditions · Oct 16",meta:"Deadline"},
{id:"utsav-volunteer",type:"volunteer_slot",name:"Utsav stage crew",meta:"Event support role"},
{id:"ms-deadline",type:"deadline",name:"Applications · Oct 18",meta:"Deadline"},
{id:"os-sprint",type:"event",name:"Open Source Sprint",meta:"Hacktoberfest sprint · Oct 20"},
{id:"os-sprint-deadline",type:"deadline",name:"Registration · Oct 18",meta:"Deadline"},
{id:"os-registration",type:"registration",name:"Open Source Sprint registration",meta:"Registration workflow"},
{id:"ai-lab-internship",type:"opportunity",name:"AI Lab Research Internship",meta:"Research opportunity"},
{id:"ai-lab-deadline",type:"deadline",name:"Applications · Oct 30",meta:"Deadline"},
{id:"genai-workshop",type:"event",name:"GenAI Workshop",meta:"Workshop · Nov 7"},
{id:"genai-deadline",type:"deadline",name:"Registration · Nov 2",meta:"Deadline"},
{id:"devops-bootcamp",type:"event",name:"Cloud & DevOps Bootcamp",meta:"Bootcamp · Nov 14"},
{id:"devops-deadline",type:"deadline",name:"Registration · Nov 10",meta:"Deadline"},
{id:"dsa-sheet",type:"resource",name:"DSA Placement Sheet",meta:"Placement resource"},
{id:"library-hours",type:"notice",name:"Library extended hours",meta:"Campus notice"}];
export const relationships:Relationship[]=[
{from:"ai-club",relation:"organizes",to:"ai-hackathon"},
{from:"ai-hackathon",relation:"has_deadline",to:"hack-deadline"},
{from:"ai-hackathon",relation:"has_deadline",to:"hack-idea-deadline"},
{from:"ai-hackathon",relation:"requires",to:"hack-team"},
{from:"hack-registration",relation:"registration_for",to:"ai-hackathon"},
{from:"ai-hackathon",relation:"requires",to:"hack-registration"},
{from:"hack-volunteer",relation:"volunteers_for",to:"ai-hackathon"},
{from:"campus-os-milestone",relation:"milestone_of",to:"campus-os-project"},
{from:"user-shiv",relation:"assigned_to",to:"campus-os-milestone"},
{from:"ms-ambassador",relation:"references",to:"ai-hackathon"},
{from:"ms-ambassador",relation:"has_deadline",to:"ms-deadline"},
{from:"tech-society",relation:"references",to:"ms-ambassador",reason:"Shared by Tech Society"},
{from:"design-club",relation:"organizes",to:"figma"},
{from:"design-club",relation:"supports",to:"ai-hackathon",reason:"Collaborating society"},
{from:"ai-club",relation:"organizes",to:"genai-workshop"},
{from:"genai-workshop",relation:"has_deadline",to:"genai-deadline"},
{from:"ai-club",relation:"references",to:"ai-lab-internship"},
{from:"ai-lab-internship",relation:"has_deadline",to:"ai-lab-deadline"},
{from:"tech-society",relation:"organizes",to:"os-sprint"},
{from:"ai-club",relation:"supports",to:"os-sprint",reason:"Collaborating society"},
{from:"os-sprint",relation:"has_deadline",to:"os-sprint-deadline"},
{from:"os-registration",relation:"registration_for",to:"os-sprint"},
{from:"os-sprint",relation:"requires",to:"os-registration"},
{from:"tech-society",relation:"organizes",to:"devops-bootcamp"},
{from:"devops-bootcamp",relation:"has_deadline",to:"devops-deadline"},
{from:"tech-society",relation:"organizes",to:"dsa-sheet"},
{from:"rhythm-arts",relation:"organizes",to:"utsav"},
{from:"design-club",relation:"supports",to:"utsav",reason:"Collaborating society"},
{from:"utsav",relation:"has_deadline",to:"utsav-auditions"},
{from:"utsav-volunteer",relation:"volunteers_for",to:"utsav"},
{from:"user-shiv",relation:"member_of",to:"ai-club"},
{from:"user-shiv",relation:"member_of",to:"design-club"},
{from:"user-shiv",relation:"member_of",to:"tech-society"},
{from:"user-shiv",relation:"participates_in",to:"ai-hackathon"},
{from:"user-shiv",relation:"interested_in",to:"genai-workshop"},
{from:"user-shiv",relation:"uses",to:"cn-notes"}];
export const posts:Post[]=[
{id:1,type:"EVENT",title:"24-Hour AI Hackathon — registrations are open",body:"Build anything with AI. Teams of 2–4. Registration closes October 10 and idea submissions close October 13.",author:"AI Club",club:"AI Club",time:"2h",votes:128,comments:24,tags:["AI/ML","Hackathon","Teams"],deadline:"Oct 10",linked:"AI Hackathon"},
{id:2,type:"OPPORTUNITY",title:"Microsoft is opening applications for the student ambassador program",body:"Applications are open to students interested in developer communities, events and technology advocacy.",author:"Tech Society",club:"Tech Society",time:"5h",votes:91,comments:18,tags:["Career","Microsoft"],deadline:"Oct 18",linked:"Microsoft Ambassador"},
{id:3,type:"EVENT",title:"Design Club: Figma crash course this Saturday",body:"A practical two-hour session covering components, auto-layout and prototyping. Bring your laptop.",author:"Design Club",club:"Design Club",time:"1d",votes:64,comments:11,tags:["Design","Workshop"],linked:"Figma Workshop"},
{id:4,type:"RESOURCE",title:"Seniors uploaded the complete CN lab viva notes",body:"Routing, transport layer, socket programming and common viva questions in one place.",author:"B-30 Community",club:"B-30",time:"1d",votes:52,comments:9,tags:["Academics","CN"],linked:"CN Viva Notes"},
{id:5,type:"EVENT",title:"Hacktoberfest Open Source Sprint — land your first merged PR",body:"Tech Society and AI Club are hosting a one-day open source sprint on October 20. Maintainers will pair with you on good-first-issues. Registration closes October 18.",author:"Tech Society",club:"Tech Society",time:"6h",votes:87,comments:15,tags:["Development","Open Source","Hacktoberfest"],deadline:"Oct 18",linked:"Open Source Sprint"},
{id:6,type:"EVENT",title:"Utsav 2026 auditions are open — sing, dance, act",body:"Rhythm & Arts Society is lining up twelve acts for the October 25 cultural night at the Open Air Theatre. Solo and group auditions close October 16.",author:"Rhythm & Arts Society",club:"Rhythm & Arts Society",time:"8h",votes:143,comments:37,tags:["Culture","Music","Dance"],deadline:"Oct 16",linked:"Utsav 2026"},
{id:7,type:"OPPORTUNITY",title:"Campus AI Lab is hiring two undergraduate research interns",body:"Work on retrieval and evaluation for campus-scale language models with faculty mentors. Stipend provided. Applications close October 30.",author:"AI Club",club:"AI Club",time:"12h",votes:76,comments:21,tags:["AI/ML","Research","Internship"],deadline:"Oct 30",linked:"AI Lab Research Internship"},
{id:8,type:"EVENT",title:"GenAI Workshop: build a RAG chatbot from scratch",body:"AI Club is hosting a hands-on GenAI workshop on November 7. Build a retrieval-augmented chatbot over campus documents. Registration closes November 2. Bring your laptop.",author:"AI Club",club:"AI Club",time:"1d",votes:98,comments:14,tags:["AI/ML","Workshop","GenAI"],deadline:"Nov 2",linked:"GenAI Workshop"},
{id:9,type:"EVENT",title:"Cloud & DevOps Bootcamp: containers to production in two days",body:"Docker, CI/CD pipelines and cloud deployment, taught by a practising site reliability engineer. November 14–15 in Lab Complex B. Registration closes November 10.",author:"Tech Society",club:"Tech Society",time:"2d",votes:58,comments:8,tags:["Development","Cloud","DevOps"],deadline:"Nov 10",linked:"Cloud & DevOps Bootcamp"},
{id:10,type:"NOTICE",title:"Central Library stays open until midnight during mid-semester exams",body:"From October 12 to October 24 the Central Library reading halls will remain open until 12 AM. Carry your ID card after 8 PM.",author:"Campus Administration",club:"Campus Administration",time:"2d",votes:211,comments:12,tags:["Academics","Notice"],linked:"Library extended hours"},
{id:11,type:"RESOURCE",title:"Placement-ready DSA sheet with 180 curated problems",body:"Arrays to graphs, ordered by difficulty, with solutions and pattern notes from seniors placed this year.",author:"Tech Society",club:"Tech Society",time:"3d",votes:167,comments:29,tags:["Career","DSA","Placements"],linked:"DSA Placement Sheet"},
{id:12,type:"PROJECT",title:"Campus OS ships its knowledge layer milestone",body:"Natural-language discovery, Notion sync and workflow suggestions are now connected to the campus graph. Contributors welcome.",author:"Shiv",club:"AI Club",time:"4d",votes:44,comments:6,tags:["Development","Campus OS"],linked:"Campus OS"},
{id:13,type:"NOTICE",title:"Recap: Tech Career Connect brought 12 recruiters and 340 students",body:"Mock interviews ran all day and 58 students were shortlisted for follow-up rounds. Slides and recruiter notes are now in the Tech Society drive.",author:"Tech Society",club:"Tech Society",time:"3w",votes:120,comments:17,tags:["Career","Placements"],linked:"Tech Society"}];
export const initialTasks:Task[]=[
{id:1,title:"Register for AI Hackathon",meta:"AI Club · due Oct 10",done:false,source:"ai-hackathon",dueDate:"October 10, 2026",kind:"task"},
{id:2,title:"Find 1–3 hackathon teammates",meta:"Derived from team size 2–4",done:false,source:"ai-hackathon",kind:"project_action"},
{id:3,title:"Prepare hackathon idea submission",meta:"AI Club · due Oct 13",done:false,source:"ai-hackathon",dueDate:"October 13, 2026",kind:"task"},
{id:4,title:"Apply for Microsoft Ambassador",meta:"Tech Society · due Oct 18",done:false,source:"ms-ambassador",dueDate:"October 18, 2026",kind:"task"},
{id:5,title:"Register for Figma Crash Course",meta:"Design Club · due Oct 8",done:true,source:"figma",dueDate:"October 8, 2026",kind:"task"},
{id:6,title:"Register for Open Source Sprint",meta:"Tech Society · due Oct 18",done:false,source:"os-sprint",dueDate:"October 18, 2026",kind:"task"},
{id:7,title:"Shortlist four good-first-issues",meta:"Derived from Open Source Sprint goal",done:false,source:"os-sprint",kind:"project_action"},
{id:8,title:"Apply for AI Lab research internship",meta:"AI Club · due Oct 30",done:false,source:"ai-lab-internship",dueDate:"October 30, 2026",kind:"task"},
{id:9,title:"Register for GenAI Workshop",meta:"AI Club · due Nov 2",done:false,source:"genai-workshop",dueDate:"November 2, 2026",kind:"task"},
{id:10,title:"Sign up for Utsav stage crew",meta:"Rhythm & Arts Society · by Oct 16",done:false,source:"utsav-volunteer",dueDate:"October 16, 2026",kind:"task"},
{id:11,title:"Revise CN viva notes before lab exam",meta:"B-30 Community resource",done:false,source:"cn-notes",kind:"project_action"},
{id:12,title:"Solve DSA sheet: arrays and strings",meta:"Tech Society resource",done:true,source:"dsa-sheet",kind:"project_action"},
{id:13,title:"Ship Notion sync for the knowledge layer",meta:"Campus OS milestone",done:true,source:"campus-os-project",kind:"project_action"},
{id:14,title:"Write discovery ranking tests",meta:"Campus OS milestone",done:false,source:"campus-os-project",kind:"project_action"}];

const unsplash=(id:string)=>"https://images.unsplash.com/photo-"+id;
export const initialEvents:CampusEvent[]=[
{id:"ai-hackathon-2026",name:"24-Hour AI Hackathon",societyId:"ai-club-society",societyName:"AI Club",date:"October 15, 2026",nature:"Competition / Hackathon",highlight:"Build an AI project in 24 hours with teams of 2–4.",specialGuests:["Industry mentor panel"],progress:65,venue:"Innovation Lab",deadline:"October 10, 2026",eligibility:"KIIT students; teams of 2–4",status:"in_progress"},
{id:"figma-workshop-2026",name:"Figma Crash Course",societyId:"design-club-society",societyName:"Design Club",date:"October 10, 2026",nature:"Workshop",highlight:"Hands-on components, auto-layout and prototyping.",specialGuests:[],progress:30,venue:"Design Studio",deadline:"October 8, 2026",eligibility:"Open to all students",status:"upcoming"},
{id:"open-source-sprint-2026",name:"Hacktoberfest Open Source Sprint",societyId:"tech-society",societyName:"Tech Society",date:"October 20, 2026",nature:"Sprint / Open Source",highlight:"Land merged pull requests with maintainers pairing live.",specialGuests:["Open source maintainer panel"],progress:55,venue:"Central Library Commons",deadline:"October 18, 2026",eligibility:"Open to all students; GitHub account required",status:"upcoming"},
{id:"utsav-2026",name:"Utsav 2026 · Cultural Night",societyId:"rhythm-arts-society",societyName:"Rhythm & Arts Society",date:"October 25, 2026",nature:"Cultural Fest / Performance",highlight:"Twelve acts across music, dance and theatre on one open-air stage.",specialGuests:["Alumni band Static Bloom"],progress:45,venue:"Open Air Theatre",deadline:"October 16, 2026",eligibility:"Open to all; performers selected by audition",status:"upcoming"},
{id:"genai-workshop-2026",name:"GenAI Workshop: RAG from Scratch",societyId:"ai-club-society",societyName:"AI Club",date:"November 7, 2026",nature:"Workshop",highlight:"Build a retrieval-augmented chatbot over campus documents in one afternoon.",specialGuests:["Priya Raman, ML Engineer"],progress:25,venue:"Seminar Hall 2, Campus 15",deadline:"November 2, 2026",eligibility:"2nd year and above; basic Python",status:"upcoming"},
{id:"devops-bootcamp-2026",name:"Cloud & DevOps Bootcamp",societyId:"tech-society",societyName:"Tech Society",date:"November 14, 2026",nature:"Bootcamp",highlight:"Two days of containers, CI/CD pipelines and cloud deployment.",specialGuests:["Karthik Menon, Site Reliability Engineer"],progress:10,venue:"Lab Complex B, Campus 25",deadline:"November 10, 2026",eligibility:"2nd–4th year; laptop with Docker installed",status:"upcoming"},
{id:"ai-hackathon-2025",name:"AI Build Night 2025",societyId:"ai-club-society",societyName:"AI Club",date:"November 22, 2025",nature:"Competition / Overnight build",highlight:"Overnight build around practical AI ideas for campus.",specialGuests:["Alumni mentor panel"],progress:100,venue:"Innovation Lab",deadline:"November 18, 2025",eligibility:"KIIT students; teams of 2–3",status:"completed"},
{id:"ux-teardown-2026",name:"UX Teardown Night",societyId:"design-club-society",societyName:"Design Club",date:"August 28, 2026",nature:"Critique / Talk",highlight:"Live teardown of five popular campus apps, then redesign sprints.",specialGuests:["Nikhil Bose, Product Designer"],progress:100,venue:"Design Studio",deadline:"August 25, 2026",eligibility:"Open to all students",status:"completed"},
{id:"career-connect-2026",name:"Tech Career Connect 2026",societyId:"tech-society",societyName:"Tech Society",date:"September 12, 2026",nature:"Career Fair / Talks",highlight:"Resume reviews, mock interviews and twelve recruiters on campus.",specialGuests:["Recruiters from 12 partner companies"],progress:100,venue:"Convention Centre",deadline:"September 8, 2026",eligibility:"Pre-final and final year students",status:"completed"},
{id:"open-mic-2026",name:"Campus Unplugged: Open Mic",societyId:"rhythm-arts-society",societyName:"Rhythm & Arts Society",date:"September 19, 2026",nature:"Performance / Open Mic",highlight:"Poetry, acoustic sets and stand-up from forty student performers.",specialGuests:[],progress:100,venue:"Food Court Amphitheatre",deadline:"September 15, 2026",eligibility:"Open to all students",status:"completed"}
];
export const initialSocieties:Society[]=[
{id:"ai-club-society",name:"AI Club",description:"AI, ML and builder community.",members:["Shiv","Aarav","Riya","Kabir","Neha","Ishaan"],leads:["Shiv","Aarav"],fic:"Dr. Ananya Mehta",genre:"AI / ML · Innovation",xfactor:"We turn curiosity into working prototypes. AI Club is a student-led space where builders learn together, ship practical systems and bring ambitious ideas from classroom concepts to competitions, demos and real campus impact.",timeline:[{id:"ai-2025",date:"2025",title:"Club founded",description:"Started as a small peer-learning circle for AI and machine learning."},{id:"ai-2025-build",date:"Nov 2025",title:"First AI Build Night",description:"142 students built overnight; Team Neural's attendance assistant was adopted by two departments."},{id:"ai-2026-hack",date:"2026",title:"Campus hackathon program",description:"Expanded into competitive builds, workshops and industry-facing events."},{id:"ai-2026-lab",date:"Sep 2026",title:"Campus AI Lab partnership",description:"Opened a research internship track with faculty mentors."}],publicMembers:[{userId:"user-shiv",name:"Shiv",position:"President"},{userId:"aarav",name:"Aarav",position:"Vice President"},{userId:"riya",name:"Riya",position:"Design & Media Lead"},{userId:"kabir",name:"Kabir",position:"Operations Lead"},{userId:"neha",name:"Neha",position:"Research Lead"},{userId:"ishaan",name:"Ishaan",position:"Technical Lead"}]},
{id:"design-club-society",name:"Design Club",description:"Product and visual design community.",members:["Ananya","Rohit","Maya","Tanvi","Shiv"],leads:["Ananya"],fic:"Prof. Rohan Sen",genre:"Design · Product · Visual Arts",xfactor:"Design Club makes product thinking tangible: learn the tools, critique the work and build interfaces that people can actually use.",timeline:[{id:"design-2025",date:"2025",title:"Sketch circle",description:"Weekly sketching and poster critiques in the Design Studio."},{id:"design-2026",date:"2026",title:"Product design chapter launched",description:"Introduced hands-on workshops and campus product critiques."},{id:"design-2026-teardown",date:"Aug 2026",title:"UX Teardown Night",description:"Five campus apps critiqued live; two redesigns were picked up by student developers."}],publicMembers:[{userId:"ananya",name:"Ananya",position:"President"},{userId:"rohit",name:"Rohit",position:"Events Lead"},{userId:"maya",name:"Maya",position:"Creative Lead"},{userId:"tanvi",name:"Tanvi",position:"Visual Design Lead"},{userId:"user-shiv",name:"Shiv",position:"Member"}]},
{id:"tech-society",name:"Tech Society",description:"Developers, open source contributors and career builders.",members:["Arjun","Sneha","Dev","Pooja","Shiv"],leads:["Arjun","Sneha"],fic:"Dr. Vikram Nair",genre:"Development · Open Source · Careers",xfactor:"Tech Society is where students go from tutorials to production: open source sprints, bootcamps and a placement network that puts real code and real recruiters in the same room.",timeline:[{id:"tech-2023",date:"2023",title:"Society founded",description:"Started as a weekend coding club for first-year students."},{id:"tech-2024",date:"2024",title:"Open source program",description:"Ran the first campus Hacktoberfest sprint with 60 merged pull requests."},{id:"tech-2026-career",date:"Sep 2026",title:"Tech Career Connect",description:"Brought twelve recruiters to campus; 58 students shortlisted."}],publicMembers:[{userId:"arjun",name:"Arjun",position:"President"},{userId:"sneha",name:"Sneha",position:"General Secretary"},{userId:"dev",name:"Dev",position:"Open Source Lead"},{userId:"pooja",name:"Pooja",position:"Outreach & Careers Lead"},{userId:"user-shiv",name:"Shiv",position:"Core Member"}]},
{id:"rhythm-arts-society",name:"Rhythm & Arts Society",description:"Music, dance and performing arts collective.",members:["Kavya","Rahul","Zoya","Aditya"],leads:["Kavya","Rahul"],fic:"Prof. Meera Iyer",genre:"Music · Dance · Performing Arts",xfactor:"Rhythm & Arts gives every performer a stage, from a first open mic to a two-thousand-seat cultural night, with rehearsal space, mentors and a crew that makes the show happen.",timeline:[{id:"ra-2022",date:"2022",title:"Collective formed",description:"Music and dance groups merged into one performing arts society."},{id:"ra-2025",date:"2025",title:"Utsav goes open-air",description:"Moved the annual cultural night to the Open Air Theatre."},{id:"ra-2026-mic",date:"Sep 2026",title:"Campus Unplugged",description:"First monthly open mic with forty performers and 260 in the audience."}],publicMembers:[{userId:"kavya",name:"Kavya",position:"President"},{userId:"rahul",name:"Rahul",position:"Music Director"},{userId:"zoya",name:"Zoya",position:"Dance Captain"},{userId:"aditya",name:"Aditya",position:"Production & Stage Lead"}]}
];
export const initialSocietyEventPosts:SocietyEventPost[]=[
{id:"post-ai-hackathon",societyId:"ai-club-society",eventId:"ai-hackathon-2026",title:"24-Hour AI Hackathon",postedBy:"AI Club",collaboratingSocieties:["Design Club"],description:"Build an AI project in 24 hours with a team and present it to a mentor panel.",registrationLink:"https://forms.google.com/",prizes:"₹25,000 prize pool + certificates",specialGuests:["Industry mentor panel"],joinReason:"A focused 24-hour build sprint with teammates, mentors and a chance to turn an idea into a working prototype.",xfactor:"24 hours. One team. One working build.",media:[unsplash("1518770660439-4636190af475")],status:"upcoming",winners:[]},
{id:"post-figma-workshop",societyId:"design-club-society",eventId:"figma-workshop-2026",title:"Figma Crash Course",postedBy:"Design Club",collaboratingSocieties:[],description:"Hands-on components, auto-layout and prototyping.",registrationLink:"https://forms.google.com/",prizes:"Certificates",specialGuests:[],joinReason:"Learn a practical design workflow you can immediately use in projects and portfolios.",xfactor:"From blank canvas to clickable prototype.",media:[],status:"upcoming",winners:[]},
{id:"post-ai-past",societyId:"ai-club-society",eventId:"ai-hackathon-2025",title:"AI Build Night 2025",postedBy:"AI Club",collaboratingSocieties:["Tech Society"],description:"An earlier overnight build event bringing student teams together around practical AI ideas.",registrationLink:"",prizes:"Certificates + mentor awards",specialGuests:["Alumni mentor panel"],joinReason:"",xfactor:"Build fast, learn faster.",media:[unsplash("1518770660439-4636190af475")],status:"past",winners:["Team Neural","Team Promptsmiths","Team Gradient Descent"]},
{id:"post-open-source-sprint",societyId:"tech-society",eventId:"open-source-sprint-2026",title:"Hacktoberfest Open Source Sprint",postedBy:"Tech Society",collaboratingSocieties:["AI Club"],description:"A one-day sprint where maintainers pair with you on good-first-issues until your first pull requests are merged.",registrationLink:"https://forms.google.com/",prizes:"Swag kits for four merged PRs + certificates",specialGuests:["Open source maintainer panel"],joinReason:"Your first merged contribution is the hardest one. Do it with a maintainer sitting next to you.",xfactor:"Walk in with an issue. Walk out with a merged PR.",media:[unsplash("1515879218367-8466d910aaa4")],status:"upcoming",winners:[]},
{id:"post-utsav",societyId:"rhythm-arts-society",eventId:"utsav-2026",title:"Utsav 2026 · Cultural Night",postedBy:"Rhythm & Arts Society",collaboratingSocieties:["Design Club"],description:"The annual cultural night: twelve student acts, an alumni headliner and a stage designed by Design Club.",registrationLink:"https://forms.google.com/",prizes:"Best act trophy + ₹15,000 for the top three acts",specialGuests:["Alumni band Static Bloom"],joinReason:"The biggest stage on campus this semester — perform, crew or just come for the night.",xfactor:"One night. Twelve acts. Two thousand people.",media:[unsplash("1501281668745-f7f57925c3b4")],status:"upcoming",winners:[]},
{id:"post-genai-workshop",societyId:"ai-club-society",eventId:"genai-workshop-2026",title:"GenAI Workshop: RAG from Scratch",postedBy:"AI Club",collaboratingSocieties:[],description:"Chunk, embed, retrieve and evaluate: build a chatbot that answers questions from real campus documents.",registrationLink:"https://forms.google.com/",prizes:"Certificates + AI Lab internship fast-track for top builds",specialGuests:["Priya Raman, ML Engineer"],joinReason:"Learn the pattern behind most production LLM apps, and leave with working code.",xfactor:"Your documents. Your chatbot. One afternoon.",media:[unsplash("1677442136019-21780ecad995")],status:"upcoming",winners:[]},
{id:"post-devops-bootcamp",societyId:"tech-society",eventId:"devops-bootcamp-2026",title:"Cloud & DevOps Bootcamp",postedBy:"Tech Society",collaboratingSocieties:[],description:"Day one covers containers and CI/CD; day two deploys a full app to the cloud with monitoring.",registrationLink:"https://forms.google.com/",prizes:"Cloud credits + certificates",specialGuests:["Karthik Menon, Site Reliability Engineer"],joinReason:"The deployment skills interviewers ask about and most courses skip.",xfactor:"From localhost to production in 48 hours.",media:[unsplash("1531297484001-80022131f5a1")],status:"upcoming",winners:[]},
{id:"post-ux-teardown",societyId:"design-club-society",eventId:"ux-teardown-2026",title:"UX Teardown Night",postedBy:"Design Club",collaboratingSocieties:[],description:"Five campus apps critiqued live, followed by 90-minute redesign sprints.",registrationLink:"",prizes:"Design books for the best redesign",specialGuests:["Nikhil Bose, Product Designer"],joinReason:"",xfactor:"Critique hard. Redesign harder.",media:[unsplash("1561070791-2526d30994b5")],status:"past",winners:["Team Kerning"]},
{id:"post-career-connect",societyId:"tech-society",eventId:"career-connect-2026",title:"Tech Career Connect 2026",postedBy:"Tech Society",collaboratingSocieties:["AI Club"],description:"Resume clinics, mock interviews and recruiter booths for pre-final and final year students.",registrationLink:"",prizes:"",specialGuests:["Recruiters from 12 partner companies"],joinReason:"",xfactor:"Twelve recruiters. One afternoon. Bring your resume.",media:[unsplash("1540575467063-178a50c2df87")],status:"past",winners:["58 students shortlisted"]},
{id:"post-open-mic",societyId:"rhythm-arts-society",eventId:"open-mic-2026",title:"Campus Unplugged: Open Mic",postedBy:"Rhythm & Arts Society",collaboratingSocieties:[],description:"Forty performers, five-minute slots: poetry, acoustic sets and stand-up.",registrationLink:"",prizes:"Audience choice award",specialGuests:[],joinReason:"",xfactor:"Five minutes. One mic. Your stage.",media:[unsplash("1516450360452-9312f5e86fc7")],status:"past",winners:["Riddhi Das (spoken word)"]}
];
export const initialSocietyTasks:SocietyTask[]=[
{id:1,eventId:"ai-hackathon-2026",societyId:"ai-club-society",title:"Confirm Innovation Lab booking",assignee:"Aarav",role:"lead",done:true,dueDate:"October 5, 2026",priority:"high"},
{id:2,eventId:"ai-hackathon-2026",societyId:"ai-club-society",title:"Publish registration poster",assignee:"Riya",role:"member",done:true,dueDate:"October 4, 2026",priority:"high"},
{id:3,eventId:"ai-hackathon-2026",societyId:"ai-club-society",title:"Confirm mentors and special guests",assignee:"Shiv",role:"lead",done:false,dueDate:"October 8, 2026",priority:"high"},
{id:4,eventId:"ai-hackathon-2026",societyId:"ai-club-society",title:"Arrange certificates and prizes",assignee:"Kabir",role:"member",done:false,dueDate:"October 12, 2026",priority:"medium"},
{id:5,eventId:"ai-hackathon-2026",societyId:"ai-club-society",title:"Draft judging rubric",assignee:"Neha",role:"member",done:true,dueDate:"October 9, 2026",priority:"medium"},
{id:6,eventId:"ai-hackathon-2026",societyId:"ai-club-society",title:"Set up idea submission portal",assignee:"Ishaan",role:"member",done:false,dueDate:"October 11, 2026",priority:"high"},
{id:7,eventId:"figma-workshop-2026",societyId:"design-club-society",title:"Prepare starter Figma file",assignee:"Maya",role:"member",done:true,dueDate:"October 7, 2026",priority:"high"},
{id:8,eventId:"figma-workshop-2026",societyId:"design-club-society",title:"Book Design Studio projector",assignee:"Rohit",role:"lead",done:false,dueDate:"October 8, 2026",priority:"medium"},
{id:9,eventId:"figma-workshop-2026",societyId:"design-club-society",title:"Share pre-workshop install guide",assignee:"Tanvi",role:"member",done:false,dueDate:"October 9, 2026",priority:"low"},
{id:10,eventId:"open-source-sprint-2026",societyId:"tech-society",title:"Curate 40 good-first-issues",assignee:"Dev",role:"lead",done:true,dueDate:"October 14, 2026",priority:"high"},
{id:11,eventId:"open-source-sprint-2026",societyId:"tech-society",title:"Confirm maintainer panel",assignee:"Arjun",role:"lead",done:false,dueDate:"October 15, 2026",priority:"high"},
{id:12,eventId:"open-source-sprint-2026",societyId:"tech-society",title:"Order swag kits",assignee:"Pooja",role:"member",done:false,dueDate:"October 16, 2026",priority:"medium"},
{id:13,eventId:"open-source-sprint-2026",societyId:"tech-society",title:"Run Git basics pre-session",assignee:"Shiv",role:"member",done:false,dueDate:"October 17, 2026",priority:"medium"},
{id:14,eventId:"devops-bootcamp-2026",societyId:"tech-society",title:"Finalize two-day curriculum",assignee:"Sneha",role:"lead",done:false,dueDate:"October 30, 2026",priority:"high"},
{id:15,eventId:"devops-bootcamp-2026",societyId:"tech-society",title:"Request cloud credits",assignee:"Arjun",role:"lead",done:false,dueDate:"November 1, 2026",priority:"medium"},
{id:16,eventId:"devops-bootcamp-2026",societyId:"tech-society",title:"Prepare Docker install checklist",assignee:"Dev",role:"member",done:false,dueDate:"November 8, 2026",priority:"low"},
{id:17,eventId:"genai-workshop-2026",societyId:"ai-club-society",title:"Build reference RAG notebook",assignee:"Neha",role:"member",done:false,dueDate:"October 28, 2026",priority:"high"},
{id:18,eventId:"genai-workshop-2026",societyId:"ai-club-society",title:"Confirm speaker travel",assignee:"Aarav",role:"lead",done:true,dueDate:"October 20, 2026",priority:"medium"},
{id:19,eventId:"genai-workshop-2026",societyId:"ai-club-society",title:"Book Seminar Hall 2",assignee:"Kabir",role:"member",done:false,dueDate:"October 25, 2026",priority:"high"},
{id:20,eventId:"utsav-2026",societyId:"rhythm-arts-society",title:"Run audition rounds",assignee:"Rahul",role:"lead",done:false,dueDate:"October 17, 2026",priority:"high"},
{id:21,eventId:"utsav-2026",societyId:"rhythm-arts-society",title:"Finalize stage and lighting vendor",assignee:"Aditya",role:"member",done:true,dueDate:"October 12, 2026",priority:"high"},
{id:22,eventId:"utsav-2026",societyId:"rhythm-arts-society",title:"Choreograph opening act",assignee:"Zoya",role:"member",done:false,dueDate:"October 22, 2026",priority:"medium"},
{id:23,eventId:"utsav-2026",societyId:"rhythm-arts-society",title:"Get crowd-safety approval",assignee:"Kavya",role:"lead",done:false,dueDate:"October 18, 2026",priority:"high"},
{id:24,eventId:"ai-hackathon-2025",societyId:"ai-club-society",title:"Book Innovation Lab overnight",assignee:"Aarav",role:"lead",done:true,dueDate:"November 10, 2025",priority:"high"},
{id:25,eventId:"ai-hackathon-2025",societyId:"ai-club-society",title:"Arrange midnight dinner",assignee:"Kabir",role:"member",done:true,dueDate:"November 20, 2025",priority:"medium"},
{id:26,eventId:"ai-hackathon-2025",societyId:"ai-club-society",title:"Publish results and photos",assignee:"Shiv",role:"lead",done:true,dueDate:"November 25, 2025",priority:"low"},
{id:27,eventId:"ux-teardown-2026",societyId:"design-club-society",title:"Select five apps to critique",assignee:"Ananya",role:"lead",done:true,dueDate:"August 20, 2026",priority:"high"},
{id:28,eventId:"ux-teardown-2026",societyId:"design-club-society",title:"Prepare redesign sprint briefs",assignee:"Maya",role:"member",done:true,dueDate:"August 26, 2026",priority:"medium"},
{id:29,eventId:"career-connect-2026",societyId:"tech-society",title:"Confirm 12 recruiter booths",assignee:"Pooja",role:"member",done:true,dueDate:"September 5, 2026",priority:"high"},
{id:30,eventId:"career-connect-2026",societyId:"tech-society",title:"Schedule mock interview panels",assignee:"Sneha",role:"lead",done:true,dueDate:"September 9, 2026",priority:"high"},
{id:31,eventId:"career-connect-2026",societyId:"tech-society",title:"Collect resumes into one drive",assignee:"Shiv",role:"member",done:true,dueDate:"September 10, 2026",priority:"medium"},
{id:32,eventId:"open-mic-2026",societyId:"rhythm-arts-society",title:"Build performer running order",assignee:"Kavya",role:"lead",done:true,dueDate:"September 17, 2026",priority:"high"},
{id:33,eventId:"open-mic-2026",societyId:"rhythm-arts-society",title:"Sound check and mic setup",assignee:"Aditya",role:"member",done:true,dueDate:"September 19, 2026",priority:"high"},
{id:34,eventId:"open-source-sprint-2026",societyId:"tech-society",title:"Review sprint issue shortlist with Dev",assignee:"Shiv",role:"member",done:false,dueDate:"October 8, 2026",priority:"medium"}
];
export const initialBudgets:SocietyBudget[]=[
{eventId:"ai-hackathon-2026",societyId:"ai-club-society",estimated:50000,actual:18500,sponsorship:25000,currency:"INR"},
{eventId:"figma-workshop-2026",societyId:"design-club-society",estimated:6000,actual:1500,sponsorship:0,currency:"INR"},
{eventId:"open-source-sprint-2026",societyId:"tech-society",estimated:15000,actual:6200,sponsorship:10000,currency:"INR"},
{eventId:"utsav-2026",societyId:"rhythm-arts-society",estimated:120000,actual:48000,sponsorship:60000,currency:"INR"},
{eventId:"genai-workshop-2026",societyId:"ai-club-society",estimated:12000,actual:2500,sponsorship:8000,currency:"INR"},
{eventId:"devops-bootcamp-2026",societyId:"tech-society",estimated:20000,actual:0,sponsorship:15000,currency:"INR"},
{eventId:"ai-hackathon-2025",societyId:"ai-club-society",estimated:35000,actual:32800,sponsorship:20000,currency:"INR"},
{eventId:"ux-teardown-2026",societyId:"design-club-society",estimated:4000,actual:3600,sponsorship:0,currency:"INR"},
{eventId:"career-connect-2026",societyId:"tech-society",estimated:60000,actual:54500,sponsorship:45000,currency:"INR"},
{eventId:"open-mic-2026",societyId:"rhythm-arts-society",estimated:8000,actual:7200,sponsorship:3000,currency:"INR"}];
export const initialPromotions:PromotionItem[]=[
{id:"promo-ai-instagram",eventId:"ai-hackathon-2026",societyId:"ai-club-society",channel:"Instagram",owner:"Riya",plannedDate:"October 3, 2026",status:"done"},
{id:"promo-ai-whatsapp",eventId:"ai-hackathon-2026",societyId:"ai-club-society",channel:"WhatsApp / Campus groups",owner:"Kabir",plannedDate:"October 6, 2026",status:"in_progress"},
{id:"promo-ai-classroom",eventId:"ai-hackathon-2026",societyId:"ai-club-society",channel:"Classroom outreach",owner:"Aarav",plannedDate:"October 7, 2026",status:"planned"},
{id:"promo-figma-instagram",eventId:"figma-workshop-2026",societyId:"design-club-society",channel:"Instagram carousel",owner:"Tanvi",plannedDate:"October 4, 2026",status:"done"},
{id:"promo-figma-posters",eventId:"figma-workshop-2026",societyId:"design-club-society",channel:"Hostel posters",owner:"Rohit",plannedDate:"October 6, 2026",status:"in_progress"},
{id:"promo-os-linkedin",eventId:"open-source-sprint-2026",societyId:"tech-society",channel:"LinkedIn",owner:"Pooja",plannedDate:"October 5, 2026",status:"done"},
{id:"promo-os-discord",eventId:"open-source-sprint-2026",societyId:"tech-society",channel:"Discord announcement",owner:"Dev",plannedDate:"October 8, 2026",status:"in_progress"},
{id:"promo-os-classroom",eventId:"open-source-sprint-2026",societyId:"tech-society",channel:"Classroom outreach",owner:"Shiv",plannedDate:"October 12, 2026",status:"planned"},
{id:"promo-utsav-reel",eventId:"utsav-2026",societyId:"rhythm-arts-society",channel:"Instagram teaser reel",owner:"Zoya",plannedDate:"October 6, 2026",status:"in_progress"},
{id:"promo-utsav-banners",eventId:"utsav-2026",societyId:"rhythm-arts-society",channel:"Campus banners",owner:"Aditya",plannedDate:"October 15, 2026",status:"planned"},
{id:"promo-genai-newsletter",eventId:"genai-workshop-2026",societyId:"ai-club-society",channel:"Department newsletter",owner:"Neha",plannedDate:"October 20, 2026",status:"planned"},
{id:"promo-genai-instagram",eventId:"genai-workshop-2026",societyId:"ai-club-society",channel:"Instagram",owner:"Riya",plannedDate:"October 18, 2026",status:"planned"},
{id:"promo-devops-linkedin",eventId:"devops-bootcamp-2026",societyId:"tech-society",channel:"LinkedIn",owner:"Pooja",plannedDate:"October 28, 2026",status:"planned"},
{id:"promo-build-2025",eventId:"ai-hackathon-2025",societyId:"ai-club-society",channel:"Instagram",owner:"Riya",plannedDate:"November 5, 2025",status:"done"},
{id:"promo-teardown",eventId:"ux-teardown-2026",societyId:"design-club-society",channel:"Instagram stories",owner:"Maya",plannedDate:"August 22, 2026",status:"done"},
{id:"promo-career-mail",eventId:"career-connect-2026",societyId:"tech-society",channel:"Placement cell mailer",owner:"Sneha",plannedDate:"September 1, 2026",status:"done"},
{id:"promo-openmic",eventId:"open-mic-2026",societyId:"rhythm-arts-society",channel:"WhatsApp / Campus groups",owner:"Kavya",plannedDate:"September 12, 2026",status:"done"}];
export const initialRequirements:ResourceRequirement[]=[
{id:"req-lab",eventId:"ai-hackathon-2026",societyId:"ai-club-society",category:"room",item:"Innovation Lab",quantity:"1 room",owner:"Aarav",status:"confirmed"},
{id:"req-cert",eventId:"ai-hackathon-2026",societyId:"ai-club-society",category:"certificate",item:"Participant certificates",quantity:"120",owner:"Kabir",status:"requested"},
{id:"req-prize",eventId:"ai-hackathon-2026",societyId:"ai-club-society",category:"prize",item:"Winner prize pool",quantity:"₹25,000",owner:"Shiv",status:"confirmed"},
{id:"req-tech",eventId:"ai-hackathon-2026",societyId:"ai-club-society",category:"technical",item:"Wi-Fi, power and AV",quantity:"Event-wide",owner:"Aarav",status:"needed"},
{id:"req-figma-room",eventId:"figma-workshop-2026",societyId:"design-club-society",category:"room",item:"Design Studio",quantity:"1 room",owner:"Rohit",status:"confirmed"},
{id:"req-figma-projector",eventId:"figma-workshop-2026",societyId:"design-club-society",category:"equipment",item:"Projector and clicker",quantity:"1 set",owner:"Rohit",status:"requested"},
{id:"req-os-room",eventId:"open-source-sprint-2026",societyId:"tech-society",category:"room",item:"Library Commons",quantity:"1 hall",owner:"Arjun",status:"confirmed"},
{id:"req-os-volunteers",eventId:"open-source-sprint-2026",societyId:"tech-society",category:"volunteer",item:"Floor mentors",quantity:"10",owner:"Dev",status:"requested"},
{id:"req-os-swag",eventId:"open-source-sprint-2026",societyId:"tech-society",category:"prize",item:"Swag kits",quantity:"60",owner:"Pooja",status:"needed"},
{id:"req-utsav-stage",eventId:"utsav-2026",societyId:"rhythm-arts-society",category:"equipment",item:"Stage, sound and lighting rig",quantity:"Full stage",owner:"Aditya",status:"confirmed"},
{id:"req-utsav-crew",eventId:"utsav-2026",societyId:"rhythm-arts-society",category:"volunteer",item:"Stage and hospitality crew",quantity:"30",owner:"Kavya",status:"requested"},
{id:"req-utsav-venue",eventId:"utsav-2026",societyId:"rhythm-arts-society",category:"room",item:"Open Air Theatre",quantity:"1 venue",owner:"Kavya",status:"confirmed"},
{id:"req-genai-gpu",eventId:"genai-workshop-2026",societyId:"ai-club-society",category:"technical",item:"Hosted notebook GPU credits",quantity:"80 seats",owner:"Ishaan",status:"needed"},
{id:"req-genai-hall",eventId:"genai-workshop-2026",societyId:"ai-club-society",category:"room",item:"Seminar Hall 2",quantity:"1 hall",owner:"Kabir",status:"requested"},
{id:"req-devops-lab",eventId:"devops-bootcamp-2026",societyId:"tech-society",category:"room",item:"Lab Complex B",quantity:"2 days",owner:"Arjun",status:"requested"},
{id:"req-devops-cloud",eventId:"devops-bootcamp-2026",societyId:"tech-society",category:"technical",item:"Cloud credits",quantity:"60 accounts",owner:"Sneha",status:"needed"},
{id:"req-build-food",eventId:"ai-hackathon-2025",societyId:"ai-club-society",category:"other",item:"Overnight food",quantity:"150 meals",owner:"Kabir",status:"done"},
{id:"req-teardown-prints",eventId:"ux-teardown-2026",societyId:"design-club-society",category:"other",item:"A3 critique printouts",quantity:"50",owner:"Maya",status:"done"},
{id:"req-career-booths",eventId:"career-connect-2026",societyId:"tech-society",category:"equipment",item:"Recruiter booths",quantity:"12",owner:"Pooja",status:"done"},
{id:"req-openmic-sound",eventId:"open-mic-2026",societyId:"rhythm-arts-society",category:"equipment",item:"PA system and two mics",quantity:"1 set",owner:"Aditya",status:"done"}];
export const initialAnalyses:SocietyAnalysis[]=[
{eventId:"ai-hackathon-2025",registrations:186,attendees:142,winners:["Team Neural","Team Promptsmiths","Team Gradient Descent"],participantFeedback:["Mentor rounds at 2 AM were the most useful part.","Problem statements could be shared earlier."],guestFeedback:["Strong prototypes for a first edition; judging ran on time."],whatWentWell:["48 teams submitted working demos","Mentor rotation kept teams unblocked"],problems:["Wi-Fi dropped twice after midnight","Dinner arrived 40 minutes late"],suggestions:["Add a backup hotspot","Publish problem statements a week early"],finalExpenditure:32800,photos:[unsplash("1518770660439-4636190af475")],sponsors:["NimbusCloud","ByteForge Labs"],eventReport:"First overnight build night. 142 of 186 registrants attended and 48 teams demoed. Team Neural's attendance assistant was later adopted by two departments."},
{eventId:"ux-teardown-2026",registrations:95,attendees:71,winners:["Team Kerning"],participantFeedback:["Seeing a real designer critique live was eye-opening.","Redesign sprint was too short."],guestFeedback:["Students asked sharp questions; the redesigns were thoughtful."],whatWentWell:["High engagement during critique","Two redesigns picked up by student developers"],problems:["Studio was over capacity for the first hour"],suggestions:["Cap registrations at 70","Extend sprints to two hours"],finalExpenditure:3600,photos:[unsplash("1561070791-2526d30994b5")],sponsors:[],eventReport:"71 attendees critiqued five campus apps. Team Kerning's mess-menu redesign won and is being built by Tech Society members."},
{eventId:"career-connect-2026",registrations:410,attendees:340,winners:["58 students shortlisted"],participantFeedback:["Mock interviews were realistic and the feedback was specific.","Queues at the two largest booths were long."],guestFeedback:["Well-prepared candidates; we will return next year."],whatWentWell:["12 recruiters attended","Resume clinic served 120 students"],problems:["Long queues at popular booths","Convention Centre AC failed for an hour"],suggestions:["Time-slot booking for booths","Run the resume clinic a week before"],finalExpenditure:54500,photos:[unsplash("1540575467063-178a50c2df87")],sponsors:["Partner recruiter network","Placement cell"],eventReport:"340 students met 12 recruiters. 58 were shortlisted for follow-up rounds. Booth booking will be slot-based next year."},
{eventId:"open-mic-2026",registrations:64,attendees:260,winners:["Riddhi Das (spoken word)"],participantFeedback:["Supportive crowd, great for first-time performers.","Sound levels were uneven between acts."],guestFeedback:[],whatWentWell:["40 performers, 260 in the audience","Ran within the time slot"],problems:["Mic feedback during the first three acts"],suggestions:["Sound check every act","Make it monthly"],finalExpenditure:7200,photos:[unsplash("1516450360452-9312f5e86fc7")],sponsors:["Campus Café"],eventReport:"First Campus Unplugged drew 260 people. Riddhi Das won audience choice. It will become a monthly series."}];
export const initialFeedback:FeedbackRecord[]=[
{id:"feedback-seed-1",eventId:"ai-hackathon-2025",societyId:"ai-club-society",category:"technical",priority:"high",sentiment:"negative",text:"Wi-Fi dropped twice after midnight and we lost our deploy.",submitter:"Aditi",createdAt:"2025-11-23T09:10:00.000Z"},
{id:"feedback-seed-2",eventId:"ai-hackathon-2025",societyId:"ai-club-society",category:"content",priority:"medium",sentiment:"positive",text:"Mentor rotations were excellent — every team got real help.",submitter:"Rohan",createdAt:"2025-11-23T10:30:00.000Z"},
{id:"feedback-seed-3",eventId:"ai-hackathon-2025",societyId:"ai-club-society",category:"organization",priority:"low",sentiment:"neutral",text:"Share problem statements a week earlier so teams can prepare.",submitter:"Sana",createdAt:"2025-11-24T08:00:00.000Z"},
{id:"feedback-seed-4",eventId:"ux-teardown-2026",societyId:"design-club-society",category:"venue",priority:"medium",sentiment:"negative",text:"Design Studio was too crowded for the first hour.",submitter:"Karan",createdAt:"2026-08-29T07:45:00.000Z"},
{id:"feedback-seed-5",eventId:"ux-teardown-2026",societyId:"design-club-society",category:"content",priority:"low",sentiment:"positive",text:"Live critique from a working designer was the highlight.",submitter:"Isha",createdAt:"2026-08-29T11:20:00.000Z"},
{id:"feedback-seed-6",eventId:"career-connect-2026",societyId:"tech-society",category:"organization",priority:"high",sentiment:"negative",text:"Queues at the big booths took over an hour. Please add slot booking.",submitter:"Manav",createdAt:"2026-09-13T06:30:00.000Z"},
{id:"feedback-seed-7",eventId:"career-connect-2026",societyId:"tech-society",category:"event",priority:"medium",sentiment:"positive",text:"Mock interviews gave me specific, useful feedback.",submitter:"Priya",createdAt:"2026-09-13T09:00:00.000Z"},
{id:"feedback-seed-8",eventId:"career-connect-2026",societyId:"tech-society",category:"venue",priority:"medium",sentiment:"negative",text:"AC in the Convention Centre stopped working mid-afternoon.",submitter:"Yash",createdAt:"2026-09-13T12:15:00.000Z"},
{id:"feedback-seed-9",eventId:"open-mic-2026",societyId:"rhythm-arts-society",category:"technical",priority:"medium",sentiment:"negative",text:"Mic feedback during the first few acts — do a sound check per act.",submitter:"Nisha",createdAt:"2026-09-20T05:40:00.000Z"},
{id:"feedback-seed-10",eventId:"open-mic-2026",societyId:"rhythm-arts-society",category:"event",priority:"low",sentiment:"positive",text:"Loved the vibe. Please make this monthly!",submitter:"Varun",createdAt:"2026-09-20T08:10:00.000Z"},
{id:"feedback-seed-11",eventId:"ai-hackathon-2026",societyId:"ai-club-society",category:"promotion",priority:"low",sentiment:"positive",text:"The registration poster is clear — deadlines are easy to spot.",submitter:"Meera",createdAt:"2026-10-02T14:00:00.000Z"},
{id:"feedback-seed-12",eventId:"utsav-2026",societyId:"rhythm-arts-society",category:"organization",priority:"medium",sentiment:"neutral",text:"Can audition slots be published so we don't wait all evening?",submitter:"Tara",createdAt:"2026-10-02T16:30:00.000Z"}];
export const initialMemberships:SocietyMembership[]=[
{societyId:"ai-club-society",userId:"user-shiv",role:"lead"},
{societyId:"design-club-society",userId:"user-shiv",role:"member"},
{societyId:"tech-society",userId:"user-shiv",role:"member"},
{societyId:"ai-club-society",userId:"aarav",role:"lead"},
{societyId:"design-club-society",userId:"ananya",role:"admin"},
{societyId:"tech-society",userId:"arjun",role:"admin"},
{societyId:"rhythm-arts-society",userId:"kavya",role:"admin"}
];
export const initialWorkspaces:SocietyWorkspace[]=[
{societyId:"ai-club-society",private:true},
{societyId:"design-club-society",private:true},
{societyId:"tech-society",private:true},
{societyId:"rhythm-arts-society",private:true}
];
export const initialKnowledge:KnowledgeRecord[]=posts.map((post,index)=>({id:"knowledge-"+post.id,title:post.title,content:post.body,source:"campus",tags:post.tags,linkedEntityIds:post.linked?[entities.find(e=>e.name===post.linked)?.id||""]:[],sourcePostId:post.id,authorizedRoles:["student","club_coordinator"],updatedAt:"2026-10-03T00:00:00.000Z"}));
export const initialSavedOpportunities:SavedOpportunity[]=[{id:"saved-ai-lab-internship",entityId:"ai-lab-internship",title:"Campus AI Lab is hiring two undergraduate research interns",sourcePostId:7,savedAt:"2026-10-02T18:20:00.000Z"}];
export const initialReminders:Reminder[]=[
{id:"reminder-hackathon-registration",taskId:1,title:"AI Hackathon registration closes",dueAt:"2026-10-10T18:00:00+05:30",done:false},
{id:"reminder-hackathon-idea",taskId:3,title:"AI Hackathon idea submission due",dueAt:"2026-10-13T23:59:00+05:30",done:false},
{id:"reminder-utsav-auditions",taskId:10,title:"Utsav auditions close",dueAt:"2026-10-16T18:00:00+05:30",done:false},
{id:"reminder-os-sprint",taskId:6,title:"Open Source Sprint registration closes",dueAt:"2026-10-18T23:59:00+05:30",done:false},
{id:"reminder-ai-lab-internship",taskId:8,title:"AI Lab internship applications close",dueAt:"2026-10-30T17:00:00+05:30",done:false}];
export const initialEventVotes:EventVote[]=[
{eventId:"ai-hackathon-2026",userId:"aarav",value:1},{eventId:"ai-hackathon-2026",userId:"riya",value:1},{eventId:"ai-hackathon-2026",userId:"neha",value:1},{eventId:"ai-hackathon-2026",userId:"arjun",value:1},
{eventId:"utsav-2026",userId:"kavya",value:1},{eventId:"utsav-2026",userId:"zoya",value:1},{eventId:"utsav-2026",userId:"maya",value:1},{eventId:"utsav-2026",userId:"rahul",value:1},{eventId:"utsav-2026",userId:"dev",value:1},
{eventId:"open-source-sprint-2026",userId:"dev",value:1},{eventId:"open-source-sprint-2026",userId:"sneha",value:1},{eventId:"open-source-sprint-2026",userId:"ishaan",value:1},
{eventId:"figma-workshop-2026",userId:"tanvi",value:1},{eventId:"figma-workshop-2026",userId:"rohit",value:1},
{eventId:"genai-workshop-2026",userId:"neha",value:1},{eventId:"genai-workshop-2026",userId:"kabir",value:1},{eventId:"genai-workshop-2026",userId:"pooja",value:-1},
{eventId:"devops-bootcamp-2026",userId:"arjun",value:1}];
export const initialEventComments:EventComment[]=[
{id:"comment-seed-1",eventId:"ai-hackathon-2026",userId:"meera",author:"Meera",text:"Can first-years join if their teammates are in second year?",createdAt:"2026-10-02T09:15:00.000Z"},
{id:"comment-seed-2",eventId:"ai-hackathon-2026",userId:"aarav",author:"Aarav",text:"Yes — mixed-year teams are welcome as long as everyone is a KIIT student.",createdAt:"2026-10-02T10:02:00.000Z"},
{id:"comment-seed-3",eventId:"utsav-2026",userId:"tara",author:"Tara",text:"Are group dance auditions on the same day as solo ones?",createdAt:"2026-10-02T16:40:00.000Z"},
{id:"comment-seed-4",eventId:"utsav-2026",userId:"zoya",author:"Zoya",text:"Group auditions are October 14, solos October 15. Slots go up tomorrow.",createdAt:"2026-10-02T17:05:00.000Z"},
{id:"comment-seed-5",eventId:"open-source-sprint-2026",userId:"varun",author:"Varun",text:"Never contributed before — is this beginner friendly?",createdAt:"2026-10-01T12:30:00.000Z"},
{id:"comment-seed-6",eventId:"open-source-sprint-2026",userId:"dev",author:"Dev",text:"Absolutely. Every issue on the list is tagged good-first-issue and a mentor will pair with you.",createdAt:"2026-10-01T13:10:00.000Z"},
{id:"comment-seed-7",eventId:"genai-workshop-2026",userId:"isha",author:"Isha",text:"Will the notebook be shared after the session?",createdAt:"2026-10-02T08:00:00.000Z"}];
export const initialGuests:EventGuest[]=[
{id:"guest-hack-ritesh",eventId:"ai-hackathon-2026",societyId:"ai-club-society",name:"Ritesh Kumar",designation:"Staff ML Engineer",role:"mentor",status:"confirmed",host:"Shiv",contact:"ritesh.k@example.com",arrival:"October 15, 2026 · 9:00 AM",needs:["Parking pass"],honorarium:0},
{id:"guest-hack-ankita",eventId:"ai-hackathon-2026",societyId:"ai-club-society",name:"Ankita Sharma",designation:"Founder, Lumen Robotics",role:"judge",status:"invited",host:"Aarav",contact:"ankita@example.com",arrival:"October 16, 2026 · 8:00 AM",needs:["Travel","Accommodation"],honorarium:5000},
{id:"guest-hack-dean",eventId:"ai-hackathon-2026",societyId:"ai-club-society",name:"Dr. S. Mohanty",designation:"Dean, School of Computer Engineering",role:"chief_guest",status:"confirmed",host:"Kabir",arrival:"October 15, 2026 · 10:00 AM",needs:["Welcome kit"],honorarium:0},
{id:"guest-os-farhan",eventId:"open-source-sprint-2026",societyId:"tech-society",name:"Farhan Ali",designation:"Maintainer, open source UI toolkit",role:"mentor",status:"confirmed",host:"Dev",contact:"farhan@example.com",arrival:"October 20, 2026 · 9:30 AM",needs:["Wi-Fi access"],honorarium:3000},
{id:"guest-os-lena",eventId:"open-source-sprint-2026",societyId:"tech-society",name:"Lena Fischer",designation:"Maintainer (remote)",role:"mentor",status:"tentative",host:"Arjun",arrival:"Joins on video",needs:["Video call setup"],honorarium:0},
{id:"guest-utsav-band",eventId:"utsav-2026",societyId:"rhythm-arts-society",name:"Static Bloom",designation:"Alumni band",role:"performer",status:"confirmed",host:"Rahul",contact:"staticbloom@example.com",arrival:"October 25, 2026 · 2:00 PM",needs:["Travel","Accommodation","Green room","Sound check"],honorarium:20000},
{id:"guest-utsav-dsw",eventId:"utsav-2026",societyId:"rhythm-arts-society",name:"Prof. Anjali Das",designation:"Dean of Student Welfare",role:"chief_guest",status:"invited",host:"Kavya",arrival:"October 25, 2026 · 6:00 PM",needs:["Front-row seating"],honorarium:0},
{id:"guest-genai-priya",eventId:"genai-workshop-2026",societyId:"ai-club-society",name:"Priya Raman",designation:"ML Engineer",role:"speaker",status:"confirmed",host:"Neha",contact:"priya.r@example.com",arrival:"November 6, 2026 · 7:30 PM",needs:["Travel","Accommodation"],honorarium:8000},
{id:"guest-devops-karthik",eventId:"devops-bootcamp-2026",societyId:"tech-society",name:"Karthik Menon",designation:"Site Reliability Engineer",role:"speaker",status:"invited",host:"Sneha",contact:"karthik.m@example.com",arrival:"November 13, 2026 · Evening",needs:["Travel","Accommodation"],honorarium:10000},
{id:"guest-teardown-nikhil",eventId:"ux-teardown-2026",societyId:"design-club-society",name:"Nikhil Bose",designation:"Product Designer",role:"speaker",status:"confirmed",host:"Ananya",arrival:"August 28, 2026 · 5:00 PM",needs:[],honorarium:2500},
{id:"guest-build-alumni",eventId:"ai-hackathon-2025",societyId:"ai-club-society",name:"Alumni mentor panel",designation:"Four AI Club alumni",role:"mentor",status:"confirmed",host:"Aarav",needs:["Dinner"],honorarium:0}];
export const initialBudgetItems:BudgetItem[]=[
{id:"bi-hack-sponsor",eventId:"ai-hackathon-2026",societyId:"ai-club-society",label:"Title sponsorship",category:"sponsorship",kind:"income",planned:25000,actual:25000,status:"received",owner:"Shiv"},
{id:"bi-hack-prizes",eventId:"ai-hackathon-2026",societyId:"ai-club-society",label:"Prize pool",category:"prizes",kind:"expense",planned:25000,actual:0,status:"committed",owner:"Shiv"},
{id:"bi-hack-food",eventId:"ai-hackathon-2026",societyId:"ai-club-society",label:"Meals and snacks for 24 hours",category:"food",kind:"expense",planned:15000,actual:12000,status:"paid",owner:"Kabir"},
{id:"bi-hack-swag",eventId:"ai-hackathon-2026",societyId:"ai-club-society",label:"Posters and badges",category:"marketing",kind:"expense",planned:4000,actual:3500,status:"paid",owner:"Riya"},
{id:"bi-hack-travel",eventId:"ai-hackathon-2026",societyId:"ai-club-society",label:"Judge travel",category:"travel",kind:"expense",planned:6000,actual:3000,status:"committed",owner:"Aarav"},
{id:"bi-figma-snacks",eventId:"figma-workshop-2026",societyId:"design-club-society",label:"Snacks",category:"food",kind:"expense",planned:2500,actual:1500,status:"paid",owner:"Rohit"},
{id:"bi-figma-certs",eventId:"figma-workshop-2026",societyId:"design-club-society",label:"Certificates",category:"other",kind:"expense",planned:1500,actual:0,status:"planned",owner:"Tanvi"},
{id:"bi-os-sponsor",eventId:"open-source-sprint-2026",societyId:"tech-society",label:"Developer platform sponsorship",category:"sponsorship",kind:"income",planned:10000,actual:10000,status:"received",owner:"Arjun"},
{id:"bi-os-swag",eventId:"open-source-sprint-2026",societyId:"tech-society",label:"Swag kits (60)",category:"prizes",kind:"expense",planned:9000,actual:4200,status:"committed",owner:"Pooja"},
{id:"bi-os-honorarium",eventId:"open-source-sprint-2026",societyId:"tech-society",label:"Maintainer honorarium",category:"honorarium",kind:"expense",planned:3000,actual:0,status:"planned",owner:"Dev"},
{id:"bi-os-food",eventId:"open-source-sprint-2026",societyId:"tech-society",label:"Lunch",category:"food",kind:"expense",planned:3000,actual:2000,status:"paid",owner:"Shiv"},
{id:"bi-utsav-sponsor",eventId:"utsav-2026",societyId:"rhythm-arts-society",label:"Festival sponsorship",category:"sponsorship",kind:"income",planned:70000,actual:60000,status:"received",owner:"Kavya"},
{id:"bi-utsav-stage",eventId:"utsav-2026",societyId:"rhythm-arts-society",label:"Stage, sound and lighting",category:"equipment",kind:"expense",planned:65000,actual:35000,status:"committed",owner:"Aditya"},
{id:"bi-utsav-band",eventId:"utsav-2026",societyId:"rhythm-arts-society",label:"Static Bloom honorarium",category:"honorarium",kind:"expense",planned:20000,actual:10000,status:"committed",owner:"Rahul"},
{id:"bi-utsav-hospitality",eventId:"utsav-2026",societyId:"rhythm-arts-society",label:"Hospitality and green room",category:"food",kind:"expense",planned:18000,actual:0,status:"planned",owner:"Kavya"},
{id:"bi-utsav-marketing",eventId:"utsav-2026",societyId:"rhythm-arts-society",label:"Banners and teaser reel",category:"marketing",kind:"expense",planned:9000,actual:3000,status:"paid",owner:"Zoya"},
{id:"bi-utsav-prizes",eventId:"utsav-2026",societyId:"rhythm-arts-society",label:"Prizes for top three acts",category:"prizes",kind:"expense",planned:15000,actual:0,status:"planned",owner:"Rahul"},
{id:"bi-utsav-security",eventId:"utsav-2026",societyId:"rhythm-arts-society",label:"Crowd security",category:"other",kind:"expense",planned:12000,actual:0,status:"planned",owner:"Aditya"},
{id:"bi-genai-sponsor",eventId:"genai-workshop-2026",societyId:"ai-club-society",label:"GPU credit sponsorship",category:"sponsorship",kind:"income",planned:8000,actual:0,status:"planned",owner:"Aarav"},
{id:"bi-genai-speaker",eventId:"genai-workshop-2026",societyId:"ai-club-society",label:"Speaker travel and honorarium",category:"travel",kind:"expense",planned:8000,actual:2500,status:"committed",owner:"Neha"},
{id:"bi-genai-snacks",eventId:"genai-workshop-2026",societyId:"ai-club-society",label:"Snacks",category:"food",kind:"expense",planned:3000,actual:0,status:"planned",owner:"Kabir"},
{id:"bi-devops-sponsor",eventId:"devops-bootcamp-2026",societyId:"tech-society",label:"Cloud credits sponsorship",category:"sponsorship",kind:"income",planned:15000,actual:0,status:"planned",owner:"Arjun"},
{id:"bi-devops-speaker",eventId:"devops-bootcamp-2026",societyId:"tech-society",label:"Speaker honorarium",category:"honorarium",kind:"expense",planned:10000,actual:0,status:"planned",owner:"Sneha"},
{id:"bi-devops-food",eventId:"devops-bootcamp-2026",societyId:"tech-society",label:"Two days of lunch",category:"food",kind:"expense",planned:8000,actual:0,status:"planned",owner:"Pooja"},
{id:"bi-build-sponsor",eventId:"ai-hackathon-2025",societyId:"ai-club-society",label:"Sponsorship",category:"sponsorship",kind:"income",planned:20000,actual:20000,status:"received",owner:"Shiv"},
{id:"bi-build-food",eventId:"ai-hackathon-2025",societyId:"ai-club-society",label:"Overnight food",category:"food",kind:"expense",planned:18000,actual:19800,status:"paid",owner:"Kabir"},
{id:"bi-build-prizes",eventId:"ai-hackathon-2025",societyId:"ai-club-society",label:"Mentor awards",category:"prizes",kind:"expense",planned:12000,actual:13000,status:"paid",owner:"Shiv"},
{id:"bi-teardown-prints",eventId:"ux-teardown-2026",societyId:"design-club-society",label:"Printouts and books",category:"prizes",kind:"expense",planned:1500,actual:1100,status:"paid",owner:"Maya"},
{id:"bi-teardown-speaker",eventId:"ux-teardown-2026",societyId:"design-club-society",label:"Speaker honorarium",category:"honorarium",kind:"expense",planned:2500,actual:2500,status:"paid",owner:"Ananya"},
{id:"bi-career-sponsor",eventId:"career-connect-2026",societyId:"tech-society",label:"Recruiter booth fees",category:"sponsorship",kind:"income",planned:45000,actual:45000,status:"received",owner:"Pooja"},
{id:"bi-career-venue",eventId:"career-connect-2026",societyId:"tech-society",label:"Convention Centre setup",category:"venue",kind:"expense",planned:35000,actual:36500,status:"paid",owner:"Sneha"},
{id:"bi-career-food",eventId:"career-connect-2026",societyId:"tech-society",label:"Recruiter lunch",category:"food",kind:"expense",planned:20000,actual:18000,status:"paid",owner:"Pooja"},
{id:"bi-openmic-sponsor",eventId:"open-mic-2026",societyId:"rhythm-arts-society",label:"Campus Café sponsorship",category:"sponsorship",kind:"income",planned:3000,actual:3000,status:"received",owner:"Kavya"},
{id:"bi-openmic-sound",eventId:"open-mic-2026",societyId:"rhythm-arts-society",label:"PA system rental",category:"equipment",kind:"expense",planned:6000,actual:6200,status:"paid",owner:"Aditya"},
{id:"bi-openmic-award",eventId:"open-mic-2026",societyId:"rhythm-arts-society",label:"Audience choice award",category:"prizes",kind:"expense",planned:1000,actual:1000,status:"paid",owner:"Kavya"}];
export const initialPolls:SocietyPoll[]=[
{id:"poll-genai-dataset",societyId:"ai-club-society",eventId:"genai-workshop-2026",question:"Which documents should the GenAI workshop chatbot answer questions about?",options:[{id:"a",label:"Campus notices"},{id:"b",label:"Course syllabi"},{id:"c",label:"Hostel and mess FAQs"}],createdBy:"Neha",createdAt:"2026-10-01T10:00:00.000Z",closesAt:"October 20, 2026",status:"open",allowMultiple:false},
{id:"poll-hack-solo",societyId:"ai-club-society",eventId:"ai-hackathon-2026",question:"Should the hackathon allow solo participants?",options:[{id:"yes",label:"Yes"},{id:"no",label:"No, teams of 2–4 only"}],createdBy:"Shiv",createdAt:"2026-09-25T09:00:00.000Z",closesAt:"September 30, 2026",status:"closed",allowMultiple:false},
{id:"poll-design-next",societyId:"design-club-society",question:"What should the next Design Club workshop cover?",options:[{id:"a",label:"Motion design"},{id:"b",label:"Design systems"},{id:"c",label:"Framer prototyping"},{id:"d",label:"Portfolio reviews"}],createdBy:"Ananya",createdAt:"2026-10-02T12:00:00.000Z",closesAt:"October 12, 2026",status:"open",allowMultiple:true},
{id:"poll-os-swag",societyId:"tech-society",eventId:"open-source-sprint-2026",question:"Pick the swag for four merged PRs",options:[{id:"tee",label:"T-shirt"},{id:"hoodie",label:"Hoodie (smaller batch)"},{id:"stickers",label:"Sticker pack and mug"}],createdBy:"Pooja",createdAt:"2026-10-01T08:00:00.000Z",closesAt:"October 9, 2026",status:"open",allowMultiple:false},
{id:"poll-devops-days",societyId:"tech-society",eventId:"devops-bootcamp-2026",question:"When should the DevOps bootcamp run?",options:[{id:"weekend",label:"Saturday and Sunday"},{id:"weekday",label:"Two weekday evenings"}],createdBy:"Sneha",createdAt:"2026-10-02T15:00:00.000Z",closesAt:"October 15, 2026",status:"open",allowMultiple:false},
{id:"poll-utsav-set",societyId:"rhythm-arts-society",eventId:"utsav-2026",question:"How long should the headliner set be?",options:[{id:"30",label:"30 minutes"},{id:"45",label:"45 minutes"},{id:"60",label:"60 minutes"}],createdBy:"Kavya",createdAt:"2026-10-01T18:00:00.000Z",closesAt:"October 14, 2026",status:"open",allowMultiple:false}];
export const initialPollVotes:PollVote[]=[
{pollId:"poll-genai-dataset",userId:"aarav",optionIds:["a"]},{pollId:"poll-genai-dataset",userId:"riya",optionIds:["c"]},{pollId:"poll-genai-dataset",userId:"kabir",optionIds:["c"]},{pollId:"poll-genai-dataset",userId:"ishaan",optionIds:["b"]},
{pollId:"poll-hack-solo",userId:"user-shiv",optionIds:["no"]},{pollId:"poll-hack-solo",userId:"aarav",optionIds:["no"]},{pollId:"poll-hack-solo",userId:"riya",optionIds:["yes"]},{pollId:"poll-hack-solo",userId:"kabir",optionIds:["no"]},{pollId:"poll-hack-solo",userId:"neha",optionIds:["no"]},
{pollId:"poll-design-next",userId:"ananya",optionIds:["b","d"]},{pollId:"poll-design-next",userId:"maya",optionIds:["a"]},{pollId:"poll-design-next",userId:"tanvi",optionIds:["a","c"]},
{pollId:"poll-os-swag",userId:"arjun",optionIds:["hoodie"]},{pollId:"poll-os-swag",userId:"dev",optionIds:["tee"]},{pollId:"poll-os-swag",userId:"sneha",optionIds:["hoodie"]},
{pollId:"poll-devops-days",userId:"pooja",optionIds:["weekend"]},
{pollId:"poll-utsav-set",userId:"rahul",optionIds:["45"]},{pollId:"poll-utsav-set",userId:"zoya",optionIds:["45"]},{pollId:"poll-utsav-set",userId:"aditya",optionIds:["30"]}];
export const initialNotionSync:NotionSyncState={status:"disconnected",knowledgePages:0,databases:0,message:"Notion is optional until a deployment owner configures the server-side integration."};
export const initialState:CampusState={entities,relationships,posts,tasks:initialTasks,events:initialEvents,societies:initialSocieties,societyEventPosts:initialSocietyEventPosts,societyTasks:initialSocietyTasks,budgets:initialBudgets,promotions:initialPromotions,requirements:initialRequirements,analyses:initialAnalyses,feedback:initialFeedback,memberships:initialMemberships,workspaces:initialWorkspaces,knowledge:initialKnowledge,savedOpportunities:initialSavedOpportunities,reminders:initialReminders,notionSync:initialNotionSync,eventVotes:initialEventVotes,eventComments:initialEventComments,guests:initialGuests,budgetItems:initialBudgetItems,polls:initialPolls,pollVotes:initialPollVotes};

export function createCampusStore(seed:CampusState=initialState){
let state:CampusState={entities:[...seed.entities],relationships:[...seed.relationships],posts:[...seed.posts],tasks:[...seed.tasks],events:[...(seed.events||[])],societies:[...(seed.societies||[])],societyEventPosts:[...(seed.societyEventPosts||[])],societyTasks:[...(seed.societyTasks||[])],budgets:[...(seed.budgets||[])],promotions:[...(seed.promotions||[])],requirements:[...(seed.requirements||[])],analyses:[...(seed.analyses||[])],feedback:[...(seed.feedback||[])],memberships:[...(seed.memberships||[])],workspaces:[...(seed.workspaces||[])],knowledge:[...(seed.knowledge||[])],savedOpportunities:[...(seed.savedOpportunities||[])],reminders:[...(seed.reminders||[])],notionSync:seed.notionSync||initialNotionSync,eventVotes:[...(seed.eventVotes||[])],eventComments:[...(seed.eventComments||[])],guests:[...(seed.guests||[])],budgetItems:[...(seed.budgetItems||[])],polls:[...(seed.polls||[])],pollVotes:[...(seed.pollVotes||[])]};
let nextId=Math.max(99,...state.posts.map(p=>p.id),...state.tasks.map(t=>t.id))+1;
return {
getState:()=>state,
addPost:(post:Post)=>{state={...state,posts:[post,...state.posts]}},
addEntities:(items:Entity[])=>{state={...state,entities:[...state.entities,...items]}},
addRelationships:(items:Relationship[])=>{state={...state,relationships:[...state.relationships,...items]}},
addTasks:(items:Task[])=>{state={...state,tasks:[...state.tasks,...items]}},
addEvent:(event:CampusEvent)=>{state={...state,events:[...state.events.filter(e=>e.id!==event.id),event]}},
addSocietyEventPost:(post:SocietyEventPost)=>{state={...state,societyEventPosts:[...state.societyEventPosts.filter(p=>p.id!==post.id),post]}},
removeEvent:(id:string)=>{state={...state,events:state.events.filter(e=>e.id!==id)}},
addSocietyTask:(task:SocietyTask)=>{state={...state,societyTasks:[...state.societyTasks.filter(t=>t.id!==task.id),task]}},
addBudget:(budget:SocietyBudget)=>{state={...state,budgets:[...state.budgets.filter(b=>b.eventId!==budget.eventId),budget]}},
addPromotion:(item:PromotionItem)=>{state={...state,promotions:[...state.promotions.filter(p=>p.id!==item.id),item]}},
addRequirement:(item:ResourceRequirement)=>{state={...state,requirements:[...state.requirements.filter(r=>r.id!==item.id),item]}},
addAnalysis:(analysis:SocietyAnalysis)=>{state={...state,analyses:[...state.analyses.filter(a=>a.eventId!==analysis.eventId),analysis]}},
addFeedback:(item:FeedbackRecord)=>{state={...state,feedback:[...state.feedback,item]}},
addKnowledge:(item:KnowledgeRecord)=>{state={...state,knowledge:[...state.knowledge.filter(x=>x.id!==item.id),item]}},
addSavedOpportunity:(item:SavedOpportunity)=>{state={...state,savedOpportunities:[...state.savedOpportunities.filter(x=>x.id!==item.id),item]}},
removeSavedOpportunity:(id:string)=>{state={...state,savedOpportunities:state.savedOpportunities.filter(x=>x.id!==id)}},
addReminder:(item:Reminder)=>{state={...state,reminders:[...state.reminders.filter(x=>x.id!==item.id),item]}},
setNotionSync:(notionSync:NotionSyncState)=>{state={...state,notionSync}},
// Voting the same way twice withdraws the vote; voting the other way switches it.
voteEvent:(eventId:string,userId:string,value:1|-1)=>{const current=state.eventVotes.find(v=>v.eventId===eventId&&v.userId===userId);const rest=state.eventVotes.filter(v=>v!==current);state={...state,eventVotes:current?.value===value?rest:[...rest,{eventId,userId,value}]}},
addEventComment:(comment:EventComment)=>{state={...state,eventComments:[...state.eventComments,comment]}},
removeEventComment:(id:string)=>{state={...state,eventComments:state.eventComments.filter(c=>c.id!==id)}},
addGuest:(guest:EventGuest)=>{state={...state,guests:[...state.guests.filter(g=>g.id!==guest.id),guest]}},
removeGuest:(id:string)=>{state={...state,guests:state.guests.filter(g=>g.id!==id)}},
addBudgetItem:(item:BudgetItem)=>{state={...state,budgetItems:[...state.budgetItems.filter(b=>b.id!==item.id),item]}},
removeBudgetItem:(id:string)=>{state={...state,budgetItems:state.budgetItems.filter(b=>b.id!==id)}},
removeRequirement:(id:string)=>{state={...state,requirements:state.requirements.filter(r=>r.id!==id)}},
addPoll:(poll:SocietyPoll)=>{state={...state,polls:[...state.polls.filter(p=>p.id!==poll.id),poll]}},
// A new ballot replaces the voter's previous one; an empty ballot withdraws it. Closed polls ignore votes.
votePoll:(pollId:string,userId:string,optionIds:string[])=>{const poll=state.polls.find(p=>p.id===pollId);if(!poll||poll.status!=="open")return;const valid=[...new Set(optionIds)].filter(id=>poll.options.some(o=>o.id===id)).slice(0,poll.allowMultiple?poll.options.length:1);const rest=state.pollVotes.filter(v=>!(v.pollId===pollId&&v.userId===userId));state={...state,pollVotes:valid.length?[...rest,{pollId,userId,optionIds:valid}]:rest}},
toggleTask:(id:number)=>{state={...state,tasks:state.tasks.map(t=>t.id===id?{...t,done:!t.done}:t)}},
nextId:()=>nextId++
};
}

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
// Bumped when the demo seed changes so browsers pick up the new campus data.
const STORAGE_KEY="campus-os-state-v2";
export const localCampusPersistence:CampusPersistence={
load:()=>{
if(typeof window==="undefined")return initialState;
try{
const raw=window.localStorage.getItem(STORAGE_KEY);
if(!raw)return initialState;
const parsed=JSON.parse(raw) as CampusState;
if(!parsed||!Array.isArray(parsed.entities)||!Array.isArray(parsed.relationships)||!Array.isArray(parsed.posts)||!Array.isArray(parsed.tasks))return initialState;
return {...initialState,...parsed,knowledge:Array.isArray(parsed.knowledge)?parsed.knowledge:initialState.knowledge,savedOpportunities:Array.isArray(parsed.savedOpportunities)?parsed.savedOpportunities:initialState.savedOpportunities,reminders:Array.isArray(parsed.reminders)?parsed.reminders:initialState.reminders,notionSync:parsed.notionSync||initialState.notionSync,eventVotes:Array.isArray(parsed.eventVotes)?parsed.eventVotes:initialState.eventVotes,eventComments:Array.isArray(parsed.eventComments)?parsed.eventComments:initialState.eventComments,events:Array.isArray(parsed.events)?parsed.events:initialState.events,societyEventPosts:Array.isArray(parsed.societyEventPosts)?parsed.societyEventPosts:initialState.societyEventPosts,societies:Array.isArray(parsed.societies)?parsed.societies:initialState.societies,societyTasks:Array.isArray(parsed.societyTasks)?parsed.societyTasks:initialState.societyTasks,budgets:Array.isArray(parsed.budgets)?parsed.budgets:initialState.budgets,promotions:Array.isArray(parsed.promotions)?parsed.promotions:initialState.promotions,requirements:Array.isArray(parsed.requirements)?parsed.requirements:initialState.requirements,analyses:Array.isArray(parsed.analyses)?parsed.analyses:initialState.analyses,feedback:Array.isArray(parsed.feedback)?parsed.feedback:initialState.feedback,memberships:Array.isArray(parsed.memberships)?parsed.memberships:initialState.memberships,workspaces:Array.isArray(parsed.workspaces)?parsed.workspaces:initialState.workspaces,guests:Array.isArray(parsed.guests)?parsed.guests:initialState.guests,budgetItems:Array.isArray(parsed.budgetItems)?parsed.budgetItems:initialState.budgetItems,polls:Array.isArray(parsed.polls)?parsed.polls:initialState.polls,pollVotes:Array.isArray(parsed.pollVotes)?parsed.pollVotes:initialState.pollVotes};
}catch{return initialState}
},
save:(state)=>{if(typeof window==="undefined")return;try{window.localStorage.setItem(STORAGE_KEY,JSON.stringify(state))}catch{}}
};
export function createCampusRepository(persistence:CampusPersistence=localCampusPersistence):CampusRepository{return persistence;}
export function loadCampusState(){return localCampusPersistence.load();}
export function saveCampusState(state:CampusState){localCampusPersistence.save(state);}


export type UserProfile={id:string;name:string;branch:string;year:number;interests:string[];clubs:string[];activeProjects:string[];role:UserRole};
export const demoProfile:UserProfile={id:"user-shiv",name:"Shiv",branch:"CSE",year:2,interests:["AI/ML","Hackathon","Development","Career"],clubs:["AI Club"],activeProjects:["Campus OS"],role:"club_coordinator"};
const PROFILE_STORAGE_KEY="campus-os-profile-v1";
export function loadUserProfile():UserProfile{
if(typeof window==="undefined")return demoProfile;
try{const raw=window.localStorage.getItem(PROFILE_STORAGE_KEY);if(!raw)return demoProfile;const parsed=JSON.parse(raw) as UserProfile;if(!parsed||!parsed.name||!Array.isArray(parsed.interests)||!Array.isArray(parsed.clubs)||!Array.isArray(parsed.activeProjects))return demoProfile;return {...demoProfile,...parsed,role:parsed.role==="club_coordinator"?"club_coordinator":"student"}}catch{return demoProfile}
}
export function saveUserProfile(profile:UserProfile){if(typeof window==="undefined")return;try{window.localStorage.setItem(PROFILE_STORAGE_KEY,JSON.stringify(profile))}catch{}}

export function roleLabel(role:UserRole){return role==="club_coordinator"?"Club Coordinator":"Student"}
export function roleCan(role:UserRole,action:"view_analytics"|"manage_society"|"sync_notion"|"create_workflow"){if(action==="view_analytics"||action==="create_workflow")return true;if(action==="sync_notion")return role==="club_coordinator";return role==="club_coordinator"}
export function personalizedWorkflow(state:CampusState,user:UserProfile){
const relevant=state.posts.map(post=>({post,relevance:relevanceForUser(post,user)})).filter(x=>x.relevance.score>0);
const existing=new Set(state.tasks.map(t=>t.title));
const actions:Task[]=[];
for(const item of relevant){if(item.post.type==="OPPORTUNITY"&&!existing.has("Review and apply: "+item.post.title))actions.push({id:10000+actions.length,title:"Review and apply: "+item.post.title,meta:"Personalized from a relevant opportunity",done:false,source:item.post.linked||"campus-os-project",kind:"task"});}
return actions;
}
export function discoveryTokens(query:string){return query.toLowerCase().split(/[^a-z0-9]+/).filter(x=>x.length>2&&!["what","when","where","with","from","for","the","and","are","can","show","find","tell","about","need"].includes(x));}
export function discoverCampus(state:CampusState,profile:UserProfile,query:string){
const tokens=discoveryTokens(query);const allowed=state.knowledge.filter(k=>k.authorizedRoles.includes(profile.role));
const scored=allowed.map(k=>{const hay=(k.title+" "+k.content+" "+k.tags.join(" ")).toLowerCase();const direct=tokens.filter(t=>hay.includes(t)).length;const links=k.linkedEntityIds.flatMap(id=>state.relationships.filter(r=>r.from===id||r.to===id));const graphBonus=links.reduce((n,r)=>n+(tokens.some(t=>(state.entities.find(e=>e.id===r.from)?.name+" "+state.entities.find(e=>e.id===r.to)?.name).toLowerCase().includes(t))?1:0),0);const profileBonus=userMatch(k,profile)?2:0;return {...k,score:direct*3+graphBonus+profileBonus,matchedTokens:tokens.filter(t=>hay.includes(t))};}).filter(k=>k.score>0).sort((a,b)=>b.score-a.score);
return scored.slice(0,8);
}
function userMatch(k:KnowledgeRecord,user:UserProfile){const hay=(k.title+" "+k.content+" "+k.tags.join(" ")).toLowerCase();return user.interests.some(x=>hay.includes(x.toLowerCase()))||user.clubs.some(x=>hay.includes(x.toLowerCase()))||user.activeProjects.some(x=>hay.includes(x.toLowerCase()));}
export function analyticsSnapshot(state:CampusState){
const registrations=state.entities.filter(e=>e.type==="registration");const registrationTasks=state.tasks.filter(t=>/register|registration/i.test(t.title));const deadlines=campusDeadlines(state);const completedTasks=state.tasks.filter(t=>t.done).length;const participation=state.analyses.reduce((n,a)=>n+a.attendees,0);const registrationsObserved=state.analyses.reduce((n,a)=>n+a.registrations,0);const workloadBySource=state.tasks.filter(t=>!t.done).reduce((acc,t)=>{acc[t.source]=(acc[t.source]||0)+1;return acc},{} as Record<string,number>);const projects=state.entities.filter(e=>e.type==="project").map(project=>{const milestones=state.entities.filter(e=>e.type==="milestone"&&state.relationships.some(r=>r.from===e.id&&r.relation==="milestone_of"&&r.to===project.id));const actions=state.tasks.filter(t=>t.source===project.id);return {project,milestones:milestones.length,actions:actions.length,completed:actions.filter(t=>t.done).length,progress:actions.length?Math.round(actions.filter(t=>t.done).length/actions.length*100):0};});return {pendingRegistrations:registrationTasks.filter(t=>!t.done).length+registrations.filter(r=>!state.tasks.some(t=>t.source===r.id&&t.done)).length,upcomingDeadlines:deadlines.filter(d=>d.status!=="overdue").length,participation:participation||registrationsObserved,workload:state.tasks.filter(t=>!t.done).length,completedTasks,totalTasks:state.tasks.length,workloadBySource,projects};}
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

export type CampusCopilotAnswer={answer:string;entities:Entity[];tasks:Task[];deadlines:ReturnType<typeof campusDeadlines>;reason:string};
export function answerCampusQuery(state:CampusState,profile:UserProfile,query:string):CampusCopilotAnswer{
const q=query.toLowerCase();
const deadlines=campusDeadlines(state).filter(d=>d.status!=="overdue"||q.includes("overdue"));
const relevantPosts=state.posts.map(post=>({post,relevance:relevanceForUser(post,profile)})).sort((a,b)=>b.relevance.score-a.relevance.score).filter(x=>x.relevance.score>0);
const openTasks=state.tasks.filter(t=>!t.done);
const wantsTasks=/\b(task|tasks|todo|to-do|action|actions|do i need|need to do)\b/i.test(q);
const wantsDeadlines=/\b(deadline|deadlines|due|due date|when.*(close|due)|registration)\b/i.test(q);
const wantsEvents=/\b(event|events|hackathon|workshop|happening)\b/i.test(q);
if(wantsTasks){
const tasks=openTasks.filter(t=>!q.includes("hackathon")||t.source==="ai-hackathon");
return {answer:tasks.length?"You have "+tasks.length+" open workflow task"+(tasks.length===1?"":"s")+": "+tasks.slice(0,4).map(t=>t.title).join("; "):"You have no open workflow tasks.",entities:tasks.map(t=>state.entities.find(e=>e.id===t.source)).filter(Boolean) as Entity[],tasks:tasks.slice(0,6),deadlines:[],reason:"Answer derived from your saved campus workflow."};
}
if(wantsDeadlines){
const selected=deadlines.filter(d=>!q.includes("hackathon")||d.source?.id==="ai-hackathon").slice(0,6);
return {answer:selected.length?selected.map(d=>d.entity.name+" for "+(d.source?.name||"campus information")).join("; "):"I could not find a connected deadline for that question.",entities:selected.flatMap(d=>[d.source,d.entity]).filter(Boolean) as Entity[],tasks:selected.map(d=>d.task).filter(Boolean) as Task[],deadlines:selected,reason:"Answer derived from connected deadline entities; no external facts were added."};
}
if(wantsEvents){
const events=state.entities.filter(e=>e.type==="event"||e.type==="competition").filter(e=>!q.includes("hackathon")||/hackathon/i.test(e.name));
return {answer:events.length?"Connected campus events: "+events.map(e=>e.name).join(", "):"I could not find a connected event matching that question.",entities:events,tasks:events.flatMap(e=>state.tasks.filter(t=>t.source===e.id&&!t.done)).slice(0,6),deadlines:events.flatMap(e=>deadlines.filter(d=>d.source?.id===e.id)).slice(0,6),reason:"Answer derived from event entities currently stored in Campus OS."};
}
if(relevantPosts.length){const top=relevantPosts.slice(0,3);return {answer:"Based on your profile, the most relevant campus signals are: "+top.map(x=>x.post.title).join("; "),entities:top.map(x=>state.entities.find(e=>e.name===x.post.linked)).filter(Boolean) as Entity[],tasks:openTasks.slice(0,4),deadlines:[],reason:top.map(x=>x.relevance.reasons.join(", ")).filter(Boolean).join("; ")||"Matches your saved campus context."};}
return {answer:"I could not find a connected campus fact for that question. Try asking about deadlines, tasks, events, or what is relevant to you.",entities:[],tasks:[],deadlines:[],reason:"Campus Copilot only answers from stored campus state."};
}


export function canAccessSociety(state:CampusState,societyId:string,userId:string):boolean{
const workspace=state.workspaces.find(w=>w.societyId===societyId);
if(!workspace?.private)return true;
return state.memberships.some(m=>m.societyId===societyId&&m.userId===userId&&(m.role==="lead"||m.role==="admin"||m.role==="member"));
}
export function societyContribution(state:CampusState,societyId:string,eventId:string){
const tasks=state.societyTasks.filter(t=>t.societyId===societyId&&t.eventId===eventId);
const names=[...new Set(tasks.map(t=>t.assignee))];
return names.map(name=>{const mine=tasks.filter(t=>t.assignee===name);const completed=mine.filter(t=>t.done).length;return {member:name,tasks:mine.length,completed,completion:mine.length?Math.round(completed/mine.length*100):0}}).sort((a,b)=>b.completion-a.completion);
}
export function feedbackSummary(state:CampusState,societyId?:string,eventId?:string){
const rows=state.feedback.filter(f=>(!societyId||f.societyId===societyId)&&(!eventId||f.eventId===eventId));
return (["event","venue","organization","promotion","content","volunteers","technical","budget","other"] as FeedbackCategory[]).map(category=>({category,count:rows.filter(r=>r.category===category).length,negative:rows.filter(r=>r.category===category&&r.sentiment==="negative").length})).filter(x=>x.count>0);
}

export const XFACTOR_WORD_LIMIT=30;
export function wordCount(text:string){return text.trim().split(/\s+/).filter(Boolean).length}
export function limitWords(text:string,limit=XFACTOR_WORD_LIMIT){const words=text.trim().split(/\s+/).filter(Boolean);return words.length>limit?words.slice(0,limit).join(" ")+"…":words.join(" ")}
export function isVideoUrl(url:string){return /\.(mp4|webm|ogg|mov)(\?|#|$)/i.test(url)||/(youtube\.com\/watch|youtu\.be\/|vimeo\.com\/)/i.test(url)}

export type FeedCard={event:CampusEvent;societyName:string;societyLogo?:string;description:string;registrationLink?:string;specialGuests:string[];xfactor:string;media:string[];score:number;upvotes:number;downvotes:number;myVote:0|1|-1;comments:EventComment[];relevance:number;};

// One card per upcoming event: the event record, completed by its society post and society profile.
export function eventFeed(state:CampusState,user:UserProfile):FeedCard[]{
const interests=[...user.interests,...user.clubs,...user.activeProjects].map(x=>x.toLowerCase()).filter(Boolean);
return state.events.filter(e=>e.status==="upcoming"||e.status==="in_progress").map(event=>{
const post=state.societyEventPosts.find(p=>p.eventId===event.id);
const society=state.societies.find(s=>s.id===event.societyId)||state.societies.find(s=>s.name===event.societyName);
const votes=state.eventVotes.filter(v=>v.eventId===event.id);
const upvotes=votes.filter(v=>v.value===1).length;const downvotes=votes.length-upvotes;
const hay=[event.name,event.societyName,event.nature,event.highlight].join(" ").toLowerCase();
const media=event.media?.length?event.media:post?.media||[];
return {event,societyName:event.societyName||society?.name||"Campus society",societyLogo:event.societyLogo||society?.logo,description:event.description||post?.description||event.highlight,registrationLink:event.registrationLink||post?.registrationLink||undefined,specialGuests:event.specialGuests.length?event.specialGuests:post?.specialGuests||[],xfactor:limitWords(event.xfactor||post?.xfactor||event.highlight||""),media,score:upvotes-downvotes,upvotes,downvotes,myVote:(votes.find(v=>v.userId===user.id)?.value||0) as 0|1|-1,comments:state.eventComments.filter(c=>c.eventId===event.id).sort((a,b)=>a.createdAt.localeCompare(b.createdAt)),relevance:interests.filter(x=>hay.includes(x)).length};
}).sort((a,b)=>b.relevance-a.relevance||b.score-a.score||(Date.parse(a.event.date)||Infinity)-(Date.parse(b.event.date)||Infinity));
}

export function canManageSociety(state:CampusState,societyId:string,userId:string){return state.memberships.some(m=>m.societyId===societyId&&m.userId===userId&&(m.role==="lead"||m.role==="admin"))}

// Line items drive the totals; events without line items fall back to the single budget record.
export function budgetSummary(state:CampusState,eventId:string){
const budget=state.budgets.find(b=>b.eventId===eventId);
const items=state.budgetItems.filter(i=>i.eventId===eventId);
const expenses=items.filter(i=>i.kind==="expense");const income=items.filter(i=>i.kind==="income");
const sum=(rows:BudgetItem[],key:"planned"|"actual")=>rows.reduce((n,r)=>n+(Number(r[key])||0),0);
const cap=budget?.estimated||0;
const plannedExpense=sum(expenses,"planned");
const actualExpense=items.length?sum(expenses,"actual"):budget?.actual||0;
const plannedIncome=sum(income,"planned");
const receivedIncome=items.length?sum(income,"actual"):budget?.sponsorship||0;
const categories=[...new Set(expenses.map(e=>e.category))].map(category=>({category,planned:sum(expenses.filter(e=>e.category===category),"planned"),actual:sum(expenses.filter(e=>e.category===category),"actual")})).sort((a,b)=>b.planned-a.planned);
return {cap,currency:budget?.currency||"INR",items,plannedExpense,actualExpense,plannedIncome,receivedIncome,net:receivedIncome-actualExpense,remaining:cap-actualExpense,plannedOverCap:cap>0&&plannedExpense>cap,actualOverCap:cap>0&&actualExpense>cap,categories};
}

// A poll stops taking votes when a lead closes it or its closing date has passed.
export function pollIsOpen(poll:SocietyPoll,now=new Date()){if(poll.status!=="open")return false;const closes=dayKey(poll.closesAt);return !closes||closes>=dayKey(now.toDateString())!}

export function pollResults(state:CampusState,pollId:string,userId?:string){
const poll=state.polls.find(p=>p.id===pollId);
const votes=state.pollVotes.filter(v=>v.pollId===pollId);
const options=(poll?.options||[]).map(o=>{const count=votes.filter(v=>v.optionIds.includes(o.id)).length;return {...o,votes:count,share:votes.length?Math.round(count/votes.length*100):0}});
const top=Math.max(0,...options.map(o=>o.votes));
return {poll,voters:votes.length,options,leaders:top?options.filter(o=>o.votes===top):[],myVote:userId?votes.find(v=>v.userId===userId)?.optionIds||[]:[]};
}

// ---- Conflict detection -------------------------------------------------------------------
// Checks upcoming events (plus events that exist only in the Notion calendar) for clashes and
// for preparation that is running late. Time-based rules use `now` so results are reproducible.
export const GUEST_CONFIRM_WINDOW_DAYS=14;
export const RESOURCE_WINDOW_DAYS=7;
const DAY_MS=86400000;
export function dayKey(text?:string){
if(!text)return undefined;
const iso=String(text).match(/^\d{4}-\d{2}-\d{2}/);if(iso)return iso[0];
const time=Date.parse(text);if(Number.isNaN(time))return undefined;
const d=new Date(time);return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");
}
function daysUntil(text:string,now:Date){const key=dayKey(text);if(!key)return undefined;const today=new Date(now.getFullYear(),now.getMonth(),now.getDate());return Math.round((new Date(key+"T00:00:00").getTime()-today.getTime())/DAY_MS)}
function formatDay(key:string){return new Date(key+"T00:00:00").toLocaleDateString("en-US",{month:"long",day:"numeric"})}
function normal(value:string){return value.toLowerCase().replace(/[^a-z0-9]+/g," ").trim()}
function groupBy<T>(rows:T[],key:(row:T)=>string){const groups=new Map<string,T[]>();for(const row of rows){const k=key(row);groups.set(k,[...(groups.get(k)||[]),row])}return groups}
function unique<T>(rows:T[]){return [...new Set(rows)]}
function inr(value:number){return "₹"+value.toLocaleString("en-IN")}
function inDays(days:number){return days===0?"today":days===1?"tomorrow":"in "+days+" days"}
const SEVERITY_RANK:Record<ConflictSeverity,number>={high:0,medium:1,low:2};

export function detectConflicts(state:CampusState,{external=[],now=new Date()}:{external?:ExternalEvent[];now?:Date}={}):Conflict[]{
const conflicts:Conflict[]=[];
const active=state.events.filter(e=>(e.status==="upcoming"||e.status==="in_progress")&&(daysUntil(e.date,now)??-1)>=0);
const byId=new Map(active.map(e=>[e.id,e]));
const societiesOf=(eventIds:string[])=>unique(eventIds.map(id=>byId.get(id)!.societyId));
// Venue and schedule clashes, including rows added by hand to the Notion events table.
type Slot={id:string;name:string;day:string;venue:string;society:string;societyId?:string;external:boolean};
const slots:Slot[]=[...active.map(e=>({id:e.id,name:e.name,day:dayKey(e.date)||"",venue:e.venue,society:e.societyName,societyId:e.societyId,external:false})),...external.filter(x=>(daysUntil(x.date,now)??-1)>=0).map(x=>({id:x.id,name:x.name,day:dayKey(x.date)||"",venue:x.venue,society:x.society||"Notion calendar",external:true}))].filter(s=>s.day);
for(const [day,group] of groupBy(slots,s=>s.day)){
if(group.length<2)continue;
const inVenueClash=new Set<string>();
for(const [venue,same] of groupBy(group.filter(s=>normal(s.venue)&&normal(s.venue)!=="tbd"),s=>normal(s.venue))){
if(same.length<2)continue;
same.forEach(s=>inVenueClash.add(s.id));
conflicts.push({id:"venue-"+day+"-"+slug(venue),kind:"venue",severity:"high",title:same[0].venue+" is double-booked on "+formatDay(day),detail:same.map(s=>s.name+" ("+s.society+(s.external?", Notion calendar":"")+")").join(" and ")+" are booked into the same venue.",eventIds:same.filter(s=>!s.external).map(s=>s.id),societyIds:unique(same.map(s=>s.societyId).filter(Boolean) as string[]),source:same.some(s=>s.external)?"notion":"campus"});
}
if(new Set(group.map(s=>s.society)).size>1&&group.some(s=>!inVenueClash.has(s.id)))conflicts.push({id:"schedule-"+day,kind:"schedule",severity:"low",title:group.length+" events compete for an audience on "+formatDay(day),detail:group.map(s=>s.name+" · "+s.venue+(s.external?" (Notion calendar)":"")).join("; ")+".",eventIds:group.filter(s=>!s.external).map(s=>s.id),societyIds:unique(group.map(s=>s.societyId).filter(Boolean) as string[]),source:group.some(s=>s.external)?"notion":"campus"});
}
// Guests: double-booked on one day, or still unconfirmed close to the event.
const guests=state.guests.filter(g=>g.status!=="declined"&&byId.has(g.eventId));
for(const [,same] of groupBy(guests,g=>normal(g.name)+"|"+dayKey(byId.get(g.eventId)!.date))){
const events=unique(same.map(g=>g.eventId));
if(events.length<2)continue;
const day=dayKey(byId.get(events[0])!.date)!;
conflicts.push({id:"guest-"+slug(same[0].name)+"-"+day,kind:"guest",severity:"high",title:same[0].name+" is booked for "+events.length+" events on "+formatDay(day),detail:events.map(id=>byId.get(id)!.name).join(" and ")+" both list this guest.",eventIds:events,societyIds:societiesOf(events),source:"campus"});
}
for(const guest of guests.filter(g=>g.status==="invited"||g.status==="tentative")){
const event=byId.get(guest.eventId)!;const days=daysUntil(event.date,now)!;
if(days>GUEST_CONFIRM_WINDOW_DAYS)continue;
conflicts.push({id:"readiness-guest-"+guest.id,kind:"readiness",severity:days<=3?"high":"medium",title:guest.name+" has not confirmed for "+event.name,detail:"Status is "+guest.status+" and the event is "+inDays(days)+". Host: "+guest.host+".",eventIds:[event.id],societyIds:[event.societyId],source:"campus"});
}
// Members: open tasks for different events due on the same day.
const openTasks=state.societyTasks.filter(t=>!t.done&&byId.has(t.eventId)&&(daysUntil(t.dueDate,now)??-1)>=0);
for(const [,same] of groupBy(openTasks,t=>normal(t.assignee)+"|"+dayKey(t.dueDate))){
const events=unique(same.map(t=>t.eventId));
if(events.length<2)continue;
const day=dayKey(same[0].dueDate)!;
conflicts.push({id:"member-"+slug(same[0].assignee)+"-"+day,kind:"member",severity:"medium",title:same[0].assignee+" has "+same.length+" tasks due "+formatDay(day)+" across events",detail:same.map(t=>t.title+" ("+byId.get(t.eventId)!.name+")").join("; ")+".",eventIds:events,societyIds:societiesOf(events),source:"campus"});
}
// Resources: the same physical item needed by two events on one day, or still unconfirmed close to the event.
const resources=state.requirements.filter(r=>r.status!=="done"&&byId.has(r.eventId));
for(const [,same] of groupBy(resources.filter(r=>r.category==="equipment"||r.category==="room"||r.category==="technical"),r=>normal(r.item)+"|"+dayKey(byId.get(r.eventId)!.date))){
const events=unique(same.map(r=>r.eventId));
if(events.length<2)continue;
const day=dayKey(byId.get(events[0])!.date)!;
conflicts.push({id:"resource-"+slug(same[0].item)+"-"+day,kind:"resource",severity:"high",title:same[0].item+" is needed by "+events.length+" events on "+formatDay(day),detail:events.map(id=>byId.get(id)!.name).join(" and ")+" both require it.",eventIds:events,societyIds:societiesOf(events),source:"campus"});
}
for(const r of resources.filter(r=>r.status==="needed"||r.status==="requested")){
const event=byId.get(r.eventId)!;const days=daysUntil(event.date,now)!;
if(days>RESOURCE_WINDOW_DAYS)continue;
conflicts.push({id:"readiness-resource-"+r.id,kind:"readiness",severity:days<=2&&r.status==="needed"?"high":"medium",title:r.item+" is not confirmed for "+event.name,detail:"Status is "+r.status+" and the event is "+inDays(days)+". Owner: "+r.owner+".",eventIds:[event.id],societyIds:[event.societyId],source:"campus"});
}
// Budgets: spend over the approved cap.
for(const event of active){
const b=budgetSummary(state,event.id);
if(b.actualOverCap)conflicts.push({id:"budget-actual-"+event.id,kind:"budget",severity:"high",title:event.name+" has spent over its budget",detail:"Actual spend "+inr(b.actualExpense)+" exceeds the "+inr(b.cap)+" cap by "+inr(b.actualExpense-b.cap)+".",eventIds:[event.id],societyIds:[event.societyId],source:"campus"});
else if(b.plannedOverCap)conflicts.push({id:"budget-planned-"+event.id,kind:"budget",severity:"medium",title:event.name+" is planned over budget",detail:"Planned spend "+inr(b.plannedExpense)+" exceeds the "+inr(b.cap)+" cap by "+inr(b.plannedExpense-b.cap)+".",eventIds:[event.id],societyIds:[event.societyId],source:"campus"});
}
// Registration deadlines that fall after the event itself.
for(const event of active){
const deadline=dayKey(event.deadline),date=dayKey(event.date);
if(deadline&&date&&deadline>date)conflicts.push({id:"schedule-deadline-"+event.id,kind:"schedule",severity:"low",title:event.name+" closes registration after the event",detail:"Deadline "+event.deadline+" is after the event date "+event.date+".",eventIds:[event.id],societyIds:[event.societyId],source:"campus"});
}
return conflicts.sort((a,b)=>SEVERITY_RANK[a.severity]-SEVERITY_RANK[b.severity]||a.title.localeCompare(b.title));
}
