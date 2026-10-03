import{describe,it,expect}from"vitest";
// @ts-ignore -- plain JS module shared with the Vercel function
import{TABLES,planSync,externalEventFromRow}from"../api/_notionTables.js";
import{createCampusStore,initialState,budgetSummary,pollResults,pollIsOpen,detectConflicts,canManageSociety}from"./domain";
import type{CampusState}from"./domain";

const today=new Date(2026,9,3,10);
const base:CampusState={...initialState,guests:[],budgetItems:[],requirements:[],societyTasks:[],budgets:[]};

describe("guest management",()=>{
it("adds, updates and removes event guests",()=>{
const store=createCampusStore(initialState);
const guest={...initialState.guests[0],id:"g-test",status:"invited" as const};
store.addGuest(guest);
store.addGuest({...guest,status:"confirmed"});
expect(store.getState().guests.filter(g=>g.id==="g-test").map(g=>g.status)).toEqual(["confirmed"]);
store.removeGuest("g-test");
expect(store.getState().guests.some(g=>g.id==="g-test")).toBe(false);
});
});

describe("budget tracker",()=>{
it("totals line items against the approved cap",()=>{
const b=budgetSummary(initialState,"utsav-2026");
expect(b).toMatchObject({cap:120000,plannedExpense:139000,actualExpense:48000,plannedIncome:70000,receivedIncome:60000,net:12000,plannedOverCap:true,actualOverCap:false});
expect(b.categories[0]).toEqual({category:"equipment",planned:65000,actual:35000});
});
it("falls back to the single budget record when an event has no line items",()=>{
const state={...initialState,budgetItems:[]};
expect(budgetSummary(state,"ai-hackathon-2026")).toMatchObject({actualExpense:18500,receivedIncome:25000,plannedExpense:0});
});
it("edits and removes line items",()=>{
const store=createCampusStore(initialState);
const item=initialState.budgetItems.find(i=>i.id==="bi-hack-prizes")!;
store.addBudgetItem({...item,actual:25000,status:"paid"});
expect(budgetSummary(store.getState(),"ai-hackathon-2026").actualExpense).toBe(43500);
store.removeBudgetItem(item.id);
expect(budgetSummary(store.getState(),"ai-hackathon-2026").plannedExpense).toBe(25000);
});
});

describe("society polls",()=>{
it("keeps one ballot per voter that can be changed or withdrawn",()=>{
const store=createCampusStore(initialState);
store.votePoll("poll-os-swag","user-shiv",["tee"]);
store.votePoll("poll-os-swag","user-shiv",["stickers"]);
let r=pollResults(store.getState(),"poll-os-swag","user-shiv");
expect(r.voters).toBe(4);
expect(r.myVote).toEqual(["stickers"]);
expect(r.leaders.map(o=>o.id)).toEqual(["hoodie"]);
store.votePoll("poll-os-swag","user-shiv",[]);
expect(pollResults(store.getState(),"poll-os-swag","user-shiv").voters).toBe(3);
});
it("limits single-choice ballots, drops unknown options and ignores closed polls",()=>{
const store=createCampusStore(initialState);
store.votePoll("poll-os-swag","user-shiv",["tee","hoodie","nope"]);
expect(pollResults(store.getState(),"poll-os-swag","user-shiv").myVote).toEqual(["tee"]);
store.votePoll("poll-design-next","user-shiv",["a","c"]);
expect(pollResults(store.getState(),"poll-design-next","user-shiv").myVote).toEqual(["a","c"]);
store.votePoll("poll-hack-solo","user-shiv",["yes"]);
expect(pollResults(store.getState(),"poll-hack-solo","user-shiv").myVote).toEqual(["no"]);
});
it("closes polls by status or by closing date",()=>{
const poll=initialState.polls.find(p=>p.id==="poll-os-swag")!;
expect(pollIsOpen(poll,today)).toBe(true);
expect(pollIsOpen(poll,new Date(2026,9,9,23))).toBe(true);
expect(pollIsOpen(poll,new Date(2026,9,10,0,1))).toBe(false);
expect(pollIsOpen({...poll,status:"closed"},today)).toBe(false);
});
it("lets only leads and admins manage a society",()=>{
expect(canManageSociety(initialState,"ai-club-society","user-shiv")).toBe(true);
expect(canManageSociety(initialState,"tech-society","user-shiv")).toBe(false);
});
});

describe("conflict detection",()=>{
it("finds the seeded conflicts",()=>{
const kinds=detectConflicts(initialState,{now:today}).map(c=>c.kind+":"+c.title);
expect(kinds).toEqual(expect.arrayContaining([
"member:Shiv has 2 tasks due October 8 across events",
"budget:Utsav 2026 · Cultural Night is planned over budget",
"readiness:Ankita Sharma has not confirmed for 24-Hour AI Hackathon",
"readiness:Projector and clicker is not confirmed for Figma Crash Course"]));
});
it("flags a venue double-booked by an event added by hand in Notion",()=>{
const external=[{id:"notion-1",name:"Department convocation rehearsal",date:"2026-10-25",venue:"open air theatre",society:"Administration"}];
const venue=detectConflicts(initialState,{now:today,external}).find(c=>c.kind==="venue")!;
expect(venue).toMatchObject({severity:"high",source:"notion",eventIds:["utsav-2026"],societyIds:["rhythm-arts-society"]});
expect(venue.detail).toContain("Department convocation rehearsal");
});
it("flags guests and shared resources booked twice on one day",()=>{
const day="October 25, 2026";
const events=[{...initialState.events[0],id:"e1",name:"Event One",date:day,venue:"Hall A"},{...initialState.events[0],id:"e2",name:"Event Two",societyId:"tech-society",societyName:"Tech Society",date:day,venue:"Hall B"}];
const state:CampusState={...base,events,
guests:[{...initialState.guests[0],id:"g1",eventId:"e1",name:"Priya Raman",status:"confirmed"},{...initialState.guests[0],id:"g2",eventId:"e2",name:"priya raman",status:"confirmed"}],
requirements:[{id:"r1",eventId:"e1",societyId:"ai-club-society",category:"equipment",item:"Projector",quantity:"1",owner:"A",status:"confirmed"},{id:"r2",eventId:"e2",societyId:"tech-society",category:"equipment",item:"projector",quantity:"1",owner:"B",status:"confirmed"}]};
const found=detectConflicts(state,{now:today});
expect(found.map(c=>c.kind).sort()).toEqual(["guest","resource","schedule"]);
expect(found.find(c=>c.kind==="guest")!.societyIds.sort()).toEqual(["ai-club-society","tech-society"]);
});
it("ignores completed events, declined guests and past dates",()=>{
const state:CampusState={...base,events:initialState.events.map(e=>({...e,status:"completed" as const})),guests:initialState.guests};
expect(detectConflicts(state,{now:today})).toEqual([]);
const external=[{id:"n",name:"Old booking",date:"2026-09-01",venue:"Open Air Theatre"}];
expect(detectConflicts(initialState,{now:today,external}).some(c=>c.source==="notion")).toBe(false);
});
it("escalates spend over the cap",()=>{
const store=createCampusStore(initialState);
store.addBudgetItem({...initialState.budgetItems.find(i=>i.id==="bi-utsav-stage")!,actual:130000});
const budget=detectConflicts(store.getState(),{now:today}).find(c=>c.kind==="budget"&&c.eventIds[0]==="utsav-2026")!;
expect(budget.severity).toBe("high");
expect(budget.detail).toContain("₹1,43,000");
});
});

describe("Notion society operation tables",()=>{
it("maps guests, budget lines, resources, polls and conflicts onto their columns",()=>{
const guest=TABLES.guests.properties({...initialState.guests[0],eventName:"24-Hour AI Hackathon",societyName:"AI Club",eventDate:"October 15, 2026"});
expect(guest["Guest"].title[0].text.content).toBe("Ritesh Kumar");
expect(guest["Status"].select.name).toBe("Confirmed");
expect(guest["Event Date"].date).toEqual({start:"2026-10-15"});
const chief=TABLES.guests.properties({...initialState.guests[2]});
expect(chief["Role"].select.name).toBe("Chief guest");
const line=TABLES.budget.properties(initialState.budgetItems[0]);
expect(line["Type"].select.name).toBe("Income");
expect(line["Planned"].number).toBe(25000);
const resource=TABLES.resources.properties(initialState.requirements[0]);
expect(resource["Resource"].title[0].text.content).toBe("Innovation Lab");
expect(resource["Status"].select.name).toBe("Confirmed");
const r=pollResults(initialState,"poll-hack-solo");
const poll=TABLES.polls.properties({...r.poll,voters:r.voters,results:r.options,leaders:r.leaders,societyName:"AI Club"});
expect(poll["Results"].rich_text[0].text.content).toBe("Yes: 1 (20%) · No, teams of 2–4 only: 4 (80%)");
expect(poll["Leading Option"].rich_text[0].text.content).toBe("No, teams of 2–4 only");
expect(poll["Closes"].date).toEqual({start:"2026-09-30"});
const conflict=TABLES.conflicts.properties({...detectConflicts(initialState,{now:today})[0],eventNames:["A"],societyNames:["B"]});
expect(conflict["Source"].select.name).toBe("Campus OS");
});
it("trashes conflict rows once the conflict is resolved",()=>{
const plan=planSync(TABLES.conflicts,[{id:"c2",title:"Still here"}],[{pageId:"p1",recordId:"c1"},{pageId:"p2",recordId:"c2"}]);
expect(plan.trash).toEqual(["p1"]);
expect(plan.update.map((u:{pageId:string})=>u.pageId)).toEqual(["p2"]);
});
it("reads only hand-added Notion event rows as external calendar entries",()=>{
const row=(id:string,props:Record<string,unknown>)=>({id,url:"https://notion.so/"+id,properties:props});
const handAdded=row("abc",{"Event":{title:[{plain_text:"Convocation rehearsal"}]},"Date":{date:{start:"2026-10-25T10:00:00.000+05:30"}},"Venue":{rich_text:[{plain_text:"Open Air Theatre"}]},"Campus OS ID":{rich_text:[]}});
expect(externalEventFromRow(handAdded)).toEqual({id:"notion-abc",name:"Convocation rehearsal",date:"2026-10-25",venue:"Open Air Theatre",society:undefined,url:"https://notion.so/abc"});
expect(externalEventFromRow(row("mirrored",{"Campus OS ID":{rich_text:[{plain_text:"utsav-2026"}]},"Date":{date:{start:"2026-10-25"}}}))).toBeNull();
expect(externalEventFromRow(row("undated",{"Event":{title:[{plain_text:"No date"}]}}))).toBeNull();
});
});
