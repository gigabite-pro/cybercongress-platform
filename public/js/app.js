  // Nav Link Highlight
  const sections = document.querySelectorAll('.sections');
  const navlinks = document.querySelectorAll('.navlink');
  const right = document.querySelector('.right-side');
  var timer = null;
  
  // Value assigning to Teacher/Student input
  const radios1 = document.querySelectorAll('.radios');
  var radio1Value = document.querySelector('#typeOfUser');
  // email validation 
  var email1 = document.getElementById('email');
  // Value assigning to Maintain Secrecy input
  const radios2 = document.querySelectorAll('.radios-2');
  const formReveal = document.querySelector('.form-reveal');

  // Phone Navbar appearing and backdrop
  const button = document.querySelector('#navbar-icon');
  const navbar = document.querySelector('.navbar-links-container');
  const blackout = document.querySelector('.blackout');
  const phoneLinks = document.querySelectorAll('.nav-link');

  // Illustration movement on hover
  const illustrationBox = document.querySelector('.home-illus');
  const mouth = document.querySelector('#Mouth');
  const fb = document.querySelector('#Icon_awesome-facebook-square');
  const snapchat = document.querySelector('#Icon_awesome-snapchat-square');
  const twitter = document.querySelector('#Icon_awesome-twitter-square');

  // SVG list for illustration movement
  const mouthList = [`M0,0A17.815,17.815,0,0,0,7.786,6.586a49.824,49.824,0,0,0,11.546,3.548`,`M0,0A17.815,17.815,0,0,0,7.786,6.586,45.606,45.606,0,0,0,24.13,10.6`,`M0,0A17.815,17.815,0,0,0,7.786,6.586c2.478,1.062,11.976,5.3,21.846,3.649`,`M0,0A17.815,17.815,0,0,0,7.786,6.586c2.478,1.062,11.976,5.3,21.846,3.649`,`M0,0A17.815,17.815,0,0,0,7.786,6.586c2.478,1.062,11.976,5.3,21.846,3.649a28.037,28.037,0,0,0,9.989-4.007`,`M0,0A17.815,17.815,0,0,0,7.786,6.586c2.478,1.062,11.976,5.3,21.846,3.649S47.265,0,47.265,0`]

  const fbList = [`M89.286,2.25H10.714A10.714,10.714,0,0,0,0,12.964V91.536A10.714,10.714,0,0,0,10.714,102.25H41.35v-34H27.288v-16H41.35v-12.2c0-13.873,8.259-21.536,20.908-21.536A85.193,85.193,0,0,1,74.652,19.6V33.214h-6.98c-6.877,0-9.022,4.268-9.022,8.645V52.25H74l-2.455,16H58.65v34H89.286A10.714,10.714,0,0,0,100,91.536V12.964A10.714,10.714,0,0,0,89.286,2.25Z`,`M92.857,2.25H11.143A11.143,11.143,0,0,0,0,13.393V95.107A11.143,11.143,0,0,0,11.143,106.25H43V70.892H28.379V54.25H43V41.566c0-14.428,8.589-22.4,21.745-22.4a88.6,88.6,0,0,1,12.889,1.124V34.453H70.379c-7.152,0-9.383,4.439-9.383,8.991V54.25H76.962L74.409,70.892H61V106.25H92.857A11.143,11.143,0,0,0,104,95.107V13.393A11.143,11.143,0,0,0,92.857,2.25Z`,`M97.321,2.25H11.679A11.679,11.679,0,0,0,0,13.929V99.571A11.679,11.679,0,0,0,11.679,111.25H45.072V74.192H29.744V56.75H45.072V43.456c0-15.121,9-23.474,22.79-23.474A92.861,92.861,0,0,1,81.37,21.16V36H73.762c-7.5,0-9.834,4.652-9.834,9.423V56.75H80.662L77.986,74.192H63.928V111.25H97.321A11.679,11.679,0,0,0,109,99.571V13.929A11.679,11.679,0,0,0,97.321,2.25Z`,`M99.107,2.25H11.893A11.893,11.893,0,0,0,0,14.143v87.214A11.893,11.893,0,0,0,11.893,113.25H45.9V75.512H30.29V57.75H45.9V44.212c0-15.4,9.167-23.9,23.208-23.9a94.565,94.565,0,0,1,13.756,1.2V36.62H75.116c-7.634,0-10.015,4.737-10.015,9.6V57.75H82.142L79.417,75.512H65.1V113.25H99.107A11.893,11.893,0,0,0,111,101.357V14.143A11.893,11.893,0,0,0,99.107,2.25Z`,`M101.786,2.25H12.214A12.214,12.214,0,0,0,0,14.464v89.571A12.214,12.214,0,0,0,12.214,116.25H47.14V77.493H31.108V59.25H47.14v-13.9c0-15.815,9.415-24.551,23.836-24.551A97.12,97.12,0,0,1,85.1,22.027V37.549H77.146c-7.84,0-10.285,4.865-10.285,9.855V59.25h17.5l-2.8,18.243H66.86V116.25h34.925A12.214,12.214,0,0,0,114,104.036V14.464A12.214,12.214,0,0,0,101.786,2.25Z`]
  
  const snapList = [`M100,2.25H12a12,12,0,0,0-12,12v88a12,12,0,0,0,12,12h88a12,12,0,0,0,12-12v-88A12,12,0,0,0,100,2.25ZM98.375,80.975c-.875,2.025-4.525,3.5-11.2,4.55A30.722,30.722,0,0,0,86.1,89.5a1.926,1.926,0,0,1-2.025,1.475h-.05c-1.55,0-3.2-.725-6.45-.725-4.4,0-5.925,1-9.35,3.425-3.625,2.575-7.1,4.775-12.3,4.55-5.25.4-9.65-2.8-12.125-4.55-3.45-2.425-4.95-3.425-9.35-3.425-3.125,0-5.1.775-6.45.775a1.985,1.985,0,0,1-2.075-1.5c-.45-1.525-.725-3.525-1.075-4C21.4,85,13.65,83.65,13.475,80.175a1.769,1.769,0,0,1,1.475-1.85c11.575-1.9,16.775-13.775,17-14.275,0-.025.025-.05.05-.075a3.739,3.739,0,0,0,.4-3.125c-.85-1.975-4.475-2.675-6-3.3-3.95-1.55-4.5-3.35-4.25-4.575.4-2.125,3.6-3.45,5.475-2.575a9.42,9.42,0,0,0,3.925,1.05,3.5,3.5,0,0,0,1.65-.35c-.35-5.975-1.175-14.5.95-19.275C39.775,19.25,51.675,18.25,55.175,18.25c.15,0,1.525-.025,1.675-.025A22.5,22.5,0,0,1,77.925,31.8c2.125,4.775,1.3,13.275.95,19.275a3.143,3.143,0,0,0,1.425.35,9.863,9.863,0,0,0,3.675-1.05,4.568,4.568,0,0,1,3.4,0,3.479,3.479,0,0,1,2.6,2.975c.025,1.625-1.425,3.025-4.3,4.15-.35.15-.775.275-1.225.425-1.625.525-4.1,1.3-4.75,2.875a3.834,3.834,0,0,0,.4,3.125c.025.025.025.05.05.075.225.5,5.425,12.375,17,14.275a1.92,1.92,0,0,1,1.225,2.7Z`,`M104.464,2.25H12.536A12.539,12.539,0,0,0,0,14.786v91.929A12.539,12.539,0,0,0,12.536,119.25h91.929A12.539,12.539,0,0,0,117,106.714V14.786A12.539,12.539,0,0,0,104.464,2.25Zm-1.7,82.24c-.914,2.115-4.727,3.656-11.7,4.753-.366.5-.653,2.559-1.123,4.152a2.012,2.012,0,0,1-2.115,1.541h-.052c-1.619,0-3.343-.757-6.738-.757-4.6,0-6.19,1.045-9.767,3.578-3.787,2.69-7.417,4.988-12.849,4.753-5.484.418-10.081-2.925-12.666-4.753-3.6-2.533-5.171-3.578-9.767-3.578-3.265,0-5.328.81-6.738.81a2.074,2.074,0,0,1-2.168-1.567c-.47-1.593-.757-3.682-1.123-4.179-3.6-.548-11.7-1.959-11.883-5.589a1.848,1.848,0,0,1,1.541-1.933c12.092-1.985,17.524-14.39,17.759-14.912,0-.026.026-.052.052-.078a3.906,3.906,0,0,0,.418-3.265c-.888-2.063-4.675-2.794-6.268-3.447-4.126-1.619-4.7-3.5-4.44-4.779.418-2.22,3.761-3.6,5.719-2.69a9.84,9.84,0,0,0,4.1,1.1,3.661,3.661,0,0,0,1.724-.366c-.366-6.242-1.227-15.147.992-20.135,5.876-13.136,18.307-14.181,21.964-14.181.157,0,1.593-.026,1.75-.026A23.506,23.506,0,0,1,81.4,33.119c2.22,4.988,1.358,13.868.992,20.135a3.284,3.284,0,0,0,1.489.366,10.3,10.3,0,0,0,3.839-1.1,4.772,4.772,0,0,1,3.552,0,3.634,3.634,0,0,1,2.716,3.108c.026,1.7-1.489,3.16-4.492,4.335-.366.157-.81.287-1.28.444-1.7.548-4.283,1.358-4.962,3a4.005,4.005,0,0,0,.418,3.265c.026.026.026.052.052.078.235.522,5.667,12.927,17.759,14.912a2.005,2.005,0,0,1,1.28,2.821Z`,`M108.929,2.25H13.071A13.075,13.075,0,0,0,0,15.321v95.857A13.075,13.075,0,0,0,13.071,124.25h95.857A13.075,13.075,0,0,0,122,111.179V15.321A13.075,13.075,0,0,0,108.929,2.25ZM107.158,88c-.953,2.206-4.929,3.812-12.2,4.956-.381.517-.681,2.669-1.171,4.33A2.1,2.1,0,0,1,91.582,98.9h-.054c-1.688,0-3.486-.79-7.026-.79-4.793,0-6.454,1.089-10.185,3.731-3.949,2.8-7.734,5.2-13.4,4.956-5.719.436-10.512-3.05-13.208-4.956-3.758-2.642-5.392-3.731-10.185-3.731-3.4,0-5.555.844-7.026.844a2.162,2.162,0,0,1-2.26-1.634c-.49-1.661-.79-3.84-1.171-4.357-3.758-.572-12.2-2.042-12.391-5.828a1.927,1.927,0,0,1,1.607-2.015c12.608-2.07,18.273-15,18.518-15.55,0-.027.027-.054.054-.082a4.073,4.073,0,0,0,.436-3.4c-.926-2.151-4.875-2.914-6.536-3.595-4.3-1.688-4.9-3.649-4.629-4.983.436-2.315,3.921-3.758,5.964-2.8a10.261,10.261,0,0,0,4.275,1.144,3.818,3.818,0,0,0,1.8-.381c-.381-6.508-1.28-15.795,1.035-21,6.127-13.7,19.09-14.787,22.9-14.787.163,0,1.661-.027,1.825-.027A24.51,24.51,0,0,1,84.883,34.438c2.315,5.2,1.416,14.46,1.035,21a3.424,3.424,0,0,0,1.552.381,10.744,10.744,0,0,0,4-1.144,4.976,4.976,0,0,1,3.7,0c1.716.626,2.8,1.852,2.832,3.241.027,1.77-1.552,3.3-4.684,4.521-.381.163-.844.3-1.334.463-1.77.572-4.466,1.416-5.174,3.132a4.177,4.177,0,0,0,.436,3.4c.027.027.027.054.054.082.245.545,5.909,13.48,18.518,15.55A2.091,2.091,0,0,1,107.158,88Z`,`M110.714,2.25H13.286A13.289,13.289,0,0,0,0,15.536v97.429A13.289,13.289,0,0,0,13.286,126.25h97.429A13.289,13.289,0,0,0,124,112.964V15.536A13.289,13.289,0,0,0,110.714,2.25Zm-1.8,87.16c-.969,2.242-5.01,3.875-12.4,5.038-.387.526-.692,2.713-1.19,4.4a2.132,2.132,0,0,1-2.242,1.633h-.055c-1.716,0-3.543-.8-7.141-.8-4.871,0-6.56,1.107-10.352,3.792-4.013,2.851-7.861,5.287-13.618,5.038-5.812.443-10.684-3.1-13.424-5.038-3.82-2.685-5.48-3.792-10.352-3.792-3.46,0-5.646.858-7.141.858a2.2,2.2,0,0,1-2.3-1.661c-.5-1.688-.8-3.9-1.19-4.429-3.82-.581-12.4-2.076-12.594-5.923a1.958,1.958,0,0,1,1.633-2.048c12.815-2.1,18.572-15.251,18.821-15.8,0-.028.028-.055.055-.083a4.14,4.14,0,0,0,.443-3.46c-.941-2.187-4.954-2.962-6.643-3.654-4.373-1.716-4.982-3.709-4.705-5.065.443-2.353,3.986-3.82,6.062-2.851a10.429,10.429,0,0,0,4.346,1.163,3.88,3.88,0,0,0,1.827-.388c-.387-6.615-1.3-16.054,1.052-21.34,6.228-13.922,19.4-15.029,23.278-15.029.166,0,1.688-.028,1.854-.028A24.912,24.912,0,0,1,86.274,34.966c2.353,5.287,1.439,14.7,1.052,21.34a3.48,3.48,0,0,0,1.578.387,10.92,10.92,0,0,0,4.069-1.163,5.057,5.057,0,0,1,3.764,0c1.744.637,2.851,1.882,2.879,3.294.028,1.8-1.578,3.349-4.761,4.595-.388.166-.858.3-1.356.471-1.8.581-4.539,1.439-5.259,3.183a4.245,4.245,0,0,0,.443,3.46c.028.028.028.055.055.083.249.554,6.006,13.7,18.821,15.8a2.125,2.125,0,0,1,1.356,2.989Z`,`M113.393,2.25H13.607A13.611,13.611,0,0,0,0,15.857v99.786A13.611,13.611,0,0,0,13.607,129.25h99.786A13.611,13.611,0,0,0,127,115.643V15.857A13.611,13.611,0,0,0,113.393,2.25ZM111.55,91.519c-.992,2.3-5.131,3.969-12.7,5.159-.4.539-.709,2.778-1.219,4.507a2.184,2.184,0,0,1-2.3,1.673h-.057c-1.758,0-3.629-.822-7.314-.822-4.989,0-6.719,1.134-10.6,3.884-4.11,2.92-8.051,5.414-13.947,5.159-5.953.454-10.942-3.175-13.749-5.159-3.912-2.75-5.613-3.884-10.6-3.884-3.544,0-5.783.879-7.314.879a2.251,2.251,0,0,1-2.353-1.7c-.51-1.729-.822-4-1.219-4.536-3.912-.6-12.7-2.126-12.9-6.067a2.006,2.006,0,0,1,1.673-2.1c13.125-2.154,19.022-15.62,19.277-16.187,0-.028.028-.057.057-.085a4.24,4.24,0,0,0,.454-3.544c-.964-2.24-5.074-3.033-6.8-3.742-4.479-1.758-5.1-3.8-4.819-5.188.454-2.41,4.082-3.912,6.208-2.92a10.681,10.681,0,0,0,4.451,1.191,3.974,3.974,0,0,0,1.871-.4c-.4-6.775-1.332-16.442,1.077-21.856C45.1,21.527,58.6,20.393,62.565,20.393c.17,0,1.729-.028,1.9-.028a25.515,25.515,0,0,1,23.9,15.393c2.41,5.415,1.474,15.053,1.077,21.856a3.564,3.564,0,0,0,1.616.4,11.184,11.184,0,0,0,4.167-1.191,5.18,5.18,0,0,1,3.855,0c1.786.652,2.92,1.928,2.948,3.373.028,1.843-1.616,3.43-4.876,4.706-.4.17-.879.312-1.389.482-1.843.6-4.649,1.474-5.386,3.26a4.348,4.348,0,0,0,.454,3.544c.028.028.028.057.057.085.255.567,6.152,14.032,19.277,16.187a2.177,2.177,0,0,1,1.389,3.062Z`];
  
  const twitterList = [`M120.536,2.25H14.464A14.468,14.468,0,0,0,0,16.714V122.786A14.468,14.468,0,0,0,14.464,137.25H120.536A14.468,14.468,0,0,0,135,122.786V16.714A14.468,14.468,0,0,0,120.536,2.25ZM105.8,50.1c.06.844.06,1.718.06,2.561,0,26.126-19.888,56.23-56.23,56.23a55.971,55.971,0,0,1-30.345-8.859,41.636,41.636,0,0,0,4.761.241,39.624,39.624,0,0,0,24.529-8.437A19.79,19.79,0,0,1,30.1,78.127a21.3,21.3,0,0,0,8.92-.362A19.765,19.765,0,0,1,23.2,58.359v-.241a19.75,19.75,0,0,0,8.92,2.5,19.722,19.722,0,0,1-8.8-16.453,19.517,19.517,0,0,1,2.682-9.974A56.116,56.116,0,0,0,66.747,54.864a19.806,19.806,0,0,1,33.72-18.05A38.727,38.727,0,0,0,113,32.052a19.712,19.712,0,0,1-8.679,10.878,39.33,39.33,0,0,0,11.391-3.074A41.6,41.6,0,0,1,105.8,50.1Z`,`M125.893,2.25H15.107A15.111,15.111,0,0,0,0,17.357V128.143A15.111,15.111,0,0,0,15.107,143.25H125.893A15.111,15.111,0,0,0,141,128.143V17.357A15.111,15.111,0,0,0,125.893,2.25ZM110.5,52.229c.063.881.063,1.794.063,2.675,0,27.287-20.772,58.729-58.729,58.729a58.458,58.458,0,0,1-31.694-9.253,43.487,43.487,0,0,0,4.973.252A41.385,41.385,0,0,0,50.735,95.82,20.669,20.669,0,0,1,31.442,81.5a22.247,22.247,0,0,0,9.316-.378A20.643,20.643,0,0,1,24.234,60.853V60.6a20.628,20.628,0,0,0,9.316,2.612,20.6,20.6,0,0,1-9.19-17.184,20.384,20.384,0,0,1,2.8-10.418A58.611,58.611,0,0,0,69.713,57.2,20.686,20.686,0,0,1,104.932,38.35a40.448,40.448,0,0,0,13.093-4.973,20.588,20.588,0,0,1-9.064,11.362,41.078,41.078,0,0,0,11.9-3.21A43.448,43.448,0,0,1,110.5,52.229Z`,`M129.464,2.25H15.536A15.54,15.54,0,0,0,0,17.786V131.714A15.54,15.54,0,0,0,15.536,147.25H129.464A15.54,15.54,0,0,0,145,131.714V17.786A15.54,15.54,0,0,0,129.464,2.25Zm-15.827,51.4c.065.906.065,1.845.065,2.751,0,28.061-21.362,60.4-60.4,60.4a60.117,60.117,0,0,1-32.593-9.516,44.719,44.719,0,0,0,5.114.259,42.559,42.559,0,0,0,26.346-9.062,21.255,21.255,0,0,1-19.84-14.727,22.878,22.878,0,0,0,9.58-.388A21.229,21.229,0,0,1,24.922,62.516v-.259a21.213,21.213,0,0,0,9.58,2.686,21.183,21.183,0,0,1-9.451-17.672,20.962,20.962,0,0,1,2.881-10.713,60.273,60.273,0,0,0,43.759,22.2,21.273,21.273,0,0,1,36.218-19.387,41.6,41.6,0,0,0,13.464-5.114,21.172,21.172,0,0,1-9.321,11.684,42.243,42.243,0,0,0,12.234-3.3A44.681,44.681,0,0,1,113.637,53.647Z`,`M131.25,2.25H15.75A15.754,15.754,0,0,0,0,18V133.5a15.754,15.754,0,0,0,15.75,15.75h115.5A15.754,15.754,0,0,0,147,133.5V18A15.754,15.754,0,0,0,131.25,2.25ZM115.2,54.356c.066.919.066,1.87.066,2.789,0,28.448-21.656,61.228-61.228,61.228A60.946,60.946,0,0,1,21,108.727a45.338,45.338,0,0,0,5.184.262A43.147,43.147,0,0,0,52.894,99.8,21.549,21.549,0,0,1,32.78,84.872a23.194,23.194,0,0,0,9.712-.394A21.522,21.522,0,0,1,25.266,63.347v-.262a21.506,21.506,0,0,0,9.713,2.723A21.475,21.475,0,0,1,25.4,47.892a21.251,21.251,0,0,1,2.92-10.861A61.1,61.1,0,0,0,72.68,59.541,21.566,21.566,0,0,1,109.4,39.886a42.169,42.169,0,0,0,13.65-5.184,21.464,21.464,0,0,1-9.45,11.845A42.826,42.826,0,0,0,126,43.2,45.3,45.3,0,0,1,115.2,54.356Z`,`M133.929,2.25H16.071A16.076,16.076,0,0,0,0,18.321V136.179A16.076,16.076,0,0,0,16.071,152.25H133.929A16.076,16.076,0,0,0,150,136.179V18.321A16.076,16.076,0,0,0,133.929,2.25ZM117.556,55.42c.067.938.067,1.908.067,2.846,0,29.029-22.1,62.478-62.478,62.478A62.19,62.19,0,0,1,21.429,110.9a46.263,46.263,0,0,0,5.29.268,44.027,44.027,0,0,0,27.254-9.375A21.988,21.988,0,0,1,33.449,86.558a23.667,23.667,0,0,0,9.911-.4A21.961,21.961,0,0,1,25.781,64.594v-.268A21.945,21.945,0,0,0,35.692,67.1a21.913,21.913,0,0,1-9.777-18.281A21.685,21.685,0,0,1,28.9,37.741,62.352,62.352,0,0,0,74.163,60.71a22.006,22.006,0,0,1,37.467-20.056,43.03,43.03,0,0,0,13.929-5.29,21.9,21.9,0,0,1-9.643,12.087,43.7,43.7,0,0,0,12.656-3.415A46.222,46.222,0,0,1,117.556,55.42Z`];

  const time = [0,100,150,200,250,300];

  // Loading Backdrop after submit btn click
  const message = document.querySelectorAll('#message');
  const nameOfUser = document.querySelector('#name');
  const phone = document.querySelector('#phone');
  const formAnon = document.querySelector('.form-anonymous')
  const submitBtn = document.querySelectorAll('#submit-btn');
  const loaderBackdrop = document.querySelector('#loading');
  const submit2 = document.getElementById("submit-news-btn");



// Reveal Identity form Show, Anonymous Form hide
  $('.reveal').click(function () {
    $('.form-anonymous').css("display", "none");
    $('.anonymous').css("display", "block");
    $('.reveal').css("display", "none");
    $('.form-reveal').css("display", "block");
    $('#report').css('height','fit-content');
    $('#report').css('margin-bottom','2rem');
  });


// Reveal Identity form Show, Reveal identity Form hide
  $('.anonymous').click(function () {
    $('.form-reveal').css("display", "none");
    $('.reveal').css("display", "block");
    $('.anonymous').css("display", "none");
    $('.form-anonymous').css("display", "block");
    $('#report').css('height','fit-content');
  });

  // Illustration on phone
  if(window.innerWidth < 500){
    $('.illus-inner').html("");
    $('.illus-inner').html(
      `<img src="https://cdn.discordapp.com/attachments/832263994839531600/833395881180135504/Illustration_2.png" width="210rem">`
    );
  }
  

// Scrollbar show/hide on right side
  right.addEventListener('scroll', (e)=>{

    if (e.target.classList.contains("on-scrollbar") === false) {
      e.target.classList.add("on-scrollbar");
  }
    let current = '';
    sections.forEach(section =>{
      const sectionTop = section.offsetTop;
      if(right.scrollTop >= sectionTop){
        current = section.getAttribute('id');
      }
  })
  
  navlinks.forEach(link =>{
    link.style.fontFamily = "Geomanist-Book";
    link.style.color = "#707070";
    if(link.classList.contains(current)){
      link.style.fontFamily = "Geomanist-Medium";
      link.style.color = "#454040";
    }
  });

    if(timer !== null) {
      clearTimeout(timer);        
  }
  timer = setTimeout(function() {
    e.target.classList.remove("on-scrollbar");
}, 300);
}, true);

// Value assigning to Teacher/Student input
radios1.forEach(radio=>{
  radio.addEventListener('click', ()=>{
    radios1.forEach(radio=>{
      radio.style.background = '#F1F1F1';
      radio.style.color = 'grey';
    })

    radio.style.background = '#888585';
    radio.style.color = 'white';
    radio.style.boxShadow = 'none'
    const value = radio.getAttribute('name');
    console.log(value);
    radio1Value.setAttribute("value", value);
    console.log(radio1Value.value);
  });
})


// Value assigning to Maintain Secrecy input
radios2.forEach(radio=>{
  radio.addEventListener('click', ()=>{
    radios2.forEach(radio=>{
      radio.style.background = '#F1F1F1';
      radio.style.color = 'grey';
    })

    if(formReveal.style.display == "block"){
      var radio2Value = document.querySelector('#maintainSecrecy1');
    }else{
      var radio2Value = document.querySelector('#maintainSecrecy2');
    }

    radio.style.background = '#888585';
    radio.style.color = 'white';
    radio.style.boxShadow = 'none'
    const value = radio.getAttribute('name');
    console.log(value);
    radio2Value.setAttribute("value", value);
    console.log(radio2Value.value);
  });
});

 // Phone Navbar appearing and backdrop
button.addEventListener('click', ()=>{
  navbar.style.left = '20%';
  blackout.style.display = 'block';
});

blackout.addEventListener('click', ()=>{
  navbar.style.left = '100%';
  blackout.style.display = 'none';
});

phoneLinks.forEach(link=>{
  link.addEventListener('click', ()=>{
    navbar.style.left = '100%';
    blackout.style.display = 'none';
  })
})

// Illustration movement on hover
illustrationBox.addEventListener('mouseover', ()=>{
  for(let i = 0;i < mouthList.length;i++){
    setTimeout(() => {
      mouth.setAttribute("d", mouthList[i])
    }, time[i]);
  }

  for(let i = 0;i < fbList.length;i++){
    setTimeout(() => {
      fb.setAttribute("d", fbList[i])
    }, time[i]);
  }

  for(let i = 0;i < snapList.length;i++){
    setTimeout(() => {
      snapchat.setAttribute("d", snapList[i])
    }, time[i]);
  }

  for(let i = 0;i < twitterList.length;i++){
    setTimeout(() => {
      twitter.setAttribute("d", twitterList[i])
    }, time[i]);
  }
});


 // Loading Backdrop after submit btn click and form validation
submitBtn.forEach(btn => {
  btn.addEventListener('click', (e)=>{

    if(formReveal.style.display == "block"){
      var radio2Value = document.querySelector('#maintainSecrecy1');
      if(!radio1Value.value){
        Toastify({
          text: `Please select if you are a Student or Teacher.`,
          duration: 5000,
          destination: "https://github.com/apvarun/toastify-js",
          newWindow: true,
          close: false,
          gravity: "top", // `top` or `bottom`
          position: "center", // `left`, `center` or `right`
          stopOnFocus: false, // Prevents dismissing of toast on hover
          style: {
            background: "#F1F1F1",
            color: 'black',
          }
        }).showToast();
        e.preventDefault();
      }
      else if(!radio2Value.value){
        Toastify({
          text: `Please select if you want to maintain secrecy or not.`,
          duration: 5000,
          destination: "https://github.com/apvarun/toastify-js",
          newWindow: true,
          close: false,
          gravity: "top", // `top` or `bottom`
          position: "center", // `left`, `center` or `right`
          stopOnFocus: false, // Prevents dismissing of toast on hover
          style: {
            background: "#F1F1F1",
            color: 'black',
          }
        }).showToast();
        e.preventDefault();
      }
      else if(phone.value == ""){
        Toastify({
          text: `Please enter your mobile number.`,
          duration: 5000,
          destination: "https://github.com/apvarun/toastify-js",
          newWindow: true,
          close: false,
          gravity: "top", // `top` or `bottom`
          position: "center", // `left`, `center` or `right`
          stopOnFocus: false, // Prevents dismissing of toast on hover
          style: {
            background: "#F1F1F1",
            color: 'black',
          }
        }).showToast();
        e.preventDefault();
      }
      else if(phone.value.toString().length > 10){
        Toastify({
          text: `Mobile number cannot exceed 10 digits.`,
          duration: 5000,
          destination: "https://github.com/apvarun/toastify-js",
          newWindow: true,
          close: false,
          gravity: "top", // `top` or `bottom`
          position: "center", // `left`, `center` or `right`
          stopOnFocus: false, // Prevents dismissing of toast on hover
          style: {
            background: "#F1F1F1",
            color: 'black',
          }
        }).showToast();
        e.preventDefault();
      }
      else if(nameOfUser.value == ""){
        Toastify({
          text: `Please enter your name.`,
          duration: 5000,
          destination: "https://github.com/apvarun/toastify-js",
          newWindow: true,
          close: false,
          gravity: "top", // `top` or `bottom`
          position: "center", // `left`, `center` or `right`
          stopOnFocus: false, // Prevents dismissing of toast on hover
          style: {
            background: "#F1F1F1",
            color: 'black',
          }
        }).showToast();
        e.preventDefault();
      }
      else if(message[0].value == ""){
        Toastify({
          text: `Please enter your message.`,
          duration: 5000,
          destination: "https://github.com/apvarun/toastify-js",
          newWindow: true,
          close: false,
          gravity: "top", // `top` or `bottom`
          position: "center", // `left`, `center` or `right`
          stopOnFocus: false, // Prevents dismissing of toast on hover
          style: {
            background: "#F1F1F1",
            color: 'black',
          }
        }).showToast();
        e.preventDefault();
      }
      else{
        formReveal.submit();
        loaderBackdrop.style.display = 'flex';
      }
    }else{
      var radio2Value = document.querySelector('#maintainSecrecy2');
      if(!radio2Value.value){
        Toastify({
          text: `Please select if you want to maintain secrecy or not.`,
          duration: 5000,
          destination: "https://github.com/apvarun/toastify-js",
          newWindow: true,
          close: false,
          gravity: "top", // `top` or `bottom`
          position: "center", // `left`, `center` or `right`
          stopOnFocus: false, // Prevents dismissing of toast on hover
          style: {
            background: "#F1F1F1",
            color: 'black',
          }
        }).showToast();
        e.preventDefault();
      }
      else if(message[1].value == ""){
        Toastify({
          text: `Please enter your message.`,
          duration: 5000,
          destination: "https://github.com/apvarun/toastify-js",
          newWindow: true,
          close: false,
          gravity: "top", // `top` or `bottom`
          position: "center", // `left`, `center` or `right`
          stopOnFocus: false, // Prevents dismissing of toast on hover
          style: {
            background: "#F1F1F1",
            color: 'black',
          }
        }).showToast();
        e.preventDefault();
      }
      else{
        formAnon.submit();
        loaderBackdrop.style.display = 'flex';
      }
    }
  });
});