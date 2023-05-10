import { Orient } from "./orient";
import { Pos } from "./pos";

export interface Pose {
    trans : Pos;
    rot : Orient;
}
