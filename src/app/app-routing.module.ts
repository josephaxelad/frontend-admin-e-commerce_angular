import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AllCategoriesComponent } from './components/categories/all-categories/all-categories.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { EditCategoryComponent } from './components/categories/edit-category/edit-category.component';
import { NewCategoryComponent } from './components/categories/new-category/new-category.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { NotFoundComponent } from './components/partials/not-found/not-found.component';
import { AllProductsComponent } from './components/products/all-products/all-products.component';
import { EditProductComponent } from './components/products/edit-product/edit-product.component';
import { NewProductComponent } from './components/products/new-product/new-product.component';
import { ProductsComponent } from './components/products/products.component';
import { SingleProductComponent } from './components/products/single-product/single-product.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  // { path: '**', component:  },
  { path: 'login', component: LoginComponent },
  { path: 'home', component:  HomeComponent,canActivate : [AuthGuard]},
  { path: 'categories' , component: CategoriesComponent ,canActivate : [AuthGuard],
    children: [
      { path : 'ajouter', component: NewCategoryComponent},
      { path : 'modifier/:id', component: EditCategoryComponent},
      { path : '', component: AllCategoriesComponent},
      { path: '', pathMatch: 'full', redirectTo: '' },
    ]
  },
  { path: 'produits' , component: ProductsComponent ,canActivate : [AuthGuard],
    children: [
      { path : 'ajouter', component: NewProductComponent},
      { path : 'produit/:id', component: SingleProductComponent},
      { path : 'modifier/:id', component: EditProductComponent},
      { path : '', component: AllProductsComponent},
      { path: '', pathMatch: 'full', redirectTo: '' },
    ]
  },
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
