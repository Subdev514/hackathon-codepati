import{describe,it,expect}from"vitest";
// @ts-ignore -- plain JS module shared with the Vercel function
import{TABLES,planSync,toIsoDate,schemaRepair}from"../api/_notionTables.js";
import{initialState}from"./domain";

const hackathon=initialState.events.find(e=>e.id==="ai-hackathon-2026")!;
const feedback={id:"feedback-1",eventId:hackathon.id,eventName:hackathon.name,societyName:"AI Club",category:"venue",priority:"high",sentiment:"negative",text:"The lab was too crowded, book a bigger hall.",submitter:"Asha",createdAt:"2026-10-03T10:15:00.000Z"};

describe("Notion upcoming events table",()=>{
it("defines every requested column",()=>{
for(const column of ["Event","Society","Date","Nature / Highlight","Special Guests","Progress","Venue"])expect(TABLES.events.schema).toHaveProperty([column]);
});
it("maps a Campus OS event onto Notion properties",()=>{
const p=TABLES.events.properties(hackathon);
expect(p["Event"].title[0].text.content).toBe("24-Hour AI Hackathon");
expect(p["Society"].rich_text[0].text.content).toBe("AI Club");
expect(p["Date"].date).toEqual({start:"2026-10-15"});
expect(p["Nature / Highlight"].rich_text[0].text.content).toBe("Competition / Hackathon — Build an AI project in 24 hours with teams of 2–4.");
expect(p["Special Guests"].rich_text[0].text.content).toBe("Industry mentor panel");
expect(p["Progress"].number).toBe(0.65);
expect(p["Venue"].rich_text[0].text.content).toBe("Innovation Lab");
expect(p["Status"].select.name).toBe("In progress");
});
it("tolerates free-text and missing dates",()=>{
expect(toIsoDate("2026-11-02")).toBe("2026-11-02");
expect(toIsoDate("next week sometime")).toBeNull();
expect(TABLES.events.properties({...hackathon,date:""})["Date"].date).toBeNull();
});
it("creates new events, updates known ones and trashes removed or finished ones",()=>{
const events=[hackathon,{...hackathon,id:"new-event"},{...hackathon,id:"done-event",status:"completed"}];
const plan=planSync(TABLES.events,events,[{pageId:"p1",recordId:"ai-hackathon-2026"},{pageId:"p2",recordId:"deleted-event"},{pageId:"p3",recordId:"done-event"},{pageId:"p4",recordId:"ai-hackathon-2026"},{pageId:"manual",recordId:""}]);
expect(plan.create.map((e:{id:string})=>e.id)).toEqual(["new-event"]);
expect(plan.update.map((u:{pageId:string})=>u.pageId)).toEqual(["p1"]);
expect(plan.trash).toEqual(["p2","p3","p4"]);
});
it("leaves a matching table alone",()=>{
const existing=Object.fromEntries(Object.entries(TABLES.events.schema).map(([name,config],i)=>[name,{id:"p"+i,type:Object.keys(config as object)[0]}]));
expect(schemaRepair(TABLES.events.schema,existing)).toBeNull();
});
it("repairs a table with a default title, missing and mistyped columns",()=>{
const repair=schemaRepair(TABLES.events.schema,{Name:{id:"title",type:"title"},Venue:{id:"v",type:"rich_text"},Progress:{id:"pr",type:"rich_text"}});
expect(repair.title).toEqual({name:"Event"});
expect(repair.Progress).toEqual({number:{format:"percent"}});
expect(repair.Venue).toBeUndefined();
for(const column of ["Society","Date","Nature / Highlight","Special Guests","Status","Campus OS ID"])expect(repair).toHaveProperty([column]);
});
});

describe("Notion feedback table",()=>{
it("lives on its own page",()=>{
expect(TABLES.feedback.pageTitle).not.toBe(TABLES.events.pageTitle);
});
it("maps a feedback record onto Notion properties",()=>{
const p=TABLES.feedback.properties(feedback);
expect(p["Feedback"].title[0].text.content).toBe(feedback.text);
expect(p["Event"].rich_text[0].text.content).toBe("24-Hour AI Hackathon");
expect(p["Society"].rich_text[0].text.content).toBe("AI Club");
expect(p["Category"].select.name).toBe("Venue");
expect(p["Sentiment"].select.name).toBe("Negative");
expect(p["Priority"].select.name).toBe("High");
expect(p["Submitted By"].rich_text[0].text.content).toBe("Asha");
expect(p["Submitted At"].date).toEqual({start:feedback.createdAt});
});
it("labels feedback that is not tied to an event",()=>{
expect(TABLES.feedback.properties({...feedback,eventName:undefined})["Event"].rich_text[0].text.content).toBe("General campus feedback");
});
it("syncs every submitted feedback record",()=>{
const plan=planSync(TABLES.feedback,[feedback,{...feedback,id:"feedback-2"}],[{pageId:"f1",recordId:"feedback-1"}]);
expect(plan.create.map((f:{id:string})=>f.id)).toEqual(["feedback-2"]);
expect(plan.update.map((u:{pageId:string})=>u.pageId)).toEqual(["f1"]);
expect(plan.trash).toEqual([]);
});
});
