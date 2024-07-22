import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../services/employee.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.css'
})
export class EmployeeListComponent implements OnInit{

  employees: any[] = [];

  constructor(private employeeService: EmployeeService,private router: Router) {}

  ngOnInit() {
    this.loadEmployees();
  }

  loadEmployees() {
    this.employeeService.getAllEmployees().subscribe({
      next: (data: any[]) => this.employees = data,
      error: (err) => console.error('Error fetching employees:', err)
    });
  }
  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
  deleteEmployee(id: number) {
    this.employeeService.deleteEmployee(id).subscribe({
      next: () => this.loadEmployees(),
      error: (err) => console.error('Error deleting employee:', err)
    });
  }
}