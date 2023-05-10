import { Component, Input, OnInit } from '@angular/core';
import { BuildTarget } from '../recipe/build-target';

@Component({
  selector: 'app-target',
  templateUrl: './target.component.html',
  styleUrls: ['./target.component.css']
})
export class TargetComponent implements OnInit {

  constructor() { }
  private _target : BuildTarget | null = null;
  ngOnInit(): void {
  }

  get target():BuildTarget | null{
    return this._target;
  }
  @Input() set target(value:BuildTarget|null){
    this._target = value;
  }
}
