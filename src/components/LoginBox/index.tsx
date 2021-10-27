import { useEffect } from "react";
import { VscGithubInverted } from "react-icons/vsc";
import { api } from "../../services/api";
import styles from "./styles.module.scss";

type AuthResponse = {
	token: string;
	user: {
		id: string;
		name: string;
		avatar_url: string;
		login: string;
	};
};

export default function LoginBox() {
	const signInURL = `https://github.com/login/oauth/authorize?scope=user&client_id=${
		import.meta.env.VITE_GITHUB_CLIENT_ID as string
	}&redirect_uri=http://localhost:4000/signin/callback?forward_to=${
		window.location.href
	}`;

	async function signIn(githubCode: string) {
		const response = await api.post<AuthResponse>("authenticate", {
			code: githubCode,
		});

		const { token, user } = response.data;

		localStorage.setItem("@dowhile:token", token);
		console.log(user);
	}

	useEffect(() => {
		// const queryString = window.location.search;
		const queryString = new URLSearchParams(window.location.search);
		const githubCode = queryString.get("code");

		if (githubCode) {
			const { origin, pathname } = window.location;
			const cleanedURL = origin + pathname;

			window.history.pushState({}, "", cleanedURL);

			signIn(githubCode);
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
