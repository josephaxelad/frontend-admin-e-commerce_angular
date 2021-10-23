import { Component, OnInit } from '@angular/core';
import { Category } from 'src/app/models/category';
import { CategoriesService } from 'src/app/services/categories.service';

@Component({
  selector: 'app-all-categories',
  templateUrl: './all-categories.component.html',
  styleUrls: ['./all-categories.component.css']
})
export class AllCategoriesComponent implements OnInit {

  categories: Category[] = [];

  constructor(private _categoriesService : CategoriesService) { }

  ngOnInit(): void {

    /**Récuperer les catégories */
    this._categoriesService.categories$.subscribe(
      (categories : Category[])=>{
        this.categories = categories?.map(
          (category)=> ({...category, parentName :categories.find((cat)=>cat._id == category.idParent)?.name! })
        )
        console.log(this.categories)
        this.categories = this.categories?.sort((a,b)=> a.parentName! < b.parentName! ? 1 : -1);
      }
    )
  }

}
