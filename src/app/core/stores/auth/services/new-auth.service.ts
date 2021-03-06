import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Params} from '@angular/router';
import {Store} from '@ngrx/store';
import {of, Observable} from 'rxjs';
import {map} from 'rxjs/operators';

import {environment} from '../../../../../environments/environment';
import {AuthActions} from '../index';
import {IApiAuth} from '../models/apiAuth.model';
import {IApiResponse} from '../models/apiResponse.model';
import {ILoginAuthData} from '../models/loginPayload.model';
import {IRestorePasswordPayload} from '../models/restorePasswordPayload.model';

export interface IUser {
    firstname: string;
    lastname: string;
    token: string;
    refresh_token: string;
}

@Injectable({
    providedIn: 'root',
})
export class NewAuthService {
    private readonly signInUrl = environment.apiUrl + '/auth/signin/';
    private readonly refreshUrl = environment.apiUrl + '/auth/refresh/';
    private readonly restorePasswordUrl = environment.apiUrl + '/auth/reset/';
    private readonly changePasswordUrl = environment.apiUrl + '/auth/change-password';
    private readonly accessTokenKey = 'token';
    private readonly refreshTokenKey = 'refresh_token';
    readonly firstnameKey = 'firstname';
    readonly lastnameKey = 'lastname';
    user: IUser;
    public redirectUrl: string;

    constructor(private http: HttpClient, private store$: Store<any>) {}

    private decodeUser(token: string = localStorage.token): IUser {
        let user: any;

        if (!token) {
            return null;
        }

        try {
            // if localStorage.token has not base-64 format
            user = JSON.parse(atob(token.split('.')[1]));
        } catch (e) {
            console.warn(e);

            return null;
        }

        return {
            firstname: user.firstname,
            lastname: user.lastname,
            token: this.accessToken,
            refresh_token: this.refreshToken,
        };
    }

    private saveUserTokens(accessToken: string, refreshToken: string) {
        localStorage.setItem(this.accessTokenKey, accessToken);
        localStorage.setItem(this.refreshTokenKey, refreshToken);
    }

    private saveUserName(firstName: string, lastName: string) {
        localStorage.setItem(this.firstnameKey, firstName);
        localStorage.setItem(this.lastnameKey, lastName);
    }

    private deleteUserTokens() {
        localStorage.removeItem(this.accessTokenKey);
        localStorage.removeItem(this.refreshTokenKey);
    }

    private deleteUserName() {
        localStorage.removeItem(this.firstnameKey);
        localStorage.removeItem(this.lastnameKey);
    }

    get accessToken(): string {
        return localStorage.getItem(this.accessTokenKey) || null;
    }

    get refreshToken(): string {
        return localStorage.getItem(this.refreshTokenKey);
    }

    get userFullName() {
        return `${localStorage.getItem(this.firstnameKey)} ${localStorage.getItem(
            this.lastnameKey,
        )}`;
    }

    get isLoggedIn() {
        return !!this.accessToken;
    }

    get currentUser(): IUser {
        if (!this.user) {
            this.user = this.decodeUser(this.accessToken);
        }

        return this.user;
    }

    initUser() {
        this.store$.dispatch(new AuthActions.SetIsLoggedIn(this.isLoggedIn));
    }

    login(authData: ILoginAuthData): Observable<IUser> {
        return this.http.post<IApiResponse<IApiAuth>>(this.signInUrl, authData).pipe(
            map((response: IApiResponse<IApiAuth>) => {
                this.saveUserTokens(response.data.token, response.data.refresh_token);
                this.saveUserName(response.data.firstname, response.data.lastname);
                this.user = this.decodeUser(response.data.token);
                this.initUser();

                return this.user;
            }),
        );
    }

    logout(): Observable<boolean> {
        this.deleteUserTokens();
        this.deleteUserName();
        this.store$.dispatch(new AuthActions.SetIsLoggedIn(false));

        return of(true);
    }

    tokenRefresh(): Observable<IApiAuth> {
        const refreshToken = this.refreshToken;
        const data = {refresh_token: refreshToken};

        this.deleteUserTokens();
        this.deleteUserName();

        return this.http.post<IApiResponse<IApiAuth>>(this.refreshUrl, data).pipe(
            map((authResponse: IApiResponse<IApiAuth>) => {
                const user = authResponse.data as IApiAuth;

                // Note that RefreshAPI doesn't return refresh
                // token as well and we have to preserve existing one
                this.saveUserTokens(user.token, refreshToken);
                this.saveUserName(user.firstname, user.lastname);

                return user;
            }),
        );
    }

    restorePassword(data: IRestorePasswordPayload): Observable<any> {
        return this.http.post(this.restorePasswordUrl, data);
    }

    changePassword(data: {password: string}, params: Params): Observable<any> {
        return this.http.post(this.changePasswordUrl, data, {
            params: params,
        });
    }
}
