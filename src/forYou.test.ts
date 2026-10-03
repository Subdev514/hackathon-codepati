import{describe,it,expect}from"vitest";
import{createCampusStore,eventFeed,initialState,limitWords,wordCount,isVideoUrl}from"./domain";
import type{UserProfile}from"./domain";
import{safeUrl,embedUrl}from"./forYou";

const viewer:UserProfile={id:"user-1",name:"Asha",branch:"CSE",year:2,interests:["design"],clubs:[],activeProjects:[],role:"student"};

describe("For You event feed",()=>{
it("builds a card with every field the For You page shows",()=>{
const card=eventFeed(initialState,viewer).find(c=>c.event.id==="ai-hackathon-2026")!;
expect(card.societyName).toBe("AI Club");
expect(card.event.name).toBe("24-Hour AI Hackathon");
expect(card.description).toContain("Build an AI project in 24 hours");
expect(card.registrationLink).toBe("https://forms.google.com/");
expect(card.specialGuests).toEqual(["Industry mentor panel"]);
expect(card.event.date).toBe("October 15, 2026");
expect(card.event.venue).toBe("Innovation Lab");
expect(card.media.length).toBe(1);
expect(card.xfactor).toBe("24 hours. One team. One working build.");
});
it("only lists upcoming or in-progress events, most relevant first",()=>{
const feed=eventFeed({...initialState,events:[...initialState.events,{...initialState.events[0],id:"old",status:"completed"}]},viewer);
const ids=feed.map(c=>c.event.id);
expect(ids).not.toContain("old");
expect(ids.sort()).toEqual(initialState.events.filter(e=>e.status==="upcoming"||e.status==="in_progress").map(e=>e.id).sort());
expect(feed[0].event.id).toBe("figma-workshop-2026");
});
it("prefers the event's own details over the society post",()=>{
const events=initialState.events.map(e=>e.id==="figma-workshop-2026"?{...e,description:"Own description",registrationLink:"https://example.com/r",media:["https://example.com/v.mp4"],societyLogo:"https://example.com/logo.png"}:e);
const card=eventFeed({...initialState,events},viewer).find(c=>c.event.id==="figma-workshop-2026")!;
expect(card.description).toBe("Own description");
expect(card.registrationLink).toBe("https://example.com/r");
expect(card.media).toEqual(["https://example.com/v.mp4"]);
expect(card.societyLogo).toBe("https://example.com/logo.png");
});
it("caps the X-factor at 30 words",()=>{
const long=Array.from({length:40},(_,i)=>"w"+i).join(" ");
expect(wordCount(limitWords(long).replace("…",""))).toBe(30);
const events=initialState.events.map(e=>({...e,xfactor:long}));
expect(eventFeed({...initialState,events},viewer).every(c=>wordCount(c.xfactor.replace("…",""))<=30)).toBe(true);
});
});

describe("event votes and discussion",()=>{
const unseeded={...initialState,eventVotes:[],eventComments:[]};
it("records one vote per user that can be switched or withdrawn",()=>{
const store=createCampusStore(unseeded);
const id="ai-hackathon-2026";
const card=()=>eventFeed(store.getState(),viewer).find(c=>c.event.id===id)!;
store.voteEvent(id,"user-1",1);store.voteEvent(id,"user-2",1);
expect(card()).toMatchObject({upvotes:2,downvotes:0,score:2,myVote:1});
store.voteEvent(id,"user-1",-1);
expect(card()).toMatchObject({upvotes:1,downvotes:1,score:0,myVote:-1});
store.voteEvent(id,"user-1",-1);
expect(card()).toMatchObject({upvotes:1,downvotes:0,score:1,myVote:0});
});
it("keeps an ordered discussion per event",()=>{
const store=createCampusStore(unseeded);
store.addEventComment({id:"c2",eventId:"ai-hackathon-2026",userId:"user-2",author:"Ravi",text:"Second",createdAt:"2026-10-03T10:05:00Z"});
store.addEventComment({id:"c1",eventId:"ai-hackathon-2026",userId:"user-1",author:"Asha",text:"First",createdAt:"2026-10-03T10:00:00Z"});
store.addEventComment({id:"c3",eventId:"figma-workshop-2026",userId:"user-1",author:"Asha",text:"Other event",createdAt:"2026-10-03T10:00:00Z"});
const card=eventFeed(store.getState(),viewer).find(c=>c.event.id==="ai-hackathon-2026")!;
expect(card.comments.map(c=>c.text)).toEqual(["First","Second"]);
store.removeEventComment("c1");
expect(eventFeed(store.getState(),viewer).find(c=>c.event.id==="ai-hackathon-2026")!.comments.map(c=>c.id)).toEqual(["c2"]);
});
});

describe("media and link safety",()=>{
it("only renders http(s) links",()=>{
expect(safeUrl("https://forms.google.com/x")).toBe("https://forms.google.com/x");
expect(safeUrl("javascript:alert(1)")).toBeUndefined();
expect(safeUrl("not a url")).toBeUndefined();
});
it("recognises video sources",()=>{
expect(isVideoUrl("https://cdn.example.com/teaser.mp4")).toBe(true);
expect(isVideoUrl("https://images.unsplash.com/photo-1")).toBe(false);
expect(embedUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ")).toBe("https://www.youtube.com/embed/dQw4w9WgXcQ");
expect(embedUrl("https://youtu.be/dQw4w9WgXcQ")).toBe("https://www.youtube.com/embed/dQw4w9WgXcQ");
expect(embedUrl("https://vimeo.com/76979871")).toBe("https://player.vimeo.com/video/76979871");
});
});

import{validateEventDraft,buildEventFromDraft,emptyDraft,formatEventDate,safeMediaUrl,OTHER_SOCIETY}from"./forYou";
import type{EventDraft}from"./forYou";

describe("posting an event from For You",()=>{
const complete:EventDraft={...emptyDraft(initialState),name:"Robotics Expo",nature:"Exhibition",description:"Student-built robots on show.",xfactor:"Watch thirty robots race, fight and dance.",date:"2026-11-20",venue:"Campus 15 Atrium",registrationLink:"https://forms.gle/abc",specialGuests:"Dr. A. Rao, Alumni panel",media:["https://youtu.be/dQw4w9WgXcQ"]};
it("requires every card field except type, guests, logo and media",()=>{
const errors=validateEventDraft(initialState,{...emptyDraft(initialState),societyId:OTHER_SOCIETY},"2026-10-03");
expect(Object.keys(errors).sort()).toEqual(["date","description","name","registrationLink","societyName","venue","xfactor"]);
expect(validateEventDraft(initialState,complete,"2026-10-03")).toEqual({});
});
it("rejects past dates, unsafe links and over-long X-factors",()=>{
const errors=validateEventDraft(initialState,{...complete,date:"2026-10-01",registrationLink:"javascript:alert(1)",xfactor:Array(31).fill("word").join(" ")},"2026-10-03");
expect(errors.date).toMatch(/passed/);
expect(errors.registrationLink).toMatch(/https/);
expect(errors.xfactor).toMatch(/30 words/);
});
it("builds an upcoming event that shows up in the feed with all its fields",()=>{
const event=buildEventFromDraft(initialState,complete,"event-robotics");
expect(event).toMatchObject({societyId:"ai-club-society",societyName:"AI Club",date:"November 20, 2026",status:"upcoming",specialGuests:["Dr. A. Rao","Alumni panel"],registrationLink:"https://forms.gle/abc"});
const store=createCampusStore(initialState);store.addEvent(event);
const card=eventFeed(store.getState(),viewer).find(c=>c.event.id==="event-robotics")!;
expect(card).toMatchObject({societyName:"AI Club",description:"Student-built robots on show.",xfactor:"Watch thirty robots race, fight and dance.",media:["https://youtu.be/dQw4w9WgXcQ"]});
});
it("supports societies that are not registered yet",()=>{
const event=buildEventFromDraft(initialState,{...complete,societyId:OTHER_SOCIETY,societyName:"Robotics Society"},"e");
expect(event).toMatchObject({societyId:"robotics-society",societyName:"Robotics Society"});
});
it("formats dates like existing events and accepts uploaded images",()=>{
expect(formatEventDate("2026-01-05")).toBe("January 5, 2026");
expect(safeMediaUrl("data:image/jpeg;base64,/9j/4AAQ")).toBe("data:image/jpeg;base64,/9j/4AAQ");
expect(safeMediaUrl("data:text/html;base64,PHNjcmlwdD4=")).toBeUndefined();
});
});
