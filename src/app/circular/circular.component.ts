import { Component , ElementRef , OnInit ,NgZone, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
@Component({
  selector: 'app-circular',
  imports: [],
  templateUrl: './circular.component.html',
  styleUrl: './circular.component.css'
})
export class CircularComponent {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef;

  constructor(private ngZone: NgZone) {}
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private isDragging = false;
  private isClicked = false;
  private plane!: THREE.Mesh;

  private raycaster = new THREE.Raycaster();
  private mouse = new THREE.Vector2();
  
  private centerX = -1;
  private centerY = -1;
  private centerZ = -1;
  private torus : THREE.Mesh | undefined;
  private last_dist = 0;
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
  private onCanvasDown = (event: MouseEvent) => {
    const rect = this.renderer.domElement.getBoundingClientRect();

    // Step 2: Convert 2D screen coordinates to normalized device coordinates (-1 to +1)
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    // Step 3: Raycasting to find intersection with plane
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObject(this.plane);

    if (intersects.length > 0) {
      const point = intersects[0].point; // Get intersection point
      console.log(`Clicked at: x=${point.x}, y=${point.y}, z=${point.z}`);
      this.addTorus(point.x, point.y, point.z);
    }
  };
  getDist(x: number,y: number,z: number){
    return Math.sqrt(Math.pow((x-this.centerX),2) + Math.pow((y-this.centerY),2) +Math.pow((z-this.centerZ),2) )
  }
  private addTorus(x: number, y: number, z: number) {
    const geometry = new THREE.TorusGeometry(0.5, 0.2, 16, 10);
    const material = new THREE.MeshBasicMaterial({ color: 0xff6347 });
    const torus = new THREE.Mesh(geometry, material);

    torus.position.set(x, y, z); // Set position
    this.centerX = x;
    this.centerY = y;
    this.centerZ = z;
    this.last_dist = this.getDist(x,y,z)
    
    this.torus = torus;
    this.scene.add(torus);
  }
  private initScene() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.z = 5;

    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvasRef.nativeElement });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    // document.body.appendChild(this.renderer.domElement);

    

    this.ngZone.runOutsideAngular(() => this.animate());
  }
  private animate() {
    requestAnimationFrame(() => this.animate());
    this.renderer.render(this.scene, this.camera);
  }
  private addEventListeners() {
    const canvas = this.renderer.domElement;

    // Handle Click Event
    // canvas.addEventListener('click', this.onCanvasClick);

    // Handle Drag Start (Mouse Down)
    canvas.addEventListener('mousedown', (event) => {
      this.isDragging = true;
      this.onCanvasDown(event);
    });

    // Handle Drag Move
    canvas.addEventListener('mousemove', (event) => {
      if (this.isDragging) {
        this.onDrag(event);
      }
    });

    // Handle Drag End (Mouse Up)
    canvas.addEventListener('mouseup', () => {
      this.isDragging = false;
      this.onRelease();
    });

    // Prevent default drag behavior
    canvas.addEventListener('dragstart', (event) => event.preventDefault());
  }
  getCoordinates(event:MouseEvent){
    const canvas = this.renderer.domElement;
    const rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    if(x<0){
      x=0
    }
  let y = event.clientY - rect.top;
  if(y<0){
    y=0;
  }
    return [x,y]
  }
  


  private onDrag = (event: MouseEvent) => {
    const rect = this.renderer.domElement.getBoundingClientRect();
    const SCALE_FACTOR = 0.5
    // Step 2: Convert 2D screen coordinates to normalized device coordinates (-1 to +1)
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    // Step 3: Raycasting to find intersection with plane
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObject(this.plane);
    
    if (intersects.length > 0) {
      const point = intersects[0].point; // Get intersection point
      let dist = this.getDist(point.x,point.y,point.z)
      if(this.torus==undefined){
        return;
      }
      let xx = this.torus?.scale.x;
      let yy = this.torus?.scale.y;
      let zz = this.torus?.scale.z;
      if(dist > this.last_dist){
        this.last_dist = dist;
        this.torus?.scale.set(xx+SCALE_FACTOR,yy+SCALE_FACTOR,zz+SCALE_FACTOR)
      }
      else{
        this.last_dist = dist;
        this.torus?.scale.set(Math.max(xx-SCALE_FACTOR,SCALE_FACTOR),Math.max(yy-SCALE_FACTOR,SCALE_FACTOR),Math.max(zz-SCALE_FACTOR,SCALE_FACTOR))
      }
      
    }
  };

  private onRelease = () => {
    console.log('Mouse released!');
    if(this.torus!=undefined){
      this.torus = undefined
    }
    
  };

}
