import { app } from "./app";
import { databaseAdapter } from "./dependencies";

databaseAdapter.start();

const port = 31000;
app.listen(port, () => {
    console.info(`Server is running on port ${port}`);
});
