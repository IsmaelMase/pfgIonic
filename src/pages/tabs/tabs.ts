import { Component } from '@angular/core';

import { RecursosPage } from '../recursos/recursos';
import { PerfilPage } from '../perfil/perfil';
import { HomePage } from '../home/home';
import { ReservasPage } from '../reservas/reservas';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  inicio = HomePage;
  recursos = RecursosPage;
  perfil = PerfilPage;
  reservas = ReservasPage;

  constructor() {

  }
}
