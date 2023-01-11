Feature: Reset password

    As a user, I want to be able to reset my password if I have forgotten it, so that I can access my account again.

    Scenario: Successfully request password reset email
        Given the user is on the login page

        When the user clicks on the "Forgot password?" link
        And enters their registered email address
        And clicks on "Send reset email" button

        Then a password reset email should be sent to the provided email address

    Scenario: Non-existent email
        Given the user is on the login page

        When the user clicks on the "Forgot password?" link
        And enters a non-existent email address
        And clicks on "Send reset email" button

        Then an error message should be displayed, indicating that the email address does not exist in our system

    Scenario: Successfully reset password
        Given the user receives the password reset email

        When clicks on the "Reset Password" link in the email
        And enters a new password that meets the requirements (e.g. 6 characters, one uppercase, one lowercase letter, one special character)
        And clicks on "Reset Password" button

        Then the user's password should be updated successfully
        And the user should be directed to the login page

    Scenario: Weak password
        Given the user receives the password reset email

        When clicks on the "Reset Password" link in the email
        And enters a new password that doesn't meet the requirements (e.g. less than 6 characters or no uppercase,lowercase letter, one special character)
        And clicks on "Reset Password" button

        Then an error message should be displayed, indicating that the password is weak
        And the user should be able to enter a new password that meets the requirements and try again
