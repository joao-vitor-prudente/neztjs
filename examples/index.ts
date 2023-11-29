import { HttpLib } from "@neztjs";

// create the client
export const httpClient = new HttpLib(3000);
// serve the server
httpClient.serve();

// import all the files with controllers (this should be a dynamic import)
import("./controllers/example");
