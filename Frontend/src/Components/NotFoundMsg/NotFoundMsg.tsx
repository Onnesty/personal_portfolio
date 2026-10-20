import style from "./NotFoundMsg.module.css";
import { Link } from 'react-router'

export default function NotFoundMsg() {
    
    return (
        <div className = {style.PageContainer}> 
            <div className = {style.MessageContainer}>
                <div className = {style.Message}> 404 PAGE NOT FOUND</div>
                <Link to='/'className = {style.Link}> GO BACK TO HOME PAGE </Link>
            </div>
        </div>
    )
}