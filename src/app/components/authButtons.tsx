/**
 * Copyright (c) 2023 Foxxite | Articca
 *   All rights reserved.
 *
 * @format
 */

"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

export const LoginButton = () => {
	return (
		<button style={{ marginRight: 10 }} onClick={() => signIn()}>
			Sign in
		</button>
	);
};

export const LogoutButton = () => {
	const { data: session } = useSession();
	return (
		!!session && (
			<button style={{ marginRight: 10 }} onClick={() => signOut()}>
				Sign Out
			</button>
		)
	);
};

export const ProfileButton = () => {
	return <Link href="/profile">Profile</Link>;
};
