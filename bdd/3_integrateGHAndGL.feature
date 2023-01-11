Feature: MDTX integration with GitHub

    As a user of MDTX, I want to be able to connect my GitHub account to the app
    So that I can easily find and edit repositories within MDTX, then commit or make a pull request and upload it directly to GitHub

    Scenario: Successful connection to GitHub
        Given the user has a valid GitHub account and is logged into MDTX

        When the user clicks on the "Integrate" button

        Then the app should successfully connect to the user's GitHub account
        And the user should be able to view a list of their repositories within MDTX

    Scenario: Unsuccessful connection to GitHub
        Given the user is logged into MDTX but does not have a GitHub account or is not logged in to GitHub

        When the user clicks on the "Integrate" button

        Then the app should display an error message stating that the connection was unsuccessful
        And the user should be prompted to log into GitHub or create an account

    Scenario: Successful connection to GitLab
        Given the user has a valid GitLab account and is logged into MDTX

        When the user clicks on the "Integrate" button

        Then the app should successfully connect to the user's GitLab account
        And the user should be able to view a list of their repositories within MDTX

    Scenario: Unsuccessful connection to GitLab
        Given the user is logged into MDTX but does not have a GitLab account or is not logged in to GitLab

        When the user clicks on the "Integrate" button

        Then the app should display an error message stating that the connection was unsuccessful
        And the user should be prompted to log into GitLab or create an account

    Scenario: Finding and editing a repository in MDTX
        Given the user has a valid GitHub account and is logged into MDTX with the account connected

        When the user searches for a specific repository in the MDTX app

        Then the app should display the repository and its contents
        And the user should be able to make edits to the repository within MDTX