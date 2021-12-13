import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Customer } from 'src/app/models/customer';
import { AlertsService } from 'src/app/services/alerts.service';
import { CustomersService } from 'src/app/services/customers.service';

@Component({
  selector: 'app-all-customers',
  templateUrl: './all-customers.component.html',
  styleUrls: ['./all-customers.component.css']
})
export class AllCustomersComponent implements OnInit {

  customers : Customer[] = [];
  customersByPage: Customer[] = [];
  numberOfElementToShow : number = 25;
  currentPage : number = 1;
  numberTotalOfpage : number = 0;
  pages : number[] = [];

  constructor(private _customersService : CustomersService, private _router : Router,private _alertsService : AlertsService) { }

  ngOnInit(): void {
    /**Récuperer les produits */
    this._customersService.customers$.subscribe(
      (customers : Customer[])=>{

        this.numberTotalOfpage = Math.ceil(customers?.length/this.numberOfElementToShow)
        this.pages=[];
        for (let i = 1; i < this.numberTotalOfpage + 1; i++) {
          this.pages.push(i)
        }
        this.customers = customers;

        // this.customers = customers?.filter((customer)=>customer.isDisabled == false)
        // console.log(this.customers)
      }
    )

    this.getCustomersByPage(this.currentPage);
  }

  getCustomersByPage(currentPage : number){
    this.currentPage = currentPage;
    /**Récuperer les produits */
    this._customersService.customers$.subscribe(
      (customers : Customer[])=>{

        this.customersByPage = customers?.slice(this.numberOfElementToShow*(currentPage-1),this.numberOfElementToShow*currentPage)

        console.log(this.customersByPage)
      }
    )
  }

  /**
   *
   * @param isDisabled
   * @param customer
   */
  isDisabled(isDisabled : boolean,customer :  Customer){
    let message : string;
    if (isDisabled) {
      message = 'Le compte de "'+customer.user.firstname+' '+customer.user.lastname+'" a été désactivé avec succès'
    } else {
      message = 'Le compte de "'+customer.user.firstname+' '+customer.user.lastname+'" a été activé avec succès'
    }
    this._customersService.isDisabled(isDisabled,customer._id!)
    .then(()=>{
      this._alertsService.success(message,
        {
          autoClose: true,
          keepAfterRouteChange: true,
        });
      this._router.navigate(["/clients"])
    })
    .catch((error)=>{
      // console.log(error)
    })
  }
}
