import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Customer } from 'src/app/models/customer';
import { AlertsService } from 'src/app/services/alerts.service';
import { CustomersService } from 'src/app/services/customers.service';

@Component({
  selector: 'app-single-customer',
  templateUrl: './single-customer.component.html',
  styleUrls: ['./single-customer.component.css']
})
export class SingleCustomerComponent implements OnInit {

  customer! : Customer;

  constructor(private _route : ActivatedRoute,private _customersService : CustomersService, private _router : Router,private _alertsService : AlertsService) { }

  ngOnInit(): void {

    /**Récuperer le client */
    this._customersService.customers$.subscribe(
      (customers : Customer[])=>{
        const id = this._route.snapshot.params["id"];
        this.customer = customers?.find( customer => customer._id == id )!
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
      // this._router.navigate(["/clients"])
    })
    .catch((error)=>{
      // console.log(error)
    })
  }

}
