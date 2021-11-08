import {
  CognitoUserPool,
  CognitoUserAttribute,
  AuthenticationDetails,
  CognitoUser,
} from 'amazon-cognito-identity-js';
export class Cognito {
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
  constructor(
    ClientId: string = '6cf41461bdjrg7r5cua5me6h9n',
    UserPoolId: string = 'ap-southeast-1_1PT2j2N7C',
    region: string = 'ap-southeast-1',
    identityPoolId: string = 'ap-southeast-1:86104e2e-5908-4009-a0ca-e5ab94615d3a',
  ) {
    this.userPoolData = new CognitoUserPool({
      UserPoolId,
      ClientId,
    });
  }

  signUp(username: string, email: string, password: string) {
    this.userPoolData.signUp(
      email,
      password,
      [new CognitoUserAttribute({ Name: 'username', Value: username })],
      [],
      (err, data) => {
        if (err) {
          return console.log('error roi', err);
        }

        console.log({ data });
      },
    );
  }

  signIn(Username: string, Password: string) {
    const authDetail = new AuthenticationDetails({ Username, Password });
    const cognitoUser = new CognitoUser({ Username, Pool: this.userPoolData });

    cognitoUser.authenticateUser(authDetail, {
      onFailure: (error) => {
        console.log(error);
      },
      onSuccess: (data) => {
        const accessToken = data.getAccessToken().getJwtToken();
        const refreshToken = data.getRefreshToken().getToken();
        const idToken = data.getIdToken().getJwtToken();

        console.log({ accessToken, refreshToken, idToken });
      },
    });
  }

  verifyToken(token: string) {
    //   const token =
  }
}
