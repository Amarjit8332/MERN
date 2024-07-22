import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../services/employee.service';

@Component({
  selector: 'app-edit-employee',
  templateUrl: './edit-employee.component.html',
  styleUrl: './edit-employee.component.css'
})
export class EditEmployeeComponent implements OnInit{
  employee = {
    f_Image: '',
    f_Name: '',
    f_Email: '',
    f_Mobile: '',
    f_Designation: '',
    f_gender: '',
    f_Course: '',
    f_Createdate: ''
  };

  constructor(private route: ActivatedRoute, private employeeService: EmployeeService, private router: Router) {}

  ngOnInit() {
    this.getEmployee();
  }

  getEmployee() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.employeeService.getEmployeeById(Number(id)).subscribe({
        next: (data) => this.employee = data,
        error: (err) => console.error('Error fetching employee:', err)
      });
    }
  }
  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
  updateEmployee() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.employeeService.updateEmployee(Number(id), this.employee).subscribe({
        next: () => this.router.navigate(['/employees']),
        error: (err) => console.error('Error updating employee:', err)
      });
    }
  }
}