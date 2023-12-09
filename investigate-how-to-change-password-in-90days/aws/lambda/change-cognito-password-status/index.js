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
Object.defineProperty(exports, "__esModule", { value: true });
const client_cognito_identity_provider_1 = require("@aws-sdk/client-cognito-identity-provider");
const VALID_PERIOD = process.env.VALID_PERIOD || '90';
const AWS_REGION = process.env.AWS_REGION || 'ap-northeast-1';
const USER_POOL_ID = process.env.USER_POOL_ID || '';
function handler(event) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const VALID_PERIOD_NUM = Number(VALID_PERIOD);
        if (USER_POOL_ID === '') {
            throw new Error('USER_POOL_ID is not set');
        }
        if (isNaN(VALID_PERIOD_NUM)) {
            throw new Error('VALID_PERIOD is not number');
        }
        const client = new client_cognito_identity_provider_1.CognitoIdentityProviderClient({
            region: AWS_REGION,
        });
        const listUsersCommand = new client_cognito_identity_provider_1.ListUsersCommand({
            UserPoolId: USER_POOL_ID,
            Filter: 'status = "Enabled"',
        });
        const users = (_a = (yield client.send(listUsersCommand)).Users) !== null && _a !== void 0 ? _a : [];
        const now = new Date();
        const targetUserNames = users
            .filter((user) => {
            if (!user.UserLastModifiedDate) {
                return false;
            }
            const lastModifiedDate = new Date(user.UserLastModifiedDate);
            return isOlderThanDays(lastModifiedDate, now, VALID_PERIOD_NUM);
        })
            .map((user) => user.Username);
        if (targetUserNames.length === 0) {
            console.log('no changed password status users');
            return;
        }
        const params = targetUserNames.map((userName) => ({
            UserPoolId: USER_POOL_ID,
            Username: userName,
        }));
        const updateCommands = params.map((param) => new client_cognito_identity_provider_1.AdminResetUserPasswordCommand(param));
        const results = yield Promise.allSettled(updateCommands.map((command) => client.send(command)));
        const successCount = results.filter((result) => result.status === 'fulfilled' &&
            result.value.$metadata.httpStatusCode === 200).length;
        console.log(`updated ${successCount} users`);
    });
}
const isOlderThanDays = (date, now, days) => {
    const diff = now.getTime() - date.getTime();
    return diff > 1000 * 60 * 60 * 24 * days;
};
handler({});
