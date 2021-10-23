import { Component, OnInit } from '@angular/core';
import { Category } from 'src/app/models/category';
import { Product } from 'src/app/models/product';
import { AlertsService } from 'src/app/services/alerts.service';
import { CategoriesService } from 'src/app/services/categories.service';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-all-products',
  templateUrl: './all-products.component.html',
  styleUrls: ['./all-products.component.css']
})
export class AllProductsComponent implements OnInit {

  products : Product[] = [];
  categories: Category[] = [];

  constructor(private _productsService : ProductsService,private _categoriesService : CategoriesService,private _alertsService : AlertsService ) { }

  ngOnInit(): void {

    /**Récuperer les catégories */
    this._categoriesService.categories$.subscribe(
      (categories : Category[])=>{
        this.categories = categories
        console.log(categories)
      }
    )

    /**Récuperer les produits */
    this._productsService.products$.subscribe(
      (products : Product[])=>{
        this.products = products?.map(
          (product)=> ({...product, categoryName : this.categories?.find((cat)=>cat._id == product.categoryId)?.name! })
        )
        console.log(this.products)
      }
    )
  }

  /**
   * Masque ou affiche un produit
   * @param e
   * @param product
   */
  isHidden(e: any,product : Product){
    const isHidden = e.target.checked;
    console.log(isHidden)
    if (isHidden) {
      this._productsService.isHidden(isHidden,product._id!)
      .then(()=>{
        this._alertsService.success('Le produit "'+product.name+'" est désormais visible en ligne',
        {
          autoClose: true,
          keepAfterRouteChange: true,
        });
      })
      .catch((error)=>{console.log(error)})
    } else {
      this._productsService.isHidden(isHidden,product._id!)
      .then(()=>{
        this._alertsService.success('Le produit "'+product.name+'" est désormais invisible en ligne',
        {
          autoClose: true,
          keepAfterRouteChange: true,
        });
      })
      .catch((error)=>{console.log(error)})
    }
  }

}
