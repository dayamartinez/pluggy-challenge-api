"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const node_cron_1 = __importDefault(require("node-cron"));
const dotenv_1 = __importDefault(require("dotenv"));
const routes_1 = __importDefault(require("./routes"));
const collectInfo_controller_1 = __importDefault(require("./controllers/collectInfo.controller"));
dotenv_1.default.config();
const app = (0, express_1.default)();
//initalization
const port = process.env.PORT || 3001;
app.set("port", port);
app.use((0, cors_1.default)());
//middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
//starting server
app.listen(app.get("port"), () => {
    console.log(`Server started on port ${port}`);
});
//Routes
app.use("/", routes_1.default);
//cron - each 60s
node_cron_1.default.schedule("* * * * *", () => __awaiter(void 0, void 0, void 0, function* () {
    const cronCall = yield collectInfo_controller_1.default.collectInformation();
    if (cronCall === null || cronCall === void 0 ? void 0 : cronCall.includes("error"))
        console.log(cronCall);
    else
        console.log("created or updated successfy");
}));
// error handler middleware
app.use((err, req, res, next) => {
    res.status(500).send({
        error: {
            status: 500,
            message: "Internal Server Error",
        },
    });
});
