import styles from './NavButtons.module.css';

interface NavButtonProps {
  IsActive: boolean;
  Title: string;
  CallBack: () => void;
}

export default function NavButton({ IsActive, Title, CallBack }: NavButtonProps) {
  return (
    <button type="button" className={`${styles.ButtonContainer} ${IsActive ? styles.Observed : ''}`}
      aria-current={IsActive ? 'location' : undefined} onClick={CallBack}>
      {Title}
    </button>
  );
}
