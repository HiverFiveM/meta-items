/**
 * Copyright (c) 2023 Foxxite | Articca
 *   All rights reserved.
 *
 * @format
 */

import { z } from "zod";

export const DiscordGuildSchema = z.object({
	id: z.string(),
	name: z.string(),
	icon: z.string().nullable(),
	owner: z.boolean(),
	permissions: z.number().int(),
	permissions_new: z.string(),
	features: z.array(z.string()),
});

export type DiscordGuild = z.infer<typeof DiscordGuildSchema>;
