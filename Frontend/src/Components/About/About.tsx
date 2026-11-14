import styles from './About.module.css'
import { useState } from 'react';


export default function About() {

    const [CurrentIndex, ChangeCurrentIndex] = useState(0);
    const SlideCount = 3;

    const HandleNext = () => {
        ChangeCurrentIndex(Index => (Index + 1) % SlideCount);
    }

    const HandlePrevious = () => {
        ChangeCurrentIndex(Index => (Index - 1 + SlideCount) % SlideCount);
    }


    return (

        <section className = {styles.MainContainer} aria-labelledby = "about-title">

            <div className = {styles.ContentContainer}>

                <div className = {styles.Message}>

                    <h2 id = "about-title" className = {styles.Title}> About me </h2>

                    <div className = {styles.MessageBody}>
                        {/* Your personal message goes here. */}
                    </div>

                </div>

                <section className = {styles.Carousel} aria-roledescription = "carousel" aria-labelledby = "activity-title">

                    <h2 id = "activity-title" className = {styles.Title}> What Ive been up to </h2>

                    <div className = {styles.Viewport}>

                        <div className = {styles.Track} style = {{transform: `translateX(-${CurrentIndex * 100}%)`}}>

                            {Array.from({length: SlideCount}, (_, Index) => (

                                <div className = {styles.Slide} key = {Index}
                                    role = "group" aria-roledescription = "slide"
                                    aria-label = {`${Index + 1} of ${SlideCount}`} aria-hidden = {Index !== CurrentIndex}>

                                    {/* Activity content goes here. */}

                                </div>

                            ))}

                        </div>

                    </div>

                    <div className = {styles.Controls}>

                        <button type = "button" className = {styles.CarouselButton}
                            onClick = {HandlePrevious} aria-label = "Previous activity">
                            <img src = "/Assets/Back.png" className = {styles.CarouselImage} alt = "" />
                        </button>

                        <div className = {styles.Dots}>

                            {Array.from({length: SlideCount}, (_, Index) => (

                                <button type = "button" className = {styles.DotButton} key = {Index}
                                    onClick = {() => ChangeCurrentIndex(Index)}
                                    aria-label = {`Show activity ${Index + 1}`}
                                    aria-current = {CurrentIndex === Index ? 'true' : undefined} />

                            ))}

                        </div>

                        <button type = "button" className = {styles.CarouselButton}
                            onClick = {HandleNext} aria-label = "Next activity">
                            <img src = "/Assets/Next.png" className = {styles.CarouselImage} alt = "" />
                        </button>

                    </div>

                </section>

            </div>

        </section>
    )
}
