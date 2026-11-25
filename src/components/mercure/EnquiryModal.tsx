import { useEffect, useState, type FormEvent } from "react";
import { useSite } from "./motion";
import { CONTACT } from "./data";

export function EnquiryModal() {
  const { enquiryOpen, setEnquiryOpen, enquirySubject, setEnquirySubject } = useSite();
  const [form, setForm] = useState({ name:"", phone:"", email:"", message:"" });

  useEffect(() => {
    if (enquiryOpen && enquirySubject) {
      setForm(previous => ({ ...previous, message: "Enquiry regarding: " + enquirySubject }));
    }
  }, [enquiryOpen, enquirySubject]);

  useEffect(() => {
    if (!enquiryOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setEnquiryOpen(false);
    };
    window.addEventListener("keydown", escape);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", escape);
    };
  }, [enquiryOpen, setEnquiryOpen]);

  if (!enquiryOpen) return null;

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const subject = encodeURIComponent(enquirySubject ? "Mercure Homes — " + enquirySubject : "Mercure Homes project enquiry");
    const body = encodeURIComponent(
      `Name: ${form.name}\nPhone: ${form.phone}\nEmail: ${form.email}\n\nProject details:\n${form.message}`
    );
    window.location.href = `mailto:${CONTACT.email}?subject=${subject}&body=${body}`;
  };

  return (
    <div role="presentation" className="fixed inset-0 z-[110] flex items-center justify-center bg-obsidian/85 p-4 backdrop-blur-md" onMouseDown={(e)=>{ if(e.target===e.currentTarget) setEnquiryOpen(false); }}>
      <div role="dialog" aria-modal="true" aria-labelledby="enquiry-title" className="relative max-h-[92vh] w-full max-w-[720px] overflow-y-auto bg-ivory p-7 text-obsidian sm:p-12">
        <button type="button" onClick={()=>{ setEnquiryOpen(false); setEnquirySubject(""); }} aria-label="Close enquiry" className="absolute right-5 top-4 text-3xl text-walnut/70 hover:text-obsidian">×</button>
        <p className="type-eyebrow">Begin your project</p>
        <h2 id="enquiry-title" className="font-accent mt-5 text-[clamp(2.6rem,5vw,4rem)] leading-none">Tell us about your space.</h2>
        <form onSubmit={submit} className="mt-10 grid gap-6 sm:grid-cols-2">
          <label className="block text-xs uppercase tracking-[.12em]">Name<input className="mt-3 w-full border-b border-walnut/25 bg-transparent p-3 outline-none focus:border-ochre" required value={form.name} onChange={e=>setForm(v=>({...v,name:e.target.value}))}/></label>
          <label className="block text-xs uppercase tracking-[.12em]">Phone<input className="mt-3 w-full border-b border-walnut/25 bg-transparent p-3 outline-none focus:border-ochre" required type="tel" value={form.phone} onChange={e=>setForm(v=>({...v,phone:e.target.value}))}/></label>
          <label className="block text-xs uppercase tracking-[.12em] sm:col-span-2">Email<input className="mt-3 w-full border-b border-walnut/25 bg-transparent p-3 outline-none focus:border-ochre" required type="email" value={form.email} onChange={e=>setForm(v=>({...v,email:e.target.value}))}/></label>
          <label className="block text-xs uppercase tracking-[.12em] sm:col-span-2">Your project<textarea className="mt-3 min-h-28 w-full resize-y border-b border-walnut/25 bg-transparent p-3 outline-none focus:border-ochre" value={form.message} onChange={e=>setForm(v=>({...v,message:e.target.value}))}/></label>
          <div className="sm:col-span-2">
            <button type="submit" className="bg-obsidian px-8 py-4 text-xs uppercase tracking-[.2em] text-ivory transition-colors hover:bg-walnut">Continue in email ↗</button>
            <p className="mt-4 text-xs text-walnut/60">Opens your email application with the enquiry details. No form data is sent to a server.</p>
          </div>
        </form>
      </div>
    </div>
  );
}
