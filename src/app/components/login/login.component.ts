import { LoginService } from './../../services/login/login.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private login: LoginService, private router: Router) { }

  ngOnInit(): void {
  }

  signin(email: any, password: any): void{
    const data = new FormData();
    data.append('email', email);
    data.append('password', password);
    this.login.login(data).subscribe(response => {
      console.log(response);
      localStorage.setItem('id', response._id);
      localStorage.setItem('name', response.name);
      this.router.navigate(['/chat']);
    }, err => {
      console.log(err);
    });
  }

}
