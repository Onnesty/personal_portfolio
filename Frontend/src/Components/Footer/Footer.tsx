import styles from './Footer.module.css'

export default function Footer() {

    return(

        <div className = {styles.MainContainer}>
            
            <div className = {styles.TextContainer} > 
                Made by <span className = {styles.ColoredText}> Onnesty </span> with <span className = {styles.ColoredText}> React </span>
                <img className = {styles.Image} src = "/Technologies/React.svg" />
            </div>

            <div className = {styles.TextContainer}>
                All Rights Reserved - 2026
            </div>
        </div>
    )
}