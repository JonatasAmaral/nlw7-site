import { useEffect, useState } from "react";
import io from "socket.io-client";
import { api } from "../../services/api";

import styles from "./styles.module.scss";

import logoImg from "../../assets/logo.svg";

type Message = {
	id: string;
	text: string;
	user: {
		name: string;
		avatar_url: string;
	};
};

const messagesQueue: Message[] = [];

const socket = io(api.defaults.baseURL as string);
socket.on("new_message", (newMessage: Message) => {
	messagesQueue.push(newMessage);
});

export default function MessageList() {
	const [messages, setMessages] = useState<Message[]>([]);

	useEffect(() => {
		const timer = setInterval(() => {
			if (messagesQueue.length > 0) {
				setMessages((prevMessages) =>
					[messagesQueue[0], prevMessages[0], prevMessages[1]].filter(Boolean)
				);
				messagesQueue.shift();
			}
		}, 2000);
	}, []);
	useEffect(() => {
		api.get<Message[]>("messages/last3").then((response) => {
			setMessages(response.data);
		});
	}, []);

	return (
		<div className={styles.MessageListWrapper}>
			<img src={logoImg} alt="DoWhile 2021" />
			<ul className={styles.messageList}>
				{messages.map((msg) => (
					<li className={styles.message} key={msg.id}>
						<p className={styles.messageContent}>{msg.text}</p>
						<div className={styles.messageUser}>
							<div className={styles.userImage}>
								<img src={msg.user.avatar_url} alt={msg.user.name} />
							</div>
							<span>{msg.user.name}</span>
						</div>
					</li>
				))}
			</ul>
		</div>
	);
}
