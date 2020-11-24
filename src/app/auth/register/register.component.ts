import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

// Servicios
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  formRegister: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.formRegister = this.fb.group({
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.formRegister.invalid) {
      return;
    }

    const { nombre, correo, password } = this.formRegister.value;

    // Mostrar el loading
    Swal.fire({
      title: 'Espere...',
      showConfirmButton: false,
      willOpen: () => {
        Swal.showLoading();
      },
    });

    this.authService
      .crearUsuario(nombre, correo, password)
      .then((credenciales) => {
        Swal.close();
        this.router.navigate(['/dashboard']);
      })
      .catch((err) => {
        console.error(err);
        Swal.fire({
          icon: 'error',
          title: '...ooops',
          text: err.message,
        });
      });
  }
}
