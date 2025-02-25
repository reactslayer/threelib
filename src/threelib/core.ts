import * as THREE from  'three';
import threelibScene from './scene';
import threelibCanvas from './canvas';
enum MODE{
    OBJECT,
    EDIT
}
enum SELECTOR{
    VERTEX,
    EDGE,
    FACE
}

class threelibCore{

    private canvas : threelibCanvas[];
    private window : Window;

    constructor(window : Window){
        this.canvas = []
        this.window = window;
    }


    
}

export default threelibCore