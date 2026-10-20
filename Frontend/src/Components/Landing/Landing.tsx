import styles from "./Landing.module.css"

import NavBar from "../NavBar/NavBar.tsx"
import Hero from "../Hero/Hero.tsx"
import Skills from "../Skills/Skills.tsx"
import Projects from "../Projects/Projects.tsx"


export default function Landing() {


  const NavitageHome = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }
  
  return(

    <div className = {styles.MainContainer}>

      <NavBar NavigateHome = {NavitageHome} />
      
      <Hero/>

      <Skills/>

      <Projects Type = "Software" />

      <Projects Type = "Engineering" />

    </div>
  )
}