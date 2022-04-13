"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = __importDefault(require("@sanity/client"));
const { SANITY_STUDIO_TOKEN } = process.env;
const clientSanity = (0, client_1.default)({
    projectId: "r398wrbn",
    dataset: "pluggy-db",
    apiVersion: "2022-04-12",
    token: SANITY_STUDIO_TOKEN ||
        "skqLKoJY7kGYeZlSbemv8E91ue9lbuSiOboXeSzvMJQm7pnm5Iyi3A47sXQJQBpyfiKWe8LbGysvNkYfYUYtkR0XvvxiEevwJFnC0l87NOYRRTMWCvKYkQnPhkJb7SxdUzaNdGd6BDoczrByRFEn06fhLG7pJhA07tNjQTnCYSPSAQwZmcYJ",
    useCdn: false, // `false` if you want to ensure fresh data
});
exports.default = clientSanity;
