import {Action} from '@ngrx/store';

import {AuthData} from '../../../api/auth.service';

import {LoginPayload} from './models/loginPayload.model';

export enum Types {
  SetFetching = '[Auth] SetFetching',
  SetIsLoggedIn = '[Auth] SetIsLoggedIn',
  SetState = '[Auth] SetState',
  SetError = '[Auth] SetError',
  SetStatus = '[Auth] SetStatus',
  SetStatusCode = '[Auth] SetStatusCode',
  Login = '[Auth] Login',
  Initialize = '[Auth] Initialize',
  RefreshToken = '[Auth] RefreshToken',
  Logout = '[Auth] Logout',
  QueryLogin = '[Auth] QueryLogin',
  SetTokenResponseToCookies = '[Auth] SetTokenResponseToCookies',
}

export class Login implements Action {
  readonly type = Types.Login;

  constructor(public payload: LoginPayload) {}
}

export class QueryLogin implements Action {
  readonly type = Types.QueryLogin;

  constructor(public payload: LoginPayload) {}
}

export class SetTokenResponseToCookies implements Action {
  readonly type = Types.SetTokenResponseToCookies;

  constructor(public payload: {item?: AuthData, rememberMe?: boolean}) {}
}

export class Initialize implements Action {
  readonly type = Types.Initialize;
}

export class RefreshToken implements Action {
  readonly type = Types.RefreshToken;
}

export class Logout implements Action {
  readonly type = Types.Logout;
}

export class SetFetching implements Action {
  readonly type = Types.SetFetching;

  constructor(public payload: boolean) {}
}

export class SetIsLoggedIn implements Action {
  readonly type = Types.SetIsLoggedIn;

  constructor(public payload: boolean) {}
}

export class SetState implements Action {
  readonly type = Types.SetState;

  constructor(public payload: AuthData) {}
}

export class SetError implements Action {
  readonly type = Types.SetError;

  constructor(public payload: string) {}
}

export class SetStatus implements Action {
  readonly type = Types.SetStatus;

  constructor(public payload: string) {}
}

export class SetStatusCode implements Action {
  readonly type = Types.SetStatusCode;

  constructor(public payload: number) {}
}

export type All = SetFetching | SetIsLoggedIn | SetState | SetError | SetStatus | SetStatusCode | Login | Initialize
  | RefreshToken | Logout | QueryLogin | SetTokenResponseToCookies;
