import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { AuthModel } from "./auth-model";

@Injectable({providedIn:"root"})
export class AuthService{

    private token: string;
    private authenticatedSub = new Subject<boolean>();
    private isAuthenticated = false;

    getIsAuthenticated(){
        return this.isAuthenticated;
    }
    getAuthenticatedSub(){
        return this.authenticatedSub.asObservable();
    }
    getToken(){
        return this.token;
    }
    
    constructor(private http: HttpClient, private router: Router){}
    
    signupUser(username: string, password: string){

        const authData: AuthModel = {username: username, password: password};
        
        this.http.post('http://localhost:3000/sign-up/', authData).subscribe(res => {
            console.log(res);
            this.router.navigate(['/']);
        })
    }

    loginUser(username: string, password: string){
        const authData: AuthModel = {username: username, password: password};

        this.http.post<{token: string}>('http://localhost:3000/login/', authData)
            .subscribe(res => {
                this.token = res.token;
                if(this.token){
                    this.authenticatedSub.next(true);
                    this.isAuthenticated = true;
                    this.router.navigate(['/']);

                    const now = new Date();
                    const expiresDate = new Date(now.getTime()+ 86400000); //+24h
                    this.storeLoginToken(this.token, expiresDate, username);
                }
            })
    }

    logout() {
        this.token = ''
        this.isAuthenticated = false;
        this.authenticatedSub.next(false);
        this.router.navigate(['/']);
        this.clearLoginToken();
    }

    storeLoginToken(token: string, expirationDate: Date, user: string) {
        localStorage.setItem('user', user);
        localStorage.setItem('token', token);
        localStorage.setItem('expiresIn', expirationDate.toISOString());
    }
    
    clearLoginToken() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('expiresIn');
    }

    getLocalStorageData() {
        const token = localStorage.getItem('token');
        const expiresIn = localStorage.getItem('expiresIn');

        if (!token || !expiresIn) {
            return;
        }

        return {
            'token': token,
            'expiresIn':  new Date(expiresIn)
        }
    }

    authenicateFromToken() {
        const localStorageData = this.getLocalStorageData();
        if (localStorageData) {
            const now = new Date();
            const expiresDate = localStorageData.expiresIn.getTime() - now.getTime();
            if (expiresDate > 0) {
                this.token = localStorageData.token;
                this.isAuthenticated = true;
                this.authenticatedSub.next(true);
            }
        }
    }
}