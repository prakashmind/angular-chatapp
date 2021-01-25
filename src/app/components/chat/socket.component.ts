import { GetUsersService } from './../../services/getUsers/get-users.service';
import { Component, OnInit, HostListener, ElementRef, ViewChild } from '@angular/core';
import { io } from 'socket.io-client';
import { environment } from '../../../environments/environment';
import * as uuid from 'uuid';
@Component({
  selector: 'app-socket',
  templateUrl: './socket.component.html',
  styleUrls: ['./socket.component.css']
})
export class SocketComponent implements OnInit {
  // socket = io.connect(url, conn_options);
  @ViewChild('scrollMe') scrollMe: ElementRef;
   public socket =  io(environment.Url, {transports: ['websocket']});
   chattings: any;
   users = [];
   time = new Date();
   myId: any;
   myName: any;
   msgTestBox: any;
   selectedUserName: any;
   selectedUserId: any;
   error = false;
   emptyMsgErr = false;
   firstMsg = false;
   typingg = false;
   timeout: any;
   friendtyping = false;
   activeUsers: any;
   lastMsg: any;
   allMessages: any;
   selectedUserImage: any;

  constructor(private getUsers: GetUsersService) { }

  ngOnInit(): void {
    const id = localStorage.getItem('id');
    this.myName = localStorage.getItem('name');
    this.myId = id;
    this.socket.emit('user_connected', {user_id: id});

    this.getUsers.getUsers().subscribe(users => {
        this.users = users;
    });

    this.socket.emit('get_all_messages');
    this.socket.on('get_all_message', (data: any) => {
      this.allMessages = data;
    });

    this.socket.on('get_messages', (data: string) => {
      console.log(data);
      this.chattings = data;
    });

    this.socket.on('user_typing', (data: string) => {
      console.log(data);
      this.friendtyping = true;
    });

    this.socket.on('typing_stopped', (data: string) => {
      console.log(data);
      this.friendtyping = false;
    });

    this.socket.on('user_online', (data: any) => {
      this.activeUsers = data;
    });

    this.socket.on('offline', (data: any) => {
      console.log(data);
      this.activeUsers = data;
    });

    this.socket.on('allMsgs', (data: any) => {
      console.log(data);
      this.chattings = data;
    });
  }

  selectedUser(user: any): any{
    this.firstMsg = true;
    this.error = false;
    this.chattings = null;
    this.lastMsg = '';
    this.selectedUserName = user.name;
    this.selectedUserId = user._id;
    this.selectedUserImage = user.image;
    this.socket.emit('getUserMsgs', {id: this.myId, selected_user_id: this.selectedUserId});
  }

  typing(): any{
    if (!this.typingg){
      this.sendTypingEvent();
    }
    clearTimeout(this.timeout);
    this.timeout = setTimeout( () => {
      this.typingg = false;
      this.socket.emit('stopped', {receiver: this.selectedUserId});
    }, 1500);
  }

  sendTypingEvent(): any{
    this.typingg = true;
    this.socket.emit('typing', {receiver: this.selectedUserId});
  }


  sendMsg(msg: any): void{
      if (this.selectedUserId){
        if  (msg){
          this.emptyMsgErr = false;
          this.firstMsg = false;
          this.msgTestBox = '';
          this.lastMsg = msg;
          this.socket.emit('send_message', {message: msg, image: this.selectedUserImage,
             receiver: this.selectedUserId, sender: this.myId, date: Date.now()});
          if (this.chattings){
            const commentLength = this.chattings.length + 1;
            this.chattings.splice(commentLength, 0, {
              message: msg,
              sender: this.myId,
              receiver: this.selectedUserId,
              date: Date.now()
            });
            }else
            {
                this.chattings = [{
                  message: msg,
                  sender: this.myId,
                  receiver: this.selectedUserId,
                  date: Date.now()
              }];
            }
        }else{
          this.emptyMsgErr = true;
        }
      }else{
        this.error = true;
      }
  }

}
