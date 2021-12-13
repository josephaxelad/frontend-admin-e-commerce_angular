import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Category } from 'src/app/models/category';
import { Product } from 'src/app/models/product';
import { AlertsService } from 'src/app/services/alerts.service';
import { CategoriesService } from 'src/app/services/categories.service';
import { ProductsService } from 'src/app/services/products.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-single-product',
  templateUrl: './single-product.component.html',
  styleUrls: ['./single-product.component.css']
})
export class SingleProductComponent implements OnInit {

  prefUrlProductsImage = `${environment.prefUrlProductsImage}`;
  product!: Product;
  products : Product[] = [];
  categories: Category[] = [];


  constructor(private _route : ActivatedRoute,private _productsService : ProductsService,private _categoriesService : CategoriesService,private _alertsService : AlertsService) { }

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
        const id = this._route.snapshot.params["id"];
        const product = products?.find( product => product._id == id )!
        this.product = {...product,  categoryName : this.categories?.find((cat)=>cat._id == product.categoryId)?.name!}
      }
    )
  }

  /**
   * Masque ou affiche un produit
   * @param e
   * @param product
   */
   isVisible(e: any,product : Product){
    const isVisible = e.target.checked;
    if (isVisible) {
      this._productsService.isVisible(isVisible,product._id!)
      .then(()=>{
        this._alertsService.success('Le produit "'+product.name+'" est désormais visible en ligne',
        {
          autoClose: true,
          keepAfterRouteChange: true,
        });
      })
      .catch((error)=>{console.log(error)})
    } else {
      this._productsService.isVisible(isVisible,product._id!)
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
