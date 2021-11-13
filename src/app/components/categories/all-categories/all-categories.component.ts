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
  categoriesByPage: Category[] = [];
  numberOfElementToShow : number = 10;
  numberOfPage : number = 0;
  numberTotalOfpage : number = 0;
  pages : number[] = [];

  constructor(private _categoriesService : CategoriesService) { }

  ngOnInit(): void {

    /**Récuperer les catégories */
    this._categoriesService.categories$.subscribe(
      (categories : Category[])=>{

        this.numberTotalOfpage = Math.ceil(categories?.length/this.numberOfElementToShow)
        for (let i = 1; i < this.numberTotalOfpage + 1; i++) {
          this.pages.push(i)
        }

        this.categories = categories?.map(
          (category)=> ({...category, parentName :categories.find((cat)=>cat._id == category.idParent)?.name! })
        )
        console.log(this.categories)
        this.categories = this.categories?.sort((a,b)=> a.parentName! < b.parentName! ? 1 : -1);
      }
    )

    this.getCategoriesByPage(1);

  }

  /**
   * Récupérer les catégories par page
   * @param numberOfPage
   */
  getCategoriesByPage(numberOfPage : number){

    /**Récuperer les catégories */
    this._categoriesService.categories$.subscribe(
      (categories : Category[])=>{

        this.numberOfPage = numberOfPage;

        const categories_ = categories?.map(
          (category)=> ({...category, parentName :categories.find((cat)=>cat._id == category.idParent)?.name! })
        )
        console.log(categories)
        this.categoriesByPage = categories_?.slice(this.numberOfElementToShow*(numberOfPage-1),this.numberOfElementToShow*numberOfPage)
        console.log(this.categoriesByPage)

        // console.log(this.categories)
        // this.categories = this.categories?.sort((a,b)=> a.parentName! < b.parentName! ? 1 : -1);
      }
    )
  }

}
