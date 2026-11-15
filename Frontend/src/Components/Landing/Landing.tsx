import styles from "./Landing.module.css";

import NavBar from "../NavBar/NavBar.tsx";
import About from "../About/About.tsx";
import Hero from "../Hero/Hero.tsx";
import Skills from "../Skills/Skills.tsx";
import Projects from "../Projects/Projects.tsx";
import Contact from "../Contact/Contact.tsx";
import Footer from "../Footer/Footer.tsx";

import { useRef, type CSSProperties } from "react";

// Generate once, outside render, so the sky does not jump on re-renders.
const Stars = Array.from({ length: 110 }, () => {
    const Size = .8 + Math.random() * 2.2;
    return {
        left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`,
        width: `${Size}px`, height: `${Size}px`,
        "--twinkle-duration": `${4 + Math.random() * 7}s`,
        "--twinkle-delay": `${-Math.random() * 20}s`,
        "--drift-x": `${(Math.random() - .5) * 18}px`,
        "--drift-y": `${(Math.random() - .5) * 18}px`,
    } as CSSProperties;
});

export interface PageRefStruct { // Must be same name as the variables

    aboutRef: React.RefObject<HTMLDivElement | null>,
    heroRef: React.RefObject<HTMLDivElement | null>,
    skillsRef: React.RefObject<HTMLDivElement | null>,
    softwareRef: React.RefObject<HTMLDivElement | null>,
    engineeringRef: React.RefObject<HTMLDivElement | null>,
    contactRef: React.RefObject<HTMLDivElement | null>;

}

export default function Landing() {

    const RefObj: PageRefStruct = {
        aboutRef: useRef<HTMLDivElement | null>(null),
        heroRef: useRef<HTMLDivElement | null>(null),
        skillsRef: useRef<HTMLDivElement | null>(null),
        softwareRef: useRef<HTMLDivElement | null>(null),
        engineeringRef: useRef<HTMLDivElement | null>(null),
        contactRef: useRef<HTMLDivElement | null>(null)

    };

    return (

        <div className = {styles.MainContainer}>

            <div className = {styles.SpaceBackground} aria-hidden = "true">
                <div className = {styles.Nebula} />
                <div className = {styles.Nebula} />
                <div className = {styles.Nebula} />
                {[
                    [24, 8, 160, 19, -17], [78, 15, 210, 23, -7],
                    [48, 42, 180, 27, -24], [94, 55, 240, 29, -14],
                    [32, 72, 150, 21, -5], [76, 88, 200, 31, -27],
                ].map(([left, top, size, duration, delay], index) => (
                    <span key = {`comet-${index}`} className = {styles.Comet} style = {{
                        left: `${left}%`, top: `${top}%`, width: `${size}px`,
                        "--event-duration": `${duration}s`, "--event-delay": `${delay}s`,
                    } as CSSProperties} />
                ))}
                {[
                    [12, 24, 10, 23, -22, -25], [82, 18, 13, 29, -12, 30],
                    [45, 48, 9, 31, -5, -40], [18, 80, 12, 27, -18, 20],
                    [88, 74, 11, 33, -29, -15],
                ].map(([left, top, size, duration, delay, angle], index) => (
                    <div key = {`quasar-${index}`} className = {styles.Pulsar} style = {{
                        left: `${left}%`, top: `${top}%`, width: `${size}px`, height: `${size}px`,
                        "--event-duration": `${duration}s`, "--event-delay": `${delay}s`,
                        "--jet-angle": `${angle}deg`, "--jet-height": `${size * 19}px`,
                    } as CSSProperties} />
                ))}
                {Stars.map((Style, Index) => (
                    <span key = {Index} className = {styles.Star} style = {Style} />
                ))}
                <div className = {styles.DaylightOrbit} />
                <div className = {styles.DaylightOrbit} />
            </div>

            <NavBar refObj = {RefObj} />

            <div ref = {RefObj.heroRef} className = {styles.PageContainer}>
                <Hero />
            </div>

            <div ref = {RefObj.aboutRef} className = {styles.PageContainer}>
                <About />
            </div>

            <div ref = {RefObj.skillsRef} className = {styles.PageContainer}>
                <Skills />
            </div>

            <div ref = {RefObj.softwareRef} className = {styles.PageContainer}>
                <Projects type = "Software" />
            </div>

            <div ref = {RefObj.engineeringRef} className = {styles.PageContainer}>
                <Projects type = "Engineering" />
            </div>

            <div ref = {RefObj.contactRef} className = {styles.PageContainer}>
                <Contact />
            </div>

            <Footer></Footer>

        </div>
    );
}
