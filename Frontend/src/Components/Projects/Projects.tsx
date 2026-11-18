import Carousel from './Carousel';
import styles from './Projects.module.css';
import { useTheme } from '../../theme';
import { useInView } from 'react-intersection-observer';
import { useState } from 'react';

import { SoftwareProjectData, EngineeringProjectData, type ProjectDataStruct } from './ProjectInformation.tsx';

export default function Projects({ type: Type }: { type: string; }) {

    const CurrentTheme = useTheme();

    const Data = (Type === "Software") ? SoftwareProjectData() as ProjectDataStruct[] : EngineeringProjectData() as ProjectDataStruct[];

    const { ref: ScrollRef, inView: InView } = useInView({ // For Intersection Observer
        threshold: 0.3,
    });

    const [IsHover, ToggleIsHover] = useState(false);

    return (

        <div className = {styles.MainContainer} ref = {ScrollRef}>

            <h1 className = {`${styles.Title} ${InView ? "animate__animated animate__fadeInDown" : "animate__animated animate__fadeOutUp"}`}>

                {`My ${Type} Projects`}

            </h1>

            <Carousel inView={InView} itemLabel="project" slides={Data.map(Item => ({
                key: Item.id,
                content: (
                    <div className = {styles.CardContainer}
                        onPointerEnter = {() => { ToggleIsHover(true); }} onPointerLeave = {() => { ToggleIsHover(false); }}
                        onClick = {() => { window.open(Item.link, '_blank', 'noopener,noreferrer'); }}
                    >

                        <img className = {styles.ProjectImage} src = {Item.projectImage} alt = {Item.title} />

                        <div className = {styles.InformationContainer}>

                            <h3 className = {styles.ProjectTitle}> {Item.title} </h3>

                            <div className = {styles.TechnologiesContainer}>

                                <div className = {styles.TechnologyTrack}>

                                    {Item.technologies.map((TechItem, TechIndex) => (

                                        <div className = {styles.Technology} key = {`${Item.id}_${TechIndex}`}>
                                            <img className = {styles.TechnologyImage} src = {TechItem.Image} alt = {TechItem.Name} />
                                            <h4 className = {styles.TechnologyName}> {TechItem.Name} </h4>
                                        </div>

                                    ))}

                                </div>

                            </div>

                            <p className = {styles.ProjectDecription}>

                                {Item.description}

                            </p>

                        </div>

                        <div className = {`${styles.LinkButton} ${IsHover ? styles.Show : ""}`} >

                            <img className = {styles.LinkImage} src = {CurrentTheme === 'light' ? "/Assets/GitHubLight.svg" : "/Assets/GitHub.svg"} alt = "GitHub" />

                            <h6 className = {styles.LinkMessage}>
                                Visit on GitHub
                            </h6>

                        </div>

                    </div>
                ),
            }))} />

        </div>
    );
}
