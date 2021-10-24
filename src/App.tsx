import styles from "./App.module.scss";
import LoginBox from "./components/LoginBox";

function App() {
	return (
		<main className={styles.contentWrapper}>
			<div className="MessgeList"></div>
			<LoginBox />
		</main>
	);
}

export default App;
