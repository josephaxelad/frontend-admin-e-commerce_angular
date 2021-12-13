import { Component, OnInit } from '@angular/core';
import { Category } from 'src/app/models/category';
import { Product } from 'src/app/models/product';
import { AlertsService } from 'src/app/services/alerts.service';
import { CategoriesService } from 'src/app/services/categories.service';
import { ProductsService } from 'src/app/services/products.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-deleted-products',
  templateUrl: './deleted-products.component.html',
  styleUrls: ['./deleted-products.component.css']
})
export class DeletedProductsComponent implements OnInit {

  prefUrlProductsImage = `${environment.prefUrlProductsImage}`;
  products : Product[] = [];
  productsByPage: Product[] = [];
  categories: Category[] = [];
  numberOfElementToShow : number = 9;
  numberOfPage : number = 0;
  numberTotalOfpage : number = 0;
  pages : number[] = [];


  constructor(private _productsService : ProductsService,private _categoriesService : CategoriesService,private _alertsService : AlertsService) { }

  ngOnInit(): void {
    /**Récuperer les catégories */
    this._categoriesService.categories$.subscribe(
      (categories : Category[])=>{
        this.categories = categories
        console.log(categories)
      }
    )

    /**Récuperer les produits archivés */
    this._productsService.products$.subscribe(
      (products : Product[])=>{

        this.numberTotalOfpage = Math.ceil(products?.length/this.numberOfElementToShow)
        for (let i = 1; i < this.numberTotalOfpage + 1; i++) {
          this.pages.push(i)
        }

        this.products = products?.filter((product)=>product.isHidden == true)?.map(
          (product : Product)=> ({...product, categoryName : this.categories?.find((cat)=>cat._id == product.categoryId)?.name! })
        )
        console.log(this.products)
      }
    )

    this.getProductsBypage(1);
  }

  restore(product : Product){
    this._productsService.isHidden(false,product._id!)
    .then(()=>{
      this._alertsService.success('Le produit "'+product.name+'" a été restauré avec succès ! ',
      {
        autoClose: true,
        keepAfterRouteChange: false,
      });
    })
    .catch((error)=>{
      this._alertsService.error("Une erreur est survenue, le produit "+product.name+" n'a été restauré ! ",
      {
        autoClose: true,
        keepAfterRouteChange: false,
      });
    })



  }

  getProductsBypage(numberOfPage : number){
    this.numberOfPage = numberOfPage;
    /**Récuperer les produits */
    this._productsService.products$.subscribe(
      (products : Product[])=>{

        const products_ = products?.filter((product)=>product.isHidden == true)?.map(
          (product : Product)=> ({...product, categoryName : this.categories?.find((cat)=>cat._id == product.categoryId)?.name! })
        )

        this.productsByPage = products_?.slice(this.numberOfElementToShow*(numberOfPage-1),this.numberOfElementToShow*numberOfPage)

        console.log(this.productsByPage)
      }
    )
  }

}
