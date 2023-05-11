import { Component, ElementRef, SecurityContext, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import {map, switchMap} from 'rxjs/operators';

import { Recipe } from './recipe/recipe';
import { RecipeService } from './services/recipe.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private selectSubject = new Subject<Recipe>();
  @ViewChild('export') exportLink : ElementRef | undefined;

  title = 'PatternL5X';
  recipes : Observable<Recipe[]>;
  selected = this.selectSubject.asObservable();
  refresh = new BehaviorSubject(true);
  copyRecipe : Recipe | null = null;
  revision = 0;

  constructor(private recipe : RecipeService, private sanatizer : DomSanitizer){
    this.recipes = this.refresh.pipe(switchMap(x=>recipe.current));
    this.recipe.export('').subscribe(x=>{
      const link = this.exportLink?.nativeElement as HTMLAnchorElement;
      link.href = x;
    })
  }

  onSelect(recipe : Recipe):void{
    this.selectSubject.next(recipe);
  }

  onImport(event : Event):void{
    const target = event.target as HTMLInputElement;
    const reader = new FileReader();
    reader.onload = (file)=>{
      this.recipe.import(file.target?.result as string)
    }
    reader.readAsText(target.files![0]);
  }

  onExport():void{
    this.recipe.export(`Update_${this.revision++}.L5X`).subscribe(x=>console.log(x));
  }

  onRecipeCopy(recipe : Recipe) : void{
    this.copyRecipe = recipe;
    console.log(this.copyRecipe);
  }

  onRecipePaste(index : number) : void{
    this.recipe.paste(this.copyRecipe!, index);
    //this.refresh.next(true);
  }
}
