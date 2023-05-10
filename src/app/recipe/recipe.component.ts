import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Subject } from 'rxjs';
import { PoseView } from 'src/pose-view';
import { BuildLayer } from './build-layer';
import { Recipe } from './recipe';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.css']
})
export class RecipeComponent implements OnInit {

  
  constructor() { }

  private _recipe : Recipe | null = null;
  offset : PoseView =new PoseView({trans:{x:0,y:0,z:0},rot:{qW:.707107,qX:0,qY:0,qZ:.707107}});

  private layerSubject = new Subject<BuildLayer>();

  selectedLayer = this.layerSubject.asObservable();

  @Input() set recipe(value : Recipe|null){
    this._recipe = value;
    if(this.recipe){
      this.offset = new PoseView(this._recipe!.outfeed!.offset);
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

}
