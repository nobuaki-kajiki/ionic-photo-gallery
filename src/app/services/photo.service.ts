import { Injectable } from '@angular/core';
import { Camera,CameraOptions } from '@ionic-native/camera/ngx';
import { Storage } from '@ionic/storage';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {

  public photos:Photo[] = [];

  constructor(
    private camera:Camera,
    private storage: Storage,
    public alertController:AlertController,
  ) { }

  takePicture(){
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };

    this.camera.getPicture(options).then((imageData) =>{
      this.photos.unshift({
        data: 'data:image/jpeg;base64,' + imageData
      });

      this.storage.set('photos',this.photos);
    }, (err) =>{
      console.log("Camera issue:" + err);
    });
  }

  loadSaved(){
    this.storage.get('photos').then((photos) => {
      this.photos = photos || [];
    });
  }

  async allClear(){
    const alert = await this.alertController.create({
      header:'Do you want to delete all data?',
      buttons:[
        {
          text:'Cancel',
          role:'cansel',
          handler: data =>{

          }
        },
        {
          text:'OK',
          role:'OK',
          handler: data =>{
            this.storage.clear();
            this.loadSaved();
          }
        }
      ]
    });
    await alert.present();
  }
}
class Photo{
  data:any;
}
