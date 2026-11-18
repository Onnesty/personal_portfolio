import { useState, type ReactNode } from 'react';
import { useTheme } from '../../theme';
import styles from './Projects.module.css';

interface CarouselProps {
    slides: { key: string | number; content: ReactNode }[];
    inView: boolean;
    itemLabel: string;
    controlsBelow?: boolean;
}

export default function Carousel({ slides, inView, itemLabel, controlsBelow = false }: CarouselProps) {
    const theme = useTheme();
    const [currentIndex, setCurrentIndex] = useState(0);
    const iconSuffix = theme === 'light' ? 'Light' : '';

    const controls = slides.length > 1 && (
        <>
            <button
                type="button"
                className={styles.CarouselButton}
                style={{ left: '5%' }}
                aria-label={`Previous ${itemLabel}`}
                onClick={() => setCurrentIndex(index => Math.max(0, index - 1))}
            >
                <img src={`/Assets/Back${iconSuffix}.png`} alt="" />
            </button>
            <button
                type="button"
                className={styles.CarouselButton}
                style={{ right: '5%' }}
                aria-label={`Next ${itemLabel}`}
                onClick={() => setCurrentIndex(index => (index + 1) % slides.length)}
            >
                <img src={`/Assets/Next${iconSuffix}.png`} alt="" />
            </button>
        </>
    );

    return (
        <>
            <div className={`${styles.Track} ${inView ? styles.Show : ''} ${controlsBelow ? styles.SpacedTrack : ''}`}>
                {slides.map(({ key, content }, index) => (
                    <div
                        key={key}
                        className={styles.ContentContainer}
                        style={{ transform: `translateX(-${100 * currentIndex}%)` }}
                        role="group"
                        aria-roledescription="slide"
                        aria-label={`${index + 1} of ${slides.length}`}
                        aria-hidden={index !== currentIndex}
                    >
                        {content}
                    </div>
                ))}
                {!controlsBelow && controls}
            </div>
            {controlsBelow && controls && (
                <div className={styles.ControlsBelow}>{controls}</div>
            )}
        </>
    );
}
