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
	signOut: () => void;
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
		import.meta.env.VITE_GITHUB_CLIENT_ID
	}&redirect_uri=${api.defaults.baseURL}/signin/callback?forward_to=${
		window.location.href
	}`;

	async function signIn(githubCode: string) {
		const response = await api.post<AuthResponse>("authenticate", {
			code: githubCode,
		});

		const { token, user } = response.data;

		api.defaults.headers.common.authorization = `Bearer ${token}`;

		localStorage.setItem("@dowhile:token", token);
		setUser(user);
	}

	function signOut() {
		setUser(null);
		localStorage.removeItem("@dowhile:token");
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
		<AuthContext.Provider value={{ signInUrl, user, signOut }}>
			{children}
		</AuthContext.Provider>
	);
}
