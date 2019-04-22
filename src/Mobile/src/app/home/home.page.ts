import { Component } from '@angular/core'
import { ApiService } from '../sercices/api.service'
import { ToastController } from '@ionic/angular'

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {
  public totp

  constructor (private api: ApiService, public toastController: ToastController) {}

  validate () {
    this.api.get('/check/' + this.totp).then(data => this.alert(data.status))
  }

  async alert (status) {
    const toast = await this.toastController.create({
      message: status ? 'OK' : 'Not valid code',
      duration: 2000,
      color: status ? 'primary' : 'danger',
    })
    toast.present()
  }
}
