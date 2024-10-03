import { useIcon } from '@/hooks';
import styles from './index.module.scss';

type Props = {
    profileImage: string,
    name: string,
    pronounce: string
}

export const MyInfo = ({ profileImage, name, pronounce }: Props) => {
    const SpeekerIcon = useIcon("Volume2");

    return (
        <div className={styles.Info}>
            <img src={profileImage} />
            <div onClick={() => {
                speechSynthesis.speak(Object.assign(new SpeechSynthesisUtterance(name), { lang: 'ko-KR', pitch: 1, rate: 1 }));
            }}>
                <span>{name}</span>
                <p>{pronounce}<SpeekerIcon size={16} className={styles.speekerIcon} /></p>
            </div>
        </div>
    )
}