import * as THREE from 'three';

class threelibScene{

    private scene : THREE.Scene;

    constructor(){
        this.scene = new THREE.Scene();
    }

    getScene(){
        return this.scene;  
    }





}

export default threelibScene;