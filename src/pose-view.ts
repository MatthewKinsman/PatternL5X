import { Orient } from "./app/recipe/orient";
import { Pos } from "./app/recipe/pos";
import { Pose } from "./app/recipe/pose";

export class PoseView {
    constructor(private pose : Pose){

    }
    trans = new PosView(this.pose.trans);
    euler = new EulerView(this.pose.rot);
}

class EulerView{
    constructor(private orient : Orient){
        this.fromOrient();
    }
    private _x : number=0;
    private _y : number=0;
    private _z : number=0;
    private fromOrient(){
        let norm = (this.orient.qW*this.orient.qW+this.orient.qX*this.orient.qX+this.orient.qY*this.orient.qY+this.orient.qZ*this.orient.qZ);
        if (norm==0){
            this._x=0;
            this._y=0;
            this._z=0;
            this.setOrient();
            return;
        }
        norm = 2/norm;
        const identity = {
            x:{
                x:1-norm*(this.orient.qY*this.orient.qY+this.orient.qZ*this.orient.qZ),
                y:norm*(this.orient.qX*this.orient.qY+this.orient.qW*this.orient.qZ),
                z:norm*(this.orient.qX*this.orient.qZ-this.orient.qW*this.orient.qY)
            },
            y:{
                x:norm*(this.orient.qX*this.orient.qY-this.orient.qW*this.orient.qZ),
                y:1-norm*(this.orient.qX*this.orient.qX+this.orient.qZ*this.orient.qZ),
                z:norm*(this.orient.qY*this.orient.qZ+this.orient.qW*this.orient.qX)
            },
            z:{
                x:norm*(this.orient.qX*this.orient.qZ+this.orient.qW*this.orient.qY),
                y:norm*(this.orient.qY*this.orient.qZ-this.orient.qW*this.orient.qX),
                z:1-norm*(this.orient.qX*this.orient.qX+this.orient.qY*this.orient.qY)
            }
        }
        if (identity.x.z>0.9999999999){
            this._y = -1.5707963267948966*(180/Math.PI);
            this._z = Math.atan2(-identity.y.x, -identity.z.x)*(180/Math.PI);
            this._x = 0;
        }else if(identity.x.z<-0.9999999999){
            this._y = 1.5707963267948966*(180/Math.PI);
            this._z = Math.atan2(-identity.y.x, -identity.z.x)*(180/Math.PI);
            this._x = 0;
        }else{
            this._y - Math.asin(identity.x.z)*(180/Math.PI);
            this._z = Math.atan2(identity.x.y, identity.x.x)*(180/Math.PI);
            this._x = Math.atan2(identity.y.z, identity.z.z);
        }
        this._z = Math.round(this._z*10000)/10000;
    }
    private setOrient():void{
        const angle = [Math.cos(this._x/2*(Math.PI/180)),Math.cos(this._y/2*(Math.PI/180)),Math.cos(this._z/2*(Math.PI/180)),Math.sin(this._x/2*(Math.PI/180)),Math.sin(this._y/2*(Math.PI/180)),Math.sin(this._z/2*(Math.PI/180))]
        this.orient.qW = angle[2]*angle[1]*angle[0]+angle[5]*angle[4]*angle[4]; 
        this.orient.qX = angle[2]*angle[1]*angle[4]-angle[5]*angle[4]*angle[0];
        this.orient.qY = angle[2]*angle[4]*angle[0]+angle[5]*angle[1]*angle[3];
        this.orient.qZ = -angle[2]*angle[4]*angle[3]+angle[5]*angle[1]*angle[0];
    }

    get x():number{
        //this.fromOrient();
        return this._x;
    }
    set x(value:number){
        this._x=value;
        this.setOrient();
    }
    get y():number{
        //this.fromOrient();
        return this._y;
    }
    set y(value:number){
        this._y=value;
        this.setOrient();
    }
    get z():number{
        //this.fromOrient();
        return this._z;
    }
    set z(value:number){
        this._z=value;
        this.setOrient();
    }
}

class PosView implements Pos{
    constructor(private pos : Pos){

    }
    set x(value:number){
        this.pos.x = value;
    }
    get x():number{
        return this.pos.x;
    }
    set y(value:number){
        this.pos.y = value;
    }
    get y():number{
        return this.pos.y;
    }
    set z(value:number){
        this.pos.z = value;
    }
    get z():number{
        return this.pos.z;
    }
}
