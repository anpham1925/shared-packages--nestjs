import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool,
  CognitoUserSession,
} from 'amazon-cognito-identity-js';
import jwt from 'jsonwebtoken';
import jwkToPem from 'jwk-to-pem';

interface TokenHeader {
  kid: string;
  alg: string;
}

interface Claim {
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

@Injectable()
export class CognitoService {
  clientId: string;
  userPool: string;
  userPoolData: CognitoUserPool;
  jwk: {
    keys: [
      {
        alg: 'RS256';
        e: 'AQAB';
        kid: 'RY2fXMxj5M3MTxmjZkX5+BP78Fprf8cgcEusosfY0as=';
        kty: 'RSA';
        n: 'tWTYQlu18qhDq4fOucEn7C3q19yjAxOh7TvpMxWmkgrSXWKpuPVOcMtiA3A24ZI9FJyO9dEx2-DlJuxMWZLhVRx-klkQcVMlAZjLcAYRcAHI4Kz4nYFbYz23O0koLuhCu6VPPRn-5lqtw-LJvv162UwSdNP4iyDHetBI_ANrZUhOJ6-KAyMN54IqIBIle7PpAnoO0bmIMT64HKQQOO7SZCjCIBG-RIZovkLOUF04YJffnH88Ze83Uabrw7CHCn6Cq17M001SBw2NcLmfxc8Z915sTObPYAkuzjo7c4NoYMe1Xfj-Uui4E0j3qRvZPRBwFihusOV7pmrKV6Bw001epQ';
        use: 'sig';
      },
      {
        alg: 'RS256';
        e: 'AQAB';
        kid: 'TVcaeqzD9yCXSIS1UIwgUHPRNdA+N6Hcn6wZWi7xB9U=';
        kty: 'RSA';
        n: 'siJrUHqh8SEAbH3dnJjMFWnTJGrh8zQsdPRCmz-MqwPohsgmbVbc5_z1ED976zR3Pd77cHQQcNSuSWsB6j3vJJjhTFILLbJVGTAyLjClOI2IhPoaGoltrYGz6m0kBQ9iMbXSw9--NT00ZLoP0DQtgERWLzu864ORiMsH0uxeBx89ChfMHunwyfD0POTYRViJ9AVDVgHUwN9KwXfNbypDkDyojhq6ZqfQT-gjNpKzHP8_g0etg0XHr3Gn4OIJH57CEn3Az56xRJb_uRmYlx421E0Ys8TxZU_zp1egIVXMWCQUxu219YLB-Oh3qdcMvZDezpvoEQFBfoYfF5Rh28kHRw';
        use: 'sig';
      },
    ];
  };

  issuer: string;
  constructor(private configService: ConfigService) {
    const region = this.configService.get<string>('AWS_COGNITO_REGION');
    const userPoolId = this.configService.get<string>('AWS_COGNITO_USER_POOL');
    const clientId = this.configService.get<string>('AWS_COGNITO_CLIENT_ID');
    this.userPoolData = new CognitoUserPool({
      UserPoolId: userPoolId || '',
      ClientId: clientId || '',
    });
    this.issuer = `https://cognito-idp.${region}.amazonaws.com/${userPoolId}`;
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
        email,
        password,
        [new CognitoUserAttribute({ Name: 'username', Value: username })],
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

    //   const token =
    const claim = jwt.verify(token, jwkToPem(chosenJWK), {
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
