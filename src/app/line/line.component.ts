import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import threelibCanvas from '../../threelib/canvas';
import * as THREE from 'three';
@Component({
  selector: 'app-line',
  imports: [],
  templateUrl: './line.component.html',
  styleUrl: './line.component.css'
})
export class LineComponent {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef;

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;

  private plane!: THREE.Mesh;
  private linematerial!: THREE.LineBasicMaterial;
  private raycaster = new THREE.Raycaster();
  private mouse = new THREE.Vector2();
  private isDragging = false;

  private line: THREE.Line | undefined;


  constructor(private ngZone: NgZone) {

    this.mouseDown = this.mouseDown.bind(this)
    this.mouseUp = this.mouseUp.bind(this)
    this.mousemove = this.mousemove.bind(this)

  }


  ngOnInit(): void {
    this.initScene();
    this.addPlane();
    this.addEventListeners();
  }

  private addPlane() {
    const planeGeometry = new THREE.PlaneGeometry(10, 10); // Large plane
    const planeMaterial = new THREE.MeshBasicMaterial({ visible: false }); // Invisible plane
    this.plane = new THREE.Mesh(planeGeometry, planeMaterial);
    this.scene.add(this.plane);
  }

  private initScene() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.z = 5;

    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvasRef.nativeElement });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    // document.body.appendChild(this.renderer.domElement);
    this.linematerial = new THREE.LineBasicMaterial({ color: 0xff0000 });


    this.ngZone.runOutsideAngular(() => this.animate());
  }

  private animate() {
    requestAnimationFrame(() => this.animate());
    this.renderer.render(this.scene, this.camera);
  }

  private addEventListeners() {
    const canvas = this.renderer.domElement;

    canvas.onmousedown = this.mouseDown;
    canvas.onmouseup = this.mouseUp;
    canvas.onmousemove = this.mousemove;


  }
// When left down, the first point of the new line is set. 
  // Now when the mouse moves the current line is expanded accordingly.
  // When another left down, a line is created if first point exists or else, first point is initialized.
  // If right down, first point is undefined and dragging is false
  private mouseDown(event : MouseEvent){
      this.isDragging = true;
      let ret = this.getxyzCoordinates(event)
      if(ret == undefined){
        return;
      }
      let points = [new THREE.Vector3(ret[0],ret[1],ret[2]),new THREE.Vector3(ret[0],ret[1],ret[2])]
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
  
      this.line = new THREE.Line(geometry , this.linematerial);
      this.scene.add(this.line)
    }
    private mouseUp(event : MouseEvent){
      this.isDragging = false;
    }
    private mousemove(event : MouseEvent){
      
     if(this.isDragging){
       if(this.line == undefined){
        console.log("Line is undefined")
        return;
       }
       let ret = this.getxyzCoordinates(event)
       if(ret == undefined){
        console.log("Coordinates are undefined")
        return
       }
       this.line.geometry.attributes['position'].setXYZ(1, ret[0], ret[1], ret[2]); // Update endpoint
       this.line.geometry.attributes['position'].needsUpdate = true;
     }
    }
    private getxyzCoordinates(event : MouseEvent) : [number,number,number] | undefined{
      const rect = this.renderer.domElement.getBoundingClientRect();
  
      // Step 2: Convert 2D screen coordinates to normalized device coordinates (-1 to +1)
      this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  
      // Step 3: Raycasting to find intersection with plane
      this.raycaster.setFromCamera(this.mouse, this.camera);
      const intersects = this.raycaster.intersectObject(this.plane);
  
      if (intersects.length > 0) {
        const point = intersects[0].point; // Get intersection point
        console.log(point.x,point.y,point.z)
        return [point.x,point.y,point.z]
      }
      return undefined;
    }
}
