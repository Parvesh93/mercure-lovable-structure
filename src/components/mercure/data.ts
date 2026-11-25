/**
 * Homepage content. Copy from the Design Flow / Content Draft where available.
 * Items marked PLACEHOLDER are clearly replaceable.
 */
import shriyaamvita from "@/assets/project-shriyaamvita.jpg";
import helloBali from "@/assets/project-hello-bali.jpg";
import dMarble from "@/assets/detail-marble.jpg";
import dWalnut from "@/assets/detail-walnut.jpg";
import dBrass from "@/assets/detail-brass.jpg";
import dLinen from "@/assets/detail-linen.jpg";
import dTeak from "@/assets/detail-teak.jpg";
import dStone from "@/assets/detail-stone.jpg";
import lFoundry from "@/assets/legacy-foundry.jpg";
import lQuarry from "@/assets/legacy-quarry.jpg";
import lMachine from "@/assets/legacy-machine.jpg";
import lExperience from "@/assets/legacy-experience.jpg";

export const CHAPTERS = [
  { id: "top", num: "01", name: "Entrance" },
  { id: "statement", num: "02", name: "Statement" },
  { id: "wheel", num: "03", name: "Collections" },
  { id: "projects", num: "04", name: "Projects" },
  { id: "legacy", num: "05", name: "Legacy" },
  { id: "process", num: "06", name: "Process" },
  { id: "testimonials", num: "07", name: "Voices" },
  { id: "begin", num: "08", name: "Begin" },
] as const;

/** Full inner-page navigation in the approved sitemap order. */
export const PAGES = [
  { num: "01", label: "About", href: "/about", material: dMarble },
  { num: "02", label: "Collections", href: "/collections", material: dWalnut },
  { num: "03", label: "Projects", href: "/projects", material: dBrass },
  { num: "04", label: "Process", href: "/process", material: dLinen },
  { num: "05", label: "Team", href: "/team", material: dTeak },
  { num: "06", label: "The SDP Group", href: "/sdp-group", material: dStone },
  { num: "07", label: "Contact", href: "/contact", material: dMarble },
] as const;

export const CONTACT = {
  phone: "+91 84310 01900",
  phoneHref: "tel:+918431001900",
  whatsapp: "https://wa.me/918431001900",
  email: "info@mercurehomes.com",
  instagram: "https://instagram.com/", // PLACEHOLDER handle
  address:
    "Bengaluru, India · Experience Centre address awaiting client confirmation",
};

export type Project = {
  slug: string;
  accent: string;
  caps: string;
  name: string;
  location: string;
  sqft: string;
  copy: string;
  image: string;
  details: { src: string; caption: string }[];
};

export const PROJECTS: Project[] = [
  {
    slug: "shriyaamvita",
    accent: "A Courtyard",
    caps: "Residence",
    name: "Shriyaamvita",
    location: "Kanakapura",
    sqft: "50,000",
    copy:
      "A family home composed around light, stone and a living courtyard. Every room was furnished in-house — Italian marble hand-set into floors, walnut panelling milled to the millimetre, and Sculpt pieces shaped to the rituals of the family.",
    image: shriyaamvita,
    details: [
      { src: dMarble, caption: "Calacatta, book-matched" },
      { src: dWalnut, caption: "Walnut, hand-dovetailed" },
      { src: dBrass, caption: "Brushed brass inlay" },
      { src: dLinen, caption: "Imported linen, piped" },
    ],
  },
  {
    slug: "hello-bali",
    accent: "An Island",
    caps: "Retreat",
    name: "Hello Bali",
    location: "Tamil Nadu",
    sqft: "20,000",
    copy:
      "A hospitality retreat that carries the ease of Bali to the Tamil Nadu coast. Teak pavilions, woven Terrain lounges and honed stone settle into the landscape — furniture made for salt air, slow evenings and long stays.",
    image: helloBali,
    details: [
      { src: dTeak, caption: "Teak & woven rope" },
      { src: dStone, caption: "Honed coastal stone" },
      { src: dLinen, caption: "Outdoor-grade linen" },
      { src: dWalnut, caption: "Oiled hardwood joinery" },
    ],
  },
];

export const STATS = [
  { label: "Years of precision", value: 50, suffix: "+", unit: "", image: lFoundry, caption: "The foundry, Ajmer" },
  { label: "Countries sourced", value: 38, suffix: "", unit: "", image: lQuarry, caption: "Marble, at the quarry" },
  { label: "Machine installations", value: 1000, suffix: "+", unit: "", image: lMachine, caption: "SDP Machines" },
  { label: "Experience Centre", value: 18000, suffix: "", unit: "sq ft", image: lExperience, caption: "Bengaluru" },
];

export const PROCESS = [
  { name: "Discover", line: "We listen before we draw." },
  { name: "Understand", line: "Your rituals, light and land." },
  { name: "Curate", line: "Materials chosen with intent." },
  { name: "Define", line: "Every line, finish and dimension." },
  { name: "Make", line: "Crafted in-house, by hand." },
  { name: "Deliver", line: "Placed, finished, made yours." },
];

/** PLACEHOLDER testimonials — replace with approved client quotes. */
export const TESTIMONIALS = [
  {
    quote:
      "They didn't sell us furniture. They listened, guided, and somehow understood the home we hadn't yet been able to describe.",
    name: "Client name",
    project: "Private residence, Bengaluru",
    image: shriyaamvita,
  },
  {
    quote:
      "Every piece arrived as if it had always belonged there — the marble, the joinery, the light. Quiet, assured, and entirely ours.",
    name: "Client name",
    project: "Hello Bali, Tamil Nadu",
    image: helloBali,
  },
  {
    quote:
      "From the first sketch to the final cushion, nothing was left to chance. Our guests still ask who made the dining table.",
    name: "Client name",
    project: "Farmhouse retreat, Kanakapura",
    image: lExperience,
  },
];
