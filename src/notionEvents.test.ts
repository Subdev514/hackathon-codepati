import{describe,it,expect}from"vitest";
// @ts-ignore -- plain JS module shared with the Vercel function
import{eventProperties,planEventSync,toIsoDate,EVENTS_SCHEMA}from"../api/_notionEvents.js";
import{initialState}from"./domain";

const hackathon=initialState.events.find(e=>e.id==="ai-hackathon-2026")!;

describe("Notion upcoming events table",()=>{
it("defines every requested column",()=>{
for(const column of ["Event","Society","Date","Nature / Highlight","Special Guests","Progress","Venue"])expect(EVENTS_SCHEMA).toHaveProperty(column);
});
it("maps a Campus OS event onto Notion properties",()=>{
const p=eventProperties(hackathon);
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
expect(eventProperties({...hackathon,date:""})["Date"].date).toBeNull();
});
it("creates new events, updates known ones and trashes removed or finished ones",()=>{
const events=[hackathon,{...hackathon,id:"new-event"},{...hackathon,id:"done-event",status:"completed"}];
const plan=planEventSync(events,[{pageId:"p1",eventId:"ai-hackathon-2026"},{pageId:"p2",eventId:"deleted-event"},{pageId:"p3",eventId:"done-event"},{pageId:"p4",eventId:"ai-hackathon-2026"},{pageId:"manual",eventId:""}]);
expect(plan.create.map((e:{id:string})=>e.id)).toEqual(["new-event"]);
expect(plan.update.map((u:{pageId:string})=>u.pageId)).toEqual(["p1"]);
expect(plan.trash).toEqual(["p2","p3","p4"]);
});
});
