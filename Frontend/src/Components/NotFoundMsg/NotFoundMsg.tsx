import styles from "./NotFoundMsg.module.css";
import { Link } from 'react-router';

export default function NotFoundMsg() {

    return (
        <div className = {styles.PageContainer}>
            <div className = {styles.MessageContainer}>
                <div className = {styles.Message}> 404 PAGE NOT FOUND</div>
                <Link to = '/' className = {styles.Link}> GO BACK TO HOME PAGE </Link>
            </div>
        </div>
    );
}
