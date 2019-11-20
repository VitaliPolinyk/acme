import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { NgxsModule } from '@ngxs/store';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthGuard } from './shared/guards/auth.guard';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './shared/services/interceptor/interceptor.service';
import { EventState } from './state/event.state';
import { AuthService } from './shared/services/auth/auth.service';
import { ApiService } from './shared/services/api/api';
import { ShareService } from './shared/services/share/share.service';
import { ToastsService } from './shared/services/toasts/toasts.service';
import { EventsService } from "./shared/services/events/events.service";

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    NgxsModule.forRoot([
      EventState
    ])
  ],
  providers: [
    StatusBar,
    AuthService,
    ApiService,
    ShareService,
    SplashScreen,
    EventsService,
    AuthGuard,
    ToastsService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
