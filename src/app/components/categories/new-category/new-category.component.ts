import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Category } from 'src/app/models/category';
import { AlertsService } from 'src/app/services/alerts.service';
import { CategoriesService } from 'src/app/services/categories.service';

@Component({
  selector: 'app-new-category',
  templateUrl: './new-category.component.html',
  styleUrls: ['./new-category.component.css']
})
export class NewCategoryComponent implements OnInit {

  addCategoryForm : FormGroup;
  categories: Category[] = [];
  submitted: boolean = false;


  constructor(private _fb : FormBuilder, private _categoriesService : CategoriesService, private _router : Router,private _alertsService : AlertsService) {

    /** Initialisation du formulaire de l'ajout d'une catégorie */
    this.addCategoryForm = this._fb.group({
      name : this._fb.control('',Validators.required),
      parent : this._fb.control(0,Validators.required),
    })


  }

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
   * Ajoute une catégorie
   */
  addCategory() : void{

    this.submitted = true;

    if (this.addCategoryForm.valid) {
      const name = this.addCategoryForm.get('name')?.value;
      const idParent = this.addCategoryForm.get('parent')?.value;
      const isParent = idParent != 0 ? true : false;

      const category = {name : name, idParent : idParent , isParent : isParent};

      this._categoriesService.addCategory(category)
      .then((res)=>{
        this.submitted = false;
        this._alertsService.success('La catégorie "'+category.name+'" a été ajoutée avec succès',
        {
          autoClose: true,
          keepAfterRouteChange: true,
        }
        )
        this._router.navigate(["/categories"])
      })
      .catch((error)=>{
        this.submitted = false;
        this._alertsService.error("Une erreur est survenue lors de la création de la catégorie, verifiez si le nom "+category.name+" n'existe pas déjà! ",
        {
          autoClose: true,
          keepAfterRouteChange: false,
        })
      })


    } else {

    }
  }

}
