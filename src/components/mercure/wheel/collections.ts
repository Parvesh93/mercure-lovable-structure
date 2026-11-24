import objMirae from "@/assets/obj-mirae.webp";
import objSculpt from "@/assets/obj-sculpt.webp";
import objTerrain from "@/assets/obj-terrain.webp";
import objModular from "@/assets/obj-modular.webp";
import objTurnkey from "@/assets/obj-turnkey.webp";
import lineMirae from "@/assets/line-mirae.webp";
import lineSculpt from "@/assets/line-sculpt.webp";
import lineTerrain from "@/assets/line-terrain.webp";
import lineModular from "@/assets/line-modular.webp";
import lineTurnkey from "@/assets/line-turnkey.webp";

export type CollectionId = "mirae" | "sculpt" | "terrain" | "modular" | "turnkey";

export type Collection = {
  id: CollectionId;
  name: string;
  word: string;
  kind: string;
  teaser: string;
  href: string;
  /** Active backdrop (Design Flow §5) — CSS colour expression from brand tokens */
  backdrop: string;
  theme: "light" | "dark";
  object: string;
  line: string;
  /** visual aspect of the object image (w/h) */
  aspect: number;
};

export const COLLECTIONS: Collection[] = [
  {
    id: "mirae",
    name: "Miraé",
    word: "MIRAÉ",
    kind: "Decorative lighting",
    teaser: "Lighting designed as an integral part of the interior, balancing sculptural form with a softer sense of illumination.",
    href: "/collections?c=lighting",
    backdrop: "var(--ivory)",
    theme: "light",
    object: objMirae,
    line: lineMirae,
    aspect: 0.58,
  },
  {
    id: "sculpt",
    name: "Sculpt",
    word: "SCULPT",
    kind: "Loose furniture",
    teaser: "Loose furniture, sculpted around the rituals of everyday living.",
    href: "/collections?c=sculpt",
    backdrop: "var(--alabaster)",
    theme: "light",
    object: objSculpt,
    line: lineSculpt,
    aspect: 1.06,
  },
  {
    id: "terrain",
    name: "Terrain",
    word: "TERRAIN",
    kind: "Outdoor furniture",
    teaser: "Materials sourced across the globe, crafted in-house for the Indian landscape.",
    href: "/collections?c=terrain",
    backdrop: "color-mix(in oklab, var(--alabaster) 85%, var(--bronze))",
    theme: "light",
    object: objTerrain,
    line: lineTerrain,
    aspect: 1.1,
  },
  {
    id: "modular",
    name: "Modular",
    word: "MODULAR",
    kind: "Modular solutions",
    teaser: "Kitchens and wardrobes, tailored to your space with a quiet attention to proportion, material and detail.",
    href: "/collections?c=modular",
    backdrop: "var(--ivory)",
    theme: "light",
    object: objModular,
    line: lineModular,
    aspect: 1.62,
  },
  {
    id: "turnkey",
    name: "Turnkey",
    word: "TURNKEY",
    kind: "Turnkey interior design",
    teaser: "End-to-end design and execution, from the first line to the final detail.",
    href: "/collections?c=turnkey",
    backdrop: "var(--walnut)",
    theme: "dark",
    object: objTurnkey,
    line: lineTurnkey,
    aspect: 0.4,
  },
];
