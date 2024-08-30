import { app } from "./app";
import { databaseAdapter } from "./dependencies";

databaseAdapter.start();

const port = 3000
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})