import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './components/main/main.component';
import { LingoComponent } from './components/main/components/lingo/lingo.component';
import { CellComponent } from './components/main/components/lingo/components/cell/cell.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ProgressBarComponent } from './components/main/components/progress-bar/progress-bar.component';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    LingoComponent,
    CellComponent,
    ProgressBarComponent
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
