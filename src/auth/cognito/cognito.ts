import { HttpService } from '@nestjs/axios';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool,
  CognitoUserSession,
} from 'amazon-cognito-identity-js';
import * as jwt from 'jsonwebtoken';
import jwkToBuffer = require('jwk-to-pem');
import { firstValueFrom } from 'rxjs';

interface TokenHeader {
  kid: string;
  alg: string;
}

export interface Claim {
  token_use: string;
  auth_time: number;
  iss: string;
  exp: number;
  username: string;
  client_id: string;
}

export interface SignInResponse {
  accessToken: string;
  refreshToken: string;
  idToken: string;
}

export interface JWK {
  alg: string;
  e: string;
  kid: string;
  kty: string;
  n: string;
  use: string;
}

@Injectable()
export class CognitoService implements OnModuleInit {
  clientId: string;
  clientSecret: string;

  userPool: string;
  userPoolData: CognitoUserPool;
  jwk: {
    keys: any[];
  };
  issuer: string;

  authorization: string;

  authURL: string =
    'https://sms-secret.auth.ap-southeast-1.amazoncognito.com/oauth2/token';

  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
  ) {
    const region = this.configService.get<string>('AWS_COGNITO_REGION');
    const userPoolId = this.configService.get<string>('AWS_COGNITO_USER_POOL');
    const clientId = this.configService.get<string>('AWS_COGNITO_CLIENT_ID');
    const clientSecret = this.configService.get<string>(
      'AWS_COGNITO_CLIENT_SECRET',
    );

    this.userPoolData = new CognitoUserPool({
      UserPoolId: userPoolId || '',
      ClientId: clientId || '',
    });
    this.issuer = `https://cognito-idp.${region}.amazonaws.com/${userPoolId}`;
    this.clientId = clientId || '';
    this.clientSecret = clientSecret || '';
    this.authorization = Buffer.from(
      `${this.clientId}:${this.clientSecret}`,
    ).toString('base64');
  }

  async onModuleInit() {
    const result = await firstValueFrom(
      this.httpService.get(`${this.issuer}/.well-known/jwks.json`),
    );
    this.jwk = result.data;
  }

  async signUp(
    username: string,
    email: string,
    password: string,
  ): Promise<boolean> {
    try {
      await this._asyncSignUp(username, email, password);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  private _asyncSignUp(username: string, email: string, password: string) {
    return new Promise((resolve, reject) => {
      this.userPoolData.signUp(
        username,
        password,
        [new CognitoUserAttribute({ Name: 'email', Value: email })],
        [],
        (err, data) => {
          if (err) return reject(err);
          return resolve(data);
        },
      );
    });
  }

  async signIn(Username: string, Password: string): Promise<SignInResponse> {
    try {
      const data = await this._asyncCognitoAuth(Username, Password);
      const accessToken = data.getAccessToken().getJwtToken();
      const refreshToken = data.getRefreshToken().getToken();
      const idToken = data.getIdToken().getJwtToken();

      return { accessToken, refreshToken, idToken };
    } catch (error) {
      return { accessToken: '', refreshToken: '', idToken: '' };
    }
  }

  private _asyncCognitoAuth(
    Username: string,
    Password: string,
  ): Promise<CognitoUserSession> {
    const authDetail = new AuthenticationDetails({ Username, Password });
    const cognitoUser = new CognitoUser({ Username, Pool: this.userPoolData });

    return new Promise((resolve, reject) => {
      cognitoUser.authenticateUser(authDetail, {
        onFailure: reject,
        onSuccess: resolve,
      });
    });
  }

  verifyToken(token: string): boolean {
    const tokenSections = (token || '').split('.');
    if (tokenSections.length < 2) {
      return false;
    }

    const headerJSON = Buffer.from(tokenSections[0], 'base64').toString('utf8');
    const header = JSON.parse(headerJSON) as TokenHeader;

    const chosenJWK = this.jwk.keys.find((x) => x.kid === header.kid);

    if (!chosenJWK) {
      return false;
    }

    const pem = jwkToBuffer(chosenJWK);

    const claim = jwt.verify(token, pem, {
      algorithms: ['RS256'],
    }) as Claim;

    return this._verifyToken(claim);
  }

  private _verifyExpiration(claim: Claim, current: number): boolean {
    if (current > claim.exp || current < claim.auth_time) {
      return false;
    }
    return true;
  }

  private _verifyIssuer(claim: Claim, issuer: string): boolean {
    return claim.iss === issuer;
  }

  private _verifyUsage(claim: Claim, usage: string[]): boolean {
    return usage.includes(claim.token_use);
  }

  private _verifyToken(claim: Claim): boolean {
    const current = Math.floor(new Date().valueOf() / 1000);

    return (
      this._verifyExpiration(claim, current) &&
      this._verifyIssuer(claim, this.issuer) &&
      this._verifyUsage(claim, ['access'])
    );
  }
}
