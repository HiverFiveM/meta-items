/**
 * Copyright (c) 2023 Foxxite | Articca
 *   All rights reserved.
 *
 * @format
 */

import { authOptions } from "@/lib/auth";
import NextAuth from "next-auth";

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
