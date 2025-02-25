import threelibCore from "./core";

class ComponentConnector implements threelibLifeCycle{

    // private corethreelib : threelibCore;

    constructor(){
        // this.corethreelib = new threelibCore()
    }
    init(): object | undefined {
        throw new Error("Method not implemented.");
    }
    render(): object | undefined {
        throw new Error("Method not implemented.");
    }
    onChange(): object | undefined {
        throw new Error("Method not implemented.");
    }
    onDestroy(): object | undefined {
        throw new Error("Method not implemented.");
    }

}
export default ComponentConnector;