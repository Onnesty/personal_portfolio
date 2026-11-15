import styles from './About.module.css';
import { useTheme } from '../../theme';
import { useState } from 'react';
import { useInView } from 'react-intersection-observer';

import { Events } from './Events';

export default function About() {

    const CurrentTheme = useTheme();

    const { ref: ScrollRef, inView: InView } = useInView({ threshold: 0.1 });
    const { ref: CarouselRef, inView: CarouselInView } = useInView({ threshold: 0.3 });
    const TitleAnimation = InView ? 'animate__animated animate__fadeInDown' : 'animate__animated animate__fadeOutUp';

    const [CurrentIndex, ChangeCurrentIndex] = useState(0);
    
    const EventsObj = Events();

    const SlideCount = EventsObj.length;

    const HandleNext = () => {
        if (SlideCount < 2) return;
        ChangeCurrentIndex(Index => (Index + 1) % SlideCount);
    };

    const HandlePrevious = () => {
        if (SlideCount < 2) return;
        ChangeCurrentIndex(Index => (Index - 1 + SlideCount) % SlideCount);
    };

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

                    <div className = {`${styles.Viewport} ${CarouselInView ? styles.Show : ''}`}>

                        <div className = {styles.Track} style = {{ transform: `translateX(-${CurrentIndex * 100}%)` }}>

                            {EventsObj.map((Item, Index) => (

                                <figure
                                    className = {styles.Slide}
                                    key = {Item.Name}
                                    aria-roledescription = "slide"
                                    aria-label = {`${Index + 1} of ${SlideCount}`}
                                    aria-hidden = {Index !== CurrentIndex}
                                >
                                    <img className = {styles.SlideImage} src = {Item.Img} alt = {Item.ImgAlt} />

                                    <figcaption className = {styles.SlideTitle}>
                                        {Item.Name}
                                    </figcaption>
                                </figure>

                            ))}

                        </div>

                    </div>

                    <div className = {`${styles.Controls} ${styles.AnimatedContent} ${CarouselInView ? styles.Show : ''}`}>

                        <button type = "button" className = {styles.CarouselButton}
                            onClick = {HandlePrevious} aria-label = "Previous activity">
                            <img src = {CurrentTheme === 'light' ? "/Assets/BackLight.png" : "/Assets/Back.png"} className = {styles.CarouselImage} alt = "" />
                        </button>

                        <div className = {styles.Dots}>

                            {Array.from({ length: SlideCount }, (_, Index) => (

                                <button type = "button" className = {styles.DotButton} key = {Index}
                                    onClick = {() => ChangeCurrentIndex(Index)}
                                    aria-label = {`Show activity ${Index + 1}`}
                                    aria-current = {CurrentIndex === Index ? 'true' : undefined} />

                            ))}

                        </div>

                        <button type = "button" className = {styles.CarouselButton}
                            onClick = {HandleNext} aria-label = "Next activity">
                            <img src = {CurrentTheme === 'light' ? "/Assets/NextLight.png" : "/Assets/Next.png"} className = {styles.CarouselImage} alt = "" />
                        </button>

                    </div>

                </section>

            </div>

        </section>
    );
}
