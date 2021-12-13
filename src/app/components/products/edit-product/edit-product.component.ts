import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Category } from 'src/app/models/category';
import { Product } from 'src/app/models/product';
import { AlertsService } from 'src/app/services/alerts.service';
import { CategoriesService } from 'src/app/services/categories.service';
import { ProductsService } from 'src/app/services/products.service';
import { Location } from '@angular/common';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit {

  prefUrlProductsImage = `${environment.prefUrlProductsImage}`;
  products!: Product[];
  product!: Product;
  editProductForm!: FormGroup;
  categories!: Category[];
  imagePreview! : String;
  picture! : any ;

  inPromotion : Boolean = false;
  promotionRate! : number ;
  promotionPrice! : number ;
  price! : number ;
  submitted: boolean = false;

  constructor(
    private _route : ActivatedRoute,
    private _productsService : ProductsService,
    private _categoriesService : CategoriesService,
    private _fb : FormBuilder,
    private _router : Router,
    private _alertsService : AlertsService,
    private _location: Location) {

    /** Initialisation du formulaire de l'ajout d'un produit */

    this.editProductForm = this._fb.group({
      name : this._fb.control('',Validators.required),
      description : this._fb.control('',Validators.required),
      isHidden : this._fb.control(false,Validators.required),
      isDeleted : this._fb.control(false,Validators.required),
      inStock : this._fb.control(false,Validators.required),
      stock : this._fb.control(0,[Validators.required,Validators.min(0)]),
      inTrend : this._fb.control(false,Validators.required),
      inPromotion: this._fb.control(false,Validators.required),
      promotionRate: this._fb.control(0,[Validators.required,Validators.min(0),Validators.max(100)]),
      promotionPrice : this._fb.control(0,[Validators.required,Validators.min(0)]),
      categoryId  : this._fb.control('0',Validators.required),
      weight  : this._fb.control(0,[Validators.required,Validators.min(0)]),
      price  : this._fb.control(0,[Validators.required,Validators.min(0)]),
    })

   }

  ngOnInit(): void {

    /**Récuperer les catégories */
    this._categoriesService.categories$.subscribe(
      (categories : Category[])=>{
        this.categories = categories;
      }
    )

    this._productsService.products$.subscribe(
      (products : Product[])=>{
        const id = this._route.snapshot.params["id"];
        this.product = products?.find( product => product._id == id )!
        this.price = this.product?.price;
        this.promotionRate = this.product?.promotionRate;
        this.promotionPrice = this.product?.promotionPrice;
        this.inPromotion = this.product?.inPromotion;

        this.editProductForm.get('name')?.setValue(this.product?.name);
        this.editProductForm.get('description')?.setValue(this.product?.description);
        this.editProductForm.get('stock')?.setValue(this.product?.stock);
        this.editProductForm.get('price')?.setValue(this.product?.price);
        this.editProductForm.get('inTrend')?.setValue(this.product?.inTrend);
        this.editProductForm.get('inPromotion')?.setValue(this.product?.inPromotion);
        this.editProductForm.get('promotionRate')?.setValue(this.product?.promotionRate);
        this.editProductForm.get('promotionPrice')?.setValue(this.product?.promotionPrice);
        this.editProductForm.get('weight')?.setValue(this.product?.weight);
        this.imagePreview = this.prefUrlProductsImage+this.product?.picture!;
        if (this.product?.categoryId) {
          this.editProductForm.get('categoryId')?.patchValue(this.product?.categoryId);
        } else {
          this.editProductForm.get('categoryId')?.patchValue(0);
        }

      }
    )

  }

  /**
   * Modifie la catégorie
   */
   editProduct(){
    this.submitted = true;

    if(this.editProductForm.valid){

      const _id = this.product._id;
      const name = this.editProductForm.get('name')?.value;
      const description = this.editProductForm.get('description')?.value;
      const stock = this.editProductForm.get('stock')?.value;
      const inStock = stock > 0 ? true : false;
      const price = this.editProductForm.get('price')?.value;
      const inTrend = this.editProductForm.get('inTrend')?.value;
      const inPromotion = this.editProductForm.get('inPromotion')?.value;
      const promotionRate = inPromotion ? this.editProductForm.get('promotionRate')?.value : 0;
      const promotionPrice = inPromotion ? this.editProductForm.get('promotionPrice')?.value : 0;
      const weight = this.editProductForm.get('weight')?.value;
      const categoryId = this.editProductForm.get('categoryId')?.value;


      const product = {
        _id : _id,
        name : name,
        description : description,
        isHidden : this.product.isHidden,
        isDeleted : false,
        isVisible : this.product.isVisible,
        inStock : inStock,
        stock : stock,
        inTrend : inTrend,
        inPromotion : inPromotion,
        promotionRate : promotionRate,
        promotionPrice : promotionPrice,
        categoryId : categoryId,
        weight : weight,
        price : price,
        picture : this.product?.picture,
        createdBy : "0",
        creationDate : this.product.creationDate,

      }


      this._productsService.editProduct(product,this.picture)
      .then(()=>{
        this.submitted = false;
        this._alertsService.success('Le produit a été modifiée avec succès',
          {
            autoClose: true,
            keepAfterRouteChange: true,
          })
        // this._location.back();
        this._router.navigate(["/produits"])
      })
      .catch((error)=>{
        this.submitted = false;
        this._alertsService.error("Une erreur est survenue lors de la modification du produit, verifiez si le nom "+product.name+" n'existe pas déjà! ",
        {
          autoClose: true,
          keepAfterRouteChange: false,
        })
      })
    }

  }

  updatePromotionRate(){
    this.promotionRate = +(100*((this.price - this.promotionPrice)/this.price)).toFixed(2)
  }

  updatePromotionPrice(){
    this.promotionPrice = +(this.price - (this.promotionRate/100)*this.price).toFixed(2)
  }

  onFileChange(event : any) {
    const reader = new FileReader();

    if(event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      this.picture = event.target.files.item(0);
      reader.readAsDataURL(file);

      reader.onload = () => {

        this.imagePreview = reader.result as string;

      };

    }
  }


}
