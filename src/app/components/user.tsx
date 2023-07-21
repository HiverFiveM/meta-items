/**
 * Copyright (c) 2023 Foxxite | Articca
 *   All rights reserved.
 *
 * @format
 */

"use client";

import { useSession } from "next-auth/react";

export const User = () => {
	const { data: session } = useSession();

	return (
		<>
			<h1>Client Session</h1>
			<pre>{JSON.stringify(session)}</pre>
		</>
	);
};
