/**
 * UI strings, English first.
 *
 * `en` is the source of truth: its keys define the `TranslationKey` type, so a
 * string missing from `es` — or a key that doesn't exist at all — is a compile
 * error rather than a blank label discovered by a driver.
 */
export const en = {
  // ── Tabs ──
  'tab.dashboard': 'Dashboard',
  'tab.trips': 'Trips',
  'tab.alerts': 'Alerts',
  'tab.account': 'Account',

  // ── Welcome ──
  'welcome.headline': 'Welcome to\nGolden Wheels',
  'welcome.subtitle':
    'Your trips, your earnings, your schedule —\nall in one place.',
  'welcome.cta': 'Get started',

  // ── Dashboard ──
  'dashboard.greeting': 'Good day,',
  'dashboard.driver': 'Driver',
  'dashboard.upcomingTitle': 'Upcoming trips',
  'dashboard.seeAll': 'See all trips →',
  'dashboard.noActive': 'No active trip',
  'dashboard.noActiveHint': "You'll be notified the moment a trip is assigned to you.",
  'dashboard.nextTrip': 'Next trip',
  'dashboard.inProgress': 'In progress',
  'dashboard.openTrip': 'Open trip',

  // ── Availability ──
  'availability.online': "You're online",
  'availability.offline': "You're offline",
  'availability.onlineHint': 'Receiving trips and able to claim open ones',
  'availability.offlineHint': 'You will not receive new trips',
  'availability.goOnline': 'Go online',
  'availability.goOffline': 'Go offline',

  // ── Open pool ──
  'pool.title': 'Open trips',
  'pool.available_one': '{{count}} trip available',
  'pool.available_other': '{{count}} trips available',
  'pool.firstToClaim': 'First to claim gets it',
  'pool.claim': 'Claim this trip',
  'pool.emptyTitle': 'No open trips right now',
  'pool.emptyBody':
    'When your operator publishes a trip to the pool, it shows up here and the first driver to claim it gets it.',
  'pool.claimedTitle': 'Trip claimed',
  'pool.claimedBody': "It's yours. You'll find it under Trips.",
  'pool.takenTitle': 'Trip unavailable',
  'pool.takenBody': 'This trip has already been taken by another driver.',

  // ── Trips ──
  'trips.title': 'My trips',
  'trips.upcoming': 'Upcoming',
  'trips.completed': 'Completed',
  'trips.cancelled': 'Cancelled',
  'trips.summary': '{{upcoming}} upcoming · {{past}} completed',
  'trips.empty': 'No {{tab}} trips',

  // ── Trip status ──
  'status.assigned': 'Assigned',
  'status.en_route': 'On the way',
  'status.arrived': 'Arrived',
  'status.in_progress': 'In progress',
  'status.completed': 'Completed',
  'status.short.assigned': 'Assigned',
  'status.short.en_route': 'On way',
  'status.short.arrived': 'Arrived',
  'status.short.in_progress': 'Driving',
  'status.short.completed': 'Done',

  // ── Trip actions ──
  'action.assigned': "I'm on my way",
  'action.en_route': "I've arrived",
  'action.arrived': 'Start the trip',
  'action.in_progress': 'Complete the trip',
  'action.navigate': 'Navigate',
  'action.navigateTo': 'Navigate to {{stop}}',
  'action.call': 'Call',
  'action.message': 'Message',
  'action.map': 'Map',
  'action.close': 'Close',
  'action.done': 'Done',

  // ── Trip detail ──
  'trip.currentStatus': 'Current status',
  'trip.tripInProgress': 'Trip in progress',
  'trip.finished': 'Finished',
  'trip.cancelled': 'Cancelled',
  'trip.cancelledValue': 'Trip cancelled',
  'trip.upNext': 'Up next',
  'trip.stepsLeft_one': '{{count}} step left',
  'trip.stepsLeft_other': '{{count}} steps left',
  'trip.youEarn': 'You earn',
  'trip.youEarned': 'You earned',
  'trip.nextStop': 'Next stop · {{stop}}',
  'trip.customer': 'Customer',
  'trip.route': 'Route',
  'trip.pickup': 'Pickup',
  'trip.dropoff': 'Drop-off',
  'trip.noteLabel': 'Note from the customer',

  // ── Confirmations & errors ──
  'confirm.completeTitle': 'Complete this trip?',
  'confirm.completeBody': 'This closes the trip and notifies the customer. It cannot be undone.',
  'confirm.notYet': 'Not yet',
  'confirm.complete': 'Complete',
  'error.updateTrip': 'Could not update the trip',
  'error.tryAgain': 'Please try again.',
  'error.noPhoneTitle': 'No phone number',
  'error.noPhoneBody': 'This customer has no phone number on file.',
  'error.noAddressTitle': 'No address',
  'error.noAddressBody': 'This trip has no address for that stop.',
  'error.noMapsTitle': 'Could not open maps',
  'error.noMapsBody': 'No maps app is available on this device.',
  'error.callFailed': 'Could not start the call',

  // ── Alerts ──
  'alerts.title': 'Notifications',
  'alerts.summary': '{{unread}} new · {{total}} total',
  'alerts.allCaughtUp': 'All caught up',
  'alerts.emptyBody': 'No notifications to show right now.',

  // ── Account ──
  'account.title': 'Account',
  'account.myProfile': 'My profile',
  'account.terms': 'Terms and Conditions',
  'account.privacy': 'Privacy Policy',
  'account.feedback': 'Send Feedback',
  'account.signOut': 'Sign Out',
  'account.personal': 'Personal',
  'account.support': 'Support',
  'account.name': 'Name',
  'account.email': 'Email',
  'account.phone': 'Phone',
  'account.licence': 'Licence number',
  'account.language': 'Language',
} as const;

export type TranslationKey = keyof typeof en;

export const es: Record<TranslationKey, string> = {
  'tab.dashboard': 'Inicio',
  'tab.trips': 'Viajes',
  'tab.alerts': 'Alertas',
  'tab.account': 'Cuenta',

  'welcome.headline': 'Bienvenido a\nGolden Wheels',
  'welcome.subtitle': 'Tus viajes, tus ganancias, tu horario —\ntodo en un solo lugar.',
  'welcome.cta': 'Comenzar',

  'dashboard.greeting': 'Buen día,',
  'dashboard.driver': 'Conductor',
  'dashboard.upcomingTitle': 'Próximos viajes',
  'dashboard.seeAll': 'Ver todos los viajes →',
  'dashboard.noActive': 'Sin viaje activo',
  'dashboard.noActiveHint': 'Te avisaremos en cuanto se te asigne un viaje.',
  'dashboard.nextTrip': 'Próximo viaje',
  'dashboard.inProgress': 'En curso',
  'dashboard.openTrip': 'Abrir viaje',

  'availability.online': 'Estás en línea',
  'availability.offline': 'Estás desconectado',
  'availability.onlineHint': 'Recibes viajes y puedes tomar los disponibles',
  'availability.offlineHint': 'No recibirás viajes nuevos',
  'availability.goOnline': 'Conectarme',
  'availability.goOffline': 'Desconectarme',

  'pool.title': 'Viajes disponibles',
  'pool.available_one': '{{count}} viaje disponible',
  'pool.available_other': '{{count}} viajes disponibles',
  'pool.firstToClaim': 'El primero en tomarlo se lo queda',
  'pool.claim': 'Tomar este viaje',
  'pool.emptyTitle': 'No hay viajes disponibles',
  'pool.emptyBody':
    'Cuando tu operador publique un viaje, aparecerá aquí y el primer conductor en tomarlo se lo queda.',
  'pool.claimedTitle': 'Viaje tomado',
  'pool.claimedBody': 'Es tuyo. Lo encontrarás en Viajes.',
  'pool.takenTitle': 'Viaje no disponible',
  'pool.takenBody': 'Otro conductor ya tomó este viaje.',

  'trips.title': 'Mis viajes',
  'trips.upcoming': 'Próximos',
  'trips.completed': 'Completados',
  'trips.cancelled': 'Cancelados',
  'trips.summary': '{{upcoming}} próximos · {{past}} completados',
  'trips.empty': 'No hay viajes {{tab}}',

  'status.assigned': 'Asignado',
  'status.en_route': 'En camino',
  'status.arrived': 'Llegaste',
  'status.in_progress': 'En curso',
  'status.completed': 'Completado',
  'status.short.assigned': 'Asignado',
  'status.short.en_route': 'En camino',
  'status.short.arrived': 'Llegaste',
  'status.short.in_progress': 'Conduciendo',
  'status.short.completed': 'Listo',

  'action.assigned': 'Voy en camino',
  'action.en_route': 'Ya llegué',
  'action.arrived': 'Iniciar el viaje',
  'action.in_progress': 'Completar el viaje',
  'action.navigate': 'Navegar',
  'action.navigateTo': 'Navegar a {{stop}}',
  'action.call': 'Llamar',
  'action.message': 'Mensaje',
  'action.map': 'Mapa',
  'action.close': 'Cerrar',
  'action.done': 'Listo',

  'trip.currentStatus': 'Estado actual',
  'trip.tripInProgress': 'Viaje en curso',
  'trip.finished': 'Finalizado',
  'trip.cancelled': 'Cancelado',
  'trip.cancelledValue': 'Viaje cancelado',
  'trip.upNext': 'Sigue',
  'trip.stepsLeft_one': 'Queda {{count}} paso',
  'trip.stepsLeft_other': 'Quedan {{count}} pasos',
  'trip.youEarn': 'Ganas',
  'trip.youEarned': 'Ganaste',
  'trip.nextStop': 'Siguiente parada · {{stop}}',
  'trip.customer': 'Cliente',
  'trip.route': 'Ruta',
  'trip.pickup': 'Recogida',
  'trip.dropoff': 'Destino',
  'trip.noteLabel': 'Nota del cliente',

  'confirm.completeTitle': '¿Completar este viaje?',
  'confirm.completeBody': 'Esto cierra el viaje y notifica al cliente. No se puede deshacer.',
  'confirm.notYet': 'Todavía no',
  'confirm.complete': 'Completar',
  'error.updateTrip': 'No se pudo actualizar el viaje',
  'error.tryAgain': 'Inténtalo de nuevo.',
  'error.noPhoneTitle': 'Sin teléfono',
  'error.noPhoneBody': 'Este cliente no tiene teléfono registrado.',
  'error.noAddressTitle': 'Sin dirección',
  'error.noAddressBody': 'Este viaje no tiene dirección para esa parada.',
  'error.noMapsTitle': 'No se pudo abrir el mapa',
  'error.noMapsBody': 'No hay una app de mapas en este dispositivo.',
  'error.callFailed': 'No se pudo iniciar la llamada',

  'alerts.title': 'Notificaciones',
  'alerts.summary': '{{unread}} nuevas · {{total}} en total',
  'alerts.allCaughtUp': 'Estás al día',
  'alerts.emptyBody': 'No hay notificaciones por ahora.',

  'account.title': 'Cuenta',
  'account.myProfile': 'Mi perfil',
  'account.terms': 'Términos y Condiciones',
  'account.privacy': 'Política de Privacidad',
  'account.feedback': 'Enviar comentarios',
  'account.signOut': 'Cerrar sesión',
  'account.personal': 'Personal',
  'account.support': 'Soporte',
  'account.name': 'Nombre',
  'account.email': 'Correo',
  'account.phone': 'Teléfono',
  'account.licence': 'Número de licencia',
  'account.language': 'Idioma',
};

export const translations = { en, es };
export type Language = keyof typeof translations;
