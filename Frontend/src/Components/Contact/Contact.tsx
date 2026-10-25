import styles from './Contact.module.css'


export default function Contact() {
    
    const Contacts = [
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

    return (

        <div className = {styles.MainContainer}>

            <div className = {styles.ContactContainer}>

                <h2 className = {styles.ContactTitle}> Contact Me </h2>
                
                {Contacts.map((Item,Index) => (

                    <div id = {`${Index}_${Item.Title}`} className = {styles.LinkContainer} 
                    onClick = {() => window.open(Item.Link, '_blank', 'noopener,noreferrer')}>
                        
                        <img src = {Item.Image} className = {styles.LinkImage} alt = {Item.Title} />

                        <div className = {styles.LinkTitle}> {Item.Title} </div>
                    </div>
                ))}

            </div>
            
            <form className = {styles.ContactContainer} action="https://api.web3forms.com/submit" method="POST"  > 
                    
                <input type = "hidden" name = "access_key" value = "559f89f3-c293-4daf-860f-4024d2071d94" />
                
                <h2 className = {styles.ContactTitle}> Contact Me For Commissions </h2>

                <div className = {styles.ContactInputContainer}>
                    
                    Name
                    <input type = "text" name = "Name" className = {styles.ContactInput} 
                    placeholder = "e.g. Jake Pino" required />

                </div>

                <div className = {styles.ContactInputContainer}>
                    
                    Contact Info 
                    <input type = "text" name = "ContactInfo" className = {styles.ContactInput} 
                    placeholder = "e.g. jake.pino@gmail.com" required />

                </div>


                <textarea name="CommissionMessage" className = {styles.TextInput} required ></textarea>

                <button type = "submit" className = {styles.SendButton}> 

                    Send Commission 
                    
                </button>   

            </form>

        </div>
    )
}

/*

*/