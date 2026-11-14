import { useEffect, useState } from 'react';
import type { PageRefStruct } from '../Landing/Landing';
import NavButton from './Buttons/NavButtons';
import styles from './NavBar.module.css';

export default function NavBar({ RefObj }: { RefObj: PageRefStruct }) {
  const [activePage, setActivePage] = useState('Home');
  const { HeroRef, AboutRef, SkillsRef, SoftwareRef, EngineeringRef, ContactRef } = RefObj;
  const links = [
    { title: 'Home', ref: HeroRef }, { title: 'About', ref: AboutRef },
    { title: 'Skills', ref: SkillsRef }, { title: 'Projects', ref: SoftwareRef },
    { title: 'Contact', ref: ContactRef },
  ];

  useEffect(() => {
    const scroller = HeroRef.current?.parentElement;
    if (!scroller) return;
    const sections = [
      { title: 'Home', ref: HeroRef }, { title: 'About', ref: AboutRef },
      { title: 'Skills', ref: SkillsRef }, { title: 'Projects', ref: SoftwareRef },
      { title: 'Projects', ref: EngineeringRef }, { title: 'Contact', ref: ContactRef },
    ];
    let frame = 0;
    const update = () => {
      const marker = scroller.getBoundingClientRect().top + Math.min(scroller.clientHeight * .35, 240);
      let title = 'Home';
      for (const section of sections) {
        if (section.ref.current && section.ref.current.getBoundingClientRect().top <= marker) title = section.title;
      }
      setActivePage(title);
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    update();
    scroller.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      scroller.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [HeroRef, AboutRef, SkillsRef, SoftwareRef, EngineeringRef, ContactRef]);

  return (
    <nav className={styles.MainContainer} aria-label="Main navigation">
      <div className={styles.Links}>
        {links.map(({ title, ref }) => (
          <NavButton key={title} Title={title} IsActive={activePage === title} CallBack={() => {
            ref.current?.scrollIntoView({ block: 'start', behavior:
              window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
          }} />
        ))}
      </div>
    </nav>
  );
}
