import { BuildPick } from "./app/recipe/build-pick";
import { PoseView } from "./pose-view";

export class PickView {
    constructor(private pick : BuildPick){

    }
    offset = new PoseView(this.pick.offset);
    flags = new FlagsView(this.pick);
    mask = new MaskView(this.pick);
}

class FlagsView{
    constructor(private pick:BuildPick){

    }
    get sensor_1():boolean{
        return(Boolean(this.pick.flags&1));
    }
    set sensor_1(value:boolean){
        this.pick.flags = value?this.pick.flags|1:this.pick.flags&~1
    }
    get sensor_2():boolean{
        return(Boolean(this.pick.flags&2));
    }
    set sensor_2(value:boolean){
        this.pick.flags = value?this.pick.flags|2:this.pick.flags&~2
    }
    get sensor_3():boolean{
        return(Boolean(this.pick.flags&4));
    }
    set sensor_3(value:boolean){
        this.pick.flags = value?this.pick.flags|4:this.pick.flags&~4
    }
    get sensor_4():boolean{
        return(Boolean(this.pick.flags&8));
    }
    set sensor_4(value:boolean){
        this.pick.flags = value?this.pick.flags|8:this.pick.flags&~8
    }
    get sensor_5():boolean{
        return(Boolean(this.pick.flags&16));
    }
    set sensor_5(value:boolean){
        this.pick.flags = value?this.pick.flags|16:this.pick.flags&~16
    }
    get sensor_6():boolean{
        return(Boolean(this.pick.flags&32));
    }
    set sensor_6(value:boolean){
        this.pick.flags = value?this.pick.flags|32:this.pick.flags&~32
    }
    get sensor_7():boolean{
        return(Boolean(this.pick.flags&64));
    }
    set sensor_7(value:boolean){
        this.pick.flags = value?this.pick.flags|64:this.pick.flags&~64
    }
    get zone_1():boolean{
        return(Boolean(this.pick.flags&256));
    }
    set zone_1(value:boolean){
        this.pick.flags = value?this.pick.flags|256:this.pick.flags&~256
    }
    get zone_2():boolean{
        return(Boolean(this.pick.flags&512));
    }
    set zone_2(value:boolean){
        this.pick.flags = value?this.pick.flags|512:this.pick.flags&~512
    }
    get zone_3():boolean{
        return(Boolean(this.pick.flags&1024));
    }
    set zone_3(value:boolean){
        this.pick.flags = value?this.pick.flags|1024:this.pick.flags&~1024
    }
    get zone_4():boolean{
        return(Boolean(this.pick.flags&2048));
    }
    set zone_4(value:boolean){
        this.pick.flags = value?this.pick.flags|2048:this.pick.flags&~2048
    }
}

class MaskView{
    constructor(private pick:BuildPick){

    }
    get sensor_1():boolean{
        return(Boolean(this.pick.mask&1));
    }
    set sensor_1(value:boolean){
        this.pick.mask = value?this.pick.mask|1:this.pick.mask&~1
    }
    get sensor_2():boolean{
        return(Boolean(this.pick.mask&2));
    }
    set sensor_2(value:boolean){
        this.pick.mask = value?this.pick.mask|2:this.pick.mask&~2
    }
    get sensor_3():boolean{
        return(Boolean(this.pick.mask&4));
    }
    set sensor_3(value:boolean){
        this.pick.mask = value?this.pick.mask|4:this.pick.mask&~4
    }
    get sensor_4():boolean{
        return(Boolean(this.pick.mask&8));
    }
    set sensor_4(value:boolean){
        this.pick.mask = value?this.pick.mask|8:this.pick.mask&~8
    }
    get sensor_5():boolean{
        return(Boolean(this.pick.mask&16));
    }
    set sensor_5(value:boolean){
        this.pick.mask = value?this.pick.mask|16:this.pick.mask&~16
    }
    get sensor_6():boolean{
        return(Boolean(this.pick.mask&32));
    }
    set sensor_6(value:boolean){
        this.pick.mask = value?this.pick.mask|32:this.pick.mask&~32
    }
    get sensor_7():boolean{
        return(Boolean(this.pick.mask&64));
    }
    set sensor_7(value:boolean){
        this.pick.mask = value?this.pick.mask|64:this.pick.mask&~64
    }
}