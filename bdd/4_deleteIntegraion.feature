Feature: MDTX integration deletion with GitHub and GitLab

    As a user of MDTX, I want to be able to delete my integration with GitHub and GitLab
    So that I can disconnect my accounts from the app and remove access to my repositories

    Scenario: Successful deletion of GitHub integration
        Given the user has a valid GitHub account and is logged into MDTX with the account connected

        When the user clicks on the "Delete" button

        Then the app should successfully disconnect from the user's GitHub account
        And the user should no longer be able to view or edit their GitHub repositories within MDTX

    Scenario: Successful deletion of GitLab integration
        Given the user has a valid GitLab account and is logged into MDTX with the account connected

        When the user clicks on the "Delete" button

        Then the app should successfully disconnect from the user's GitLab account
        And the user should no longer be able to view or edit their GitLab repositories within MDTX