Feature: Create a new account on the web app

    As a user, I want to be able to create a new account on the web app so that I can access the app's features.

    Scenario: Successfully create a new account
        Given the user is on the sign up page

        When the user enters a valid email, a unique username, and a password with at least 6 characters including at least one uppercase letter, one lowercase letter and one special character
        And clicks on "Create account" button

        Then a new account should be created
        And a confirmation email should be sent to the provided email address
        And the user should be directed to a confirmation page

    Scenario: Invalid email
        Given the user is on the sign up page

        When the user enters an invalid email, a unique username, and a password with at least 6 characters including at least one uppercase letter, one lowercase letter and one special character
        And clicks on "Create account" button

        Then an error message should be displayed, indicating that the email is invalid
        And the user should be able to correct their email and try again

    Scenario: Non-unique username
        Given the user is on the sign up page

        When the user enters a valid email, a non-unique username, and a password with at at least 6 characters including at least one uppercase letter, one lowercase letter and one special character
        And clicks on "Create account" button

        Then an error message should be displayed, indicating that the username is already in use
        And the user should be able to enter a new unique username and try again

    Scenario: Weak password
        Given the user is on the sign up page

        When the user enters a valid email, a unique username, and a password that doesn't meet the requirements (e.g. less than 6 characters or doesn't include an uppercase and lowercase letter or special characters)
        And clicks on "Create account" button

        Then an error message should be displayed, indicating that the password is weak
        And the user should be able to enter a new password that meets the requirements and try again
