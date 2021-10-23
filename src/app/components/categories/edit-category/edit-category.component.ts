import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Category } from 'src/app/models/category';
import { AlertsService } from 'src/app/services/alerts.service';
import { CategoriesService } from 'src/app/services/categories.service';

@Component({
  selector: 'app-edit-category',
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.css']
})
export class EditCategoryComponent implements OnInit {

  categories!: Category[];
  category!: Category;
  parent!: Category;
  editCategoryForm!: FormGroup;
  submitted: boolean = false;

  constructor(private _route : ActivatedRoute, private _categoriesService : CategoriesService,private _fb : FormBuilder,private _router : Router,private _alertsService : AlertsService) {

    /** Initialisation du formulaire de l'ajout d'une catégorie */
    this.editCategoryForm = this._fb.group({
      name : this._fb.control('',Validators.required),
      parent : this._fb.control('',Validators.required),
    })
   }

  ngOnInit(): void {

    this._categoriesService.categories$.subscribe(
      (categories : Category[])=>{
        const id = this._route.snapshot.params["id"];
        this.categories = categories;
        this.category = categories?.find( category => category._id == id )!

        //Récuperer le nom de la catégorie parent
        this.parent = categories?.find( category => category._id == this.category?.idParent )!

        this.editCategoryForm.get('name')?.setValue(this.category?.name);
        if (this.category?.isParent) {
          this.editCategoryForm.get('parent')?.patchValue(this.parent?._id);
        } else {
          this.editCategoryForm.get('parent')?.patchValue(0);
        }


      }
    )

  }

  /**
   * Modifie la catégorie
   */
  editCategory(){

    this.submitted = true;

    if(this.editCategoryForm.valid){

      const _id = this.category._id;
      const name = this.editCategoryForm.get('name')?.value;
      const idParent = this.editCategoryForm.get('parent')?.value;
      const isParent = idParent != 0 ? true : false;

      const category = {_id : _id, name : name, idParent : idParent , isParent : isParent};


      this._categoriesService.editCategory(category)
      .then(()=>{
        this.submitted = false;
        this._alertsService.success('La catégorie a été modifiée avec succès',
          {
            autoClose: true,
            keepAfterRouteChange: true,
          }
          )
          this._router.navigate(["/categories"])
      })
      .catch((error)=>{
        this.submitted = false;
        this._alertsService.error("Une erreur est survenue lors de la modification du produit, verifiez si le nom "+category.name+" n'existe pas déjà! ",
        {
          autoClose: true,
          keepAfterRouteChange: false,
        })
      })
    }

  }

}
