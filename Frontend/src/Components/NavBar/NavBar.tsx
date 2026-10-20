import styles from './NavBar.module.css'

interface NavBarProps {
    NavigateHome: () => void;
}

import NavButton from './Buttons/NavButtons';

      
export default function NavBar( { NavigateHome } : NavBarProps) {
    

    const ButtonInformation = [
        {
            Title: "Home",
            Image: "/Assets/Home.svg",
            Link: ""
        },
        {
            Title: "Facebook",
            Image: "/Assets/Facebook.svg",
            Link: "https://www.facebook.com/profile.php?id=61584212274234"
        },
        {
            Title: "Email",
            Image: "/Assets/Gmail.svg",
            Link: "mailto:luiz_terrens@gmail.com"
        },
        {
            Title: "GitHub",
            Image: "/Assets/GitHub.svg",
            Link: "https://github.com/Onnesty"
        },
        {
            Title: "LeetCode",
            Image: "/Assets/LeetCode.svg",
            Link: "https://leetcode.com/u/Onnesty/"
        },
        {
            Title: "LinkedIn",
            Image: "/Assets/LinkedIn.svg",
            Link: "https://www.linkedin.com/in/luiz-morata-6ba892384"
        },
    ]

    const HandleButton = (Type : string, Link : string) => {
        
        if (Type === "Home") {
            NavigateHome();
        } else {

            window.open(Link, '_blank', 'noopener,noreferrer')
        }
    }


    return (
        <div className = {styles.MainContainer}>
            
            { ButtonInformation.map((Item,Index) => (

                <NavButton key = {`${Item.Title}_${Index}`} Item = {Item} CallBack = {() => HandleButton(Item.Title, Item.Link)}  />
            ))}

        </div>
    )
}