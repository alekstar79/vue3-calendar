/**
 * Localization configuration for different locales
 * Supports multiple languages and regional formats
 */

export type SupportedLocale = 'en-US' | 'ru-RU' | 'de-DE' | 'fr-FR' | 'es-ES'

export interface LocaleConfig {
  code: SupportedLocale
  name: string
  monthNames: string[]
  dayNames: string[]
  dayNamesShort: string[]
  today: string
  prevMonth: string
  nextMonth: string
  weekStartsOn: 'monday' | 'sunday'
}

export const localeConfigs: Record<SupportedLocale, LocaleConfig> = {
  'en-US': {
    code: 'en-US',
    name: 'English (US)',
    monthNames: [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ],
    dayNames: [
      'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
    ],
    dayNamesShort: [
      'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'
    ],
    today: 'Today',
    prevMonth: 'Previous Month',
    nextMonth: 'Next Month',
    weekStartsOn: 'sunday'
  },
  'ru-RU': {
    code: 'ru-RU',
    name: 'Русский',
    monthNames: [
      'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
      'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
    ],
    dayNames: [
      'Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'
    ],
    dayNamesShort: [
      'Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'
    ],
    today: 'Сегодня',
    prevMonth: 'Предыдущий месяц',
    nextMonth: 'Следующий месяц',
    weekStartsOn: 'monday'
  },
  'de-DE': {
    code: 'de-DE',
    name: 'Deutsch',
    monthNames: [
      'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
      'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
    ],
    dayNames: [
      'Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'
    ],
    dayNamesShort: [
      'So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'
    ],
    today: 'Heute',
    prevMonth: 'Vorheriger Monat',
    nextMonth: 'Nächster Monat',
    weekStartsOn: 'monday'
  },
  'fr-FR': {
    code: 'fr-FR',
    name: 'Français',
    monthNames: [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ],
    dayNames: [
      'Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'
    ],
    dayNamesShort: [
      'Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'
    ],
    today: 'Aujourd\'hui',
    prevMonth: 'Mois précédent',
    nextMonth: 'Mois suivant',
    weekStartsOn: 'monday'
  },
  'es-ES': {
    code: 'es-ES',
    name: 'Español',
    monthNames: [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ],
    dayNames: [
      'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'
    ],
    dayNamesShort: [
      'Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'
    ],
    today: 'Hoy',
    prevMonth: 'Mes anterior',
    nextMonth: 'Próximo mes',
    weekStartsOn: 'monday'
  }
}

export function getLocaleConfig(locale: SupportedLocale): LocaleConfig {
  return localeConfigs[locale] || localeConfigs['en-US']
}
