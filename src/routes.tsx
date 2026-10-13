import type { ReactElement } from "react";
import Home from "@/pages/Home";
import Courses from "@/pages/Courses";
import Training from "@/pages/Training";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import NotFound from "@/pages/NotFound";

export type Route = { path: string; element: ReactElement; title: string; description: string };

export const SITE_URL = "https://hawkeyedata.ca";

export const routes: Route[] = [
  {
    path: "/",
    element: <Home />,
    title: "HawkEye Data | Data, cloud and AI courses, training and consulting",
    description:
      "Learn data, cloud and AI with Amandeep Sawhney: Udemy courses taken by 176,000+ learners, plus corporate training and consulting from HawkEye Data Solutions.",
  },
  {
    path: "/courses",
    element: <Courses />,
    title: "Courses | HawkEye Data",
    description:
      "Every HawkEye Data course on Udemy, grouped by goal: AI at work, AWS and Azure certifications, Oracle Cloud, Power BI and Tableau, SQL and more.",
  },
  {
    path: "/training",
    element: <Training />,
    title: "Corporate training and consulting | HawkEye Data",
    description:
      "Instructor-led data, cloud and AI training for teams, certification bootcamps, and hands-on consulting from HawkEye Data Solutions.",
  },
  {
    path: "/about",
    element: <About />,
    title: "About | HawkEye Data",
    description: "HawkEye Data Solutions is Amandeep Sawhney's data, cloud and AI education and consulting practice.",
  },
  {
    path: "/contact",
    element: <Contact />,
    title: "Contact | HawkEye Data",
    description: "Talk to HawkEye Data about corporate training, consulting or a course: learn@hawkeyedata.ca.",
  },
  {
    path: "*",
    element: <NotFound />,
    title: "Page not found | HawkEye Data",
    description: "This page doesn't exist. Head back to HawkEye Data's courses, training and consulting.",
  },
];
