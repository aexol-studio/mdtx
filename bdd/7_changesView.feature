Feature: MDTX changes section for GitHub and GitLab integrations

    As a user of MDTX, I want to be able to view and commit changes to my repositories in GitHub and GitLab
    So that I can easily manage and track my code changes within the app

    Scenario: Viewing changes in MDTX
        Given the user is connected to a GitHub or GitLab account in MDTX

        When the user opens a repository and makes changes

        Then the app should display a changes section in the interface
        And the user should be able to view the changes made in the repository within MDTX

    Scenario: Committing changes in MDTX
        Given the user has made changes to a repository in MDTX

        When the user clicks on the "Commit Changes" button

        Then the app should open a pop-up window for the user to fill in a commit head message and commit body message
        And the user should be able to commit the changes to the repository in GitHub or GitLab

    Scenario: Creating a pull request in MDTX
        Given the user has made changes to a repository in MDTX

        When the user clicks on the "Create Pull Request" button

        Then the app should open a pop-up window for the user to fill in fields such as the target branch, new branch name, pull request title, pull request message, commit head message, and commit body message
        And the user should be able to create a pull request in GitHub or GitLab

    Scenario: Error message for empty commit messages
        Given the user is attempting to commit changes in MDTX

        When the user leaves the commit head message or commit body message fields blank

        Then the app should display an error message stating that the commit message fields must be filled
        And the user should be prompted to fill in the required fields before committing the changes

    Scenario: Error message for empty pull request fields
        Given the user is attempting to create a pull request in MDTX

        When the user leaves the target branch, new branch name, pull request title, or pull request message fields blank

        Then the app should display an error message stating that the pull request fields must be filled
        And the user should be prompted to fill in the required fields before creating the pull request.