import React, { useEffect, useState } from "react";
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
import { AboutPage, CollectionsPage } from "./components/mercure/InnerPages";
import { ProjectsPage, ProjectDetailPage, ProcessPage, TeamPage, SDPGroupPage, ContactPage } from "./components/mercure/InnerStories";

function Home() {
  return <>
    <Preloader />
    <ChapterRail />
    <Hero />
    <Statement />
    <CollectionsWheel />
    <Projects />
    <Legacy />
    <Process />
    <Testimonials />
    <Begin />
  </>;
}
function ContentRouter() {
  const [url, setUrl] = useState(() => window.location.pathname);
  useEffect(() => {
    const onRoute = () => {
      const pathname = window.location.pathname;
      setUrl(pathname);
      window.scrollTo({ top: 0, behavior: "instant" });
      const titles: Record<string, string> = {
        "/": "Mercure Homes | Luxury Interior Atelier Bengaluru",
        "/about": "About Mercure Homes | Bengaluru Experience Centre",
        "/collections": "Collections | Mercure Homes Bengaluru",
        "/projects": "Projects | Mercure Homes Portfolio",
        "/process": "Our Process | Mercure Homes Bengaluru",
        "/team": "Our Team | Mercure Homes",
        "/sdp-group": "SDP Group | Mercure Homes Legacy",
        "/contact": "Contact | Mercure Homes Bengaluru",
      };
      document.title = titles[pathname] ?? (pathname.startsWith("/projects/") ? "Project | Mercure Homes" : titles["/"]);
    };
    onRoute();
    window.addEventListener("popstate", onRoute);
    return () => window.removeEventListener("popstate", onRoute);
  }, []);

  if (url === "/about") return <AboutPage />;
  if (url === "/collections") return <CollectionsPage />;
  if (url === "/projects") return <ProjectsPage />;
  if (url.startsWith("/projects/")) return <ProjectDetailPage slug={decodeURIComponent(url.substring("/projects/".length))} />;
  if (url === "/process") return <ProcessPage />;
  if (url === "/team") return <TeamPage />;
  if (url === "/sdp-group") return <SDPGroupPage />;
  if (url === "/contact") return <ContactPage />;
  return <Home />;
}
function App() {
  return (
    <SmoothScroll>
      <Header />
      <Cursor />
      <ContentRouter />
      <EnquiryModal />
    </SmoothScroll>
  );
}
const root = document.getElementById("root");
if (!root) throw new Error("Missing #root element");
createRoot(root).render(<React.StrictMode><App /></React.StrictMode>);
