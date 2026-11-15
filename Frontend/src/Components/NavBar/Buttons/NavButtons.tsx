import styles from './NavButtons.module.css';

interface NavButtonProps {
    isActive: boolean;
    title: string;
    callback: () => void;
}

export default function NavButton({ isActive: IsActive, title: Title, callback: Callback }: NavButtonProps) {
    return (
        <button type = "button" className = {`${styles.ButtonContainer} ${IsActive ? styles.Observed : ''}`}
            aria-current = {IsActive ? 'location' : undefined} onClick = {Callback}>
            {Title}
        </button>
    );
}
