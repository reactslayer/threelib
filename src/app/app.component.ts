import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CircularComponent } from './circular/circular.component';
import { DetectorComponent } from './detector/detector.component';
import { LineComponent } from './line/line.component';
import { PolylineComponent } from './polyline/polyline.component';
import { Line2Component } from './line2/line2.component';
import threelibCore from '../threelib/core';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet , CircularComponent , DetectorComponent,LineComponent,PolylineComponent,Line2Component],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  private core : threelibCore;
  constructor(){
    this.core = new threelibCore(window);
    this.title = window.innerWidth +"";
  }
  title = 'line2';
}
