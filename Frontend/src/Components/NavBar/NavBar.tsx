import styles from './NavBar.module.css'

import { type PageRefStruct } from '../Landing/Landing';


import { useEffect, useState } from 'react';



interface ButtonInformation {
  
    Title: string;
    Ref: React.RefObject<HTMLDivElement | null>;

}

interface NavBarProps {
    RefObj: PageRefStruct;
}

import NavButton from './Buttons/NavButtons';


const Scroll = (Ref : React.RefObject<HTMLDivElement | null>) => {

    Ref?.current?.scrollIntoView({
        behavior: "smooth",
        block: 'center'
    })

}

      
export default function NavBar( { RefObj } : NavBarProps) {
    
    const [ActivePage, UpdateActivePage] = useState("");

    const ButtonInformationArray : ButtonInformation[]  = [
        {
            Title: "Home",
            Ref: RefObj.HeroRef,
        },
        {
            Title: "Skills",
            Ref: RefObj.SkillsRef,
        },
        {
            Title: "Projects",
            Ref: RefObj.SoftwareRef,
        },
        {
            Title: "Contact",
            Ref: RefObj.ContactRef,
        },

 
    ]

    useEffect(() => {

        
        const Observer = new IntersectionObserver((Entries) => {
            
            Entries.forEach(Entry => {

                if (Entry.isIntersecting) {


                    const Match = ButtonInformationArray.find( (Item) => 
                        Item.Ref.current === Entry.target
                    )

                    if (Match) {
                        UpdateActivePage(Match.Title);

                        console.log(ActivePage)
                    }

                } 

                
            });
            

        },
        {
            threshold: 0.7
        }
        )

        ButtonInformationArray.forEach(Item => {
            
            if (Item.Ref.current) {
                Observer.observe(Item.Ref.current);
            }
            
        });

        return () => {

            ButtonInformationArray.forEach(Item => {
            
                if (Item.Ref.current) {
                    Observer.unobserve(Item.Ref.current);
                }
                
            });

            
        }
    },[]);


    return (
        <div className = {styles.MainContainer}>
            
            { ButtonInformationArray.map((Item,Index) => (


                <NavButton 
                    key = {`${Item.Title}_${Index}`} IsActive = {ActivePage == Item.Title} 
                    Title = {Item.Title} CallBack = {() => Scroll(Item.Ref)}  
                />

            )
            )
            
            }

        </div>
    )
}