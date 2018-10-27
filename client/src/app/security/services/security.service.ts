import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable} from 'rxjs';
import { User } from 'src/app/domain/manage_film_example_db/user';
import { shareReplay, map, tap } from 'rxjs/operators';

/**
 * Manage rest API about security
 */
@Injectable()
export class SecurityService {
    contextUrl = environment.endpoint;
    constructor(
        private http: HttpClient,
    ) { }

    /**
     * Login by username and md5 password
     *
     * @param {string} username username for login
     * @param {string} password password in MD5
     * @param {boolean} remember store token in local storage
     * @returns {Observable<User>} logged user
     */
    login(username: string, password: string, remember: boolean): Observable<User> {
        return this.http.post<User>(this.contextUrl + '/login', { username: username, password: password })
            .pipe(
                tap(user => this.setSession(user.token)),
                tap(user => { if (remember) this.setLocal(user.token); }),
                map(user => user),
                shareReplay()
            );
    }

    /**
     * Verify JWT token
     *
     * @param {string} token JWT token to verify
     * @returns {Observable<any>} logged user or error message
     */
    verifyToken(token: string): Observable<any> {
        return this.http.post<any>(this.contextUrl + '/verifyToken', { token: token })
            .pipe(
                map(user => user)
            );
    }

    /**
     * Change password of current user
     *
     * @param {string} passwordNew New password to set in MD5
     * @param {string} passwordOld Old password to check in MD5
     * @returns {Observable<void>} Success or error
     */
    changePassword(passwordNew: string, passwordOld: string): Observable<void> {
        return this.http
            .post<void>(this.contextUrl + '/changePassword', {
                passwordNew: passwordNew,
                passwordOld: passwordOld
            })
            .pipe(
                map(response => response)
            );
    }

    /**
     * Set token in sessionStorage
     *
     * @private
     * @param {*} token JWT token to set in sessionStorage
     */
    private setSession(token) {
        sessionStorage.setItem('token', token);
    }

    /**
     * Set token in localStorage
     *
     * @private
     * @param {*} token JWT token to set in localStorage
     */
    private setLocal(token) {
        localStorage.setItem('token', token);
    }

}
