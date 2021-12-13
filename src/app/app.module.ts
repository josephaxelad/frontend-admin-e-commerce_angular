import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/partials/header/header.component';
import { FooterComponent } from './components/partials/footer/footer.component';
import { SidenavComponent } from './components/partials/sidenav/sidenav.component';
import { HomeComponent } from './components/home/home.component';
import { NotFoundComponent } from './components/partials/not-found/not-found.component';
import { LoginComponent } from './components/login/login.component';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { ProductsComponent } from './components/products/products.component';
import { NewProductComponent } from './components/products/new-product/new-product.component';
import { AllProductsComponent } from './components/products/all-products/all-products.component';
import { HiddenProductsComponent } from './components/products/hidden-products/hidden-products.component';
import { EditProductComponent } from './components/products/edit-product/edit-product.component';
import { SingleProductComponent } from './components/products/single-product/single-product.component';
import { DeletedProductsComponent } from './components/products/deleted-products/deleted-products.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { EditCategoryComponent } from './components/categories/edit-category/edit-category.component';
import { NewCategoryComponent } from './components/categories/new-category/new-category.component';
import { AllCategoriesComponent } from './components/categories/all-categories/all-categories.component';
import { PageHeaderComponent } from './components/partials/page-header/page-header.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AuthInterceptor } from "./interceptors/auth.interceptor";
import { AlertComponent } from './components/partials/alert/alert.component';
import { CustomersComponent } from './components/customers/customers.component';
import { AllCustomersComponent } from './components/customers/all-customers/all-customers.component';
import { SingleCustomerComponent } from './components/customers/single-customer/single-customer.component';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
registerLocaleData(localeFr, 'fr');



@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    SidenavComponent,
    HomeComponent,
    NotFoundComponent,
    LoginComponent,
    ProductsComponent,
    NewProductComponent,
    AllProductsComponent,
    HiddenProductsComponent,
    EditProductComponent,
    SingleProductComponent,
    DeletedProductsComponent,
    CategoriesComponent,
    EditCategoryComponent,
    NewCategoryComponent,
    AllCategoriesComponent,
    PageHeaderComponent,
    AlertComponent,
    CustomersComponent,
    AllCustomersComponent,
    SingleCustomerComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,

    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
  }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
