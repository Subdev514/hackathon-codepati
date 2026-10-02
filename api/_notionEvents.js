// Pure mapping between Campus OS events and the Notion "Upcoming Events" table.
// Prefixed with "_" so Vercel does not expose it as a serverless route.

export const EVENT_ID_PROPERTY="Campus OS ID";

export const EVENTS_SCHEMA={
  "Event":{title:{}},
  "Society":{rich_text:{}},
  "Date":{date:{}},
  "Nature / Highlight":{rich_text:{}},
  "Special Guests":{rich_text:{}},
  "Progress":{number:{format:"percent"}},
  "Venue":{rich_text:{}},
  "Status":{select:{options:[{name:"Upcoming",color:"blue"},{name:"In progress",color:"yellow"}]}},
  [EVENT_ID_PROPERTY]:{rich_text:{}}
};

const STATUS_LABELS={upcoming:"Upcoming",in_progress:"In progress"};

export function isUpcomingEvent(event){return Boolean(event&&event.id&&STATUS_LABELS[event.status])}

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

export function eventProperties(event){
  const date=toIsoDate(event.date);
  const nature=[event.nature,event.highlight].filter(Boolean).join(" — ");
  const progress=Math.max(0,Math.min(100,Number(event.progress)||0));
  return {
    "Event":{title:text(event.name||"Untitled event",200)},
    "Society":{rich_text:text(event.societyName)},
    "Date":{date:date?{start:date}:null},
    "Nature / Highlight":{rich_text:text(nature)},
    "Special Guests":{rich_text:text((event.specialGuests||[]).join(", ")||"—")},
    "Progress":{number:progress/100},
    "Venue":{rich_text:text(event.venue||"TBD")},
    "Status":{select:{name:STATUS_LABELS[event.status]}},
    [EVENT_ID_PROPERTY]:{rich_text:text(event.id,200)}
  };
}

// Decide which Notion rows to create, update or trash so the table mirrors the upcoming events.
export function planEventSync(events,existingRows){
  const upcoming=(events||[]).filter(isUpcomingEvent);
  const keep=new Set(upcoming.map(e=>e.id));
  const byEventId=new Map();
  const trash=[];
  // Rows without a Campus OS ID were added by hand in Notion and are left alone.
  for(const row of existingRows.filter(r=>r.eventId)){
    if(!keep.has(row.eventId)||byEventId.has(row.eventId))trash.push(row.pageId);
    else byEventId.set(row.eventId,row.pageId);
  }
  return {
    create:upcoming.filter(e=>!byEventId.has(e.id)),
    update:upcoming.filter(e=>byEventId.has(e.id)).map(event=>({pageId:byEventId.get(event.id),event})),
    trash
  };
}
