import { createContext, ReactNode, useEffect, useState } from "react";
import { api } from "../services/api";

type User = {
	id: string;
	name: string;
	avatar_url: string;
	login: string;
};
type AuthContextData = {
	user: User | null;
	signInUrl: string;
};

type AuthResponse = {
	token: string;
	user: User;
};

export const AuthContext = createContext({} as AuthContextData);

type AuthProvider = {
	children: ReactNode;
};

export function AuthProvider({ children }: AuthProvider) {
	const [user, setUser] = useState<User | null>(null);

	const signInUrl = `https://github.com/login/oauth/authorize?scope=user&client_id=${
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
		setUser(user);
	}

	useEffect(() => {
		const token = localStorage.getItem("@dowhile:token");

		if (token) {
			api.defaults.headers.common.authorization = `Bearer ${token}`;

			api.get<User>("profile").then((response) => {
				setUser(response.data);
			});
		}
	}, []);
	useEffect(() => {
		// const queryString = window.location.search;
		const queryString = new URLSearchParams(window.location.search);
		const githubCode = queryString.get("code");

		if (githubCode) {
			const { origin, pathname } = window.location;
			const cleanedUrl = origin + pathname;

			window.history.pushState({}, "", cleanedUrl);

			signIn(githubCode);
		}
	}, []);

	return (
		<AuthContext.Provider value={{ signInUrl, user }}>
			{children}
		</AuthContext.Provider>
	);
}
