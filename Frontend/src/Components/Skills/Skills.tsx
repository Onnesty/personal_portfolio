import styles from "./Skills.module.css"
import { useInView } from 'react-intersection-observer';
import { useState } from "react";


export default function Skills() {

    const { ref : ScrollRef, inView } = useInView({ // For Intersection Observer
        threshold: 0.1,
    })

    

    const [AllowTrackRun, ToggleTrackRun] = useState(true);

    const Cards = [

        {id : 1, title: "Python", img: "/Technologies/Python.svg"},
        {id : 2, title: "C", img: "/Technologies/C.svg"},
        {id : 2, title: "C++", img: "/Technologies/CPP.svg"},
        {id : 3, title: "Java", img: "/Technologies/Java.svg"},
        {id : 4, title: "JavaScript", img: "/Technologies/Javascript.svg"},
        {id : 5, title: "HTML", img: "/Technologies/HTML.svg"},
        {id : 6, title: "CSS", img: "/Technologies/CSS.svg"},
        {id : 7, title: "React", img: "/Technologies/React.svg"},
        {id : 14, title: "TypeScript", img: "/Technologies/TypeScript.svg"},
        {id : 8, title: "MongoDB", img: "/Technologies/MongoDB.svg"},
        {id : 9, title: "Flutter", img: "/Technologies/Flutter.svg"},
        {id : 10, title: "Fusion360", img: "/Technologies/Fusion.svg"},
        {id : 11, title: "AutoCad2021", img: "/Technologies/AutoCad.svg"},
        {id : 12, title: "EasyEDA", img: "/Technologies/EasyEDA.svg"},
        {id : 13, title: "ArduinoIDE", img: "/Technologies/ArduinoIDE.svg"},

    ]

    const Items = [...Cards, ...Cards];


    return (

        <div className = {styles.MainContainer}  ref = {ScrollRef}>

            <div className = {styles.Fade} style = {{ left: 0, background: "linear-gradient(to right, var(--background), transparent)"}}> </div>
            <div className = {styles.Fade} style = {{ right: 0, background: "linear-gradient(to left, var(--background), transparent)"}}> </div>

            <h1 className = {`${styles.Title} ${inView ?  "animate__animated animate__fadeInDown" : "animate__animated animate__fadeOutUp"}`} >
                
                Technologies I've Learned

            </h1>

            <div className = {`${styles.SkillsContainer} ${inView ? styles.Show : ""}`}>

    


                <div className = {`${styles.Track} ${AllowTrackRun ? styles.Play : ""} `} >

                    {Items.map((Item, Index) => (

                        <h3 className = {styles.CardContainer} key = {`${Item.id}_${Index}`} 
                            onPointerDown={() => {ToggleTrackRun(false)}}
                            onPointerUp={() => {ToggleTrackRun(true)}}
                            onPointerCancel={() => {ToggleTrackRun(true)}}
                        >

                            <img src = {Item.img} className = {styles.CardImage} alt = {Item.title}></img>

                            <div className = {styles.CardName}> {Item.title} </div>

                        </h3>

                    ))}

                </div>

                
            </div>



        </div>
    )
}