import styles from '@/styles/NavBar.module.css';

function Nav() {
  return (
    <nav className={styles.navBar}>
      <div className={styles.links}>
        <p>Home</p>
        <p>Issues</p>
      </div>
      <p>User</p>
    </nav>
  );
}

export default Nav;
