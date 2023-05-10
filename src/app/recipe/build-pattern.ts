import { BuildLayer } from "./build-layer";
import { Pose } from "./pose";

export interface BuildPattern {
    layer : BuildLayer[];
    offset : Pose;
    count : number;
    clearance: number;
}
