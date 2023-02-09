var events = [{
    event: "ComicCon",
    city: "New York",
    state: "New York",
    attendance: 240000,
    date: "06/01/2017",
},
{
    event: "ComicCon",
    city: "New York",
    state: "New York",
    attendance: 250000,
    date: "06/01/2018",
},
{
    event: "ComicCon",
    city: "New York",
    state: "New York",
    attendance: 257000,
    date: "06/01/2019",
},
{
    event: "ComicCon",
    city: "San Diego",
    state: "California",
    attendance: 130000,
    date: "06/01/2017",
},
{
    event: "ComicCon",
    city: "San Diego",
    state: "California",
    attendance: 140000,
    date: "06/01/2018",
},
{
    event: "ComicCon",
    city: "San Diego",
    state: "California",
    attendance: 150000,
    date: "06/01/2019",
},
{
    event: "HeroesCon",
    city: "Charlotte",
    state: "North Carolina",
    attendance: 40000,
    date: "06/01/2017",
},
{
    event: "HeroesCon",
    city: "Charlotte",
    state: "North Carolina",
    attendance: 45000,
    date: "06/01/2018",
},
{
    event: "HeroesCon",
    city: "Charlotte",
    state: "North Carolina",
    attendance: 50000,
    date: "06/01/2019",
},
];

function buildDropDown() {
    //get the dropdown meny from the page
    let dropdownMenu = document.getElementById('eventDropDown');
    //empty the innerHTML to ensure it is clean
    dropdownMenu.innerHTML = '';

    //get our events
    let currEvents = getEventData();

    //pull out just the city nanmes 
    let eventCities = currEvents.map(
        function (event) {
            return event.city
        }
    );
    //filter the cities to only distinct city names
    let distinctCities = [...new Set(eventCities)];

    //get the template from the page
    const template = document.getElementById('dropdownItemTemplate');

    //copy the template
    let dropdownTemplateNode = document.importNode(template.content, true);
    //get the a tag from the tempalte copy
    let menuItem = dropdownTemplateNode.querySelector('a');
    //change the text
    menuItem.textContent = 'All Cities';
    menuItem.setAttribute("data-string", "All");
    // <a class="drop-down items" data-string="All">All Cities</a>

    //add items to the page 
    dropdownMenu.appendChild(menuItem);

    for (let index = 0; index < distinctCities.length; index++) {
        let cityMenuItem = document.importNode(template.content, true);
        let cityButton = cityMenuItem.querySelector('a');

        cityButton.textContent = distinctCities[index];
        cityButton.setAttribute("data-string", distinctCities[index]);

        dropdownMenu.appendChild(cityMenuItem);
    }

    displayStats(currEvents);
    displayEventData(currEvents);
}

function displayStats(eventsArray) {
    let totalAttendance = calculateTotal(eventsArray);
    let averageAttendance = calculateAverage(eventsArray);
    let mostAttended = calculateMax(eventsArray);
    let leastAttended = calculateMin(eventsArray);

    //do some math

    document.getElementById('total').textContent = totalAttendance.toLocaleString(
        
    );
    document.getElementById('average').textContent = averageAttendance.toLocaleString(
        "en-US", {
        maximumFractionDigits: 0,
        minimumFractionDigits: 0
    }
    );
    document.getElementById('most').textContent = mostAttended.toLocaleString();
    document.getElementById('least').textContent = leastAttended.toLocaleString();


}


function calculateTotal(eventsArray) {
    let sum = 0;

    for (let index = 0; index < eventsArray.length; index++) {
        let currentEvent = eventsArray[index];
        sum = sum + currentEvent.attendance;


    }
    return sum;
}

function calculateAverage(eventsArray) {
    let total = calculateTotal(eventsArray); // above
    let average = total / eventsArray.length;
    return average;

}

function calculateMax(eventsArray) {
    let max = eventsArray[0].attendance;

    for (let index = 0; index < eventsArray.length; index++) {
        let currentEvent = eventsArray[index];

        if (currentEvent.attendance > max) {
            max = currentEvent.attendance;
        }

    }
    return max;

}

function calculateMin(eventsArray) {
    let min = eventsArray[0].attendance;

    for (let index = 0; index < eventsArray.length; index++) {
        let currentEvent = eventsArray[index];
        if (currentEvent.attendance < min) {
            min = currentEvent.attendance;
        }
    }
    return min;

}

function displayEventData(eventsArray) {
    let tableBody = document.getElementById('eventTableBody');
    const tableRowTemplate = document.getElementById('eventTableRowTemplate');

    tableBody.innerHTML = ''; // clear table body 

    for (let i = 0; i < eventsArray.length; i++) {
        let eventRow = document.importNode(tableRowTemplate.content, true);
        let currentEvent = eventsArray[i];


        let tableCells = eventRow.querySelectorAll('td');

        tableCells[0].textContent = currentEvent.event;
        tableCells[1].textContent = currentEvent.city;
        tableCells[2].textContent = currentEvent.state;
        tableCells[3].textContent = currentEvent.attendance.toLocaleString( "en-US", {
            maximumFractionDigits: 0,
            minimumFractionDigits: 0
        });
        tableCells[4].textContent = currentEvent.date;

        tableBody.appendChild(eventRow);



    }



}

function getEventData() { // went into dropdown function
    let currentEvents = JSON.parse(localStorage.getItem('superDogEventData')); // do i have anything in storage

    if (currentEvents == null) { //if i don't, use the events array and store it so next time i have something in stoage
        currentEvents = events;
        localStorage.setItem('superDogEventData', JSON.stringify(currentEvents)); //JSON - put into string then parse back into object
    }

    return currentEvents;
}

function getEvents(element) {
    let currentEvents = getEventData(); //get all events we have full array of every event
    let cityName = element.getAttribute('data-string'); 
    //from a tag element in template give me your data-string attribute which we set to be hte name 
    //of city they clcked on reducing to city data

    let filteredEvents = currentEvents;

    if (cityName != 'All') {
         filteredEvents = currentEvents.filter(
            function (event) {
                if (cityName == event.city) {
                    return event;
                }
            }
        );
    }


    document.getElementById('statsHeader').textContent = cityName;
    displayStats(filteredEvents);
    displayEventData(filteredEvents);
}

function saveEventData() {
    //get info from form inputs
    let eventName = document.getElementById('newEventName').value;
    let cityName = document.getElementById('newEventCity').value;
    let eventAttendance = parseInt(document.getElementById('newEventAttendance').value);
    let eventDate = document.getElementById('newEventDate').value;

    eventDate = `${eventDate} 00:00`;
    eventDate = new Date(eventDate).toLocaleDateString();

    let stateSelect = document.getElementById('newEventState');
    let state = stateSelect.options[stateSelect.selectedIndex].text;

    let newEvent = {
            event: eventName,
            city: cityName,
            state: state,
            attendance: eventAttendance,
            date: eventDate,
    };

    let currentEvents = getEventData();
    currentEvents.push(newEvent);

    localStorage.setItem("superDogEventData", JSON.stringify(currentEvents));
    //update the page

    buildDropDown();
    document.getElementById('statsHeader').textContent = 'All';
    document.getElementById('newEventForm').reset();
}


//delete an event enhancement
