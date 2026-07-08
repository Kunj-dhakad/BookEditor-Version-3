import { dbConnection } from "@/utils/MYSQL_DB";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
    try {
        const connection = await dbConnection()
        const [rows] = await connection.execute(`SELECT * FROM templates`)

        return NextResponse.json(rows);
    } catch (error) {
        console.error("❌ ERROR KEYS:", Object.keys(error || {}));
        return NextResponse.json(
            {
                message: "Database error",
                error: error || error || String(error),
            },
            { status: 500 }
        );
    }
}
