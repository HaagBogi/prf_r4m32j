import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }


  login(email: any, password: any) {
    // username: someone@someone.com, password: someonepw

    /*const body = {
      username: 'someone@someone.com',
      password: 'someonepw'
    };*/

    let body = new URLSearchParams();
    body.set('username', email);
    body.set('password', password);

    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(environment.baseServerUrl + '/login', body.toString(), {headers: headers, withCredentials: true});
  }

  logout() {
    let headers = new HttpHeaders();
    // headers = headers.set('Content-Type', 'application/x-www-form-urlencoded');
    headers = headers.set('Accept', '*/*');

    return this.http.post(environment.baseServerUrl + '/logout', {}, {headers: headers, responseType: 'text', withCredentials: true});
  }
}
