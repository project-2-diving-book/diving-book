# DIVINGBOOK

## DESCRIPTION:

DiveBook is a web application for divers to 
have an account, log their dives and share their experiences.

## TOOLS USED:

<br>

-   `JavaScript`, `Express`, `NodeJS`, `Handlebars`, `MongoDB`, `bootstrap`, `CSS`
-   `Cloudinary` to store images 
-   `Adatable` to deploy project

<br>
<br>

![screenshot](/public/images/homepageScreenshot.png)

<br>

<details>
  <summary> Click here to see the image </summary>
<br>

![](/public/images/profileScreenshot.png)
    
</details>

<br>

<details>
  <summary> Click here to see the image </summary>
<br>

![](/public/images/createDiveScreenshot.png)
    
</details>

<br>

## FUNCTIONALITY:

<br>

### **User that is not logged in:**

<br>

-   Singup

-   Login

-   READ functionality for diving-sites list and diving-site details.

<br>

### **User that is logged in:**

<br>

-   CREATE functionality for dives.
-   READ functionality for diving-sites list, diving-site details, 
    user profile, other users profile.
-   UPDATE functionality for dives details ( only dives created by same user ) and user details.
-   DELETE functionality for dives ( only dives created by same user ).

-   MAP functionality:
    -   Select location in map when creating a dive.
    -   Look for places with a search bar.
    -   View other users dives 
    -   Click on other users dives to see the details of that dive

<br>

-   Add dives from other users to your DivesToDo list

<br>

## INSTRUCTIONS TO RUN THIS APP ON YOUR COMPUTER:

<br>

-   Install dependencies: `npm install`
-   Create `.env` file and add enviroment variables:
    - CLOUDINARY_NAME
    - CLOUDINARY_KEY
    - CLOUDINARY_SECRET

    - Create a `Cloudinary account`, set the previous variables with the value from your account.
-   Run the application with `npm run dev`

<br>

## DEMO:

<br>

[Check it out!](https://divebook.adaptable.app/)


