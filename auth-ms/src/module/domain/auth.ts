// DDD: Domain Driven Design + Análisis de requerimientos
export class Auth {
  private readonly id: string;
  private name: string;
  private email: string;
  private password: string;
  private refreshToken: string;

  constructor(id: string, name: string, email: string, password: string, refreshToken: string) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.refreshToken = refreshToken;
  }

  properties() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      password: this.password,
      refreshToken: this.refreshToken
    };
  }

  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getPassword(): string {
    return this.password;
  }

  getRefreshToken(): string {
    return this.refreshToken;
  }
}
