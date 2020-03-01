import * as angularCore from '@angular/core';
import * as angularPBD from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import * as environment from './environments/environment';
if (environment.environment.production) {
    angularCore.enableProdMode();
}
angularPBD.platformBrowserDynamic().bootstrapModule(AppModule)
    .catch(err => console.error(err));
//# sourceMappingURL=main.js.map