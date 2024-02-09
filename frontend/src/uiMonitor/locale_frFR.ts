/* eslint-disable sort-keys-fix/sort-keys-fix */

import fr_FR from 'rsuite/locales/fr_FR'

import type { Locale } from 'rsuite'

const Calendar = {
  sunday: 'Dim',
  monday: 'Lundi',
  tuesday: 'Mardi',
  wednesday: 'Merc',
  thursday: 'Jeudi',
  friday: 'Vend',
  saturday: 'Sam',
  ok: 'OK',
  today: "Aujourd'hui",
  yesterday: 'Hier',
  hours: 'Heures',
  minutes: 'Minutes',
  seconds: 'Secondes',
  formattedMonthPattern: 'MMM, yyyy',
  formattedDayPattern: 'MMM dd, yyyy',
  dateLocale: fr_FR.Calendar.dateLocale
}

export const FR_FR_LOCALE: Locale = {
  Breadcrumb: {
    expandText: 'Montrer le chemin'
  },
  Calendar,
  CloseButton: {
    closeLabel: 'Fermer'
  },
  common: {
    // clear: 'Effacer',
    emptyMessage: 'Aucune donnée',
    loading: 'Chargement...'
    // remove: 'Supprimer'
  },
  DatePicker: {
    ...Calendar
  },
  DateRangePicker: {
    ...Calendar,
    last7Days: '7 derniers jours'
  },
  InputPicker: {
    createOption: 'Créer option "{0}"',
    newItem: 'Nouvel item'
  },
  Pagination: {
    first: 'Premier',
    last: 'Dernier',
    limit: '{0} / page',
    more: 'Plus',
    next: 'Suivant',
    prev: 'Précédent',
    skip: 'Aller à {0}',
    total: 'Total : {0}'
  },
  Picker: {
    checkAll: 'Tout',
    noResultsText: 'Aucun résultat trouvé',
    placeholder: 'Sélectionner',
    searchPlaceholder: 'Rechercher'
  },
  Plaintext: {
    notSelected: 'Non sélectionné',
    notUploaded: 'Non téléchargé',
    unfilled: 'Vide'
  },
  Toggle: {
    off: 'Fermer',
    on: 'Ouvrir'
  },
  Uploader: {
    complete: 'Terminé',
    emptyFile: 'Vide',
    error: 'Erreur',
    inited: 'Initial',
    progress: 'En cours',
    // removeFile: 'Supprimer',
    upload: 'Charger'
  }
}
