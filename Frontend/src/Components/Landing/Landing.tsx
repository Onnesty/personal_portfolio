import styles from "./Landing.module.css"

import NavBar from "../NavBar/NavBar.tsx"
import Hero from "../Hero/Hero.tsx"
import Skills from "../Skills/Skills.tsx"
import Projects from "../Projects/Projects.tsx"
import Contact from "../Contact/Contact.tsx"

import { useRef, useEffect } from "react"


export interface PageRefStruct { // Must be same name as the variables

  HeroRef: React.RefObject<HTMLDivElement | null>,
  SkillsRef: React.RefObject<HTMLDivElement | null>,
  SoftwareRef: React.RefObject<HTMLDivElement | null>,
  EngineeringRef: React.RefObject<HTMLDivElement | null>,
  ContactRef : React.RefObject<HTMLDivElement | null>

}

export default function Landing() {

  
  const RefObj : PageRefStruct = {
      HeroRef : useRef<HTMLDivElement | null>(null),
      SkillsRef : useRef<HTMLDivElement | null>(null),
      SoftwareRef : useRef<HTMLDivElement | null>(null),
      EngineeringRef : useRef<HTMLDivElement | null>(null),
      ContactRef : useRef<HTMLDivElement | null>(null)

  }




  return(

    <div className = {styles.MainContainer}>

      <NavBar RefObj = { RefObj } />
      

      <div ref = {RefObj.HeroRef} className = {styles.PageContainer}>
        <Hero/>
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

      

    </div>
  )
}