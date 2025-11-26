import { Component, OnInit, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProfileService } from '../../services/profile.service';
import { IProfile } from '../../interfaces/IProfile';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  private readonly api = inject(ProfileService);
  private readonly fb = inject(FormBuilder);

  profile = signal<IProfile | null>(null);
  updated = signal<boolean>(false);
  isLoading = signal<boolean>(false);

  profileForm!: FormGroup;

  ngOnInit(): void {
    this.initForm();
    this.loadProfile();
  }

  private initForm() {
    this.profileForm = this.fb.group({
      full_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      birthday: [''],
      address: [''],
    });
  }

  loadProfile() {
    this.api.getProfile().subscribe({
      next: (res) => {
        this.profile.set(res);
        this.profileForm.patchValue(res);
      },
    });
  }

  submitForm() {
    if (this.profileForm.invalid) return;

    this.isLoading.set(true);

    this.api.updateProfile(this.profileForm.value).subscribe({
      next: () => {
        this.updated.set(true);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }
}
