const toggleBtn = document.getElementById('toggle-mode'); //Gets the theme toggle button and stores it in a variable to be recalled multiple times

function setTheme(isDark) { //Switches between light and dark mode
  document.body.classList.toggle('dark-mode', isDark); //Adds and removes dark mode, if isDark = true, it adds dark mode
  document.body.classList.toggle('light-mode', !isDark); //!isDark is the inverse, aka light mode - the same principle applies, if !isDark = true it removes light mode
  toggleBtn.textContent = isDark ? 'Light Mode' : 'Dark Mode'; //Updates the button text dependent on the current theming
  localStorage.setItem('theme', isDark ? 'dark' : 'light'); //Saves the mode to the user's browser, even after closing or refreshing, saving the mode under the key
}

toggleBtn.addEventListener('click', () => setTheme(!document.body.classList.contains('dark-mode'))); //Upon click, it checks if dark mode is currently in use, switching to the opposite mode
const savedTheme = localStorage.getItem('theme'); //Checks if there is a theme preference, checking if it's dark mode, passing it through 'savedTheme'
if (savedTheme) setTheme(savedTheme === 'dark'); // if there is a saved theme, it applies it


  const DESKTOP = 992; //Stores the desktop's width size in pixels, being unadaptable 
  const isDesktop = () => window.innerWidth >= DESKTOP; //Activates if the screen meets the pixel requirments, using an arrow function to determine whether to use the desktop or mobile site

  const findBtn = document.getElementById('findActivitiesBtn');
  if (findBtn) {
    const step1 = document.getElementById('step1'); //Stores step 1 (the location) in this variable, so each variable can be referenced repeatedly
    const step2 = document.getElementById('step2');
    const step3 = document.getElementById('step3'); 
  

    let userLocation     = null; //Each step starts empty, being completed by user input - calls upon geolocation or manual postcode entry
    let selectedDate     = null; //Gets filled in a dd/mm/yyyy format
    let selectedActivity = ''; //Gets set by user choice, though also allows for all activities, hence it's an empty string to allow all


  function checkAllComplete() { //Checks whether all 3 steps are completed
    const allDone = userLocation && selectedActivity !== undefined && selectedDate; //Sets 'allDone' to true if all 3 steps are completed, checking they're not null 
    findBtn.disabled = !allDone; //if 'allDone' is true (all steps completed), then it allows the 'Find Activities' button to be clicked, if it's false then it stays greyed out
  }


  function setStatus(el, msg, type) { //Writes text into status paragraphs - el being element to write in to, msg being the message displayed and type to add status effects via CSS (i.e. green and red colours indicating status)
    el.textContent = msg; //Writes the text message
    el.className = 'status-text ' + (type || ''); //Applies if the status text is correct or an error, and leaves it blank if undefined
  }

  function showFieldError(inputEl, errorEl, msg) { //Shows a validation error on an input field
//inputEl = the input that failed (i.e. the postcode input)
//errorEl = the <p class="field-error"> paragraph below the input
//msg = the error message to display
    inputEl.classList.add('invalid'); //Adds red border + shake animation via CSS
    inputEl.classList.remove('valid'); //Removes green border if it was previously valid
    errorEl.textContent = msg; //Writes the error message into the paragraph
    errorEl.classList.add('visible'); //Makes the paragraph visible (was display:none)
    inputEl.setAttribute('aria-invalid', 'true'); //Tells screen readers this field has an error
    inputEl.focus(); //Moves cursor focus to the issue
  }

  function clearFieldError(inputEl, errorEl) { //Clears a validation error - called when the user starts correcting their input
    inputEl.classList.remove('invalid'); //Removes red border
    errorEl.classList.remove('visible'); //Hides the error message
    inputEl.removeAttribute('aria-invalid'); //Removes the screen reader error flag
  } 

  function markFieldValid(inputEl, errorEl) { //Marks an input as successfully validated — called after postcode/date passes checks
    inputEl.classList.add('valid');
    inputEl.classList.remove('invalid');
    errorEl.classList.remove('visible');
    inputEl.removeAttribute('aria-invalid');
  }


  function openStep(stepEl) { //Opens or closes a step card on mobile (accordion), while exiting the function on desktop
    if (isDesktop()) return; //On desktop (≥992px) do nothing — steps are always open, no accordion needed
    if (stepEl.classList.contains('locked')) return; //If the card is still locked due to the previous step not being completed then it will remain locked, being unable to be opened
    const isOpen = stepEl.classList.contains('open'); //Checks whether the card is open
    stepEl.classList.toggle('open', !isOpen); //Toggles the 'open' class to the oppsite state
    stepEl.querySelector('.step-header').setAttribute('aria-expanded', String(!isOpen)); //Updates 'aria-expanded' on the header button to match the new state, 'String(!isOpen)' converts the boolean to the string 'true' or 'false', as 'setAttribute' requires a string value
  }

  function unlockAndOpenStep(stepEl) { //Unlocks a step card on mobile, after it's confirmed that the previous steps have been completed
    stepEl.classList.remove('locked'); //Removes the 'locked' class, which changes the colour from grey to white, to indicate to the user that, that section can now be completed and allows interaction
    const trigger = stepEl.querySelector('.step-header'); //Finds the header button inside this step card
    trigger.removeAttribute('disabled'); //Removes the disabled attribute from the header button, without this the button is completely unclickable even after unlocking
    if (!isDesktop()) { //Checks if the device is a desktop device, where if it's a desktop the cards will all be visible, whereas on mobile it will unlock the cards after completing steps
      setTimeout(() => { //Delays the process of opening the card, in order to give the animations time to finish and not interrupt each other
        stepEl.classList.add('open'); //Expands the card
        trigger.setAttribute('aria-expanded', 'true'); //Informs screen readers the card is open
        stepEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); //Scrolls the page smoothly, so that the new page becomes visible in a straightforward way
      }, 220);//ms or milliseconds 
    }
  }

  function markStepComplete(stepEl) { //Marks a section as complete, adding the green border and done badge so that it's clear to the user they have completed said section
    stepEl.classList.add('completed'); //Adds the 'completed' class, triggering the CSS to make the header's border green, making the done badge visible and turning the step number circle green
    if (!isDesktop()) { 
      stepEl.classList.remove('open'); //Collapses the card
      stepEl.querySelector('.step-header').setAttribute('aria-expanded', 'false'); //Informs screen readers that the content is hidden
    }
    }

  document.querySelectorAll('.step-header').forEach(btn => { //Attaches a click listener to every step header button on the page, with 'querySelectorAll' returning all elements with class 'step-header' as a list,
  //with 'forEach' looping through each one and adding the same click handler to each
    btn.addEventListener('click', () => openStep(btn.closest('.step-card'))); //'btn.closest('.step-card')' ascends through the DOM tree from the button to find the parent step card div, which is what 'openStep()' needs
  });

  window.addEventListener('resize', () => { //Listens for the browser being resized
    if (isDesktop()) {
     [step2, step3].forEach(s => s.querySelector('.step-header').removeAttribute('disabled')); //if the browser is resized to a desktop screen size (from mobile), then it will treat the device like a desktop
     //It will remove the 'disabled' attribute from steps 2 and 3 header buttons
    }
  });


  const locationStatus = document.getElementById('locationStatus'); //Stores the location status paragraph so it can be updated by multiple functions

  function completeStep1(label) { //This function is called after a valid location is confirmed
    setStatus(locationStatus, `Location set: ${label}`, 'success'); //Will show a green success message
    markStepComplete(step1); //Collapses step 1 and adds completed styling
    unlockAndOpenStep(step2); //Unlocks step 2 and opens it on mobile devices
    checkAllComplete(); //Checks if all 3 steps done to enable 'Find Activities' button
  }

  document.getElementById('enableLocationBtn').addEventListener('click', () => { //Listens for a click on the 'Find My Location' button 
    if (!navigator.geolocation) { 
      setStatus(locationStatus, 'Geolocation is not supported by your browser.', 'error'); //Checks if the browser supports geolocation (i.e. if it's enabled, older browsers may not have those features)
      return; //Stops the process here if no geolocation is possible
    }
    setStatus(locationStatus, 'Finding your location…', ''); //Shows a loading status message while waiting for the co-ordinates, to give the user feedback that something is happening
    navigator.geolocation.getCurrentPosition( 
      pos => { //Callback for when the co-ordinates are returned
        userLocation = { lat: pos.coords.latitude, lng: pos.coords.longitude }; //Asks the browser for the user's co-ordinates, storing them in the 'userLocation' variable
        completeStep1(`${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}`); //Rounds the co-ordinates to 4 decimal points in order to lessen space taken up, using it for the success message
      },
      () => setStatus(locationStatus, 'Could not get location. Try entering your postcode instead.', 'error') //Failure callback - which shows if the user's location cannot be gotten via geolocation
    );
  });

  document.getElementById('postcodeBtn').addEventListener('click', () => { //Listens for a click on the 'Confirm Postcode' button
    const raw = document.getElementById('postcode').value.trim().toUpperCase().replace(/\s+/g, ' '); //Reads the postcode input, trimming and cleaning it - removing spaces, coverting all letters to capital, replaces multiple spaces with a single space for formatting
    const postcodeRe = /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/; //Uses a regex to define a UK postcode's format
    //^ = must start here (nothing before)
    //[A-Z]{1,2} = 1 or 2 capital letters e.g. 'K' or 'KT'
    //\d = exactly 1 digit e.g. '6'
    //[A-Z\d]?= optionally 1 letter or digit e.g. the '1' in 'SW1'
    //? = an optional space
    //\d = exactly 1 digit e.g. '7'
    //[A-Z]{2} = exactly 2 capital letters e.g. 'NS'
    //$ = must end here (nothing after)

    if (!postcodeRe.test(raw)) { //'.test(raw)' checks if the cleaned postcode matches the regex pattern, with the ! flipping it, so the block runs if the postcode is invalid
      setStatus(locationStatus, 'Please enter a valid UK postcode (e.g. KT6 7NS).', 'error'); //Error message
      return; //Stops the function if the postcode is invalid
    }
    userLocation = { postcode: raw }; //The postcode is validated, storing it in 'userLocation' as an object
    completeStep1(raw); //Marks step 1 complete, allowing the user to proceed to steps 2 and 3, showing a success message
  });

  document.getElementById('postcode').addEventListener('keydown', e => { //Listens for keyboard input inside the postcode text field, allowing the user to press enter or click the confirm button
    if (e.key === 'Enter') document.getElementById('postcodeBtn').click(); //'e.key' is what checks if the enter key was pressed, which clicks the confirm button if so
  });


  const dateStatus      = document.getElementById('dateStatus'); //Status message paragraph
  const travelDateInput = document.getElementById('travelDate'); //The date picker input
  const dateError       = document.getElementById('dateError'); //The error message paragraph
  const todayISO        = new Date().toISOString().split('T')[0]; //Gets today's date as an ISO string format 'YYYY-MM-DD', e.g. '2026-03-11'

  travelDateInput.setAttribute('min', todayISO); //Sets the minimum selectable date to today's date, greying out past dates

  travelDateInput.addEventListener('change', () => { //Listens for the user changing the date picker value, and changes every time a new date is selected
    clearFieldError(travelDateInput, dateError); //Clears any previous error styling/message on the date input
    if (isDesktop() && travelDateInput.value) applyDate(travelDateInput.value); //On desktop, the site automatically passes onto step 3 if a date is selected, whereas on mobile the user needs to click the button
  });

  function applyDate(val) { //Validates and applies the selected date, then advances to step 3, where 'val' = the date string from the input e.g. '2026-06-15'
    if (!val) return; //If 'val' is empty, it stops the function
    if (val < todayISO) { //Compares the selected date string against today's date string, using string comparison works here because of the ISO dates, sorting them alphabetically — '2025-01-01' < '2026-03-11' just like numbers would
      showFieldError(travelDateInput, dateError, 'Please choose today or a future date.'); 
      return; //Stops the process here if it's a past date
    }
    markFieldValid(travelDateInput, dateError); //Validates the date, adding a green border to the input
    selectedDate = val; //Stores the date string in the shared 'selectedDate' variable
    const formatted = new Date(val).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }); //Converts the raw date string into a readable format for the status
    //'new Date(val)' creates a date object from the string
    //'.toLocaleDateString('en-GB', {...})' formats it for in a UK format (i.e. Day Date Month Year)
    setStatus(dateStatus, `Date: ${formatted}`, 'success'); //Shows green success message
    markStepComplete(step2); //Collapses step 2 with completed styling
    unlockAndOpenStep(step3); //Unlocks and opens step 3
    checkAllComplete(); //Checks if all 3 steps are done
  }

  document.getElementById('confirmDateBtn').addEventListener('click', () => { //Listens for a click on the 'Confirm Date' button (used on mobile)
    if (!travelDateInput.value) {
      showFieldError(travelDateInput, dateError, 'Please select a date before continuing.'); //If no date has been picked yet, show an error and stop
      return;
    }
    applyDate(travelDateInput.value); //If a date is selected, it passes through 'applyDate()' for validation and processing
  });


  const activityStatus  = document.getElementById('activityStatus'); //Stores the activity status paragraph so functions below can write messages into it
  const activityOptions = document.querySelectorAll('.activity-option'); //Gets all elements with class 'activity-option' and stores them into a list, using 'querySelectorAll', which returns multiple elements - in this case all 6 activities (All Activities, Museums, Nature etc.)

  activityOptions.forEach(opt => { //Loops through every activity and attaches click and keyboard listeners to each one, where 'opt' = the current activity being processed in each loop iteration
    function select() { //Defines a select() function for each specific activity, which is defined inside the loop so each activity gets its own version that knows which tile it belongs to via the opt variable
      activityOptions.forEach(o => { o.classList.remove('selected'); o.setAttribute('aria-pressed', 'false'); }); //First loops through all of the activities and deselects them all, ensuring that only one tile can be selected at a time,
      //removing the orange highlight styling and informing screen readers this activity is not selected
      opt.classList.add('selected'); //Selects the clicked activity, adding an orange highlight
      opt.setAttribute('aria-pressed', 'true'); //Tells screen readers that this activity has been selected
      selectedActivity = opt.dataset.value; //Stores the activity's data-value in the shared 'selectedActivity' variable, where 'dataset.value' reads the 'data-value=""' attribute from the HTML, such as 'museum', 'nature', 'theatre', or '' for all activities
    }
    opt.addEventListener('click', select); //Attaches the select() function to function when this tile is clicked with a mouse
    opt.addEventListener('keydown', e => { //Attaches a keyboard listener so the tile can also be activated by keyboard users who tab to it and press enter or space
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(); } //'e.preventDefault()' stops the space key from scrolling the page, (its default browser behaviour)
    });
  });

  document.getElementById('confirmActivityBtn').addEventListener('click', () => { //Listens for a click for the 'Confirm Activity' button
    const label = document.querySelector('.activity-option.selected')?.textContent.trim() || 'All Activities'; //Finds the currently selected tile and reads its text content for the status message
  //'document.querySelector('.activity-option.selected')' finds the tile with BOTH classes
  //'.textContent.trim()' gets the text and removes surrounding whitespace
  //The '?.' is optional chaining - if no tile is selected it returns undefined instead of crashing
  //|| 'All Activities' is fallback text if nothing is selected
    setStatus(activityStatus, `Activity: ${label}`, 'success'); //Shows a green success message
    markStepComplete(step3); //Collapses step 3 with completed styling
    checkAllComplete(); //Checks if all 3 steps done, which enables Find Activities if so
  });


  findBtn.addEventListener('click', () => { //Listens for a click on the final 'Find Activities' button, 
  //To do: This is where the TfL/activities API call will go
    sessionStorage.setItem('tripSearch', JSON.stringify({ userLocation, selectedActivity, selectedDate }));
    window.location.href = '/Results';
  });
}


const LINE_COLOURS = { //Stores the tube line colours in a lookup table
  'bakerloo':          '#a45a2a',
  'central':           '#da291c',
  'circle':            '#ffcd00',
  'district':          '#007a33',
  'hammersmith-city':  '#e89cae',
  'jubilee':           '#7c878e',
  'metropolitan':      '#840b55',
  'northern':          '#000000',
  'piccadilly':        '#10069f',
  'victoria':          '#00a3e0',
  'waterloo-city':     '#6eceb2',
  'elizabeth':         '#6950a1',
  'dlr':               '#00A4A7',
  'london-overground': '#EE7C0E',
  'tram':              '#84B817',
};

const LINE_NAMES = { //The key is the line names as the API line names, converting them to a value that has a more readable format for users
  'bakerloo':          'Bakerloo',
  'central':           'Central',
  'circle':            'Circle',
  'district':          'District',
  'hammersmith-city':  'Hammersmith & City',
  'jubilee':           'Jubilee',
  'metropolitan':      'Metropolitan',
  'northern':          'Northern',
  'piccadilly':        'Piccadilly',
  'victoria':          'Victoria',
  'waterloo-city':     'Waterloo & City',
  'elizabeth':         'Elizabeth line',
  'dlr':               'DLR',
  'london-overground': 'Overground',
  'tram':              'Tram',
};

function getSeverityClass(code) { //Converts TfL's numeric severity code into a CSS class name, as the TfL API rates each line's status with a number, where lower is worse
  if (code === 10) return 'good'; //Shows a green dot on the widget
  if (code >= 5)  return 'minor'; //Shows an amber dot
  return 'severe'; //Shows a red dot 
}

async function fetchTflStatus() { //The main function that fetches live data from TfL and builds the widget, with 'async' meaning the function can pause and wait for the API response without freezing the rest of the page
  const list    = document.getElementById('tflLinesList'); //references the list of lines
  const updated = document.getElementById('tflLastUpdated'); //Is used to display the last time the tracker was updated

  if (!list) return; //Only runs if the widget exists

  list.innerHTML = '<div class="tfl-loading">Loading line status…</div>'; //Shows a loading message while waiting for the API response
  updated.textContent = 'Fetching data…'; //Replaces whatever was previously in the list div

  const lineIds = Object.keys(LINE_COLOURS).join(','); //Gets all the line IDs from 'LINE_COLOURS', 'Object.keys()' returns an array of just the keys (i.e. bakerloo, circle)
  //Where '.join(',')' joins them into a single comma-separated string, acting as a way to build the API URL so TfL knows which lines to return data for

  try { //tries the code block, if it fails, jumps to the next block
    const res  = await fetch(`https://api.tfl.gov.uk/Line/${lineIds}/Status`); //Sends a request to the TfL API and waits for the response, 'await' pauses this function until TfL responds
    //The URL uses template literals (backticks) to insert the lineIds string i.e. /line/bakerloo/status
    if (!res.ok) throw new Error(`${res.status}`); //'res.ok' is true if the server responded with a success code, if TfL's server returned an error, throw an 'Error' which jumps execution to the catch block below
    const data = await res.json(); //Reads the response body and converts it from JSON text into a JavaScript array of objects, where 'await' pauses again while this happens, turning data into an array i.e. id, linestatus, severity

    list.innerHTML = ''; //Clears the loading message

    data.sort((a, b) => { //Sorts the lines so disrupted ones appear at the top, 'data.sort()' takes a comparison function with two items a and b, where for each pair it returns a negative, zero, or positive number
      const aCode = a.lineStatuses?.[0]?.statusSeverity ?? 10; //Gets the severity code for line a, '?.' is optional chaining, if lineStatuses or [0] doesn't exist, returns undefined instead of crashing
      const bCode = b.lineStatuses?.[0]?.statusSeverity ?? 10; //'?? 10' means if the result is null or undefined, use 10 instead
      return aCode - bCode; // Subtracting aCode from bCode provides a negative result, therefore the worst status lines come to the top
    });

    data.forEach(line => { //Loops through every line returned by the TfL API and builds an HTML row for each, 'line' is the current line object being processed
      const id         = line.id; //Gets the line's ID from the API response e.g. 'central'
      const colour     = LINE_COLOURS[id] || '#888'; //References the colour for this line in 'LINE_COLOURS' using the id as the key, where '#888' is a fallback — if the id isn't found in 'LINE_COLOURS'
      const name       = LINE_NAMES[id]   || line.name; //Looks up the formatted names/values in 'LINE_NAMES', 'line.name' falls back to whatever name TfL sent in the API response if the id isn't found
      const status     = line.lineStatuses?.[0]; //Gets the first status object from the 'lineStatuses' array, TfL can return multiple statuses per line, although [0] takes just the most important one (i.e. the first or most important one)
      const statusText = status?.statusSeverityDescription || 'Unknown'; //Gets the readable status description e.g. 'Good Service', where 'status?.' means if status is undefined (no statuses returned), don't crash
      //'Unknown' is the fallback if no description exists
      const sevClass   = getSeverityClass(status?.statusSeverity ?? -1); //Converts the numeric severity code to a CSS class name, i.e. 'good', using the getSeverityClass function 
      //'?? -1' means if 'statusSeverity' is null or undefined, pass -1 to 'getSeverityClass', which will return 'severe' since -1 is below 5
      const pillText   = id === 'circle' ? '#1a1a2e' : '#fff'; //The Circle line has a yellow background, therefore dark text is needed so it's readable
      //All other lines have dark/coloured backgrounds so white text works fine

      const row = document.createElement('div'); //Creates a new empty <div> element in memory (not yet on the page)
      row.className = 'tfl-line-row'; //Gives it the CSS class for styling
      row.innerHTML = ` 
        <span class="line-pill" style="background:${colour}; color:${pillText};">${name}</span> 
        <span class="line-status-text">${statusText}</span>
        <span class="status-dot ${sevClass}" title="${statusText}"></span>
      `; //Fills the div with three child elements using a template literal, that use backticks and ${} to insert variables directly into HTML strings - This builds one complete row, i.e. line-status-text = Good Service
      //The title="${statusText}" on the dot means hovering over it shows the status as a tooltip, which also helps screen readers
      list.appendChild(row); //Adds the completed row div to the 'tflLinesList' div on the page, 'appendChild' adds it as the last child, with all lines in order
    });

    const now = new Date(); //Gets the current time to show when the data was last fetched
    updated.textContent = `Updated ${now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`; //Writes the timestamp into the footer of the widget, e.g. 'Updated 16:24'
    //With 'toLocaleTimeString('en-GB')' formatting it in UK style (24 hour clock) and '{ hour: '2-digit', minute: '2-digit' }' ensures it always shows as HH:MM

  } catch (err) { //Catches any errors and the execution jumps here instead
    list.innerHTML = `<div class="tfl-error">Could not load TfL data. Check your connection and try refreshing.</div>`; //Replaces the loading/line rows with an error message
    updated.textContent = 'Failed to load'; //Updates the timestamp to show the fetch failed
    console.error('TfL fetch error:', err); //Logs the full technical error details to the browser console
  }
}

fetchTflStatus(); 

let autoRefresh = setInterval(fetchTflStatus, 60000); //Starts an automatic refresh timer that calls 'fetchTflStatus' every 60000ms (milliseconds), where 'setInterval' returns a numeric ID for this timer, stored in autoRefresh so it
//can be cancelled later if the user clicks 'Pause'
let isPaused = false; //Tracks whether the auto-refresh is currently paused, and starts as false because the timer is running when the page loads

document.getElementById('tflRefreshBtn')?.addEventListener('click', fetchTflStatus); //Listens for a click on the manual refresh button, and, when clicked, calls 'fetchTflStatus()' to get the latest data without waiting for the automatic refresh

document.getElementById('tflPauseBtn')?.addEventListener('click', () => { //Listens for a click on the Pause/Resume button, where each click checks the current 'isPaused' state and does the opposite
  if (isPaused) { //If currently paused, the user wants to resume auto refreshing
    autoRefresh = setInterval(fetchTflStatus, 60000); //Starts a new 60 second timer and stores its ID in 'autoRefresh' again, A new 'setInterval' is needed as 'clearInterval' has been permanently cancelled
    isPaused = false; //Updates the tracking variable to reflect that the timer is now running
    document.getElementById('tflPauseBtn').textContent = '⏸ Pause'; //Updates the button text to show what clicking it will do next
  } else { //If currently running, the user wants to pause auto refreshing
    clearInterval(autoRefresh); //Cancels the timer using the ID stored in 'autoRefresh', which permanently stops that specific interval from firing again
    isPaused = true; //Updates the tracking variable to reflect that the timer is now stopped
    document.getElementById('tflPauseBtn').textContent = '▶ Resume'; 
  }
});

const searchParams = JSON.parse(sessionStorage.getItem('tripSearch') || '{}'); //Reads the search choices the user made on the Trip Planner page
//'sessionStorage.getItem('tripSearch')' retrieves the string that was made when the user clicked 'Find Activities', with 'JSON.parse()' coverting the object to JS
//'{}' is a safety net of sorts, if nothing gets entered or saved, it uses an empty object instead of crashing
const resultsLocation = searchParams.userLocation; //Extracts each individual value from the searchParams object into its own variable, this uses postcode
const resultsActivity = searchParams.selectedActivity; //Uses categories
const resultsDate     = searchParams.selectedDate; //Uses date

let allActivities      = []; //Two arrays that store activity data from the database, both every activity
let filteredActivities = []; //As well as specific filtered activities


function buildSummaryBar() { //Builds the summary bar at the top of the results page showing what the user searched for
  if (resultsLocation?.postcode) { //Updates the bar's location text
    document.getElementById('summaryLocation').textContent = resultsLocation.postcode;
  } else if (resultsLocation?.lat) { //Shows 'your current location' if geolocation was used
    document.getElementById('summaryLocation').textContent = 'your current location';
  }
  if (resultsDate) { //Updates the bar's date
    document.getElementById('summaryDate').textContent = new Date(resultsDate).toLocaleDateString('en-GB', { //Converts the raw date string, i.e. '2026-04-26' into a readable format
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    });
  }
  const tagsEl = document.getElementById('resultsTags'); //Finds the tags container element
  if (!tagsEl) return; //Stops here if no tags element present
  tagsEl.innerHTML = ''; //Clears previous tags
  const label = resultsActivity //Builds the activity tag 
    ? resultsActivity.charAt(0).toUpperCase() + resultsActivity.slice(1) //Capitalises the categories' first letter, with 'slice(1)' getting the rest of the string from the second character onward
    : 'All Activities'; //Defaults to all if no specific activity is chosen
  tagsEl.innerHTML += `<span class="results-tag">${label}</span>`;
  if (resultsDate) { //Adds a date tag
    const d = new Date(resultsDate);
    tagsEl.innerHTML += `<span class="results-tag tag-green">${d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>`;
  }
}


async function fetchActivities() { //Fetches matching activities from the Flask backend AP
  const categoryMap = { //Maps the data to the the category, with the values on the left and database names on the right
    'museum':  'Museum',
    'nature':  'Nature & Parks',
    'theatre': 'Theatre',
    'support': 'Support Groups',
    '':        '' //No filter, so all activities are present
  };
  const category = categoryMap[resultsActivity] || ''; //Looks up the mapped category name, defaulting to '' if not found
  const date     = resultsDate || '';
  const res = await fetch(`/api/activities?category=${encodeURIComponent(category)}&date=${encodeURIComponent(date)}`); //Sends a GET request to Flask using the category and date as URL parameters
  //'encodeURIComponent()' makes the values URL safe
  if (!res.ok) throw new Error('Failed to fetch activities'); //If an error occurs, throws an error which gets caught by init()
  return await res.json(); //Converts the JSON response into a JavaScript array of activity objects
}


function buildCard(activity) { //Builds a single activity card HTML element from an activity object
  const card = document.createElement('article'); //Creates a new <article> element in memory
  card.className = 'activity-card'; //Applies the card styling from CSS
  card.setAttribute('aria-label', activity.name); //Gives screen readers a label for the card
  card.setAttribute('tabindex', '0'); //Makes the card focusable with Tab key for keyboard navigation
  //Builds the card's inner HTML using a template literal
  //${} sections insert the live data
  card.innerHTML = ` 
    <div class="activity-card-img">
      ${activity.image //If the activity has an image filename, show the real image
        ? `<img src="/static/images/${activity.image}" alt="${activity.name}" style="width:100%;height:100%;object-fit:cover;">` //'object-fit:cover' fills the box without stretching, and crops the images if needed
        //If there's no image, it will show the placeholder
        : ''}
    </div>
    <div class="activity-card-body">
      <span class="activity-type-badge">${activity.category}</span> 
      <div class="activity-card-name">${activity.name}</div>
      <p class="activity-card-desc">${activity.location} · ${activity.duration} · ${activity.opening_hours}</p>
      <a class="activity-card-url" href="${activity.url}" target="_blank" rel="noopener" onclick="event.stopPropagation();">${activity.url}</a> 
      <div class="activity-card-meta">
        <span class="activity-price">${activity.price}</span>
        <span class="activity-distance">🚇 ${activity.journey_mins ? activity.journey_mins + ' mins away' : activity.postcode}</span>
      </div>
    </div>
  `; //Displays the card elements, such as location, duration and opening hours separated by dots
  //"event.stopPropagation()" stops the click from also triggering the whole card click handler below, which would open the URL twice
  //"Activity-Distance" shows the journey time in minutes if TfL calculated it, otherwise it falls back to postcode
  card.style.cursor = 'pointer'; //Makes the whole card clickable, which opens the activity's website in a new tab
  card.addEventListener('click', () => window.open(activity.url, '_blank', 'noopener'));
  card.addEventListener('keydown', e => { //Allows for enter/space to activate the card 
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); window.open(activity.url, '_blank', 'noopener'); } //'e.preventDefault()' stops Space from scrolling the page
  });
  return card; //Returns the completed card element so it can be added to the grid
}


function renderResults(activities) { //Takes an array of activity objects and writes them into the results grid
  const grid  = document.getElementById('resultsGrid'); //The grid where cards are
  const empty = document.getElementById('resultsEmpty'); //"No trips found" message 
  const count = document.getElementById('resultsCount'); //the 5 trips found counter
  if (!grid) return; //Checks if the grid exists, then stops if it doesn't to prevent crashing
  grid.innerHTML = ''; //Clears the current data
  if (activities.length === 0) { //If no activities matched the search, shows the empty state message and updates the counter
    empty.style.display = 'block'; //Makes the "No trips found" div visible
    count.textContent = 'No results found';
    return;
  }
  empty.style.display = 'none'; //If there are results, hide the empty state message
  count.textContent = `${activities.length} trip${activities.length !== 1 ? 's' : ''} found`; //Updates the results counter with the correct number and word
  //'activities.length !== 1' checks if there is more than one result, if true, adds 's' to the end
  activities.forEach(a => grid.appendChild(buildCard(a))); //Loops through every activity in the array, builds a card for each one, using 'buildCard()', appending it to the grid
  //'forEach' loops through each item, with 'a' being the current activity processing, 'appendChild' adds each card as the last child of the grid div
}


document.getElementById('sortSelect')?.addEventListener('change', e => { //Listens for the user changing the sort dropdown
  const val = e.target.value; //'e.target' is the dropdown element that changes, 'e.target.value' is the value of the new option
  let sorted = [...filteredActivities]; //Creates a copy of 'filteredActivities' using the spread operator, therefore it can reset to default if needed
  if (val === 'price-asc')  sorted.sort((a, b) => (a.price_numeric || 0) - (b.price_numeric || 0)); //Sorts by price ascending (cheapest), subtracts b from a — if the result is negative, a comes first and if positive, b comes first, 0 means that it accepts null or empty values, as some activities are free
  if (val === 'price-desc') sorted.sort((a, b) => (b.price_numeric || 0) - (a.price_numeric || 0)); //Sorts by price descending (most expensive)
  if (val === 'distance')   sorted.sort((a, b) => (a.journey_mins || 9999) - (b.journey_mins || 9999)); //Sorts by the closest journey time first, 9999 refers to activities with no journey time
  if (val === 'name')       sorted.sort((a, b) => a.name.localeCompare(b.name)); //Sorts alphabetically, 'localeCompare' is a string comparison method handling special characters
  renderResults(sorted); //Renders the grid with the filters in mind
});


function filterByType(activities) { //Filters the full list of activities down to only those matching the category the user chose on the Trip Planner page
  if (!resultsActivity) return activities; //If no activity type was chosen (resultsActivity is '' or undefined), return all activities unfiltered — the user chose 'All Activities'
  const categoryMap = { //Maps the Trip Planner's data value (lowercase) to the category name
    'museum':  'Museum',
    'nature':  'Nature & Parks',
    'theatre': 'Theatre',
    'support': 'Support Groups',
    '':        ''
  };
  const category = categoryMap[resultsActivity] || ''; //Looks up the mapped category name using 'resultsActivity' as the key
  if (!category) return activities; //If the mapping returned an empty string, meaning no match was found, it returns all activities
  return activities.filter(a => a.category === category); //Filters the array to only include activities whose category matches, '.filter()' loops through every activity and keeps only the ones where the condition is true
}

async function getJourneyTime(fromLocation, toPostcode) { //Calls the TfL Journey API to get the travel time in minutes from the user's location to the activity's location
  let from; //Will hold the 'from' part of the TfL API URL
  if (fromLocation.postcode) { //If the user entered a postcode, encode it for use in the URL
    from = encodeURIComponent(fromLocation.postcode); 
  } else if (fromLocation.lat) { //If geolocation was used, uses TfL, which accepts coordinates directly as 'lat,lng'
    from = `${fromLocation.lat},${fromLocation.lng}`;
  } else { //If no location is available, returns null as it can't calculate journey time
    return null;
  }

  const to = encodeURIComponent(toPostcode); //Encodes the destination postcode for use in the URL

  try {
    const res = await fetch(`https://api.tfl.gov.uk/Journey/JourneyResults/${from}/to/${to}?app_key=c7712bd11a31493c9c88323985b24206`); //Calls the TfL Journey API with the from and to locations
    //Using an API key (allows more requests) that I registered with an account for
    if (!res.ok) return null; //If TfL returned an error, return null
    const data = await res.json(); //Converts the response to a JS object
    const firstJourney = data.journeys?.[0]; //TfL returns an array of possible journey options and takes the first one, typically the fastest or most recommended route
    return firstJourney?.duration ?? null; //Returns the journey duration in minutes, with '?? null' meaning if the duration is undefined or null, it returns null instead
  } catch { //If anything goes wrong, it returns null rather than crashing the whole page
    return null;
  }
}

async function init() { //The main function that runs when the Results page loads, which handles coordinates, fetching activities, calculating journey times and rendering cards
  if (!document.getElementById('resultsGrid')) return; //If the grid doesn't exist, it stops
  buildSummaryBar(); //Builds the summary bar
  try {
    allActivities = await fetchActivities(); //Fetches all matching activities from the Flask API

    if (resultsLocation) { //Only runs the TfL journey time calculations if the user provided a location
      const journeyTimes = await Promise.all( //'Promise.all' runs all the TfL API calls simultaneously
        allActivities.map(a => getJourneyTime(resultsLocation, a.postcode)) //'allActivities.map()' creates an array of promises, and waits for them all to finish
      );
      allActivities = allActivities.map((a, i) => ({ //Attaches the journey time to each activity object, 'allActivities.map()' creates a new array where each activity gets a new property 'journey_mins' added
        ...a,
        journey_mins: journeyTimes[i] //'i' is the index, it matches each activity to its corresponding journey time
      }));
    }

    filteredActivities = filterByType(allActivities); //Filters the activities down to the chosen category
    renderResults(filteredActivities); //Renders the filtered activities as cards in the grid
  } catch (err) { //If anything in the try block above throws an error, it shows a user-friendly error message in the grid instead of a blank page
    const grid = document.getElementById('resultsGrid');
    if (grid) grid.innerHTML = `<p style="font-family:'Montserrat',sans-serif; color:#d94040; padding:2rem;">Could not load activities. Please try again.</p>`;
    console.error('Results fetch error:', err); //Logs the full technical error to the browser console to debug
  }
}
init(); //Calls init() immediately when the script loads, starting the whole process

