import { useContext, FormEvent } from "react";
import { VscGithubInverted, VscSignOut } from "react-icons/vsc";
import { AuthContext } from "../../contexts/auth";
import { api } from "../../services/api";
import styles from "./styles.module.scss";

export function SendMessageForm() {
	const { user, signOut } = useContext(AuthContext);

	async function SendMessage(event: FormEvent) {
		event.preventDefault();

		const form = event.target as HTMLFormElement;
		const message = form.message.value.trim();

		if (!message.trim()) return;

		await api.post("messages", { message });
		form.message.value = "";

		history.pushState(null, "", "");
	}

	return (
		<div className={styles.sendMessageFormWrapper}>
			<button className={styles.signOutButton} onClick={signOut}>
				<VscSignOut size="32" />
			</button>

			<header className={styles.userInformation}>
				<div className={styles.userImage}>
					<img src={user?.avatar_url} alt={user?.name} />
				</div>

				<strong className={styles.userName}>{user?.name}</strong>
				<span className={styles.userGithub}>
					<VscGithubInverted size="16" />
					{user?.login}
				</span>
			</header>

			<form onSubmit={SendMessage} action="" className={styles.sendMessageForm}>
				<label htmlFor="message">Mensagem</label>
				<textarea
					name="message"
					id="message"
					placeholder="Qual sua espectativa para o evento?"
				/>
				<button type="submit">Enviar mensagem</button>
			</form>
		</div>
	);
}
