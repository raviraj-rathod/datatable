import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import myData from '../assets/data/MOCK_DATA.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  tableData:any = myData;
  dtOptions: any;
  localStorageData:any = localStorage.getItem('tabledData');
  editDetail:any = {};
  updateform!: FormGroup;
  submitted: boolean = false
  dtTrigger: Subject<any> = new Subject();
constructor(
  private modalService:NgbModal,
  private formBuilder: FormBuilder,
){
console.log(this.tableData)
}

 ngOnInit(): void {
   this.getLocalStorage();
   this.randerTable();
  this.updateform = this.formBuilder.group(
    {
      firstName: ['', [Validators.required]],
      lastName: ['',[Validators.required]],
      email: ['',[Validators.required,Validators.email]]
    })
  this.dtOptions = {
    dom: '<"top d-flex justify-content-between"fB>rt<"bottom"ilp><"clear">',
    select: true,
    buttons: [
      {
        extend: 'excel',
        exportOptions: {
          columns: [1, 2, 3, 4, 5, 6]
        }
      }
    ],
    order: [[0, 'asc']],
    "columnDefs": [
      {
        "targets": [6],
        "orderable": false
      },
    ]

  };
 }
 getLocalStorage(){
    if(this.localStorageData){
      this.tableData = JSON.parse(this.localStorageData);
    }else{
      this.setLocastorage()
    }
  }
  setLocastorage(){
    localStorage.setItem('tabledData',(JSON.stringify(this.tableData)))    
  }
  openModal(item:any, modalName:any) {
    console.log(item);
    this.editDetail = item
    this.updateform.controls.lastName.setValue(item.lastName)
    this.updateform.controls.firstName.setValue(item.firstName)
    this.updateform.controls.email.setValue(item.email) 
    const ms = this.modalService.open(modalName,
       { centered: true, modalDialogClass: "recipe-modal" });
    ms.dismissed.subscribe((res: any) => {
      this.editDetail = {}

    })

  }
  randerTable() {

    let dataTable = $("#users-table").DataTable();
    dataTable.destroy();
    this.dtTrigger.next();
  }
  submitUpdate(){
    this.submitted = true;
    console.log(this.updateform);
    if (this.updateform.invalid) return
    this.tableData.users.forEach((e:any) => {
      if (e.id == this.editDetail.id) {
        e.firstName = this.updateform.value.firstName
        e.lastName = this.updateform.value.lastName
        e.email = this.updateform.value.email
      }
    });
    this.modalService.dismissAll()
    this.setLocastorage();
  }
  removeUser(modal:any){
    this.submitted = true;
    console.log(this.updateform);
    if (this.updateform.invalid) return
    this.tableData.users.forEach((e:any,i:number) => {
      if (e.id == this.editDetail.id) {
        this.tableData.users.splice(i, 1);
        this.randerTable();
      }
    });
    this.setLocastorage()
    modal.close();
  }
}
