import { BuildTarget } from "./build-target";
import { Pose } from "./pose";

export interface BuildLayer {
    target : BuildTarget[];
    count : number;
    offset : Pose;
}
