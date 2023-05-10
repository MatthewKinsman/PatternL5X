import { InfeedParam } from "./infeed-param";
import { Pose } from "./pose";

export interface InfeedRecipe {
    offset : Pose[];
    parameter : InfeedParam;
}
