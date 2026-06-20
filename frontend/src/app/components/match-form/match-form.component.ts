import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatchService } from '../../services/match.service';

@Component({
  selector: 'app-match-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './match-form.component.html',
  styleUrls: ['./match-form.component.css']
})
export class MatchFormComponent {
  form: FormGroup;
  submitting = false;
  errorMsg: string | null = null;

  constructor(
    private fb:           FormBuilder,
    private matchService: MatchService,
    private router:       Router
  ) {
    this.form = this.fb.group({
      team_home:    ['', [Validators.required, Validators.maxLength(100)]],
      team_away:    ['', [Validators.required, Validators.maxLength(100)]],
      goals_home:   [0,  [Validators.required, Validators.min(0)]],
      goals_away:   [0,  [Validators.required, Validators.min(0)]],
      match_status: ['Pendiente', Validators.required],
      match_date:   ['', Validators.required],
    });
  }

  get f() { return this.form.controls; }

  isInvalid(field: string): boolean {
    const ctrl = this.form.get(field);
    return !!(ctrl?.invalid && ctrl?.touched);
  }

  submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    this.submitting = true;
    this.errorMsg   = null;

    this.matchService.createMatch(this.form.value).subscribe({
      next:  () => this.router.navigate(['/matches']),
      error: (err) => {
        this.errorMsg  = err.error?.message ?? 'Error al crear el partido.';
        this.submitting = false;
      }
    });
  }
}
