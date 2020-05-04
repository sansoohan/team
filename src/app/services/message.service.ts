import { Component, Injectable, Inject } from '@angular/core';
import Swal from 'sweetalert2';
import SweetAlertIcon from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})

export class MessageService {
  private message: string;

  constructor() { }

  showError(messageTitle: string, messageContent: string) {
    Swal.fire({
      title: messageTitle,
      text: messageContent,
      icon: 'error'
    });
  }

  showSuccess(messageTitle: string, messageContent: string) {
    Swal.fire({
      position: 'top-end',
      title: messageTitle,
      text: messageContent,
      icon: 'success',
      showConfirmButton: false,
      timer: 2000,
      backdrop: `
        rgba(0,0,0,0)
      `
    });
  }

  async showPrompt(messageTitle: string, inputPlaceholder: string){
    const { value: email } = await Swal.fire({
      title: messageTitle,
      input: 'text',
      inputPlaceholder: 'Enter your email address'
    });
    return email;
  }
}
