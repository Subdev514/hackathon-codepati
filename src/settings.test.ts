import{describe,it,expect}from"vitest";
import{readFileSync}from"node:fs";
import{resolve}from"node:path";

const source=readFileSync(resolve(process.cwd(),"src/main.tsx"),"utf8");

describe("settings policy center",()=>{
it("exposes the complete production policy catalog",()=>{
for(const label of ["Privacy Policy","DPDP compliance reference","HIPAA compliance reference","Accessibility statement","Security & responsible disclosure","Cookies & local storage","Acceptable Use Policy","AI & automation policy","Terms & Conditions"])expect(source).toContain(label);
});
it("documents substantive compliance and accessibility boundaries",()=>{
for(const phrase of ["Data Principal","Data Fiduciary","Breach Notification","Business Associate Agreements","WCAG 2.2 AA","keyboard-only navigation","reduced-motion","HIPAA-certified","not legal advice"])expect(source).toContain(phrase);
});
it("distinguishes prototype controls from deployment responsibilities",()=>{
for(const phrase of ["CURRENT IMPLEMENTATION","DEPLOYMENT OWNER","NOT CLAIMED","local-first","centralized retention engine"])expect(source).toContain(phrase);
});
});
