import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { BuildLayer } from '../recipe/build-layer';
import { BuildPattern } from '../recipe/build-pattern';
import { BuildPick } from '../recipe/build-pick';
import { BuildTarget } from '../recipe/build-target';
import { DestackerParam } from '../recipe/destacker-param';
import { InfeedParam } from '../recipe/infeed-param';
import { InfeedRecipe } from '../recipe/infeed-recipe';
import { Orient } from '../recipe/orient';
import { Pos } from '../recipe/pos';
import { Pose } from '../recipe/pose';
import { Recipe } from '../recipe/recipe';

@Injectable({
  providedIn: 'root'
})

export class RecipeService {

  constructor() { }

  private document : XMLDocument | undefined;
  private recipes = new ReplaySubject<Recipe[]>(1)

  import(project:string):void{
    const parser = new DOMParser();
    this.document = parser.parseFromString(project, "text/xml");
    const recipe = this.document.querySelector('Tag[Name="Recipe"]')?.getElementsByTagName('Data')[0].textContent as string;
    this.parseRecipes(recipe.replace(/\t/g, '').replace(/\n/g,''));
  }


  export(name : string):void{
    this.recipes.subscribe(x=>{
      const output = `[${x.reduce((prevRecipe, recipe, recipeIdx)=>{
        return prevRecipe+`${recipeIdx>0?'\n\t,':''}[[[${recipe.outfeed.layer.reduce((prevLayer, layer, layerIdx)=>{
          return prevLayer+`${layerIdx>0?',':''}[[${layer.target.reduce((prevTarget, target, targetIdx)=>{
            return prevTarget+`${targetIdx>0?'\n\t\t,':''}[[[${target.position.trans.x.toExponential(8)},${target.position.trans.y.toExponential(8)},${target.position.trans.z.toExponential(8)}],[${target.position.rot.qW.toExponential(8)},${target.position.rot.qX.toExponential(8)},${target.position.rot.qY.toExponential(8)},${target.position.rot.qZ.toExponential(8)}]],[${target.approach.x.toExponential(8)},${target.approach.x.toExponential(8)},${target.approach.x.toExponential(8)}],${target.flags},${target.mask},[[[${target.pick.offset.trans.x.toExponential(8)},${target.pick.offset.trans.y.toExponential(8)},${target.pick.offset.trans.z.toExponential(8)}],[${target.pick.offset.rot.qW.toExponential(8)},${target.pick.offset.rot.qX.toExponential(8)},${target.pick.offset.rot.qY.toExponential(8)},${target.pick.offset.rot.qZ.toExponential(8)}]],${target.pick.flags},${target.pick.mask}]]`
          }, '')}]\n\t,${layer.count},[[${layer.offset.trans.x.toExponential(8)},${layer.offset.trans.y.toExponential(8)},${layer.offset.trans.z.toExponential(8)}],[${layer.offset.rot.qW.toExponential(8)},${layer.offset.rot.qX.toExponential(8)},${layer.offset.rot.qY.toExponential(8)},${layer.offset.rot.qZ.toExponential(8)}]]]`
        },'')}]\n,${recipe.outfeed.count},[[${recipe.outfeed.offset.trans.x.toExponential(8)},${recipe.outfeed.offset.trans.y.toExponential(8)},${recipe.outfeed.offset.trans.z.toExponential(8)}],[${recipe.outfeed.offset.rot.qW.toExponential(8)},${recipe.outfeed.offset.rot.qX.toExponential(8)},${recipe.outfeed.offset.rot.qY.toExponential(8)},${recipe.outfeed.offset.rot.qZ.toExponential(8)}]],${recipe.outfeed.clearance.toExponential(8)}],\
[[${recipe.destacker.drop.position.toExponential(8)}],[${recipe.destacker.lift.position.toExponential(8)}],[${recipe.destacker.clamp.position.toExponential(8)},${recipe.destacker.clamp.delay.toExponential(8)}]],[${recipe.description.length},'${recipe.description}${'$00'.repeat(82-recipe.description.length)}'],
[[${recipe.infeed.offset.reduce((prevOffset,offset,offsetIdx)=>{
  return prevOffset+`${(offsetIdx>0?',':'')}[[${offset.trans.x.toExponential(8)},${offset.trans.y.toExponential(8)},${offset.trans.z.toExponential(8)}],[${offset.rot.qW.toExponential(8)},${offset.rot.qX.toExponential(8)},${offset.rot.qY.toExponential(8)},${offset.rot.qZ.toExponential(8)}]]`
},'')}],[${recipe.infeed.parameter.distance.toExponential(8)},${recipe.infeed.parameter.count},[${recipe.infeed.parameter.guideSetting[0]},${recipe.infeed.parameter.guideSetting[1]}]]]]`
      }, '')}]`
      
      const cdata = this.document?.createCDATASection(output);
      this.document!.querySelector('Tag[Name="Recipe"]')?.getElementsByTagName('Data')[0].replaceChild(cdata!, this.document!.querySelector('Tag[Name="Recipe"]')?.getElementsByTagName('Data')[0].childNodes.item(1)as Node);
      const serialize = new XMLSerializer();
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(new Blob([serialize.serializeToString(this.document!)],{type:"text/xml"}));
      link.download=name;
      link.click();
    });
  }

  public get current():Observable<Recipe[]>{
    return this.recipes.asObservable();
  }

  private parseRecipes(value:string):void{
    const recipes : Recipe[] = [];
    value = value.substring(value.indexOf('[')+1);
    do{
      value = this.parseRecipe(value.substring(value.indexOf('[')), recipe=>recipes.push(recipe));
    }while(value.indexOf(',')>=0);
    recipes[15].description="Test Export";
    console.log(recipes);
    this.recipes.next(recipes);
  }
  
  private parseRecipe(value : string, out:(recipe:Recipe)=>void):string{
    const recipe = {} as Recipe;
    value = this.parseOutfeed(value.substring(value.indexOf('[')+1), outfeed=>recipe.outfeed = outfeed);
    value = this.parseDestacker(value.substring(value.indexOf('[')), destacker=>recipe.destacker = destacker);
    value = this.parseDescription(value.substring(value.indexOf('[')), description=>recipe.description=description);
    value = this.parseInfeed(value.substring(value.indexOf('[')), infeed=>recipe.infeed = infeed);
    out(recipe);
    return value.substring(value.indexOf(']')+1);
  }

  private parseInfeed(value : string, out:(infeed : InfeedRecipe)=>void):string{
    const infeed = {} as InfeedRecipe;
    value = value.substring(value.indexOf('[')+1);
    infeed.offset = [];
    value = this.parsePose(value.substring(value.indexOf('[')+1), offset=>infeed.offset.push(offset));
    value = this.parsePose(value.substring(value.indexOf('[')), offset=>infeed.offset.push(offset));
    value = value.substring(value.indexOf('[')+1);
    infeed.parameter = {} as InfeedParam;
    infeed.parameter.distance = parseFloat(value);
    value = value.substring(value.indexOf(',')+1);
    infeed.parameter.count = parseInt(value);
    value = value.substring(value.indexOf('[')+1);
    infeed.parameter.guideSetting = [];
    infeed.parameter.guideSetting.push(parseInt(value));
    value = value.substring(value.indexOf(',')+1);
    infeed.parameter.guideSetting.push(parseInt(value));
    out(infeed);
    return value.substring(value.indexOf(']')+1).substring(value.indexOf(']')+1);
  }
  
  private parseDescription(value : string, out:(description:string)=>void):string{
    value = value.substring(value.indexOf('[')+1);
    const length = parseInt(value);
    out(value.substring(value.indexOf("'")+1).substring(0, length));
    return value.substring(value.indexOf(']')+1);
  }

  private parseDestacker(value : string, out:(destacker:DestackerParam)=>void):string{
    const destacker = {} as DestackerParam;
    value = value.substring(value.indexOf('[')+1);
    value = value.substring(value.indexOf('[')+1);
    destacker.drop = {position:parseFloat(value)};
    value = value.substring(value.indexOf('[')+1);
    destacker.lift = {position:parseFloat(value)};
    value = value.substring(value.indexOf('[')+1);
    const clamp = parseFloat(value);
    value = value.substring(value.indexOf(',')+1);
    destacker.clamp = {position:clamp, delay:parseFloat(value)};
    value = value.substring(value.indexOf(']')+1);
    out(destacker);
    return value.substring(value.indexOf(']')+1);;
  }


  private parseOutfeed(value : string, out:(outfeed : BuildPattern)=>void):string{
    const outfeed = {} as BuildPattern;
    value = this.parseLayers(value.substring(value.indexOf('[')+1), layers=>outfeed.layer=layers);
    value = value.substring(value.indexOf(',')+1);
    outfeed.count = parseInt(value);
    value = this.parsePose(value.substring(value.indexOf('[')), offset=>outfeed.offset=offset);
    value = value.substring(value.indexOf(',')+1);
    outfeed.clearance = parseFloat(value);
    out(outfeed);
    return value.substring(value.indexOf(']')+1);
  }

  private parseLayers(value : string, out:(layers:BuildLayer[])=>void):string{
    const layers : BuildLayer[] = [];
    value = value.substring(value.indexOf('[')+1);
    do{
      value = this.parseLayer(value.substring(value.indexOf('[')), layer=>layers.push(layer));
    }while(value.indexOf(']')>value.indexOf(','));
    out(layers);
    return value.substring(value.indexOf(']')+1);
  }

  private parseLayer(value : string, out:(layer:BuildLayer)=>void) : string{
    const layer = {} as BuildLayer;
    value = this.parseTargets(value.substring(value.indexOf('[')+1), targets=>layer.target = targets);
    value = value.substring(value.indexOf(',')+1);
    layer.count = parseInt(value);
    value = this.parsePose(value.substring(value.indexOf('[')), offset=>layer.offset = offset);
    out(layer);
    return value.substring(value.indexOf(']')+1);
  }

  parseTargets(value:string, out:(targets:BuildTarget[])=>void):string{
    const targets : BuildTarget[] = [];
    value = value.substring(value.indexOf('[')+1);
    do{
      value = this.parseTarget(value.substring(value.indexOf('[')), target=>targets.push(target));
    }while(value.indexOf(']')>value.indexOf(','));
    out(targets);
    return value.substring(value.indexOf(']')+1);
  }

  private parseTarget(value:string, out:(target:BuildTarget)=>void):string{
    
    const target = {} as BuildTarget;
    value = this.parsePose(value.substring(value.indexOf('[')+1), pose=>target.position = pose);
    value = this.parsePos(value.substring(value.indexOf(',')+1), trans=>target.approach = trans);
    value = value.substring(value.indexOf(',')+1);
    target.flags = parseInt(value);
    value = value.substring(value.indexOf(',')+1);
    target.mask = parseInt(value);
    value = this.parsePick(value.substring(value.indexOf(',')+1), pick=>target.pick = pick)
    out(target);
    return value.substring(value.indexOf(']')+1);
  }

  private parsePick (value:string, out:(pick : BuildPick)=>void):string{
    const pick={} as BuildPick;
    value = this.parsePose(value.substring(value.indexOf('[')+1), offset=>pick.offset = offset);
    value = value.substring(value.indexOf(',')+1);
    pick.flags = parseInt(value);
    value = value.substring(value.indexOf(',')+1);
    pick.mask = parseInt(value);
    out(pick);
    return value.substring(value.indexOf(']')+1);
  }
  
  private parsePose(value:string, out:(pose:Pose)=>void):string{
    const pose ={} as Pose;
    value = this.parsePos(value.substring(value.indexOf('[')+1), (trans)=>pose.trans = trans);
    value = this.parseOrient(value.substring(value.indexOf(',')+1),(rot)=>pose.rot = rot);
    out(pose)
    return value.substring(value.indexOf(']')+1);
  }

  private parsePos(value:string, out : (trans : Pos)=>void):string{
    const index = value.indexOf(']');
    const trans = JSON.parse(value.substring(0,index+1));
    out({x:trans[0], y:trans[1], z:trans[2]});
    return value.substring(index+1);
  }

  private parseOrient(value:string, out:(rot:Orient)=>void):string{
    const index = value.indexOf(']');
    const rot = JSON.parse(value.substring(0,index+1));
    out({qW:rot[0],qX:rot[1],qY:rot[2],qZ:rot[3]});
    return value.substring(index+1);
  }
}
