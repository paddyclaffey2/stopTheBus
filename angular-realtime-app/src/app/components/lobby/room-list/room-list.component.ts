import { Component, Input, OnInit } from '@angular/core';
import { IRoom } from '../../model';

@Component({
  selector: 'room-list',
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.css']
})
export class RoomListComponent implements OnInit {

  @Input() rooms: IRoom[];

  constructor() { }

  ngOnInit(): void {
  }

}
