import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Category } from 'src/app/models/category';
import { AlertsService } from 'src/app/services/alerts.service';
import { CategoriesService } from 'src/app/services/categories.service';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-new-product',
  templateUrl: './new-product.component.html',
  styleUrls: ['./new-product.component.css']
})
export class NewProductComponent implements OnInit {

  // @Input() ngModel : any;
  addProductForm!: FormGroup;
  imagePreview! : String;
  categories!: Category[];
  picture!: any;
  inPromotion : Boolean = false;
  promotionRate : number = 0;
  promotionPrice : number = 0;
  price : number = 0;
  submitted: boolean = false;

  constructor(private _fb : FormBuilder, private _productsService : ProductsService,private _categoriesService : CategoriesService, private _router : Router,private _alertsService : AlertsService) {

    /** Initialisation du formulaire de la création d'un produit */
    this.addProductForm = this._fb.group({
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
      weight  : this._fb.control(0,[Validators.min(0)]),
      picture  : this._fb.control('',Validators.required),
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
    this._categoriesService.emitCategories();
  }

  /**
   * Créer un produit
   */
  addProduct(){

    this.submitted = true;

    if (this.addProductForm.valid) {
      const name : string = this.addProductForm.get('name')?.value;
      const description : string = this.addProductForm.get('description')?.value;
      const inStock : boolean = this.addProductForm.get('inStock')?.value;
      const stock : number = this.addProductForm.get('stock')?.value;
      const inTrend : boolean = this.addProductForm.get('inTrend')?.value;
      const inPromotion : boolean = this.addProductForm.get('inPromotion')?.value;
      const promotionRate : number = this.addProductForm.get('promotionRate')?.value;
      const promotionPrice : number = this.addProductForm.get('promotionPrice')?.value;
      const categoryId : string = this.addProductForm.get('categoryId')?.value;
      const weight : number = this.addProductForm.get('weight')?.value;
      // const picture = this.addProductForm.get('picture')?.value;
      const price : number = this.addProductForm.get('price')?.value;

      const product = {
        name : name,
        description : description,
        isHidden : false,
        isDeleted : false,
        isVisible : true,
        inStock : inStock,
        stock : stock,
        inTrend : inTrend,
        inPromotion : inPromotion,
        promotionRate : promotionRate,
        promotionPrice : promotionPrice,
        categoryId : categoryId,
        weight : weight,
        price : price,
        createdBy : "0",
        creationDate : new Date(),
      }

      console.log(product)

      this._productsService.createProduct(product,this.picture)
      .then((res)=>{
        this.submitted = false;
        this.resetForm();
        this._alertsService.success('Le produit "'+product.name+'" a été ajoutée avec succès',
        {
          autoClose: true,
          keepAfterRouteChange: true,
        })
        console.log(res)
      })
      .catch((error)=>{
        this.submitted = false;
        this._alertsService.error("Une erreur est survenue lors de la création du produit, verifiez si le nom "+product.name+" n'existe pas déjà! ",
        {
          autoClose: true,
          keepAfterRouteChange: false,
        })
      })

    } else {

    }
  }


  onFileChange(event : any) {
    const reader = new FileReader();

    if(event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      this.picture = event.target.files.item(0);
      reader.readAsDataURL(file);

      reader.onload = () => {

        this.imagePreview = reader.result as string;

        // this.addProductForm.patchValue({
        //   picture: reader.result
        // });

      };

    }
  }

  resetForm(){
    this.addProductForm.reset();
    this.deleteImagePreview();
    /** Initialisation du formulaire de la création d'un produit */
    this.addProductForm = this._fb.group({
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
      weight  : this._fb.control(0,[Validators.min(0)]),
      picture  : this._fb.control('',Validators.required),
      price  : this._fb.control(0,[Validators.required,Validators.min(0)]),

    })
  }

  updatePromotionRate(){
    this.promotionRate = +(100*((this.price - this.promotionPrice)/this.price)).toFixed(2)
    // if (this.promotionRate >= 100) {
    //   this.promotionRate = 100
    // } else if (this.promotionRate <= 0) {
    //   this.promotionRate = 0
    // } else {
    //   this.promotionRate = 100*((this.price - this.promotionPrice)/this.price)
    // }

  }

  updatePromotionPrice(){
    this.promotionPrice = +(this.price - (this.promotionRate/100)*this.price).toFixed(2)
    // if (this.promotionPrice >= this.price) {
    //   this.price = this.promotionPrice
    //   this.promotionPrice = this.price - (this.promotionRate/100)*this.price
    // } else if (this.promotionPrice <= 0) {
    //   this.promotionPrice = 0
    // } else {
    //   this.promotionPrice = this.price - (this.promotionRate/100)*this.price
    // }

  }

  deleteImagePreview(){
    this.imagePreview = '';
    this.addProductForm.patchValue({
      picture: ''
    });
  }



}
