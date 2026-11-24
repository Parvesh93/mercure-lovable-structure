import React from "react";
import { createRoot } from "react-dom/client";

import "./styles.css";
import { SmoothScroll } from "./components/mercure/motion";
import { Preloader } from "./components/mercure/Preloader";
import { Header } from "./components/mercure/Header";
import { ChapterRail } from "./components/mercure/ChapterRail";
import { Cursor } from "./components/mercure/Cursor";
import { Hero } from "./components/mercure/chapters/Hero";
import { Statement } from "./components/mercure/chapters/Statement";
import { CollectionsWheel } from "./components/mercure/wheel/CollectionsWheel";
import { Projects } from "./components/mercure/chapters/Projects";
import { Legacy } from "./components/mercure/chapters/Legacy";
import { Process } from "./components/mercure/chapters/Process";
import { Testimonials } from "./components/mercure/chapters/Testimonials";
import { Begin } from "./components/mercure/chapters/Begin";
import { EnquiryModal } from "./components/mercure/EnquiryModal";

function App() {
  return (
    <SmoothScroll>
      <Preloader />
      <Header />
      <ChapterRail />
      <Cursor />
      <main>
        <Hero />
        <Statement />
        <CollectionsWheel />
        <Projects />
        <Legacy />
        <Process />
        <Testimonials />
        <Begin />
      </main>
      <EnquiryModal />
    </SmoothScroll>
  );
}

const root = document.getElementById("root");
if (!root) throw new Error("Missing #root element");
createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
