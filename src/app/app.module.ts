import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './components/main/main.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { GameComponent } from './components/game/game.component';
import { CellComponent } from './components/game/components/lingo/components/cell/cell.component';
import { LingoComponent } from './components/game/components/lingo/lingo.component';
import { ProgressBarComponent } from './components/game/components/progress-bar/progress-bar.component';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    LingoComponent,
    CellComponent,
    ProgressBarComponent,
    GameComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
