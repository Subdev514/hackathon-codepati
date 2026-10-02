import{describe,expect,it}from"vitest";
import{commitExtraction,createCampusStore,extractAnnouncement,initialState,normalizeExtraction,validateExtraction,deterministicExtractionProvider,relevanceForUser,deadlineStatus,campusDeadlines,createCampusRepository}from"./domain";

describe("announcement extraction",()=>{
it("extracts the hackathon demo into connected facts and actions",()=>{
const result=extractAnnouncement({title:"24-Hour AI Hackathon — registrations are open",body:"AI Club is conducting a 24-hour hackathon on October 15. Teams of 2–4 can participate. Registration closes October 10. Participants need to submit their idea before October 13.",type:"EVENT",author:"AI Club",club:"AI Club"});
expect(result.event?.name.toLowerCase()).toContain("hackathon");
expect(result.organization?.name).toBe("AI Club");
expect(result.deadlines.map(x=>x.date)).toEqual(["October 10","October 13"]);
expect(result.requirements[0]).toContain("Team size 2–4");
expect(result.relationships.some(x=>x.relation==="organizes")).toBe(true);
expect(result.relationships.some(x=>x.relation==="has_deadline")).toBe(true);
expect(result.tasks.length).toBeGreaterThanOrEqual(3);
});
it("commits extracted state without duplicating existing relationships",()=>{
const store=createCampusStore({...initialState,entities:[],relationships:[],posts:[],tasks:[]});
const result=extractAnnouncement({title:"AI Hackathon",body:"AI Club is conducting a hackathon on October 15. Registration closes October 10.",type:"EVENT",author:"AI Club",club:"AI Club"});
commitExtraction(store,result);
const after=store.getState();
expect(after.posts).toHaveLength(1);
expect(after.entities.length).toBeGreaterThan(0);
expect(after.relationships.some(x=>x.relation==="has_deadline")).toBe(true);
expect(after.tasks.length).toBeGreaterThan(0);
commitExtraction(store,result);
expect(store.getState().relationships.filter(x=>x.relation==="has_deadline")).toHaveLength(1);
});
});
describe("extraction boundary",()=>{
 it("normalizes duplicate facts and validates the provider contract",async()=>{
  const result=extractAnnouncement({title:"AI Hackathon",body:"AI Club is conducting a hackathon. Registration closes October 10.",type:"EVENT",author:"AI Club",club:"AI Club"});
  const duplicated={...result,entities:[...result.entities,...result.entities],relationships:[...result.relationships,...result.relationships],tasks:[...result.tasks,...result.tasks]};
  const normalized=normalizeExtraction(duplicated);
  expect(validateExtraction(normalized).valid).toBe(true);
  const providerResult=await deterministicExtractionProvider.understand(result.input);
  expect(providerResult.entities.length).toBeGreaterThan(0);
 });
});

describe("campus information types",()=>{
 it("preserves resource, notice and competition announcements as first-class entities",()=>{
  const resource=extractAnnouncement({title:"CN Viva Notes",body:"Seniors uploaded routing and socket notes.",type:"RESOURCE",author:"B-30",club:"B-30"});
  const notice=extractAnnouncement({title:"Exam form notice",body:"Submit the examination form before October 20.",type:"NOTICE",author:"Admin",club:"Administration"});
  const competition=extractAnnouncement({title:"National Coding Competition",body:"Teams of 2-4 can participate. Registration closes October 12.",type:"COMPETITION",author:"Coding Club",club:"Coding Club"});
  expect(resource.entities.some(e=>e.type==="resource")).toBe(true);
  expect(notice.entities.some(e=>e.type==="notice")).toBe(true);
  expect(competition.entities.some(e=>e.type==="competition")).toBe(true);
  expect(competition.relationships.some(r=>r.relation==="has_deadline")).toBe(true);
 });
});

describe("personal workspace",()=>{
 it("loads the demo profile safely and uses active projects for relevance",()=>{
  const post={id:99,type:"PROJECT",title:"Campus OS planning",body:"Work on the Campus OS dashboard",author:"Team",club:"Tech Society",time:"now",votes:0,comments:0,tags:["Campus OS"],linked:"Campus OS"};
  const profile={...({id:"u",name:"A",branch:"CSE",year:2,interests:[],clubs:[],activeProjects:["Campus OS"]})};
  expect(profile.activeProjects).toContain("Campus OS");
  expect(relevanceForUser(post,profile).reasons.join(" ")).toContain("active project");
 });
});


describe("deadline intelligence",()=>{
 it("classifies deadline attention windows",()=>{
  const now=new Date(2026,9,2,12);
  expect(deadlineStatus("October 2",now)).toBe("today");
  expect(deadlineStatus("October 5",now)).toBe("due_soon");
  expect(deadlineStatus("September 30",now)).toBe("overdue");
  const deadlines=campusDeadlines(initialState,now);
  expect(deadlines[0]?.date).toBe("October 10");
  expect(deadlines[0]?.source?.name).toBe("AI Hackathon");
 });
});

describe("persistence boundary",()=>{
 it("can swap the local persistence implementation without changing domain consumers",()=>{
  let saved=initialState;
  const persistence={load:()=>saved,save:(next:typeof initialState)=>{saved=next}};
  const repository=createCampusRepository(persistence);
  const state=repository.load();
  expect(state.entities.length).toBeGreaterThan(0);
  repository.save({...state,posts:[]});
  expect(repository.load().posts).toHaveLength(0);
 });
});

describe("state hardening",()=>{
 it("allocates ids above persisted state and avoids duplicate generated tasks",()=>{
  const seed={...initialState,posts:[{...initialState.posts[0],id:900}],tasks:[{...initialState.tasks[0],id:901}]};
  const store=createCampusStore(seed);
  expect(store.nextId()).toBe(902);
  const result=extractAnnouncement({title:"AI Hackathon",body:"AI Club is conducting a hackathon. Registration closes October 10.",type:"EVENT",author:"AI Club",club:"AI Club"});
  commitExtraction(store,result);
  const count=store.getState().tasks.length;
  commitExtraction(store,result);
  expect(store.getState().tasks.length).toBe(count);
 });
});
