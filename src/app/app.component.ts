import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgFor, AsyncPipe,NgIf } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { NumberFormatPipe } from './pipes/number-format.pipe';
import { NgxSpinnerService, NgxSpinnerModule } from 'ngx-spinner';
import { BASE_URL } from 'src/constant';

interface IOptionData {
  user_id: Number;
  username: string;
  fullname: string;
  picture: string;
  followers: Number;
  is_verified: boolean;
}

interface IPostItem {
  display_url: string;
  like_count: number;
  comment_count: number;
}

interface IUserDetails {
  followers: number;
  fullname: string;
  is_verified: boolean;
  picture: string;
  user_id: string;
  username: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    NgFor,
    AsyncPipe,
    MatGridListModule,
    MatCardModule,
    NgxSpinnerModule,
    NgIf
  ],
})
export class AppComponent {
  myControl = new FormControl('');
  options: IOptionData[] = [];
  posts: IPostItem[] = [];
  userDetails: IUserDetails = {
    followers: 0,
    fullname: '',
    is_verified: false,
    picture: '',
    user_id: '',
    username: '',
  };

  constructor(
    private http: HttpClient,
    private numberFormat: NumberFormatPipe,
    private SpinnerService: NgxSpinnerService
  ) {}

  transformValue(value: any): any {
    return this.numberFormat.transform(value);
  }

  searchOptions() {
    const searchTerm = this.myControl.value;
    this.http
      .get<any[]>(`${BASE_URL}/user?search=${searchTerm}`)
      .subscribe((response: any) => {
        this.options = response.data;
      });
  }

  onOptionSelected(event: any) {
    this.SpinnerService.show();
    this.userDetails = event.option.value;
    const selectedOption = event.option.value;
    this.posts=[]
    this.http
      .get<any[]>(
        `${BASE_URL}/user/post?search=${selectedOption.username}`
      )
      .subscribe((response: any) => {
        this.posts = response;
        this.SpinnerService.hide();
      });
    // Perform additional actions based on the selected option
  }

  public displayProperty(value: any) {
    if (value) {
      return value.fullname;
    }
  }
}
