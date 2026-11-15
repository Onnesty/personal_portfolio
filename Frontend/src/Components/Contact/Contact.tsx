import styles from './Contact.module.css';
import { useState, type FormEvent } from 'react';
import { useTheme } from '../../theme';

export default function Contact() {

    const CurrentTheme = useTheme();
    const [Submitting, SetSubmitting] = useState(false);
    const [SubmissionMessage, SetSubmissionMessage] = useState('');

    async function SubmitCommission(Event: FormEvent<HTMLFormElement>) {
        Event.preventDefault();
        if (Submitting) return;

        const Form = Event.currentTarget;
        const Data = new FormData(Form);
        SetSubmitting(true);
        SetSubmissionMessage('');

        try {
            const Response = await fetch(Form.action, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                body: JSON.stringify(Object.fromEntries(Data)),
            });
            const Result = await Response.json();

            if (Response.ok && Result.success === true) {
                Form.reset();
                SetSubmissionMessage('Your commission request was sent successfully.');
            } else {
                SetSubmissionMessage('Unable to send your request. Please try again.');
            }
        } catch {
            SetSubmissionMessage('Unable to send your request. Check your connection and try again.');
        } finally {
            SetSubmitting(false);
        }
    }

    const Contacts = [
        {
            title: "Facebook",
            image: "/Assets/Facebook.svg",
            link: "https://www.facebook.com/profile.php?id=61584212274234"
        },
        {
            title: "Email",
            image: "/Assets/Gmail.svg",
            link: "mailto:luiz_terrens@gmail.com"
        },
        {
            title: "GitHub",
            image: CurrentTheme === 'light' ? "/Assets/GitHubLight.svg" : "/Assets/GitHub.svg",
            link: "https://github.com/Onnesty"
        },
        {
            title: "LeetCode",
            image: CurrentTheme === 'light' ? "/Assets/LeetCodeLight.svg" : "/Assets/LeetCode.svg",
            link: "https://leetcode.com/u/Onnesty/"
        },
        {
            title: "LinkedIn",
            image: "/Assets/LinkedIn.svg",
            link: "https://www.linkedin.com/in/luiz-morata-6ba892384"
        },

    ];

    return (

        <div className = {styles.MainContainer}>

            <div className = {styles.ContactContainer}>

                <h2 className = {styles.ContactTitle}> Contact Me </h2>

                {Contacts.map((Item, Index) => (

                    <div id = {`${Index}_${Item.title}`} className = {styles.LinkContainer}
                        onClick = {() => window.open(Item.link, '_blank', 'noopener,noreferrer')}>

                        <img src = {Item.image} className = {styles.LinkImage} alt = {Item.title} />

                        <div className = {styles.LinkTitle}> {Item.title} </div>
                    </div>
                ))}

            </div>

            <form className = {styles.ContactContainer} action = "https://api.web3forms.com/submit" method = "POST" onSubmit = {SubmitCommission} aria-busy = {Submitting} >

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

                <textarea name = "CommissionMessage" className = {styles.TextInput} required ></textarea>

                <button type = "submit" className = {styles.SendButton} disabled = {Submitting}>

                    {Submitting ? 'Sending…' : 'Send Commission'}

                </button>

                <p role = "status">{SubmissionMessage}</p>

            </form>

        </div>
    );
}

/*

*/
