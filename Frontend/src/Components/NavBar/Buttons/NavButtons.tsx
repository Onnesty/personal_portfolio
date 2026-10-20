
import { useState } from 'react';
import styles from './NavButtons.module.css'

interface ButtonInformation {
  
    Title: string;
    Image: string;
    Link: string;

}

interface NavButtonProps {

    Item : ButtonInformation,
    CallBack : () => void
}

export default function NavButton( { Item, CallBack } : NavButtonProps ) {
    
    const [IsHover, ToggleHover] = useState(false);


    return (

        <div className = {styles.ButtonContainer}
            onClick = {CallBack} onMouseEnter={()=>ToggleHover(true)} onMouseLeave={()=>ToggleHover(false)}
        >

            <img className = {styles.ButtonImage} src = {Item.Image} alt = {Item.Title}/>

            <div className = {`${styles.ButtonTitle} ${IsHover ? styles.Hover : ""}`} >
                {Item.Title}
            </div>

        </div>

    )
}