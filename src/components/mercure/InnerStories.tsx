import { useEffect, useRef, useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { CONTACT, PROJECTS } from "./data";
import { COLLECTIONS } from "./wheel/collections";
import { registerGsap, useSite } from "./motion";
import { InnerLayout, PageHero } from "./InnerPages";
import heroPhoto from "@/assets/legacy-experience.jpg";
import foundry from "@/assets/legacy-foundry.jpg";
import machine from "@/assets/legacy-machine.jpg";
import quarry from "@/assets/legacy-quarry.jpg";
import marble from "@/assets/detail-marble.jpg";
import walnut from "@/assets/detail-walnut.jpg";
import brass from "@/assets/detail-brass.jpg";
import linen from "@/assets/detail-linen.jpg";
import teak from "@/assets/detail-teak.jpg";
import stone from "@/assets/detail-stone.jpg";
import bali from "@/assets/project-hello-bali.jpg";
import shri from "@/assets/project-shriyaamvita.jpg";

const frame="mx-auto max-w-[1680px] px-6 md:px-12 lg:px-20";
const eyebrow="type-eyebrow text-ochre";
const display="font-display text-[clamp(43px,6vw,100px)] leading-[1.05] tracking-[-.05em]";
const copy="text-[15px] leading-[1.9] text-walnut/75 md:text-[17px]";
const rise={initial:{opacity:0,y:32},whileInView:{opacity:1,y:0},viewport:{once:true,amount:.15},transition:{duration:.75,ease:[.22,1,.36,1] as const}};
const projectRows=[
  {slug:"shriyaamvita",name:"Shriyaamvita",type:"Residential",location:"Kanakapura",sqft:"50,000",scope:"Modular · Loose Furniture · Lighting",image:shri,details:[marble,walnut,brass,linen],description:"A quiet dialogue between Kerala’s timeless sensibility and contemporary Bangalore, this residence is shaped by warmth, restraint, and an affinity with nature. Conceived as a turnkey home, every layer—from furniture and lighting to finishes and textiles—was considered as part of a singular design language."},
  {slug:"grand-pavilion",name:"The Grand Pavilion",type:"Turnkey",location:"Chandapura",sqft:"40,000",scope:"Turnkey",image:shri,details:[marble,walnut,linen,brass],description:"This villa is a study in warm contemporary living, where every room is treated as its own considered chapter rather than a repeated formula. The palette stays quietly consistent — travertine and marble surfaces, walnut-toned wood panelling, and soft leathers."},
  {slug:"hello-bali",name:"Hello Bali",type:"Hospitality",location:"Tamil Nadu",sqft:"20,000",scope:"Turnkey",image:bali,details:[teak,stone,linen,walnut],description:"A Bali-inspired sanctuary of pure luxury. Each villa is thoughtfully designed with contemporary European sensibilities, soaring ceilings, expansive French windows and warm natural textures."},
  {slug:"model-flat-marketing-offices",name:"Model Flat & Marketing Offices",type:"Turnkey",location:"Bengaluru",sqft:"Varies by unit",scope:"Turnkey · Furniture · Styling",image:heroPhoto,details:[linen,brass,walnut,marble],description:"Show spaces crafted for builders, modular apartment units and corporate marketing offices, styled to sell a lifestyle to prospective buyers."},
  {slug:"mercure-studio",name:"The Mercure Studio",type:"Residential",location:"Bengaluru",sqft:"18,000",scope:"Experience Centre",image:heroPhoto,details:[marble,teak,stone,linen],description:"Our own Bengaluru atelier and Experience Centre — the one project we are never finished refining."},
];
export function ProjectsPage(){
  const [filter,setFilter]=useState("All");
  const matches=filter==="All"?projectRows:projectRows.filter(p=>p.type===filter);
  return <InnerLayout><PageHero eyebrow="Projects" title="Spaces shaped with intention." lead="A glimpse of our most recent residences and show spaces, each composed around its site, its light, and the people who live in it." image={shri}/>
    <section className={frame+" py-20"}>
      <nav className="mb-12 flex flex-wrap gap-3" aria-label="Filter projects">{["All","Residential","Hospitality","Turnkey"].map(name=><button key={name} onClick={()=>setFilter(name)} aria-pressed={filter===name} className={"border px-5 py-3 text-xs uppercase tracking-[.17em] "+(filter===name?"border-ochre bg-ochre text-obsidian":"border-walnut/20")}>{name}</button>)}</nav>
      <div className="grid gap-7 md:grid-cols-2">{matches.map((p,i)=><a href={"/projects/"+p.slug} className={"group relative block overflow-hidden "+(i%3===0?"md:row-span-2":"")} key={p.slug}><img src={p.image} alt={p.name+" project"} className={"w-full object-cover transition-transform duration-700 group-hover:scale-[1.04] "+(i%3===0?"h-[500px] md:h-[850px]":"h-[400px] md:h-[440px]")}/><div className="absolute inset-0 bg-gradient-to-t from-obsidian/80 via-transparent to-transparent"/><div className="absolute bottom-7 left-7 right-7 translate-y-0 text-ivory transition-transform duration-500 md:translate-y-5 md:group-hover:translate-y-0"><p className={eyebrow}>{p.location} · {p.sqft} sq ft</p><h2 className="mt-2 font-display text-[clamp(28px,3vw,48px)]">{p.name} ↗</h2></div></a>)}</div>
    </section>
  </InnerLayout>;
}

export function ProjectDetailPage({slug}:{slug:string}){
 const {setEnquiryOpen,setEnquirySubject}=useSite();
 const p=projectRows.find(x=>x.slug===slug);
 useEffect(()=>{ if(slug==="hello-bali"){setEnquirySubject("Hello Bali");setEnquiryOpen(true)} },[slug,setEnquiryOpen,setEnquirySubject]);
 const galleryRef=useRef<HTMLDivElement>(null);const galleryTrack=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  registerGsap();const mm=gsap.matchMedia();
  mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)",()=>{
   const wrap=galleryRef.current,track=galleryTrack.current;if(!wrap||!track)return;
   const ctx=gsap.context(()=>{gsap.to(track,{x:()=>Math.min(0,window.innerWidth-track.scrollWidth-64),ease:"none",scrollTrigger:{trigger:wrap,start:"top top",end:()=>"+="+Math.max(1,track.scrollWidth-window.innerWidth),pin:true,scrub:.8,invalidateOnRefresh:true}})},wrap);
   return()=>ctx.revert();
  });
  return()=>mm.revert();
 },[slug]);
 if(!p)return <InnerLayout><PageHero eyebrow="Projects" title="Project not found." lead="Explore our selected work."/><div className={frame+" py-24"}><a href="/projects">← All projects</a></div></InnerLayout>;
 const next=projectRows[(projectRows.indexOf(p)+1)%projectRows.length];
 const relevant=COLLECTIONS.filter(c=>["sculpt","modular","mirae","terrain"].includes(c.id));
 return <InnerLayout>
  <PageHero eyebrow={p.location+" · "+p.type} title={p.name} lead={p.description} image={p.image}/>
  <section className="bg-alabaster py-12"><div className={frame+" grid gap-6 md:grid-cols-3"}>{[["Location",p.location],["Project scale",p.sqft+" sq ft"],["Scope",p.scope]].map(([k,v])=><div className="border-t border-ochre/50 pt-5" key={k}><p className={eyebrow}>{k}</p><p className="mt-4 font-display text-xl">{v}</p></div>)}</div></section>
  <section className={frame+" py-24 md:py-32"}><motion.div {...rise} className="grid gap-12 lg:grid-cols-[.4fr_.6fr]"><div><p className={eyebrow}>The story</p><h2 className={display+" mt-6"}>Designed for <em className="font-accent italic text-bronze">living.</em></h2></div><p className={copy+" max-w-3xl"}>{p.description}</p></motion.div></section>
  <section className="bg-obsidian py-16 text-ivory"><div className={frame}><p className={eyebrow}>Project gallery</p><div className="mt-8 grid gap-5 md:grid-cols-2">{[p.image,...p.details,p.image,...p.details].slice(0,9).map((img,i)=><motion.figure {...rise} key={i} className={i%4===0?"md:col-span-2":""}><img className={"w-full object-cover "+(i%4===0?"h-[45vh] md:h-[72vh]":"h-[360px] md:h-[500px]")} src={img} alt={p.name+" project detail "+(i+1)}/><figcaption className="mt-3 text-xs text-ivory/65">Material and space study · {String(i+1).padStart(2,"0")}</figcaption></motion.figure>)}</div></div></section>
  <section ref={galleryRef} className="overflow-hidden bg-alabaster py-24 lg:flex lg:h-screen lg:items-center lg:py-0"><div className={frame+" w-full"}><p className={eyebrow}>Material details</p><div ref={galleryTrack} className="mt-8 flex snap-x snap-mandatory gap-5 overflow-x-auto lg:w-max lg:overflow-visible">{p.details.map((img,i)=><figure key={i} className="w-[75vw] max-w-[420px] shrink-0 snap-start lg:w-[33vw]"><img src={img} alt="Material closeup" className="aspect-[4/3] w-full object-cover"/><figcaption className="mt-3 text-xs text-walnut/60">Detail {i+1}</figcaption></figure>)}</div></div></section>
  <section className={frame+" py-24"}><p className={eyebrow}>Materials & collections</p><div className="mt-6 flex flex-wrap gap-4">{relevant.map(c=><a key={c.id} href={c.href} className="border border-ochre/45 px-5 py-3 text-xs uppercase tracking-[.14em] hover:bg-alabaster">{c.name} ↗</a>)}<a href="/sdp-group" className="border border-ochre/45 px-5 py-3 text-xs uppercase tracking-[.14em]">Our heritage ↗</a></div></section>
  {p.slug==="hello-bali"&&<button onClick={()=>{setEnquirySubject("Hello Bali");setEnquiryOpen(true)}} className="fixed bottom-5 right-5 z-[65] bg-ochre px-5 py-4 text-xs font-semibold uppercase tracking-[.12em] text-obsidian shadow-lg">Enquire about Hello Bali ↗</button>}
  <a href={"/projects/"+next.slug} className="group relative block overflow-hidden bg-obsidian text-ivory"><img src={next.image} alt="" className="h-[340px] w-full object-cover opacity-50 transition-transform duration-700 group-hover:scale-[1.04]"/><div className="absolute inset-0 flex flex-col items-center justify-center"><p className={eyebrow}>Next project</p><h2 className="mt-4 font-accent text-[clamp(40px,6vw,95px)]">{next.name} ↗</h2></div></a>
 </InnerLayout>;
}

const journey=[
 ["Discover","An introduction to Mercure.","Through trusted recommendations, design collaborations, our showroom and digital presence, discover our world of craftsmanship, materials and considered design.",heroPhoto],
 ["Understand","A conversation before a concept.","We begin by understanding your space, your way of living and what you envision for it. Where needed, we visit the site to understand the architecture, materials and context firsthand.",marble],
 ["Curate","A direction shaped around you.","We bring together materials, textures, finishes and ideas to create a considered design direction — balancing your aesthetic, lifestyle and investment.",linen],
 ["Define","Clarity in every detail.","Once the direction is established, we refine the design, align on the investment and bring together the drawings, materials and specifications that will guide the making.",walnut],
 ["Make","Crafted with intention.","From approved drawings and materials to production, every piece moves through a considered process of making, with regular updates along the way.",machine],
 ["Deliver","Made for its final setting.","From site coordination to delivery, we ensure every detail is ready for its place. And when the project is complete, our relationship continues beyond the final handover.",heroPhoto],
] as const;
const faq=[
 ["What is the minimum project size Mercure Homes takes on?","We work across single categories (a kitchen, a set of carpets) through to full turnkey homes — scope is discussed and confirmed at the design consultation stage."],
 ["How long does a typical project take?","Timelines typically range between 6–8 weeks, depending on the scope and requirements of the project. A detailed stage-by-stage timeline is shared as part of your Project Kit."],
 ["How much of the design can I customise?","Every piece is made to order — dimensions, finishes and materials are shaped around you. Nothing leaves our atelier without your approval."],
 ["Where are your factories located?","We have manufacturing facilities in Ajmer, Rajasthan and Jigani, Karnataka, where we produce everything in-house — from furniture and lighting to modular systems and other bespoke elements."],
 ["Do you work outside Bengaluru?","Yes — while our atelier and Experience Centre are based in Bengaluru, we execute turnkey and modular projects pan-India."],
];
export function ProcessPage(){
 const {setEnquiryOpen}=useSite();
 return <InnerLayout>
  <PageHero eyebrow="Our process" title="From the first conversation to the final detail." lead="Every Mercure project is shaped through a considered process — personal, collaborative and precise." image={marble}/>
  <section className={frame+" py-24 md:py-32"}><div className="relative border-l border-ochre/50 pl-6 md:pl-14">{journey.map(([name,subtitle,text,image],i)=><motion.article {...rise} key={name} className="relative grid gap-8 border-b border-walnut/15 py-14 lg:grid-cols-[.55fr_.45fr] lg:gap-16"><span className="absolute -left-[30px] top-16 h-2 w-2 rounded-full bg-ochre md:-left-[60px]"/><div><p className={eyebrow}>{String(i+1).padStart(2,"0")} / 06</p><h2 className={display+" mt-5"}>{name}</h2><h3 className="mt-5 font-accent text-3xl italic text-bronze">{subtitle}</h3><p className={copy+" mt-6 max-w-xl"}>{text}</p></div><img src={image} alt={name+" process stage visual"} loading="lazy" className="aspect-[4/3] w-full object-cover"/></motion.article>)}</div></section>
  <section className="bg-alabaster py-24"><div className={frame+" grid gap-12 lg:grid-cols-[.4fr_.6fr]"}><div><p className={eyebrow}>FAQ</p><h2 className={display+" mt-5"}>Questions, <em className="font-accent italic text-bronze">answered.</em></h2></div><div>{faq.map(([q,a],i)=><details className="group border-b border-walnut/25 py-7" key={q} open={i===0}><summary className="flex cursor-pointer items-center justify-between gap-7 font-display text-[clamp(17px,2vw,23px)]"><span>{q}</span><span className="text-ochre">+</span></summary><p className={copy+" mt-5 max-w-2xl"}>{a}</p></details>)}<p className="mt-9 font-accent text-2xl">Still have a question?</p><button onClick={()=>setEnquiryOpen(true)} className="mt-5 border-b border-ochre pb-2 text-sm uppercase tracking-[.15em]">Write to us ↗</button></div></div></section>
 </InnerLayout>;
}

export function TeamPage(){
 return <InnerLayout>
 <PageHero eyebrow="The team" title="The people behind Mercure Homes." lead="The Bengaluru studio bringing Italian design sensibility and Indian craftsmanship to the spaces we make." image={heroPhoto}/>
 <section className={frame+" grid gap-12 py-24 md:py-32 lg:grid-cols-2 lg:gap-24"}><div className="flex min-h-[460px] items-center justify-center border border-ochre/25 bg-alabaster text-center text-xs uppercase tracking-[.16em] text-walnut/60">Founder portrait pending approval</div><div className="flex flex-col justify-center"><p className={eyebrow}>Founder's note</p><h2 className="mt-6 font-accent text-[clamp(44px,5vw,72px)] leading-[1.15]">A personal note from the atelier.</h2><p className={copy+" mt-8"}>The founder's first-person note, name, signature and portrait are awaiting the studio's approval.</p><div className="mt-12 border-t border-ochre/40 pt-5 text-sm text-walnut/60">Founder · Mercure Homes</div></div></section>
 <section className="bg-alabaster py-20"><div className={frame}><p className={eyebrow}>Our studio</p><div className="relative mt-8"><img src={heroPhoto} alt="Mercure Experience Centre; team photograph pending" className="h-[50vh] w-full object-cover"/><span className="absolute bottom-6 left-6 bg-obsidian/75 px-4 py-2 text-xs text-ivory">Team photograph pending</span></div></div></section>
 <section className={frame+" grid gap-10 py-24 lg:grid-cols-2"}><div><p className={eyebrow}>Meet our people</p><h2 className={display+" mt-5"}>A shared point of view.</h2></div><div><p className={copy}>The second brand representative's details and approved social profile are pending confirmation.</p><a href={CONTACT.instagram} target="_blank" rel="noreferrer" className="mt-7 inline-block border-b border-ochre pb-2 text-xs uppercase tracking-[.18em]">Instagram ↗</a></div></section>
 </InnerLayout>;
}

const milestones=[
 ["1972","Shankar Iron Foundry","Ajmer, Rajasthan","The SDP Group's journey began with a foundry — and a 15-metric-ton single-piece cast iron casting that set an early benchmark for engineering scale and precision.",foundry],
 ["1993","Shree Dee Pee Marbles and Granites","Kishangarh, Rajasthan","Entry into stone processing, backed by ownership of White Rajasthani Marble mines and proprietary Diamond Segment Tooling engineered in-house.",quarry],
 ["2001","SDP Granites","Bengaluru, Karnataka","Expansion into Red Multi-Colour Granite, producing what became recognised as South India's finest finished granite.",stone],
 ["2002","SDP Machines","Ajmer, Rajasthan","World-class stone-processing machinery, engineered to reduce India's reliance on expensive imports.",machine],
 ["2018","SDP Stones","Shoolgiri, Tamil Nadu","Exotic natural stone curated from 38 countries, including an exclusive partnership securing Benetton Beige marble from a premier Turkish quarry.",marble],
 ["2023","Mercure Homes","Bengaluru, Karnataka","The culmination of the legacy — where the timeless beauty of natural stone meets the precision of the Group's machines, in bespoke interiors for the home.",heroPhoto],
] as const;
export function SDPGroupPage(){
 return <InnerLayout>
 <PageHero eyebrow="The SDP Group" title="A legacy of precision, a future of beauty." lead="From a 1972 iron foundry to Mercure Homes in 2023 — a journey through stone, machines and interior design." dark/>
 <section className="bg-obsidian py-24 text-ivory"><div className={frame}><p className={eyebrow}>1972 — 2023</p><div className="relative mt-14 border-l border-ochre/50 pl-7 md:ml-[50%] md:pl-16">{milestones.map(([year,name,place,description,image],i)=><motion.article {...rise} key={year} className={"relative mb-24 max-w-[680px] last:mb-0 "+(i%2===0?"md:-ml-[85%] md:pr-10":"")}><span className="absolute -left-[34px] top-5 h-3 w-3 rounded-full border border-ochre bg-obsidian md:-left-[70px]"/><p className="font-accent text-[clamp(48px,6vw,95px)] leading-none text-ochre">{year}</p><h2 className="mt-5 font-display text-[clamp(26px,3vw,43px)]">{name}</h2><p className={eyebrow+" mt-4"}>{place}</p><p className="mt-6 text-[15px] leading-8 text-ivory/75">{description}</p><img src={image} alt={name+" historical visual reference"} className="mt-9 h-[290px] w-full object-cover md:h-[350px]"/></motion.article>)}</div></div></section>
 <section className={frame+" grid gap-12 py-24 md:grid-cols-2 md:py-32"}>{[["SDP Machines","Precision engineering and stone-processing machinery.",machine,"https://www.youtube.com/watch?v=q5CbyGRPTyM","https://sdpmachines.com"],["SDP Stones","International stone sourced from thirty-eight countries.",quarry,"https://www.youtube.com/watch?v=aud6STneDJg","https://sdpstones.com"]].map(([name,description,image,video,link])=><div key={name}><img src={image} alt="" className="aspect-video w-full object-cover"/><p className={eyebrow+" mt-6"}>The SDP Group</p><h2 className="mt-4 font-display text-4xl">{name}</h2><p className={copy+" mt-4"}>{description}</p><div className="mt-7 flex flex-wrap gap-6 text-xs uppercase tracking-[.16em]"><a className="border-b border-ochre pb-2" href={video} target="_blank" rel="noreferrer">Watch film ↗</a><a className="border-b border-ochre pb-2" href={link} target="_blank" rel="noreferrer">Visit website ↗</a></div></div>)}</section>
 <section className="bg-alabaster py-24"><div className={frame+" grid gap-12 lg:grid-cols-2"}><div><p className={eyebrow}>The material bridge</p><h2 className={display+" mt-6"}>Stone becomes <em className="font-accent italic text-bronze">home.</em></h2><p className={copy+" mt-7 max-w-xl"}>The same Italian and international marbles we import through SDP Stones, we use in your home.</p><a href="/collections" className="mt-9 inline-block border-b border-ochre pb-3 text-xs uppercase tracking-[.17em]">Explore collections ↗</a></div><img src={marble} alt="Natural marble" className="aspect-[4/3] w-full object-cover"/></div></section>
 </InnerLayout>;
}

export function ContactPage(){
 const [form,setForm]=useState({name:"",email:"",phone:"",projectType:"",source:"",message:""});
 const [status,setStatus]=useState("");
 const submit=(event:FormEvent<HTMLFormElement>)=>{
  event.preventDefault();
  setStatus("Your email application will open with the details ready to send.");
  const body=encodeURIComponent(["Name: "+form.name,"Email: "+form.email,"Phone: "+form.phone,"Project type: "+form.projectType,"How you heard: "+form.source,"Message: "+form.message].join("\n"));
  window.location.href="mailto:"+CONTACT.email+"?subject="+encodeURIComponent("Mercure Homes consultation enquiry")+"&body="+body;
 };
 const field="mt-3 w-full border-0 border-b border-walnut/25 bg-transparent px-0 py-4 text-[15px] outline-none transition-colors focus:border-ochre";
 return <InnerLayout>
  <PageHero eyebrow="Contact" title="Crafting your story, one statement at a time." lead="Let’s begin with yours." image={heroPhoto}/>
  <section className={frame+" grid gap-16 py-24 lg:grid-cols-[1.2fr_.8fr] lg:gap-28"}>
   <div><p className={eyebrow}>Begin your project</p><h2 className="mt-5 font-accent text-[clamp(39px,4vw,68px)]">Tell us about your space.</h2>
    <form onSubmit={submit} className="mt-12 grid gap-8 sm:grid-cols-2">
     <label className="text-xs uppercase tracking-[.15em]">Full Name<input required className={field} value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></label>
     <label className="text-xs uppercase tracking-[.15em]">Email<input required type="email" className={field} value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></label>
     <label className="text-xs uppercase tracking-[.15em]">Phone<input required type="tel" className={field} value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/></label>
     <label className="text-xs uppercase tracking-[.15em]">Project Type<select className={field} required value={form.projectType} onChange={e=>setForm({...form,projectType:e.target.value})}><option value="">Select type</option>{["Residential","Hospitality","Modular","Turnkey","Furniture","Experience Centre visit"].map(n=><option key={n}>{n}</option>)}</select></label>
     <label className="text-xs uppercase tracking-[.15em] sm:col-span-2">How did you hear about us?<select className={field} value={form.source} onChange={e=>setForm({...form,source:e.target.value})}><option value="">Select</option>{["Recommendation","Instagram","Google","Design professional","Experience Centre","Other"].map(n=><option key={n}>{n}</option>)}</select></label>
     <label className="text-xs uppercase tracking-[.15em] sm:col-span-2">Message<textarea rows={4} className={field} value={form.message} onChange={e=>setForm({...form,message:e.target.value})}/></label>
     <div className="sm:col-span-2"><button type="submit" className="bg-obsidian px-9 py-5 text-xs uppercase tracking-[.2em] text-ivory hover:bg-walnut">Continue in email ↗</button><p role="status" className="mt-4 text-sm text-walnut/65">{status||"This currently opens your email application; no backend submission is configured."}</p></div>
    </form>
   </div>
   <aside className="border-t border-ochre/50 pt-7"><p className={eyebrow}>Visit by appointment</p><h3 className="mt-5 font-display text-3xl">Our Bengaluru atelier</h3><p className={copy+" mt-7"}>{CONTACT.address}</p><div className="mt-10 space-y-6 text-lg"><a className="block hover:text-bronze" href={CONTACT.phoneHref}>{CONTACT.phone}</a><a className="block hover:text-bronze" href={"mailto:"+CONTACT.email}>{CONTACT.email}</a><a href={CONTACT.whatsapp} target="_blank" rel="noreferrer" className="inline-block border border-ochre px-6 py-3 text-xs uppercase tracking-[.15em]">WhatsApp ↗</a><a className="block text-sm" href={CONTACT.instagram} target="_blank" rel="noreferrer">Instagram ↗</a></div><p className="mt-10 text-sm text-walnut/60">We respond within 24 hours.</p></aside>
  </section>
  <section className="bg-alabaster py-16"><div className={frame}><p className={eyebrow}>Find us</p><a href="https://www.google.com/maps/search/?api=1&query=Mercure+Homes+Bengaluru" target="_blank" rel="noreferrer" className="mt-7 flex min-h-[260px] items-center justify-center border border-ochre/25 bg-ivory text-sm text-bronze">Open location in Google Maps ↗<br/>Address confirmation pending</a></div></section>
 </InnerLayout>;
}
