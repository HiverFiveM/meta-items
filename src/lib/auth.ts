/**
 * Copyright (c) 2023 Foxxite | Articca
 *   All rights reserved.
 *
 * @format
 */

// https://codevoweb.com/setup-and-use-nextauth-in-nextjs-13-app-directory/

import DiscordProvider, { DiscordProfile } from "next-auth/providers/discord";

import { env } from "./env";

import type { NextAuthOptions } from "next-auth";
import axios from "axios";
import { DiscordGuildSchema } from "@/schemas/DiscordGuild";

const cookieOptions = {
	httpOnly: true,
	sameSite: "lax",
	path: "/",
	secure: process.env.NODE_ENV === "production",
};

export const authOptions: NextAuthOptions = {
	cookies: {
		sessionToken: {
			name: "auth.session",
			options: cookieOptions,
		},
		callbackUrl: {
			name: "auth.callback",
			options: cookieOptions,
		},
		csrfToken: {
			name: "auth.token",
			options: cookieOptions,
		},
	},
	session: {
		strategy: "jwt",
	},
	providers: [
		DiscordProvider({
			clientId: env.DISCORD_CLIENT_ID,
			clientSecret: env.DISCORD_CLIENT_SECRET,
			async profile(profile: DiscordProfile, tokens) {
				if (profile.avatar === null) {
					const defaultAvatarNumber = parseInt(profile.discriminator) % 5;
					profile.image_url = `https://cdn.discordapp.com/embed/avatars/${defaultAvatarNumber}.png`;
				} else {
					const format = profile.avatar.startsWith("a_") ? "gif" : "png";
					profile.image_url = `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.${format}`;
				}

				return await axios
					.get("https://discord.com/api/users/@me/guilds", {
						headers: {
							Authorization: `Bearer ${tokens.access_token}`,
						},
					})
					.then((res) => {
						const guilds = DiscordGuildSchema.array().parse(res.data);

						return {
							id: profile.id,
							name: profile.username,
							image: profile.image_url,
							inRequiredGuild: guilds.some((guild) => guild.id === env.DISCORD_REQUIRED_GUILD),
						};
					})
					.catch((err) => {
						console.log("Error", err);
						throw new Error("Failed to fetch user guilds");
					});
			},
			authorization: {
				params: {
					scope: "identify guilds",
				},
			},
		}),
	],
	callbacks: {
		session: ({ session, token }) => {
			// console.log("Session Callback", { session, token });
			return {
				...session,
				user: {
					...session.user,
					id: token.id,
					inRequiredGuild: token.inRequiredGuild,
				},
			};
		},
		jwt: ({ token, user }) => {
			// console.log("JWT Callback", { token, user });
			if (user) {
				return {
					...token,
					id: user.id,
					inRequiredGuild: user.inRequiredGuild,
				};
			}
			return token;
		},
	},
};
