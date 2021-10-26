import { useEffect } from "react";
import { VscGithubInverted } from "react-icons/vsc";
import styles from "./styles.module.scss";

export default function LoginBox() {
	const signInURL = `https://github.com/login/oauth/authorize?scope=user&client_id=${
		import.meta.env.VITE_GITHUB_CLIENT_ID as string
	}&redirect_uri=http://localhost:4000/signin/callback?forward_to=${
		window.location.href
	}`;

	useEffect(() => {
		// const queryString = window.location.search;
		const queryString = new URLSearchParams(window.location.search);
		const githubCode = queryString.get("code");

		if (githubCode) {
			const { origin, pathname } = window.location;
			const cleanedURL = origin + pathname;

			window.history.pushState({}, "", cleanedURL);
		}
	}, []);

	return (
		<div className={styles.loginBoxWrapper}>
			<strong>Entre e compartilhe sua mensagem</strong>
			<a href={signInURL} className={styles.signWithGithub}>
				<VscGithubInverted size="24" />
				Entrar Com o Github
			</a>
		</div>
	);
}
