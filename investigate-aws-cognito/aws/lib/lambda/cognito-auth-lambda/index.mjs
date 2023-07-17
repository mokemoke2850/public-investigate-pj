'use strict';
import { CognitoJwtVerifier } from 'aws-jwt-verify';
import * as dotenv from 'dotenv';

dotenv.config();

const USER_POOL_ID = process.env.USER_POOL_ID;
const CLIENT_ID = process.env.CLIENT_ID;

const verifyJwt = async (jwt) => {
  const verifier = CognitoJwtVerifier.create({
    userPoolId: USER_POOL_ID,
    tokenUse: 'id',
    clientId: CLIENT_ID,
  });

  try {
    const payload = await verifier.verify(jwt);
    return payload;
  } catch (err) {
    throw err;
  }
};
export const handler = async (event, context, callback) => {
  const request = event.Records[0].cf.request;
  try {
    const authHeader = request.headers.authorization;
    const jwtToken = authHeader
      .find((value) => value.key === 'authorization')
      ?.value?.slice(7);

    await verifyJwt(jwtToken);
  } catch (err) {
    const notValidResponse = {
      status: 403,
      statusDescription: 'Forbidden',
      headers: {
        'content-type': [
          {
            key: 'Content-Type',
            value: 'application/json; charset=utf-8',
          },
        ],
      },
      body: JSON.stringify({
        message: 'Not Valid Cognito ID',
      }),
    };
    callback(null, notValidResponse);
  }

  callback(null, request);
};
