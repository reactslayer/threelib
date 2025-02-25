import * as THREE from 'three'
import threelibScene from './scene';

class threelibCanvas{


    // single renderer per canvas to avoid conflicts
    private renderer!: THREE.WebGLRenderer;

    // the main canvas HTML element, has to be already created.
    private canvas : HTMLCanvasElement;

    // a list of cameras to render images/videos from different positions.
    private cameras : THREE.Camera[];
    

    // used only for orbit controller, only moving camera. 
    private orbitCamera : THREE.Camera;

    private window:Window;

    private scene : threelibScene;

    constructor(canvas : HTMLCanvasElement , window : Window , scene : threelibScene){
        this.canvas = canvas;
        this.window = window;
        this.initRenderer();
        this.orbitCamera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );
        this.cameras = [];
        this.initCamera(window.innerWidth , window.innerHeight)
        this.scene = scene;
        
    }

    initRenderer(){
        this.renderer = new THREE.WebGLRenderer({canvas : this.canvas});
        this.renderer.setSize(window.innerWidth , window.innerHeight)
    }

    initCamera(width:number , height:number){
        let camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.z = 5;
        this.addCamera(camera);
    }

    addCamera(camera : THREE.Camera){
        this.cameras.push(camera);
    }
    getCamera(id : number) : THREE.Camera{
        let camera  = this.cameras.at(id);
        if(camera == undefined){
            throw new Error("The Camera does not exist")
        }
        else{
            return camera;
        }
    }

    addListener(event : string , callback : (event:Event)=> object|undefined ){
        this.canvas.addEventListener(event ,(event)=>callback(event))
    }
    
}
export default threelibCanvas