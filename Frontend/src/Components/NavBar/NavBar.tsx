import { useEffect, useState } from 'react';
import type { PageRefStruct } from '../Landing/Landing';
import NavButton from './Buttons/NavButtons';
import styles from './NavBar.module.css';
import { GetTheme, SaveTheme, type Theme } from '../../theme';

export default function NavBar({ refObj: RefObj }: { refObj: PageRefStruct; }) {
    const [ActivePage, SetActivePage] = useState('Home');
    const [CurrentTheme, SetCurrentTheme] = useState<Theme>(GetTheme);
    const NextTheme = CurrentTheme === 'dark' ? 'light' : 'dark';

    const ToggleTheme = () => {
        SaveTheme(NextTheme);
        SetCurrentTheme(NextTheme);
    };
    const { heroRef: HeroRef, aboutRef: AboutRef, skillsRef: SkillsRef, softwareRef: SoftwareRef, engineeringRef: EngineeringRef, contactRef: ContactRef } = RefObj;
    const Links = [
        { title: 'Home', ref: HeroRef }, { title: 'About', ref: AboutRef },
        { title: 'Skills', ref: SkillsRef }, { title: 'Projects', ref: SoftwareRef },
        { title: 'Contact', ref: ContactRef },
    ];

    useEffect(() => {
        const Scroller = HeroRef.current?.parentElement;
        if (!Scroller) return;
        const Sections = [
            { title: 'Home', ref: HeroRef }, { title: 'About', ref: AboutRef },
            { title: 'Skills', ref: SkillsRef }, { title: 'Projects', ref: SoftwareRef },
            { title: 'Projects', ref: EngineeringRef }, { title: 'Contact', ref: ContactRef },
        ];
        let Frame = 0;
        const Update = () => {
            const Marker = Scroller.getBoundingClientRect().top + Math.min(Scroller.clientHeight * .35, 240);
            let Title = 'Home';
            for (const Section of Sections) {
                if (Section.ref.current && Section.ref.current.getBoundingClientRect().top <= Marker) Title = Section.title;
            }
            SetActivePage(Title);
        };
        const OnScroll = () => {
            cancelAnimationFrame(Frame);
            Frame = requestAnimationFrame(Update);
        };
        Update();
        Scroller.addEventListener('scroll', OnScroll, { passive: true });
        window.addEventListener('resize', OnScroll);
        return () => {
            cancelAnimationFrame(Frame);
            Scroller.removeEventListener('scroll', OnScroll);
            window.removeEventListener('resize', OnScroll);
        };
    }, [HeroRef, AboutRef, SkillsRef, SoftwareRef, EngineeringRef, ContactRef]);

    return (
        <nav className = {styles.MainContainer} aria-label = "Main navigation">
            <div className = {styles.Links}>
                {Links.map(({ title: Title, ref: Ref }) => (
                    <NavButton key = {Title} title = {Title} isActive = {ActivePage === Title} callback = {() => {
                        Ref.current?.scrollIntoView({
                            block: 'start', behavior:
                                window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'
                        });
                    }} />
                ))}
            </div>
            <button
                type = "button"
                className = {styles.ThemeButton}
                onClick = {ToggleTheme}
                aria-label = {`Switch to ${NextTheme} mode`}
                title = {`Switch to ${NextTheme} mode`}
            >
                <svg viewBox = "0 0 24 24" width = "18" height = "18" fill = "none"
                    stroke = "currentColor" strokeWidth = "1.8" strokeLinecap = "round" strokeLinejoin = "round" aria-hidden = "true">
                    {CurrentTheme === 'dark' ? (
                        <>
                            <circle cx = "12" cy = "12" r = "4" />
                            <path d = "M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" />
                        </>
                    ) : (
                        <path d = "M20.5 13A8.5 8.5 0 0 1 11 3.5 8.5 8.5 0 1 0 20.5 13Z" />
                    )}
                </svg>
            </button>
        </nav>
    );
}
