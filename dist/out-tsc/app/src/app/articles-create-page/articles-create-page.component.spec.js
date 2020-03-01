import { async, TestBed } from '@angular/core/testing';
import { ArticlesCreatePageComponent } from './articles-create-page.component';
describe('ArticlesCreatePageComponent', () => {
    let component;
    let fixture;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ArticlesCreatePageComponent]
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
//# sourceMappingURL=articles-create-page.component.spec.js.map