import styles from './Hero.module.css'
import 'animate.css';



export default function Hero() {

    return (


        <div className = {styles.MainContainer}>

            <div className = {styles.ContentContainer}>

                <div className = {styles.TextArea}>
                    
                    <h1 className = {`${styles.Introduction} animate__animated animate__fadeInUp`}> Hello. My name is <span style ={{ color: "var(--sky)" }}> Luiz </span> </h1>
                    
                    <h5 className = {`${styles.SubIntroduction} animate__animated animate__fadeInUp animate__delay-1s`}> But you might also know me as  <span className ={styles.SubIntroductionName}> Onnesty </span> </h5>
                    
                    <p className = {`${styles.Explanation} animate__animated animate__fadeIn animate__delay-2s`}>
                        
                        I am a student of Western Leyte College of Ormoc, currently studying to be a 
                        Computer Engineer. It is my hobby to create software and hardware solutions for everyday problems
                        and inconveniences. This portfolio shows what I have accomplished throughout my journey in the 
                        tech world.

                    </p>
                </div>


                <img className = {`${styles.ProfileImage} animate__animated animate__zoomIn`} src = "/Assets/Persona.png"></img>

                

                
            </div>

        </div>
    )
}