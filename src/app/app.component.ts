import { Component } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Recipe } from './recipe/recipe';
import { RecipeService } from './services/recipe.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private selectSubject = new Subject<Recipe>();
  

  title = 'PatternL5X';
  recipes : Observable<Recipe[]>;
  selected = this.selectSubject.asObservable();

  
  constructor(private recipe : RecipeService){
    this.recipes = recipe.current;
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
    this.recipe.export('Update.L5X');
  }
}
