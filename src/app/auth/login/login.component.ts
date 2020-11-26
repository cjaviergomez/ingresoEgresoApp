import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

// SweetAlert
import Swal from 'sweetalert2';

import { AppState } from '../../app.reducer';
import { Store } from '@ngrx/store';

// Servicios
import { AuthService } from '../../services/auth.service';
import * as ui from '../../shared/ui.actions';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {
  formLogin: FormGroup;
  loading: boolean = false;
  uiSubscription: Subscription;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.formLogin = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    this.uiSubscription = this.store
      .select('ui')
      .subscribe((ui) => (this.loading = ui.isLoading));
  }

  onSubmit(): void {
    const { correo, password } = this.formLogin.value;

    this.store.dispatch(ui.isLoading());
    // Mostrar el loading
    // Swal.fire({
    //   title: 'Espere...',
    //   showConfirmButton: false,
    //   willOpen: () => {
    //     Swal.showLoading();
    //   },
    // });

    this.authService
      .loginUsuario(correo, password)
      .then((credenciales) => {
        console.log(credenciales);
        // Swal.close();
        this.store.dispatch(ui.stopLoading());
        console.log('Ir a /');
        this.router.navigate(['/']);
      })
      .catch((err) => {
        console.log(err);
        this.store.dispatch(ui.stopLoading());
        Swal.fire({
          icon: 'error',
          title: '...ooops',
          text: err.message,
        });
      });
  }

  ngOnDestroy(): void {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.
    this.uiSubscription.unsubscribe();
  }
}
