import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { PickView } from 'src/pick-view';
import { PoseView } from 'src/pose-view';
import { BuildTarget } from '../recipe/build-target';

@Component({
  selector: 'app-target',
  templateUrl: './target.component.html',
  styleUrls: ['./target.component.css']
})
export class TargetComponent implements OnInit {

  constructor(private changeDetect:ChangeDetectorRef) { }
  private _target : BuildTarget | null = null;
  position : PoseView =new PoseView({trans:{x:0,y:0,z:0},rot:{qW:.707107,qX:0,qY:0,qZ:.707107}});
  pick : PickView = new PickView({offset:{trans:{x:0,y:0,z:0},rot:{qW:.707107,qX:0,qY:0,qZ:.707107}},flags:0,mask:0})

  ngOnInit(): void {
  }

  get target():BuildTarget | null{
    return this._target;
  }
  @Input() set target(value:BuildTarget|null){
    this._target = value;
    if(this._target){
      this.position = new PoseView(this._target.position);
      this.pick = new PickView(this._target.pick);
    }
  }
}
