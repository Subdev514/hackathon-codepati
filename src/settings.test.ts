import{describe,it,expect}from"vitest";
import{readFileSync}from"node:fs";
import{resolve}from"node:path";

const source=readFileSync(resolve(process.cwd(),"src/main.tsx"),"utf8");

describe("settings policy center",()=>{
it("exposes the complete production policy catalog",()=>{
for(const label of ["Privacy Policy","DPDP compliance reference","HIPAA compliance reference","Accessibility statement","Security & responsible disclosure","Cookies & local storage","Acceptable Use Policy","AI & automation policy","Terms & Conditions"])expect(source).toContain(label);
});
it("documents substantive compliance and accessibility boundaries",()=>{
for(const phrase of ["Data Principal","Data Fiduciary","Breach Notification","Business Associate Agreements","WCAG 2.2 AA","Keyboard-only navigation","reduced-motion","HIPAA-certified","not legal advice"])expect(source).toContain(phrase);
});
it("distinguishes prototype controls from deployment responsibilities",()=>{
for(const phrase of ["CURRENT IMPLEMENTATION","DEPLOYMENT OWNER","NOT CLAIMED","local-first","centralized institutional retention engine"])expect(source).toContain(phrase);
});
});


describe("knowledge and operations surfaces",()=>{
it("exposes discovery, Notion, role and analytics UI",()=>{for(const phrase of ["KNOWLEDGE LAYER","SYNC TO NOTION","Student","Club Coordinator","PENDING REGISTRATIONS","PROJECT PROGRESS","DEPENDENCY CHAINS"])expect(source).toContain(phrase);});
});
