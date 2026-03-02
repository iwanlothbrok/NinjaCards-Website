import { NextApiRequest } from "next";

export function getUserId(req: NextApiRequest): string | null {
    const userId = req.headers["x-user-id"];
    return typeof userId === "string" ? userId : null;
}
