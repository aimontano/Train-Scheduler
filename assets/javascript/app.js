// Initialize Firebase
var config = {
  apiKey: "AIzaSyBvOVJ48jlHigGJcqUs7HXEEYOo0nh7XFE",
  authDomain: "train-scheduler-5c72a.firebaseapp.com",
  databaseURL: "https://train-scheduler-5c72a.firebaseio.com",
  projectId: "train-scheduler-5c72a",
  storageBucket: "train-scheduler-5c72a.appspot.com",
  messagingSenderId: "280573182229"
};

firebase.initializeApp(config);

let database = firebase.database();

// functions upload train info to databas
const uploadTrain = (name, destination, firstTrainTime, frequency) => {
  database.ref('/trains').push({
    trainName: name,
    trainDestination: destination,
    trainFrequency: frequency,
    firstTrainTime: firstTrainTime
  });
}

// loads data from database
database.ref('/trains').on('child_added', snap => {
  displayTrains(snap.val()); // displays data
});

// functions return mins away according to mins frequency
const getMinsAway = snap => {
  let now = (moment().hour() * 60) + moment().minute();
  let minsAway = Math.abs((now % snap.trainFrequency) - snap.trainFrequency);
  return minsAway;
}

// functions returns next arrival
const getNextArrival = snap => {
  let minsAway = getMinsAway(snap);
  let nextArrival = moment().add(minsAway, 'minutes').format('hh:mm A');
  return nextArrival;
}

// functions displays data 
const displayTrains = snap => {
  let tr = $('<tr>');
  tr.append($('<td>').text(snap.trainName));
  tr.append($('<td>').text(snap.trainDestination));
  tr.append($('<td>').text(snap.trainFrequency));
  tr.append($('<td>').text(getNextArrival(snap)));
  tr.append($('<td>').text(getMinsAway(snap)));
  $('tbody').append(tr);
}


// when submit button is clicked...
$('#btnAdd').click(e => {
  e.preventDefault();

  let trainName = $('#txtTrainName').val().trim();
  let trainDestination = $('#txtTrainDestination').val().trim();
  let firstTrainTime = $('#txtFirstTrainTime').val().trim();
  let trainFrequency = $('#txtFrequency').val().trim();

  let firstTime = moment(firstTrainTime, 'HH:mm');

  if(trainName != '' && trainDestination != '' && firstTime != '' && trainFrequency != '') {
    uploadTrain(trainName, trainDestination, firstTrainTime, trainFrequency);
  }

  $('#txtTrainName').val('');
  $('#txtTrainDestination').val('');
  $('#txtFirstTrainTime').val('');
  $('#txtFrequency').val('');

});