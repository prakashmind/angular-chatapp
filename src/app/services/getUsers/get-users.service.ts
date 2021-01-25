import { environment } from './../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
const baseUrl = environment.Url + '/user';
@Injectable({
  providedIn: 'root'
})
export class GetUsersService {

  constructor(private http: HttpClient) { }

  getUsers(): Observable<any>{
    return this.http.get<any[]>(baseUrl + '/getUsers');
  }

}
