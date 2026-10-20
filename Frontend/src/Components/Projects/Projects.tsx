import styles from './Projects.module.css';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router';
import { useState, useRef, useEffect } from 'react';

import {SoftwareProjectData, EngineeringProjectData, type ProjectDataStruct}from './ProjectInformation.tsx';


export default function Projects({ Type } : { Type : string }) {
        
    const Data = (Type === "Software") ? SoftwareProjectData() as ProjectDataStruct[] : EngineeringProjectData() as ProjectDataStruct[];

    const Size = Data.length;

    const GoTo = useNavigate();
    
    const { ref : ScrollRef, inView } = useInView({ // For Intersection Observer
    threshold: 0.3,
    })

    const [IsHover, ToggleIsHover] = useState(false);

    const [CurrentIndex, ChangeCurrentIndex ] = useState(0);


    const HandleNext = () => {
        
        const Index : number = (CurrentIndex + 1) % Size;

        ChangeCurrentIndex(Index);
        

    }

    const HandlePrevious = () => {

        const Index : number = (CurrentIndex - 1);

        ChangeCurrentIndex(Index < 0 ? 0 : Index);
        
    }


    




    return (

        <div className = {styles.MainContainer}> 

            <div className = {styles.Fade} style = {{left: 0, background: "linear-gradient(to right, var(--background), transparent)"}}> </div>
            <div className = {styles.Fade} style = {{right: 0, background: "linear-gradient(to left, var(--background), transparent)"}}> </div>

            


            <h1 className = {`${styles.Title} ${inView ? "animate__animated animate__fadeInDown" : "animate__animated animate__fadeOutUp"}`} ref = {ScrollRef}>

                {`My ${Type} Projects`}

            </h1>


            <div className = {`${styles.Track} ${inView ? styles.Show : ""}`} ref = {ScrollRef}>

                <img className = {styles.CarouselButton} style = {{left : "5%"}} src = "/Assets/Back.png" alt = "Previous" onClick = {HandlePrevious}/>

                <img className = {styles.CarouselButton} style = {{right : "5%"}} src = "/Assets/Next.png" alt = "Next" onClick = {HandleNext}/>

                {Data.map((Item, Index) => (
                    
                    <div className = {styles.ContentContainer} style = {{transform : `translateX(-${100 * CurrentIndex}%)`}}>

                        <div className = {styles.CardContainer} key = {`${Item.ID}_${Index}`} 
                            onPointerEnter = {() => {ToggleIsHover(true)}} onPointerLeave = {() => {ToggleIsHover(false)}}
                            onClick = {() => {window.open(Item.Link, '_blank', 'noopener,noreferrer')}}
                        >
                            
                            <div className = {styles.InformationContainer}>

                                <img className = {styles.ProjectImage} src = {Item.ProjectImage} alt = {Item.ProjectImage}/> 

                            </div>

                            <div className = {styles.InformationContainer}>

                                <h3 className = {styles.ProjectTitle}> {Item.Title} </h3>
                                
                                <div className = {styles.TechnologiesContainer}>

                                    {Item.Technologies.map((TechItem, TechIndex) => (

                                        <div className = {styles.Technology} key = {`${Item.ID}_${Index}_${TechIndex}`}> 
                                            <img className = {styles.TechnologyImage} src = {TechItem.Image} alt = {TechItem.Name} />
                                            <h4 className = {styles.TechnologyName}> {TechItem.Name} </h4>
                                        </div>

                                    ))}

                                </div>
                                
                                <h4 className = {styles.ProjectDecription}>

                                    {Item.Description}

                                </h4>

               
                                

                            </div>
                            
                            <div className = {`${styles.LinkButton} ${IsHover ? styles.Show : ""}`} > 
                                
                                <img className = {styles.LinkImage} src = {`/Assets/${Type === "Software" ? "GitHub": "Documentation"}.svg`} alt = "Link" />
                                
                                <h6 className = {styles.LinkMessage}>
                                    { Type === "Software" ? "Visit on GitHub": "View Documentation"}
                                </h6>

                            </div>

                            

                        </div>
                    </div>

                ))}
            

            </div>

            

        </div>
    )
}