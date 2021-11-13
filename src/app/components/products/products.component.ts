import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from 'src/app/models/product';
import { AlertsService } from 'src/app/services/alerts.service';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  products : Product[] = [];

  constructor(private _productsService : ProductsService, private _router : Router,private _alertsService : AlertsService) { }

  ngOnInit(): void {

    /**Récuperer les produits */
    this._productsService.products$.subscribe(
      (products : Product[])=>{
        this.products = products
      }
    )
  }

  /**
   * Supprime un produit
   * @param id
   */
   isHidden(product : Product){
    const isHidden = true;
    this._productsService.isHidden(isHidden,product._id!)
    .then(()=>{
      this._alertsService.success('Le produit "'+product.name+'" a été supprimée avec succès',
        {
          autoClose: true,
          keepAfterRouteChange: true,
        });
      this._router.navigate(["/produits"])
    })
    .catch((error)=>{
      console.log(error)
    })
  }

  /**
   * Supprime un produit
   * @param id
   */
  deleteProduct(product : Product){
    this._productsService.deleteProduct(product._id!)
    .then(()=>{
      this._alertsService.success('Le produit "'+product.name+'" a été supprimée avec succès',
        {
          autoClose: true,
          keepAfterRouteChange: true,
        });
      this._router.navigate(["/produits/archives"])
    })
    .catch((error)=>{
      console.log(error)
    })
  }

}
