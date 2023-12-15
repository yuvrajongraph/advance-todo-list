
# Advance calendar app

This app is use for creating the todos and appointment on the calendar on a specific date and time so user can get to know on which date and on which time he/she will do that particular part done by their own. They also sync their events with their google calendar also by using their google ids and set the birthday of their near ones by using the contact list feature in the app, system notification and alarm is also setup in the app according to specific date and time.

This app is helpful for all those user who are not easily remember the event they want to attend.

## Installation

Setup and Install the project with the following steps

```bash
npm create vite@latest frontend -- --template react
cd frontend

npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```
In tailwind.config.js file,
```bash
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

In index.css file,
```bash
@tailwind base;
@tailwind components;
@tailwind utilities;
```
and lastly,
```bash
npm run dev
```

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`VITE_BACKEND_URL`

`VITE_BACKEND_URL_TWO`


## Project structrure

- /src
  - /components
    - /Component1
        - Component1.jsx
    - /Component2
        - Component2.jsx
    - /Context
        - /Context1
            - Context1.jsx
            - Context1State.jsx
        - /Context2
            - Context2.jsx
            - Context2State.jsx
    - /hooks
        - hookFunction.jsx
    - /redux
    - store.jsx
        - /Example1
            - Example1Api.jsx
            - Example1Slice.jsx
     - /utils
        - utilFunction.jsx
- App.jsx
- main.jsx



## Features
- Light/dark mode toggle
- Google sync functionality
- Upload an image in profile section
- Fetch the contact list through google id
- Sync with Google Calendar

## Functionality

The functionality of my web app is to make the events for the user with the particular date time , and when the date time meets to the datetime given to any event on calendar by the user then the animation of shaking  take place with yellow color on the event present on the calendar and after time get passed it turn into the red color with the info get cut by a line for that particulr event showing the user that your event expired . Apart from that user can also update  and delete the event as he/she wanted, they can also sync their calendar with their google calendar and set the birthday from their contact list whenever they want. They also set their image in profile section and the functionality of crop it too.

## Technologies Used

The technologies, frameworks, libraries, or APIs used in our project are as follows

- Vite React
- Redux ToolKit 
- Tailwind CSS
- Material UI
  etc.

## Conclusion

End with a concluding note, thanking users for checking out your project and inviting feedback or suggestions.
