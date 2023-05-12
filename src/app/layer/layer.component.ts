import { Component, Input, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { PoseView } from 'src/pose-view';
import { BuildLayer } from '../recipe/build-layer';
import { BuildPick } from '../recipe/build-pick';
import { BuildTarget } from '../recipe/build-target';

@Component({
  selector: 'app-layer',
  templateUrl: './layer.component.html',
  styleUrls: ['./layer.component.css']
})
export class LayerComponent implements OnInit {

  constructor() { }
  private _layer : BuildLayer | null = null;
  private targetSubject = new Subject<BuildTarget>();

  selectedTarget = this.targetSubject.asObservable();
  copyPick: BuildPick | null=null;

  offset : PoseView =new PoseView({trans:{x:0,y:0,z:0},rot:{qW:.707107,qX:0,qY:0,qZ:.707107}});

  ngOnInit(): void {
  }

  @Input() set layer(value:BuildLayer|null){
    this._layer = value;
    if(this._layer){
      this.offset = new PoseView(this._layer!.offset);
    }else{
      this.copyPick = null;
    }
    this.targetSubject.next();
  }
  get layer():BuildLayer|null{
    return this._layer;
  }

  onTargetSelect(target : BuildTarget):void{
    this.targetSubject.next(target);
  }

  onPickCopy(target : BuildTarget):void{
    this.copyPick = target.pick;
  }

  onPickPaste(target : BuildTarget):void{
    target.pick = JSON.parse(JSON.stringify(this.copyPick));
    this.layer = this._layer;
  }
}
