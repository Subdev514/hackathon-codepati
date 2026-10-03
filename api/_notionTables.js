// Pure mapping between Campus OS records and the Notion tables they are mirrored into.
// Prefixed with "_" so Vercel does not expose it as a serverless route.

export const ROW_ID_PROPERTY="Campus OS ID";

// Campus OS stores human dates ("October 15, 2026"); Notion needs ISO dates.
export function toIsoDate(value){
  const raw=String(value||"").trim();
  if(!raw)return null;
  if(/^\d{4}-\d{2}-\d{2}$/.test(raw))return raw;
  const parsed=new Date(raw);
  if(Number.isNaN(parsed.getTime()))return null;
  const pad=n=>String(n).padStart(2,"0");
  return parsed.getFullYear()+"-"+pad(parsed.getMonth()+1)+"-"+pad(parsed.getDate());
}

function text(value,max=1900){const content=String(value||"").slice(0,max);return content?[{type:"text",text:{content}}]:[]}
function select(value){return {select:value?{name:String(value).slice(0,100).replace(/,/g," ")}:null}}
function capitalize(value){const s=String(value||"");return s.charAt(0).toUpperCase()+s.slice(1)}

const EVENT_STATUS={upcoming:"Upcoming",in_progress:"In progress"};

export const TABLES={
  events:{
    pageTitle:"Campus OS · Upcoming Events",
    databaseTitle:"Upcoming Events",
    envDataSource:"NOTION_EVENTS_DATA_SOURCE_ID",
    schema:{
      "Event":{title:{}},
      "Society":{rich_text:{}},
      "Date":{date:{}},
      "Nature / Highlight":{rich_text:{}},
      "Special Guests":{rich_text:{}},
      "Progress":{number:{format:"percent"}},
      "Venue":{rich_text:{}},
      "Status":{select:{options:[{name:"Upcoming",color:"blue"},{name:"In progress",color:"yellow"}]}},
      [ROW_ID_PROPERTY]:{rich_text:{}}
    },
    // Only upcoming / in-progress events belong in the table; finished ones are trashed.
    include:event=>Boolean(event&&event.id&&EVENT_STATUS[event.status]),
    properties(event){
      const date=toIsoDate(event.date);
      const progress=Math.max(0,Math.min(100,Number(event.progress)||0));
      return {
        "Event":{title:text(event.name||"Untitled event",200)},
        "Society":{rich_text:text(event.societyName)},
        "Date":{date:date?{start:date}:null},
        "Nature / Highlight":{rich_text:text([event.nature,event.highlight].filter(Boolean).join(" — "))},
        "Special Guests":{rich_text:text((event.specialGuests||[]).join(", ")||"—")},
        "Progress":{number:progress/100},
        "Venue":{rich_text:text(event.venue||"TBD")},
        "Status":select(EVENT_STATUS[event.status]),
        [ROW_ID_PROPERTY]:{rich_text:text(event.id,200)}
      };
    }
  },
  feedback:{
    pageTitle:"Campus OS · Feedback",
    databaseTitle:"Feedback",
    envDataSource:"NOTION_FEEDBACK_DATA_SOURCE_ID",
    schema:{
      "Feedback":{title:{}},
      "Event":{rich_text:{}},
      "Society":{rich_text:{}},
      "Category":{select:{options:["Event","Venue","Organization","Promotion","Content","Volunteers","Technical","Budget","Other"].map(name=>({name}))}},
      "Sentiment":{select:{options:[{name:"Positive",color:"green"},{name:"Neutral",color:"gray"},{name:"Negative",color:"red"}]}},
      "Priority":{select:{options:[{name:"High",color:"red"},{name:"Medium",color:"yellow"},{name:"Low",color:"gray"}]}},
      "Submitted By":{rich_text:{}},
      "Submitted At":{date:{}},
      [ROW_ID_PROPERTY]:{rich_text:{}}
    },
    include:item=>Boolean(item&&item.id&&item.text),
    properties(item){
      return {
        "Feedback":{title:text(item.text,1900)},
        "Event":{rich_text:text(item.eventName||"General campus feedback")},
        "Society":{rich_text:text(item.societyName||"—")},
        "Category":select(capitalize(item.category)),
        "Sentiment":select(capitalize(item.sentiment)),
        "Priority":select(capitalize(item.priority)),
        "Submitted By":{rich_text:text(item.submitter||"Anonymous")},
        "Submitted At":{date:item.createdAt?{start:item.createdAt}:null},
        [ROW_ID_PROPERTY]:{rich_text:text(item.id,200)}
      };
    }
  },
  resources:{
    pageTitle:"Campus OS · Resource Tracker",
    databaseTitle:"Resources",
    envDataSource:"NOTION_RESOURCES_DATA_SOURCE_ID",
    schema:{
      "Resource":{title:{}},
      "Event":{rich_text:{}},
      "Society":{rich_text:{}},
      "Event Date":{date:{}},
      "Category":{select:{options:["Equipment","Room","Volunteer","Certificate","Prize","Technical","Other"].map(name=>({name}))}},
      "Quantity":{rich_text:{}},
      "Owner":{rich_text:{}},
      "Status":{select:{options:[{name:"Needed",color:"red"},{name:"Requested",color:"yellow"},{name:"Confirmed",color:"blue"},{name:"Done",color:"green"}]}},
      [ROW_ID_PROPERTY]:{rich_text:{}}
    },
    include:item=>Boolean(item&&item.id&&item.item),
    properties(item){
      return {
        "Resource":{title:text(item.item,200)},
        "Event":{rich_text:text(item.eventName||"—")},
        "Society":{rich_text:text(item.societyName||"—")},
        "Event Date":dateValue(item.eventDate),
        "Category":select(label(item.category)),
        "Quantity":{rich_text:text(item.quantity||"—")},
        "Owner":{rich_text:text(item.owner||"Unassigned")},
        "Status":select(label(item.status)),
        [ROW_ID_PROPERTY]:{rich_text:text(item.id,200)}
      };
    }
  },
  guests:{
    pageTitle:"Campus OS · Guest Management",
    databaseTitle:"Guests",
    envDataSource:"NOTION_GUESTS_DATA_SOURCE_ID",
    schema:{
      "Guest":{title:{}},
      "Designation":{rich_text:{}},
      "Event":{rich_text:{}},
      "Society":{rich_text:{}},
      "Event Date":{date:{}},
      "Role":{select:{options:["Chief guest","Speaker","Judge","Mentor","Performer"].map(name=>({name}))}},
      "Status":{select:{options:[{name:"Invited",color:"gray"},{name:"Tentative",color:"yellow"},{name:"Confirmed",color:"green"},{name:"Declined",color:"red"}]}},
      "Host":{rich_text:{}},
      "Arrival":{rich_text:{}},
      "Needs":{rich_text:{}},
      "Honorarium":{number:{format:"rupee"}},
      [ROW_ID_PROPERTY]:{rich_text:{}}
    },
    include:guest=>Boolean(guest&&guest.id&&guest.name),
    properties(guest){
      return {
        "Guest":{title:text(guest.name,200)},
        "Designation":{rich_text:text(guest.designation||"—")},
        "Event":{rich_text:text(guest.eventName||"—")},
        "Society":{rich_text:text(guest.societyName||"—")},
        "Event Date":dateValue(guest.eventDate),
        "Role":select(label(guest.role)),
        "Status":select(label(guest.status)),
        "Host":{rich_text:text(guest.host||"Unassigned")},
        "Arrival":{rich_text:text(guest.arrival||"—")},
        "Needs":{rich_text:text((guest.needs||[]).join(", ")||"—")},
        "Honorarium":{number:Number(guest.honorarium)||0},
        [ROW_ID_PROPERTY]:{rich_text:text(guest.id,200)}
      };
    }
  },
  budget:{
    pageTitle:"Campus OS · Budget Tracker",
    databaseTitle:"Budget",
    envDataSource:"NOTION_BUDGET_DATA_SOURCE_ID",
    schema:{
      "Line Item":{title:{}},
      "Event":{rich_text:{}},
      "Society":{rich_text:{}},
      "Type":{select:{options:[{name:"Expense",color:"red"},{name:"Income",color:"green"}]}},
      "Category":{select:{options:["Venue","Food","Prizes","Marketing","Travel","Equipment","Honorarium","Sponsorship","Other"].map(name=>({name}))}},
      "Planned":{number:{format:"rupee"}},
      "Actual":{number:{format:"rupee"}},
      "Status":{select:{options:[{name:"Planned",color:"gray"},{name:"Committed",color:"yellow"},{name:"Paid",color:"blue"},{name:"Received",color:"green"}]}},
      "Owner":{rich_text:{}},
      [ROW_ID_PROPERTY]:{rich_text:{}}
    },
    include:item=>Boolean(item&&item.id&&item.label),
    properties(item){
      return {
        "Line Item":{title:text(item.label,200)},
        "Event":{rich_text:text(item.eventName||"—")},
        "Society":{rich_text:text(item.societyName||"—")},
        "Type":select(label(item.kind)),
        "Category":select(label(item.category)),
        "Planned":{number:Number(item.planned)||0},
        "Actual":{number:Number(item.actual)||0},
        "Status":select(label(item.status)),
        "Owner":{rich_text:text(item.owner||"Unassigned")},
        [ROW_ID_PROPERTY]:{rich_text:text(item.id,200)}
      };
    }
  },
  polls:{
    pageTitle:"Campus OS · Society Polls",
    databaseTitle:"Polls",
    envDataSource:"NOTION_POLLS_DATA_SOURCE_ID",
    schema:{
      "Question":{title:{}},
      "Society":{rich_text:{}},
      "Event":{rich_text:{}},
      "Status":{select:{options:[{name:"Open",color:"green"},{name:"Closed",color:"gray"}]}},
      "Results":{rich_text:{}},
      "Leading Option":{rich_text:{}},
      "Votes":{number:{}},
      "Closes":{date:{}},
      "Created By":{rich_text:{}},
      [ROW_ID_PROPERTY]:{rich_text:{}}
    },
    include:poll=>Boolean(poll&&poll.id&&poll.question),
    properties(poll){
      const options=poll.results||[];
      return {
        "Question":{title:text(poll.question,200)},
        "Society":{rich_text:text(poll.societyName||"—")},
        "Event":{rich_text:text(poll.eventName||"Society-wide")},
        "Status":select(label(poll.status)),
        "Results":{rich_text:text(options.map(o=>o.label+": "+o.votes+" ("+o.share+"%)").join(" · ")||"No options")},
        "Leading Option":{rich_text:text((poll.leaders||[]).map(o=>o.label).join(" / ")||"No votes yet")},
        "Votes":{number:Number(poll.voters)||0},
        "Closes":dateValue(poll.closesAt),
        "Created By":{rich_text:text(poll.createdBy||"—")},
        [ROW_ID_PROPERTY]:{rich_text:text(poll.id,200)}
      };
    }
  },
  conflicts:{
    pageTitle:"Campus OS · Conflicts",
    databaseTitle:"Conflicts",
    envDataSource:"NOTION_CONFLICTS_DATA_SOURCE_ID",
    schema:{
      "Conflict":{title:{}},
      "Type":{select:{options:["Venue","Schedule","Guest","Member","Resource","Budget","Readiness"].map(name=>({name}))}},
      "Severity":{select:{options:[{name:"High",color:"red"},{name:"Medium",color:"yellow"},{name:"Low",color:"gray"}]}},
      "Details":{rich_text:{}},
      "Events":{rich_text:{}},
      "Societies":{rich_text:{}},
      "Source":{select:{options:[{name:"Campus OS",color:"blue"},{name:"Notion calendar",color:"purple"}]}},
      [ROW_ID_PROPERTY]:{rich_text:{}}
    },
    // Conflicts that are resolved disappear from the records and are trashed on the next sync.
    include:conflict=>Boolean(conflict&&conflict.id&&conflict.title),
    properties(conflict){
      return {
        "Conflict":{title:text(conflict.title,200)},
        "Type":select(label(conflict.kind)),
        "Severity":select(label(conflict.severity)),
        "Details":{rich_text:text(conflict.detail)},
        "Events":{rich_text:text((conflict.eventNames||[]).join(", ")||"—")},
        "Societies":{rich_text:text((conflict.societyNames||[]).join(", ")||"—")},
        "Source":select(conflict.source==="notion"?"Notion calendar":"Campus OS"),
        [ROW_ID_PROPERTY]:{rich_text:text(conflict.id,200)}
      };
    }
  }
};

function label(value){return capitalize(String(value||"").replace(/_/g," "))}
function dateValue(value){const date=toIsoDate(value);return {date:date?{start:date}:null}}

// Rows added by hand to the Notion events table (no Campus OS ID) act as an external calendar
// that Campus OS checks for venue and schedule conflicts.
export function externalEventFromRow(row){
  const props=row.properties||{};
  if(plainTitle(props[ROW_ID_PROPERTY]?.rich_text))return null;
  const date=props["Date"]?.date?.start;
  if(!date)return null;
  return {
    id:"notion-"+row.id,
    name:plainTitle(props["Event"]?.title)||"Untitled Notion event",
    date:String(date).slice(0,10),
    venue:plainTitle(props["Venue"]?.rich_text),
    society:plainTitle(props["Society"]?.rich_text)||undefined,
    url:row.url
  };
}

// Decide which Notion rows to create, update or trash so the table mirrors the given records.
export function planSync(table,records,existingRows){
  const included=(records||[]).filter(table.include);
  const keep=new Set(included.map(r=>r.id));
  const byId=new Map();
  const trash=[];
  // Rows without a Campus OS ID were added by hand in Notion and are left alone.
  for(const row of existingRows.filter(r=>r.recordId)){
    if(!keep.has(row.recordId)||byId.has(row.recordId))trash.push(row.pageId);
    else byId.set(row.recordId,row.pageId);
  }
  return {
    create:included.filter(r=>!byId.has(r.id)),
    update:included.filter(r=>byId.has(r.id)).map(record=>({pageId:byId.get(record.id),record})),
    trash
  };
}

// Given an existing data source's properties ({name:{id,type}}), return the PATCH body that
// adds missing columns, fixes wrong column types and renames the title column.
// Returns null when the table already matches.
export function schemaRepair(schema,existing){
  const patch={};
  const titleName=Object.keys(schema).find(name=>schema[name].title);
  const currentTitle=Object.entries(existing||{}).find(([,p])=>p.type==="title");
  if(currentTitle&&currentTitle[0]!==titleName){
    // Free the name first if a non-title column is squatting on it.
    if(existing[titleName])patch[existing[titleName].id]={name:titleName+" (old)"};
    patch[currentTitle[1].id]={name:titleName};
  }
  for(const [name,config] of Object.entries(schema)){
    if(config.title)continue;
    const type=Object.keys(config)[0];
    const current=existing?.[name];
    if(!current||current.type!==type)patch[name]=config;
  }
  return Object.keys(patch).length?patch:null;
}

export function plainTitle(richText){return (richText||[]).map(t=>t.plain_text).join("")}
