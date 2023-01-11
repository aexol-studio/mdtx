Feature: Login to the web app

    As a user, I want to be able to log in to the web app so that I can access my account and the app's features.

    Scenario: Log in with Google
        Given the user is on the login page

        When the user clicks on the "Log in with Google" button
        And the user enters their Google credentials and clicks "Log in"

        Then the user should be logged in to the web app
        And the user's account information should be retrieved from Google

    Scenario: Log in with Apple
        Given the user is on the login page

        When the user clicks on the "Log in with Apple" button
        And the user enters their Apple credentials and clicks "Log in"

        Then the user should be logged in to the web app
        And the user's account information should be retrieved from Apple

    Scenario: Log in with GitHub
        Given the user is on the login page

        When the user clicks on the "Log in with GitHub" button
        And the user enters their GitHub credentials and clicks "Log in"

        Then the user should be logged in to the web app
        And the user's account information should be retrieved from GitHub

    Scenario: Log in with Microsoft
        Given the user is on the login page

        When the user clicks on the "Log in with Microsoft" button
        And the user enters their Microsoft credentials and clicks "Log in"

        Then the user should be logged in to the web app
        And the user's account information should be retrieved from Microsoft

    Scenario: Log in with app account
        Given the user is on the login page

        When the user enters their email and password and clicks "Log in"

        Then the user should be logged in to the web app
        And the user's account information should be retrieved from the app's database.
