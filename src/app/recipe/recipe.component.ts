import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Subject } from 'rxjs';
import { PoseView } from 'src/pose-view';
import { BuildLayer } from './build-layer';
import { BuildTarget } from './build-target';
import { Recipe } from './recipe';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.css']
})
export class RecipeComponent implements OnInit {

  
  constructor() { }

  private _recipe : Recipe | null = null;
  palletOffset : PoseView =new PoseView({trans:{x:0,y:0,z:0},rot:{qW:.707107,qX:0,qY:0,qZ:.707107}});
  infeedOffset : PoseView[] =[new PoseView({trans:{x:0,y:0,z:0},rot:{qW:.707107,qX:0,qY:0,qZ:.707107}}),new PoseView({trans:{x:0,y:0,z:0},rot:{qW:.707107,qX:0,qY:0,qZ:.707107}})];

  private layerSubject = new Subject<BuildLayer>();

  selectedLayer = this.layerSubject.asObservable();
  copyTarget : BuildTarget[] | null = null;

  @Input() set recipe(value : Recipe|null){
    this._recipe = value;
    if(this.recipe){
      this.palletOffset = new PoseView(this._recipe!.outfeed!.offset);
      this.infeedOffset = [new PoseView(this._recipe!.infeed!.offset[0]),new PoseView(this._recipe!.infeed!.offset[1])]
    }else{
      this.copyTarget = null;
    }
    this.layerSubject.next();
  }

  get recipe():Recipe | null{
    return this._recipe;
  }


  ngOnInit(): void {
  }

  onLayerSelect(layer : BuildLayer):void{
    this.layerSubject.next(layer);
  }

  onTargetCopy(layer : BuildLayer):void{
    this.copyTarget = layer.target;
  }

  onTargetPaste(layer : BuildLayer):void{
    //layer.target = this.copyTarget!;
    layer.target = JSON.parse(JSON.stringify(this.copyTarget));
    this.recipe = this._recipe;
  }

}
