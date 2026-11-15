import styles from './Projects.module.css';
import { useTheme } from '../../theme';
import { useInView } from 'react-intersection-observer';
import { useState } from 'react';

import { SoftwareProjectData, EngineeringProjectData, type ProjectDataStruct } from './ProjectInformation.tsx';

export default function Projects({ type: Type }: { type: string; }) {

    const CurrentTheme = useTheme();

    const Data = (Type === "Software") ? SoftwareProjectData() as ProjectDataStruct[] : EngineeringProjectData() as ProjectDataStruct[];

    const Size = Data.length;

    const { ref: ScrollRef, inView: InView } = useInView({ // For Intersection Observer
        threshold: 0.3,
    });

    const [IsHover, ToggleIsHover] = useState(false);

    const [CurrentIndex, ChangeCurrentIndex] = useState(0);

    const HandleNext = () => {

        const Index: number = (CurrentIndex + 1) % Size;

        ChangeCurrentIndex(Index);

    };

    const HandlePrevious = () => {

        const Index: number = (CurrentIndex - 1);

        ChangeCurrentIndex(Index < 0 ? 0 : Index);

    };

    return (

        <div className = {styles.MainContainer} ref = {ScrollRef}>

            <h1 className = {`${styles.Title} ${InView ? "animate__animated animate__fadeInDown" : "animate__animated animate__fadeOutUp"}`}>

                {`My ${Type} Projects`}

            </h1>

            <div className = {`${styles.Track} ${InView ? styles.Show : ""}`} >

                {Data.map((Item, Index) => (

                    <div key = {Item.id} className = {styles.ContentContainer} style = {{ transform: `translateX(-${100 * CurrentIndex}%)` }}>

                        <div className = {styles.CardContainer} key = {`${Item.id}_${Index}`}
                            onPointerEnter = {() => { ToggleIsHover(true); }} onPointerLeave = {() => { ToggleIsHover(false); }}
                            onClick = {() => { window.open(Item.link, '_blank', 'noopener,noreferrer'); }}
                        >

                            <img className = {styles.ProjectImage} src = {Item.projectImage} alt = {Item.title} />

                            <div className = {styles.InformationContainer}>

                                <h3 className = {styles.ProjectTitle}> {Item.title} </h3>

                                <div className = {styles.TechnologiesContainer}>

                                    <div className = {styles.TechnologyTrack}>

                                        {Item.technologies.map((TechItem, TechIndex) => (

                                            <div className = {styles.Technology} key = {`${Item.id}_${Index}_${TechIndex}`}>
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

                                <img className = {styles.LinkImage} src = {`/Assets/${Type === "Software" ? (CurrentTheme === 'light' ? "GitHubLight" : "GitHub") : "Documentation"}.svg`} alt = "Link" />

                                <h6 className = {styles.LinkMessage}>
                                    {Type === "Software" ? "Visit on GitHub" : "View Documentation"}
                                </h6>

                            </div>

                        </div>
                    </div>

                ))}

                <img className = {styles.CarouselButton} style = {{ left: "5%" }} src = {CurrentTheme === 'light' ? "/Assets/BackLight.png" : "/Assets/Back.png"} alt = "Previous" onClick = {HandlePrevious} />

                <img className = {styles.CarouselButton} style = {{ right: "5%" }} src = {CurrentTheme === 'light' ? "/Assets/NextLight.png" : "/Assets/Next.png"} alt = "Next" onClick = {HandleNext} />

            </div>

        </div>
    );
}
