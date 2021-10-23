import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Category } from 'src/app/models/category';
import { AlertsService } from 'src/app/services/alerts.service';
import { CategoriesService } from 'src/app/services/categories.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {

  categories: Category[] = [];

  constructor(private _categoriesService : CategoriesService, private _router : Router,private _alertsService : AlertsService) { }

  ngOnInit(): void {

    /**Récuperer les catégories */
    this._categoriesService.categories$.subscribe(
      (categories : Category[])=>{
        this.categories = categories;
      }
    )
    this._categoriesService.emitCategories();
  }

  /**
   * Supprime une catégorie
   * @param id
   */
  deleteCategory(category : Category){
    this._categoriesService.deleteCategory(category._id!)
    .then(()=>{
      this._alertsService.success('La catégorie "'+category.name+'" a été supprimée avec succès',
        {
          autoClose: true,
          keepAfterRouteChange: true,
        });
      this._router.navigate(["/categories"])
    })
    // .catch((error)=>{ console.log(error) })

  }
}
