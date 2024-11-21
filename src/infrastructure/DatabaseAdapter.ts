import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

export class DatabaseAdapter {
    private client;

    start() {
        const connectionString = process.env.DATABASE_URL;
        console.log("Connection String: ");
        console.log(connectionString);

        // Disable prefetch as it is not supported for "Transaction" pool mode
        const client = postgres(connectionString, { prepare: false });
        this.client = drizzle(client);
    }

    getClient() {
        if (this.client) {
            return this.client;
        } else {
            console.log("Database client has not started yet.");
        }
    }
}
