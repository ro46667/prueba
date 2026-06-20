import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatchService } from '../../services/match.service';

@Component({
  selector: 'app-match-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './match-edit.component.html',
  styleUrls: ['./match-edit.component.css']
})
export class MatchEditComponent implements OnInit {
  form: FormGroup;
  loading    = true;
  submitting = false;
  errorMsg: string | null = null;
  matchId!: number;

  constructor(
    private fb:           FormBuilder,
    private matchService: MatchService,
    private route:        ActivatedRoute,
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

  ngOnInit(): void {
    this.matchId = Number(this.route.snapshot.paramMap.get('id'));
    this.matchService.getMatchById(this.matchId).subscribe({
      next: (res) => {
        const m = res.data;
        // datetime-local input necesita formato YYYY-MM-DDTHH:mm
        const dateLocal = m.match_date
          ? new Date(m.match_date).toISOString().slice(0, 16)
          : '';
        this.form.patchValue({
          team_home:    m.team_home,
          team_away:    m.team_away,
          goals_home:   m.goals_home,
          goals_away:   m.goals_away,
          match_status: m.match_status,
          match_date:   dateLocal,
        });
        this.loading = false;
      },
      error: () => {
        this.errorMsg = 'No se pudo cargar el partido.';
        this.loading  = false;
      }
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

    this.matchService.updateMatch(this.matchId, this.form.value).subscribe({
      next:  () => this.router.navigate(['/matches']),
      error: (err) => {
        this.errorMsg   = err.error?.message ?? 'Error al actualizar el partido.';
        this.submitting = false;
      }
    });
  }
}
