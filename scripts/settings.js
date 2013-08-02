/*exported Settings, Lang */

var Settings = {

  'host': 'http://www.ridingsocial.net/api/',
  //host: 'http://localhost:3000/api/',
  'coeff': 0.01,
  'radius': 3,
  'checkin_distance': 1,
  'android_gcm_senderID': '535845696743',
  'geoloc_timeout': 30000,
  'facebook_app_ID': '290983157607960',
  'facebook_permissions': 'email, user_location'
};

var Lang = {
  en: {
    'checkin_successful': 'Check-in successful!',
    'error_checkin': 'Oops...',
    'error_location': 'Could not get your location. Check you\'ve got GPS enabled and we\'ll try again!',
    'error_comment': 'Could not save your comment. Check your data connection and try again.',
    'error': 'Oops...'
  }
};