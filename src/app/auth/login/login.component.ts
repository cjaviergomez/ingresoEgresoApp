import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

// SweetAlert
import Swal from 'sweetalert2';

// Servicios
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  formLogin: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.formLogin = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit(): void {
    const { correo, password } = this.formLogin.value;

    // Mostrar el loading
    Swal.fire({
      title: 'Espere...',
      showConfirmButton: false,
      willOpen: () => {
        Swal.showLoading();
      },
    });

    this.authService
      .loginUsuario(correo, password)
      .then((credenciales) => {
        console.log(credenciales);
        Swal.close();
        this.router.navigate(['/']);
      })
      .catch((err) => {
        console.log(err);
        Swal.fire({
          icon: 'error',
          title: '...ooops',
          text: err.message,
        });
      });
  }
}
