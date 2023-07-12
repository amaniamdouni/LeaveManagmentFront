import { Component, ViewChild } from '@angular/core';
import { BoardComponent } from './board/board.component';

@Component({
  selector: 'app-all-teams',
  templateUrl: './all-teams.component.html',
  styleUrls: ['./all-teams.component.scss'],
  providers: [],
})
export class AllteamsComponent {
  public title = 'Oh My Kanban!';

  @ViewChild(BoardComponent)
  boardComponent!: BoardComponent;
}
