import styles from './About.module.css';
import Carousel from '../Projects/Carousel';
import projectStyles from '../Projects/Projects.module.css';
import { useInView } from 'react-intersection-observer';

import { Events } from './Events';

export default function About() {

    const { ref: ScrollRef, inView: InView } = useInView({ threshold: 0.1 });
    const { ref: CarouselRef, inView: CarouselInView } = useInView({ threshold: 0.3 });
    const TitleAnimation = InView ? 'animate__animated animate__fadeInDown' : 'animate__animated animate__fadeOutUp';

    return (

        <section className = {styles.MainContainer} ref = {ScrollRef} aria-labelledby = "about-title">

            <div className = {styles.ContentContainer}>

                <div className = {styles.Message}>

                    <h2 id = "about-title" className = {`${styles.Title} ${TitleAnimation}`}> About me </h2>

                    <div className = {`${styles.MessageBody} ${styles.AnimatedContent} ${InView ? styles.Show : ''}`}>
                        Hi I'm Luiz. I'm from Ormoc City, Philippines. I'm really interested about electronics and engineering 
                        as well as programming. I mainly do projects for fun and for solving my own problems. I mainly prefer programming 
                        languages like C++ since it can be used to create fast programs and used for microcontroller programming for Arduinos and ESPs.
                        <br/><br/>
                        I got into software and electronics engineering through the videos I would watch in Youtube. Channels like Michael Reeves, William Osman,
                        I did a thing, Current Concept, and others, have inspired me to create things that are helpful, interesting, or just plain ridiculous. To be honest, 
                        I never really wanted to go into software development, especially creating websites, but since this can be used to showcase and improve my projects,
                        I eventually gave in. 
                    
                    </div>

                </div>

                <section className = {styles.Carousel} ref = {CarouselRef} aria-roledescription = "carousel" aria-labelledby = "activity-title">

                    <h2 id = "activity-title" className = {`${styles.Title} ${TitleAnimation}`}> What I've been up to </h2>

                    <Carousel inView={CarouselInView} itemLabel="activity" controlsBelow slides={Events().map(event => ({
                        key: event.Name,
                        content: (
                            <figure className={`${projectStyles.CardContainer} ${styles.ActivityCard}`} onClick = {() => window.open(event.Link)}>
                                <img className={`${projectStyles.ProjectImage} ${styles.ActivityImage}`} src={event.Img} alt={event.ImgAlt} />
                                <figcaption className={`${projectStyles.ProjectTitle} ${styles.ActivityCaption}`}>{event.Name}</figcaption>
                            </figure>
                        ),
                    }))} />

                </section>

            </div>

        </section>
    );
}
