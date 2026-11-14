import styles from "./Landing.module.css"

import NavBar from "../NavBar/NavBar.tsx"
import About from "../About/About.tsx"
import Hero from "../Hero/Hero.tsx"
import Skills from "../Skills/Skills.tsx"
import Projects from "../Projects/Projects.tsx"
import Contact from "../Contact/Contact.tsx"
import Footer from "../Footer/Footer.tsx"

import { useRef, type CSSProperties } from "react"

// Generate once, outside render, so the sky does not jump on re-renders.
const stars = Array.from({ length: 110 }, () => {
  const size = .8 + Math.random() * 2.2;
  return {
    left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`,
    width: `${size}px`, height: `${size}px`,
    "--twinkle-duration": `${4 + Math.random() * 7}s`,
    "--twinkle-delay": `${-Math.random() * 20}s`,
    "--drift-x": `${(Math.random() - .5) * 18}px`,
    "--drift-y": `${(Math.random() - .5) * 18}px`,
  } as CSSProperties;
})

export interface PageRefStruct { // Must be same name as the variables

  AboutRef: React.RefObject<HTMLDivElement | null>,
  HeroRef: React.RefObject<HTMLDivElement | null>,
  SkillsRef: React.RefObject<HTMLDivElement | null>,
  SoftwareRef: React.RefObject<HTMLDivElement | null>,
  EngineeringRef: React.RefObject<HTMLDivElement | null>,
  ContactRef : React.RefObject<HTMLDivElement | null>

}

export default function Landing() {

  
  const RefObj : PageRefStruct = {
      AboutRef : useRef<HTMLDivElement | null>(null),
      HeroRef : useRef<HTMLDivElement | null>(null),
      SkillsRef : useRef<HTMLDivElement | null>(null),
      SoftwareRef : useRef<HTMLDivElement | null>(null),
      EngineeringRef : useRef<HTMLDivElement | null>(null),
      ContactRef : useRef<HTMLDivElement | null>(null)

  }




  return(

    <div className = {styles.MainContainer}>

      <div className={styles.SpaceBackground} aria-hidden="true">
        <div className={styles.Nebula} />
        <div className={styles.Nebula} />
        <div className={styles.Nebula} />
        <span className={styles.Comet} />
        <span className={styles.Comet} />
        <div className = {styles.Pulsar} />
        {stars.map((style, index) => (
          <span key={index} className={styles.Star} style={style} />
        ))}
      </div>

      <NavBar RefObj = { RefObj } />
      

      <div ref = {RefObj.HeroRef} className = {styles.PageContainer}>
        <Hero/>
      </div>
      
      <div ref={RefObj.AboutRef} className={styles.PageContainer}>
        <About />
      </div>

      <div ref = {RefObj.SkillsRef} className = {styles.PageContainer}>
        <Skills/>
      </div>

      <div ref = {RefObj.SoftwareRef} className = {styles.PageContainer}>
        <Projects Type = "Software" />
      </div>

      <div ref = {RefObj.EngineeringRef} className = {styles.PageContainer}>
        <Projects Type = "Engineering" />
      </div>

      <div ref = {RefObj.ContactRef} className = {styles.PageContainer}>
        <Contact/>
      </div>

      <Footer></Footer>

      

    </div>
  )
}