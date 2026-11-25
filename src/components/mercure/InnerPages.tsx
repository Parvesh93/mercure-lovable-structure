import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { CONTACT, PROJECTS, PROCESS, type Project } from "./data";
import { COLLECTIONS } from "./wheel/collections";
import { registerGsap, useSite } from "./motion";
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

const asset = { marble, walnut, brass, linen, teak, stone };
const fade = { initial: { opacity: 0, y: 28 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.12 }, transition: { duration: 0.75 } };
const frame = "mx-auto w-full max-w-[1680px] px-6 md:px-12 lg:px-20";
const editorial = "font-display text-[clamp(42px,6.2vw,106px)] leading-[1.08] tracking-[-.055em]";
const paragraph = "text-[15px] leading-[1.9] text-walnut/75 md:text-[17px]";
const goldLabel = "type-eyebrow text-ochre";
const anchor = "inline-flex items-center gap-5 border-b border-ochre pb-3 text-xs font-semibold uppercase tracking-[.18em] transition-colors hover:text-bronze";

function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <motion.div {...fade} className={className}>{children}</motion.div>;
}
export function PageHero({ eyebrow, title, lead, image, dark = false }: { eyebrow: string; title: string; lead: string; image?: string; dark?: boolean }) {
  return <section data-chapter data-header-theme={dark || image ? "dark" : "light"} data-theme={dark || image ? "dark" : "light"} className={"relative flex min-h-[75svh] items-end overflow-hidden pb-20 pt-40 md:min-h-[88svh] md:pb-24 " + (dark || image ? "bg-obsidian text-ivory" : "bg-ivory text-obsidian")}>
    {image && <><img src={image} alt="" className="absolute inset-0 h-full w-full object-cover" /><div className="absolute inset-0 bg-gradient-to-r from-obsidian/85 via-obsidian/55 to-obsidian/20" /></>}
    <div className={frame + " relative z-10"}>
      <Reveal><p className={goldLabel}>{eyebrow}</p><h1 className={editorial + " mt-8 max-w-[1150px]"}>{title}</h1><p className={"mt-8 max-w-[750px] text-[16px] leading-[1.8] " + (dark || image ? "text-ivory/80" : "text-walnut/70")}>{lead}</p></Reveal>
    </div>
  </section>;
}
export function EndBand() {
  const { setEnquiryOpen } = useSite();
  return <section data-theme="dark" className="bg-walnut px-6 py-24 text-center text-ivory md:py-32">
    <p className={goldLabel}>Mercure Homes · Bengaluru</p>
    <h2 className="mx-auto mt-5 max-w-5xl font-accent text-[clamp(43px,6vw,95px)] italic leading-[1.13]">Ready to begin?</h2>
    <button className="mt-9 border border-ochre px-8 py-4 text-xs uppercase tracking-[.2em] text-ivory transition-colors hover:bg-ochre hover:text-obsidian" onClick={() => setEnquiryOpen(true)}>Begin your project ↗</button>
  </section>;
}
export function PageFooter() {
  return <footer data-theme="dark" className="bg-obsidian px-6 py-14 text-ivory/70 md:px-12 lg:px-20">
    <div className="mx-auto flex max-w-[1600px] flex-wrap justify-between gap-12">
      <div><strong className="font-display text-2xl font-normal text-ivory">MERCURE <span className="text-ochre">HOMES</span></strong><p className="mt-3 text-sm">An SDP Group company</p></div>
      <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-xs sm:grid-cols-4">
        {["About","Collections","Projects","Process","Team","The SDP Group","Contact"].map((name,i)=><a className="hover:text-ivory" href={["/about","/collections","/projects","/process","/team","/sdp-group","/contact"][i]} key={name}>{name}</a>)}
      </div>
      <div className="max-w-sm text-sm leading-7"><a href={CONTACT.phoneHref}>{CONTACT.phone}</a><br/><a href={"mailto:"+CONTACT.email}>{CONTACT.email}</a><p>{CONTACT.address}</p></div>
    </div>
  </footer>;
}
export function InnerLayout({ children }: { children: ReactNode }) {
  const { setIntroDone } = useSite();
  useEffect(()=>{setIntroDone(true); window.scrollTo({top:0,behavior:"instant"});},[setIntroDone]);
  return <main className="bg-ivory text-obsidian">{children}<EndBand/><PageFooter/></main>;
}

const values = [
  ["Craftsmanship","Quiet mastery, made visible in every detail."],
  ["Personalisation","Tailored to your space and the way you live."],
  ["Integrity","Transparent in process."],
  ["Guidance","Mentoring rather than selling."],
  ["Confidence","Assured without excess."],
];

export function AboutPage() {
  const { setEnquiryOpen } = useSite();
  const storyRef=useRef<HTMLDivElement>(null);
  const trackRef=useRef<HTMLDivElement>(null);
  useEffect(()=>{
    registerGsap();
    const media=gsap.matchMedia();
    media.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)",()=>{
      const story=storyRef.current, track=trackRef.current;
      if(!story||!track) return;
      const ctx=gsap.context(()=>{
        gsap.to(track,{x:()=>-(track.scrollWidth-window.innerWidth),ease:"none",scrollTrigger:{
          trigger:story,start:"top top",end:()=>"+="+Math.max(1,track.scrollWidth-window.innerWidth),pin:true,scrub:0.8,invalidateOnRefresh:true,
        }});
      },story);
      return ()=>ctx.revert();
    });
    return ()=>media.revert();
  },[]);
  return <InnerLayout>
    <PageHero eyebrow="About · Mercure Homes" title="A home is never simply furnished; it is composed." lead="Italian contemporary design meets Indian craftsmanship." image={heroPhoto}/>
    <section ref={storyRef} className="overflow-hidden bg-alabaster py-24 lg:py-0">
      <div ref={trackRef} className="flex w-full flex-col gap-14 px-6 md:px-12 lg:h-screen lg:w-max lg:flex-row lg:items-center lg:gap-28 lg:px-[8vw]">
        <div className="w-full lg:w-[55vw]"><p className={goldLabel}>The atelier</p><h2 className={editorial+" mt-8"}>Every decision <em className="font-accent text-bronze">deliberate.</em></h2><p className={paragraph+" mt-8 max-w-xl"}>Mercure Homes is a luxury interior atelier based in Bengaluru, India, where Italian contemporary design meets Indian craftsmanship. We believe a home is never simply furnished; it is composed. Every decision is deliberate, nothing is ornamental for its own sake, and every piece that leaves our atelier carries the story of the family it was made for.</p></div>
        <img className="h-[360px] w-full object-cover lg:h-[72vh] lg:w-[35vw]" src={marble} alt="Natural marble material detail"/>
        <div className="w-full lg:w-[51vw]"><p className={goldLabel}>1972 — The beginning</p><h2 className="mt-7 font-accent text-[clamp(60px,11vw,150px)] leading-none text-bronze">1972</h2><p className={paragraph+" mt-8 max-w-xl"}>We are the newest chapter of the SDP Group, a fifty-year-old family of companies built on stone, precision engineering and material mastery. What began as a foundry in Ajmer became a marble house in Kishangarh, then a machine manufacturer competing with global giants, then a stone importer curating from thirty-eight countries. Mercure Homes is where all of that expertise finally arrives at the home itself.</p></div>
        <div className="flex w-full flex-col gap-6 lg:w-[43vw]"><img className="h-56 w-full object-cover" src={foundry} alt="SDP foundry"/><img className="h-56 w-full object-cover" src={walnut} alt="Walnut craftsmanship detail"/></div>
      </div>
    </section>
    <section className={frame+" py-24 md:py-32"}><div className="grid gap-12 lg:grid-cols-12">
      <div className="lg:col-span-5"><Reveal><p className={goldLabel}>The Experience Centre</p><h2 className={editorial+" mt-6"}>18,000 <span className="font-accent italic text-bronze">sq ft.</span></h2><p className={paragraph+" mt-7"}>Our 18,000 sq ft Experience Centre in Bengaluru is where the Mercure world is meant to be walked through, not just described. Kitchens, wardrobes, furniture, lighting and carpets are staged as lived-in spaces rather than showroom displays — every material within arm’s reach, every finish visible in daylight.</p><button className={anchor+" mt-8"} onClick={()=>setEnquiryOpen(true)}>Schedule a visit ↗</button></Reveal></div>
      <div className="lg:col-span-7"><div className="relative aspect-video overflow-hidden bg-alabaster"><img src={heroPhoto} className="h-full w-full object-cover" alt="Experience Centre preview"/><span className="absolute bottom-5 left-6 bg-obsidian/70 px-4 py-2 text-xs text-ivory">Walkthrough footage pending</span></div></div>
    </div></section>
    <section className="bg-alabaster py-24"><div className={frame}><p className={goldLabel}>Visit by appointment</p><div className="mt-8 grid gap-8 lg:grid-cols-2"><div><h2 className="font-accent text-5xl text-obsidian">Find our atelier.</h2><p className={paragraph+" mt-5"}>{CONTACT.address}</p><a className={anchor+" mt-7"} href="https://www.google.com/maps/search/?api=1&query=Mercure+Homes+Bengaluru" target="_blank" rel="noreferrer">Open Google Maps ↗</a></div><div className="flex min-h-[260px] items-center justify-center border border-ochre/30 bg-ivory text-center text-sm text-walnut/60">Map location to be confirmed by the studio</div></div></div></section>
    <section className={frame+" py-24 md:py-32"}><p className={goldLabel}>Part of the SDP Group</p><div className="mt-9 grid gap-5 md:grid-cols-3">
      {[["SDP Machines","Based in Ajmer, Rajasthan, South Asia’s leading stone-processing machine manufacturer, exported globally.",machine],["SDP Stones","Importers and processors of exotic natural stone, sourced from thirty-eight countries — Diamond Sponsors of the IIID.",quarry],["Mercure Homes","The group’s interior atelier, where every material and machine the SDP Group has mastered finally becomes a home.",heroPhoto]].map(([name,copy,image])=><a href="/sdp-group" key={name} className="group block bg-alabaster"><img src={image} alt="" className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"/><div className="p-6"><h3 className="font-display text-2xl">{name}</h3><p className={paragraph+" mt-4 !text-sm"}>{copy}</p><span className="mt-6 block text-xs text-bronze">Discover the group ↗</span></div></a>)}
    </div></section>
    <section className="bg-alabaster py-24"><div className={frame}><p className={goldLabel}>Our values</p><div className="mt-8 grid gap-3 md:grid-cols-5">{values.map(([name,meaning])=><div className="group min-h-40 border-t border-ochre/40 py-5"><h3 className="font-display text-lg">{name}</h3><p className="mt-5 text-sm leading-7 text-walnut/65 opacity-100 transition-opacity lg:opacity-0 lg:group-hover:opacity-100">{meaning}</p></div>)}</div></div></section>
  </InnerLayout>;
}

type Item = { name:string; category:string; kind:string; description:string; image:string };
const products:Item[] = [
  ["Marmo Island Kitchen","modular","Kitchen","An island kitchen built around a single slab of stone, engineered for the way a home actually gathers around food.",marble],
  ["Vetro Handleless Kitchen","modular","Kitchen","Clean, handle-free cabinetry in soft-close precision — designed to disappear into the architecture around it.",walnut],
  ["Custodia Walk-In Wardrobe","modular","Wardrobe","A walk-in wardrobe planned around what you actually own, not a standard module stretched to fit.",walnut],
  ["Linea Sliding Wardrobe","modular","Wardrobe","Slim-profile sliding wardrobes for rooms where every centimetre of floor space matters.",walnut],
  ["Alba Mirae Chandelier","lighting","Alba Mirae","A sculptural chandelier designed as the room’s first sentence — the piece a space is planned around.",brass],
  ["Alba Mirae Pendant","lighting","Alba Mirae","A single-drop pendant for entryways and dining tables, cast in warm, textured metal.",brass],
  ["Mirae Wall Sconce","lighting","Mirae","A quiet wall light for corridors and bedside walls, built for daily ambient use.",brass],
  ["Mirae Table Lamp","lighting","Mirae","A considered bedside and console lamp, finished to complement Mercure’s furniture metals.",COLLECTIONS[0].object],
  ["Terrain Lounge Chair","terrain","Outdoor","A weather-rated lounge chair in teak and woven rope, built for balconies and poolside decks.",COLLECTIONS[2].object],
  ["Terrain Daybed","terrain","Outdoor","An outdoor daybed sized for long afternoons, finished to withstand Indian coastal climates.",teak],
  ["Terrain Dining Set","terrain","Outdoor","A full outdoor dining set for terraces and courtyards, made to the proportions of your space.",teak],
  ["Sculpt Sofa","sculpt","Indoor","A sofa built to the proportion of your living room, upholstered in fabrics and leathers chosen with you.",linen],
  ["Sculpt Armchair","sculpt","Indoor","A single accent chair, sculpted for reading corners and quiet rooms.",COLLECTIONS[1].object],
  ["Sculpt Coffee Table","sculpt","Indoor","A coffee table in stone or wood, sized to sit at the centre of a considered living space.",marble],
  ["Sculpt Console","sculpt","Indoor","An entryway or media console, finished to complement the metals and stones used elsewhere in the home.",walnut],
  ["Bespoke Bed","sculpt","Loose Furniture","A custom bed frame and headboard, upholstered or in solid wood, sized to your room.",linen],
  ["Custom Dining Table","sculpt","Loose Furniture","A dining table in stone or wood, seated to the number your family actually gathers.",marble],
  ["Occasional Console","sculpt","Loose Furniture","A standalone console for entryways, landings or media walls.",walnut],
  ["Accent Bench","sculpt","Loose Furniture","A single upholstered bench, made to sit at the foot of a bed or along a hallway.",linen],
  ["Hand-Knotted Silk Rug","soft-furnishings","Carpet","A fine hand-knotted silk rug, woven to your room’s exact dimensions and palette.",linen],
  ["Hand-Tufted Wool Rug","soft-furnishings","Carpet","A hand-tufted wool rug in custom pattern and scale, built for daily, family-home use.",linen],
  ["Custom Dhurrie","soft-furnishings","Carpet","A flat-weave dhurrie for casual and outdoor-adjacent spaces, made to measure.",linen],
].map(([name,category,kind,description,image])=>({name,category,kind,description,image}));
const filters=[["all","All"],["modular","Modular"],["lighting","Miraé"],["sculpt","Sculpt"],["terrain","Terrain"],["soft-furnishings","Soft Furnishings"],["turnkey","Turnkey"]];
export function CollectionsPage(){
  const {setEnquiryOpen,setEnquirySubject}=useSite();
  const getFilter=()=>{
    const query=new URLSearchParams(location.search).get("c");
    return filters.some(f=>f[0]===query)?query!:"all";
  };
  const [filter,setFilter]=useState(getFilter);
  const [selected,setSelected]=useState<Item|null>(null);
  const [photo,setPhoto]=useState(0);
  useEffect(()=>{const fn=()=>setFilter(getFilter());window.addEventListener("popstate",fn);return()=>window.removeEventListener("popstate",fn)},[]);
  useEffect(()=>{const key=(e:KeyboardEvent)=>{if(e.key==="Escape")setSelected(null)};window.addEventListener("keydown",key);return()=>window.removeEventListener("keydown",key)},[]);
  const change=(f:string)=>{setFilter(f);history.replaceState(null,"",f==="all"?"/collections":"/collections?c="+f)};
  const result=filter==="all"?products:products.filter(p=>p.category===filter);
  return <InnerLayout>
    <PageHero eyebrow="Collections" title="A mood board of forms, materials and details." lead="Each piece is made to order, allowing the design to evolve around your space. Take a closer look. If something catches your eye, let’s make it yours." image={marble}/>
    <div className="sticky top-16 z-40 overflow-x-auto border-b border-walnut/15 bg-ivory/95 px-6 py-5 backdrop-blur-md md:px-12"><div className="mx-auto flex w-max max-w-[1600px] gap-7">{filters.map(([id,name])=><button key={id} onClick={()=>change(id)} className={"border-b-2 pb-2 text-[11px] uppercase tracking-[.15em] transition-colors "+(filter===id?"border-ochre text-obsidian":"border-transparent text-walnut/55 hover:text-obsidian")}>{name}</button>)}</div></div>
    <section className={frame+" py-16 md:py-24"}>
      <div className="flex items-center justify-between gap-5"><p className={goldLabel}>Products · Made in-house</p><span className="text-xs text-walnut/50">{result.length} pieces</span></div>
      <div className="mt-9 grid grid-cols-2 gap-x-4 gap-y-12 lg:grid-cols-4 lg:gap-x-7">
        {result.map((item,index)=><motion.button layout key={item.name} type="button" onClick={()=>{setPhoto(0);setSelected(item)}} className="group block text-left">
          <div className={"overflow-hidden bg-alabaster "+(index%5===0?"aspect-[3/4]":"aspect-square")}><img className="h-full w-full object-contain p-3 saturate-75 transition-all duration-500 group-hover:scale-[1.04] group-hover:saturate-100" src={item.image} alt={"Visual reference for "+item.name}/></div>
          <h3 className="mt-4 font-display text-[clamp(15px,1.5vw,22px)]">{item.name}</h3><p className="mt-2 text-[10px] uppercase tracking-[.13em] text-bronze">{item.category} · {item.kind}</p><p className="mt-3 text-xs leading-6 text-walnut/60">{item.description}</p>
        </motion.button>)}
      </div>
      {!result.length && <p className="py-20 text-walnut/60">This is a service rather than an individual product. See the Turnkey offering below.</p>}
    </section>
    <section className="bg-walnut py-24 text-ivory"><div className={frame+" grid gap-12 md:grid-cols-2"}><div><p className={goldLabel}>Services · Turnkey</p><h2 className={editorial+" mt-6"}>One considered <em className="font-accent italic text-ochre">journey.</em></h2></div><div><p className="text-lg leading-9 text-ivory/80">From the first conversation to the final styled detail, we manage it all — design consultation, execution and styling — as one continuous process, under one roof.</p><p className="mt-5 text-ivory/65">No fragmented vendors. No dilution between stages. Just a single, considered journey from concept to completion.</p><button onClick={()=>setEnquiryOpen(true)} className={anchor+" mt-8"}>Schedule consultation ↗</button></div></div></section>
    <section className={frame+" py-24"}><p className={goldLabel}>Material stories</p><div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{[["Italian marble",marble],["Imported linens",linen],["Italian leather",walnut],["Ethically sourced wood",teak]].map(([name,img])=><a key={name} href="/sdp-group" className="group"><img src={img} alt="" className="aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"/><h3 className="mt-4 font-display text-lg">{name} ↗</h3></a>)}</div></section>
    {selected&&<div className="fixed inset-0 z-[120] bg-obsidian/70 backdrop-blur-sm" onMouseDown={e=>{if(e.target===e.currentTarget)setSelected(null)}}><aside role="dialog" aria-modal="true" aria-label={selected.name} className="absolute bottom-0 right-0 top-auto max-h-[95svh] w-full overflow-y-auto bg-ivory p-7 text-obsidian md:bottom-0 md:top-0 md:w-[min(680px,90vw)] md:p-12"><button className="absolute right-6 top-6 text-2xl" onClick={()=>setSelected(null)} aria-label="Close">×</button><p className={goldLabel}>Quick view · {selected.category}</p><h2 className="mt-5 font-display text-4xl">{selected.name}</h2><img className="mt-8 aspect-[4/3] w-full bg-alabaster object-contain" src={[selected.image,marble,linen,brass,walnut][photo]} alt={"Detail for "+selected.name}/><div className="mt-3 flex flex-wrap gap-2">{[selected.image,marble,linen,brass,walnut].map((src,i)=><button key={i} onClick={()=>setPhoto(i)} aria-label={"View material reference "+(i+1)} className={"h-14 w-14 border "+(photo===i?"border-ochre":"border-walnut/15")}><img src={src} className="h-full w-full object-cover" alt=""/></button>)}</div><p className={paragraph+" mt-7"}>{selected.description}</p><p className="mt-5 text-xs text-walnut/60">Materials and finishes: confirmed for each made-to-order project. Images are material references pending approved product photography.</p><button onClick={()=>{setEnquirySubject(selected.name);setSelected(null);setEnquiryOpen(true)}} className="mt-8 bg-obsidian px-7 py-4 text-xs uppercase tracking-[.18em] text-ivory">Enquire about this piece ↗</button></aside></div>}
  </InnerLayout>;
}
