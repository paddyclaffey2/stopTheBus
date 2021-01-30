import { Component, Input, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil} from 'rxjs/operators'
import { User } from '../model';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {
  @Input() isConnected: boolean;
  @Input() numOfConnectedUsers: number;
  @Input() user: User;
  
  constructor() { }

  ngOnInit(): void {
  }

}
