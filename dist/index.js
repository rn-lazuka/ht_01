"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const settings_1 = require("./settings");
const db_1 = require("./db");
const port = process.env.PORT || 5000;
const startApp = async () => {
    await (0, db_1.runDB)();
    settings_1.app.listen(port, () => {
        console.log(`App listen on port ${port}`);
    });
};
startApp();
