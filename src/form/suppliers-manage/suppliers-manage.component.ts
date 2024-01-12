import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, Directive, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { takeUntil } from 'rxjs';
import { BaseComponent } from 'src/base-component';
import { AppSettings } from 'src/services/api.config';


@Component({
  selector: 'app-suppliers-manage',
  templateUrl: './suppliers-manage.component.html',
  styleUrls: ['./suppliers-manage.component.scss']
})


export class SuppliersManageComponent extends BaseComponent implements OnInit {
  suppilerColumns: string[] = AppSettings.suppliersColumn;
  // dataSource: any;
  listData: any;
  numberShowPages = [4, 6, 10];
  pageIndex: number = 1;
  pageSize: number = 4;
  pageLength: number = 0;
  dataSource: any = new MatTableDataSource();
  @ViewChild(MatSort) sort: MatSort | undefined;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator | undefined;

  ngOnInit(): void {
    this.searchSuppliers();
  }
  sortData(sortData: Sort) {
    console.log(sortData, 'sortData');
    console.log(this.dataSource, 'data');
    this.dataSource.paginator = this.paginator;

    if (!sortData.active || sortData.direction === '') {
      this.sort = this.dataSource;
      return;
    }

    this.dataSource.data = this.dataSource.data.sort((a: any, b: any) => {
      const isAsc = sortData.direction === 'asc';
      switch (sortData.active) {
        case 'CODE_SUPPILER':
          return this.compare(a.code, b.code, isAsc);
        case 'NAME_SUPPILER':
          return this.compare(a.name, b.name, isAsc);
        case 'ALIAS_SUPPILER':
          return this.compare(a.alias, b.alias, isAsc);
        default:
          return 0;
      }
    });

  }
  searchSuppliers() {
    let params = {
      "page": this.pageIndex,
      "size": this.pageSize
    }
    this.supplierService.searchSupplier(params).pipe(takeUntil(this._onDestroySub))
      .subscribe((res: any) => {
        if (res && res.data) {
          this.listData = res.data.items;
          this.dataSource = new MatTableDataSource(this.listData)
          this.pageLength = res.data.totalCount;
          console.log(this.listData);

        }
      }
      )
  }
  onPaging(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.searchSuppliers();
  }
  listChecked: any[] = []
  listCheckedAll: any[] = []
  selection: any = new SelectionModel<any>(true, []);
  initDeleteMul() {
    console.log(this.listChecked, 'listchecked');

  }
  checkAll(event: any) {
    if (event.checked) {
      this.listChecked = this.listData.map((res: any) => res);
    } else {
      this.listChecked = [];
    }

    console.log(this.listChecked, 'this.listChecked');

  }
  checkOne(element: any) {
    const selectElement = this.selection.isSelected(element.id);
    console.log(selectElement, 'selectElement');
    if (selectElement) {
      this.selection.deselect(element.id);
      if (this.listChecked.length > 0) {
        this.listChecked = this.listChecked.filter(x => x.id !== element.id);
      }
    } else {
      this.selection.select(element.id);
      const isExistSelected = this.listChecked.filter(x => x.id === element.id)[0];
      if (!isExistSelected) {
        this.listChecked.push(element);
      }
    }
    console.log(this.listChecked, ' this.listChecked this.listChecked');

  }
  initEdit(item: any) { }
  initDelete(item: any) { }
  initAddSuppiler() {

  }
  closePopup() { }
  deleteSuppiler() { }
}