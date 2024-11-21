import { app } from "./app";
import { databaseAdapter } from "./dependencies";

databaseAdapter.start();

const port = 8080;
app.listen(port, () => {
    console.info(`Server is running on port ${port}`);
});
