import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { LoginPage } from '../pages/login/login';
import * as firebase from 'firebase';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = LoginPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      this.initFireBase();
    });
  }

  initFireBase() {
    firebase.initializeApp({
      apiKey: "AIzaSyC8Cxez8isntpZLmbhy7QxJ4FO9qk-TrLI",
      authDomain: "salerevfotos.firebaseapp.com",
      databaseURL: "https://salerevfotos.firebaseio.com",
      projectId: "salerevfotos",
      storageBucket: "salerevfotos.appspot.com",
      messagingSenderId: "311606484205"
    });
  }
}
