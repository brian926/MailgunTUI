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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var FormData = require("form-data");
var mailgun_js_1 = require("mailgun.js");
var readline = require("readline");
var dotenv = require("dotenv");
dotenv.config();
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
function question(questionText) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve) {
                    rl.question(questionText, function (choice) {
                        resolve(choice);
                    });
                })];
        });
    });
}
function getMenuChoice(options) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (options.at(-1) != "Exit") {
                        options.push("Exit");
                    }
                    console.log("Menu:");
                    options.forEach(function (option, index) {
                        console.log("".concat(index + 1, ". ").concat(option));
                    });
                    return [4 /*yield*/, question("Enter your choice: ")];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function choice(options) {
    return __awaiter(this, void 0, void 0, function () {
        var choice_1, optionIndex;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!true) return [3 /*break*/, 2];
                    return [4 /*yield*/, getMenuChoice(options)];
                case 1:
                    choice_1 = _a.sent();
                    optionIndex = parseInt(choice_1);
                    if (optionIndex >= 1 && optionIndex <= options.length) {
                        return [2 /*return*/, optionIndex];
                    }
                    else {
                        console.log("Invalid choice. Please enter a valid option number.");
                    }
                    return [3 /*break*/, 0];
                case 2: return [2 /*return*/];
            }
        });
    });
}
function getDomains(mg) {
    return __awaiter(this, void 0, void 0, function () {
        var domainList, domainIndex, domain;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    domainList = [];
                    return [4 /*yield*/, mg.domains.list()
                            .then(function (domains) {
                            for (var _i = 0, domains_1 = domains; _i < domains_1.length; _i++) {
                                var name_1 = domains_1[_i];
                                domainList.push(name_1.name);
                            }
                        })
                            .catch(function (err) { return console.log(err); })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, choice(domainList)];
                case 2:
                    domainIndex = _a.sent();
                    domain = domainList[domainIndex - 1];
                    console.log("You picked " + domain);
                    checkExit(domain);
                    return [2 /*return*/, domain];
            }
        });
    });
}
function handleOutput(option, element) {
    var fs = require('fs');
    switch (option) {
        case 1: {
            console.log(element);
        }
        case 2: {
            var userjson = fs.readFileSync('errors.json');
            var users = JSON.parse(userjson);
            users.push(element);
            userjson = JSON.stringify(users);
            fs.writeFileSync("errors.json", userjson, "utf-8");
            break;
        }
        case 3: {
            console.log(element);
            var userjson = fs.readFileSync('errors.json');
            var users = JSON.parse(userjson);
            users.push(element);
            userjson = JSON.stringify(users);
            fs.writeFileSync("errors.json", userjson, "utf-8");
            break;
        }
        default: {
            break;
        }
    }
}
function getFails(mg) {
    return __awaiter(this, void 0, void 0, function () {
        var domain, filters, filter, filterBase, _a, options, option;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, getDomains(mg)];
                case 1:
                    domain = _b.sent();
                    filters = ["Filter on email domains", "Search for email address"];
                    return [4 /*yield*/, choice(filters)];
                case 2:
                    filter = _b.sent();
                    checkExit(filters[filter - 1]);
                    console.log(filter);
                    _a = filter;
                    switch (_a) {
                        case 1: return [3 /*break*/, 3];
                        case 2: return [3 /*break*/, 5];
                    }
                    return [3 /*break*/, 7];
                case 3: return [4 /*yield*/, question('Input email domains: ')];
                case 4:
                    filterBase = _b.sent();
                    _b.label = 5;
                case 5: return [4 /*yield*/, question('Input email address to search: ')];
                case 6:
                    filterBase = _b.sent();
                    _b.label = 7;
                case 7:
                    console.log(filterBase);
                    options = ["Output to console", "Save to JSON file", "Both output to console & save to JSON file"];
                    return [4 /*yield*/, choice(options)];
                case 8:
                    option = _b.sent();
                    checkExit(options[option - 1]);
                    mg.events.get(domain, {
                        event: 'failed'
                    }).then(function (data) {
                        data.items.forEach(function (element) {
                            handleOutput(option, element);
                        });
                    })
                        .catch(function (err) { return console.error(err); });
                    return [2 /*return*/];
            }
        });
    });
}
function checkExit(choice) {
    if (choice == "Exit") {
        process.exit();
    }
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var MAILGUN_API, regions, region, mailgun, mg;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    MAILGUN_API = process.env.MAILGUN_API_KEY;
                    regions = ["USA", "EU"];
                    return [4 /*yield*/, choice(regions)];
                case 1:
                    region = _a.sent();
                    console.log("You picked: " + regions[region - 1]);
                    checkExit(regions[region - 1]);
                    mailgun = new mailgun_js_1.default(FormData);
                    if (regions[region - 1] == "EU") {
                        mg = mailgun.client({ username: 'api', key: MAILGUN_API, url: 'https://api.eu.mailgun.net' });
                    }
                    else {
                        mg = mailgun.client({ username: 'api', key: MAILGUN_API, url: 'https://api.mailgun.net' });
                    }
                    getFails(mg);
                    return [2 /*return*/];
            }
        });
    });
}
// Start the program
main();
