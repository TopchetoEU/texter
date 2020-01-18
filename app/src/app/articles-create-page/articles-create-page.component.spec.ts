import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticlesCreatePageComponent } from './articles-create-page.component';

describe('ArticlesCreatePageComponent', () => {
  let component: ArticlesCreatePageComponent;
  let fixture: ComponentFixture<ArticlesCreatePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArticlesCreatePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticlesCreatePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
