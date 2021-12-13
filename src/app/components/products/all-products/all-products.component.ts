import { Component, OnInit } from '@angular/core';
import { Category } from 'src/app/models/category';
import { Product } from 'src/app/models/product';
import { AlertsService } from 'src/app/services/alerts.service';
import { CategoriesService } from 'src/app/services/categories.service';
import { ProductsService } from 'src/app/services/products.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-all-products',
  templateUrl: './all-products.component.html',
  styleUrls: ['./all-products.component.css']
})
export class AllProductsComponent implements OnInit {

  prefUrlProductsImage = `${environment.prefUrlProductsImage}`;
  categories: Category[] = [];
  products : Product[] = [];
  productsByPage: Product[] = [];
  numberOfElementToShow : number = 9;
  currentPage : number = 1;
  numberTotalOfpage : number = 0;
  pages : number[] = [];

  constructor(
    private _productsService : ProductsService,
    private _categoriesService : CategoriesService,
    private _alertsService : AlertsService ) { }

  ngOnInit(): void {

    /**Récuperer les catégories */
    this._categoriesService.categories$.subscribe(
      (categories : Category[])=>{
        this.categories = categories
        console.log(categories)

        /**Récuperer les produits */
        this._productsService.products$.subscribe(
          (products : Product[])=>{

            this.numberTotalOfpage = Math.ceil(products?.length/this.numberOfElementToShow)
            this.pages=[];
            for (let i = 1; i < this.numberTotalOfpage + 1; i++) {
              this.pages.push(i)
            }

            this.products = products?.filter((product)=>product.isHidden == false)?.map(
              (product : Product)=> ({...product, categoryName : categories?.find((cat)=>cat._id == product.categoryId)?.name! })
            )
            console.log(this.products)
          }
        )
      }
    )



    this.getProductsBypage(this.currentPage);
  }

  /**
   * Rend visible un produit
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

  getProductsBypage(currentPage : number){
    this.currentPage = currentPage;
    /**Récuperer les produits */
    this._productsService.products$.subscribe(
      (products : Product[])=>{

        const products_ = products?.filter((product)=>product.isHidden == false)?.map(
          (product : Product)=> ({...product, categoryName : this.categories?.find((cat)=>cat._id == product.categoryId)?.name! })
        )

        this.productsByPage = products_?.slice(this.numberOfElementToShow*(currentPage-1),this.numberOfElementToShow*currentPage)

        console.log(this.productsByPage)
      }
    )
  }


}
