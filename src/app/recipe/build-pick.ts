import { Pose } from "./pose";

export interface BuildPick {
    offset : Pose;
    flags : number;
    mask : number;
}
