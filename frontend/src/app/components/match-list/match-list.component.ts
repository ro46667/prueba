import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatchService } from '../../services/match.service';
import { Match } from '../../models/match.model';

@Component({
  selector: 'app-match-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './match-list.component.html',
  styleUrls: ['./match-list.component.css']
})
export class MatchListComponent implements OnInit {
  matches: Match[] = [];
  loading  = true;
  error: string | null = null;

  constructor(private matchService: MatchService) {}

  ngOnInit(): void { this.loadMatches(); }

  loadMatches(): void {
    this.loading = true;
    this.error   = null;
    this.matchService.getMatches().subscribe({
      next:  (res) => { this.matches = res.data; this.loading = false; },
      error: ()    => { this.error = 'No se pudo conectar con el servidor.'; this.loading = false; }
    });
  }

  deleteMatch(id: number, teamHome: string, teamAway: string): void {
    if (!confirm(`¿Eliminar el partido ${teamHome} vs ${teamAway}?`)) return;
    this.matchService.deleteMatch(id).subscribe({
      next:  () => { this.matches = this.matches.filter(m => m.id !== id); },
      error: () => alert('Error al eliminar el partido.')
    });
  }

  statusClass(status: string): string {
    const map: Record<string, string> = {
      'Pendiente': 'status-pending',
      'En Curso':  'status-live',
      'Finalizado':'status-done'
    };
    return map[status] ?? '';
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('es-ES', {
      day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit'
    });
  }
}
