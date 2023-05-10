import { BuildPick } from "./build-pick";
import { Pos } from "./pos";
import { Pose } from "./pose";

export interface BuildTarget {
    position : Pose;
    approach : Pos;
    flags : number;
    mask : number;
    pick : BuildPick;
}
