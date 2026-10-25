

import styles from './NavButtons.module.css'



interface NavButtonProps {
    
    IsActive: boolean,
    Title : string,
    CallBack : () => void
}

export default function NavButton( { IsActive, Title, CallBack } : NavButtonProps ) {
    

    return (

        <div className = {`${styles.ButtonContainer} ${IsActive ? styles.Observed : ""}`} onClick = {CallBack}>

            <div className = {styles.ButtonTitle} >
                {Title}
            </div>

        </div>

    )
}