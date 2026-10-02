import{describe,expect,it}from"vitest";
import{commitExtraction,createCampusStore,extractAnnouncement,initialState,normalizeExtraction,validateExtraction,deterministicExtractionProvider}from"./domain";

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
