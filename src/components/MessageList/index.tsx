import styles from "./styles.module.scss";

import logoImg from "../../assets/logo.svg";

export default function MessageList() {
	return (
		<div className={styles.MessageListWrapper}>
			<img src={logoImg} alt="DoWhile 2021" />
			<ul className={styles.messageList}>
				{[1, 2, 3].map((item) => (
					<li className={styles.message}>
						<p className={styles.messageContent}>
							Lorem ipsum, dolor sit amet consectetur adipisicing elit.
						</p>
						<div className={styles.messageUser}>
							<div className={styles.userImage}>
								<img
									src="https://github.com/jonatasAmaral.png"
									alt="Jonatas Amaral"
								/>
							</div>
							<span>Jonatas Amaral</span>
						</div>
					</li>
				))}
			</ul>
		</div>
	);
}
