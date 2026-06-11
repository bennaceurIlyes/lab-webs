/* Tag — small category pill label */
import styles from './Tag.module.css';

const colorMap = {
  'Publication': 'green',
  'Événement': 'blue',
  'Séminaire': 'purple',
  'Soutenance': 'orange',
  'Seminar': 'purple',
  'Conference': 'blue',
  'Defense': 'orange',
};

export default function Tag({ label, variant }) {
  const colorClass = variant || colorMap[label] || 'blue';
  return (
    <span className={`${styles.tag} ${styles[colorClass]}`}>
      {label}
    </span>
  );
}
