import { BuildPattern } from "./build-pattern";
import { DestackerParam } from "./destacker-param";
import { InfeedRecipe } from "./infeed-recipe";

export interface Recipe {
    outfeed : BuildPattern;
    destacker : DestackerParam;
    description : string;
    infeed : InfeedRecipe;
}
