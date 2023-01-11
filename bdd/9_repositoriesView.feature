Feature: My repositories view for recent, favorite, and all repositories

    As a user of MDTX, I want to be able to view my recent, favorite, and all repositories in a single, organized view
    So that I can easily access and manage my repositories within the app

    Scenario: Viewing recent repositories in MDTX
        Given the user is connected to a GitHub or GitLab account in MDTX

        When the user opens the "My Repositories" view and recent repositories section

        Then the app should display a section for recent repositories
        And the user should be able to see a list of the repositories they have recently accessed within MDTX

    Scenario: Adding a repository to favorites in MDTX
        Given the user is connected to a GitHub or GitLab account in MDTX and has opened a repository

        When the user clicks on the "Add to Favorites" button

        Then the app should add the repository to the user's favorites
        And the user should be able to see the repository in the "Favorites" section within the "My Repositories" view

    Scenario: Viewing favorite repositories in MDTX
        Given the user has added repositories to their favorites in MDTX

        When the user opens the "My Repositories" view and favourites repositories section

        Then the app should display a section for favorite repositories
        And the user should be able to see a list of the repositories they have added as favorites within MDTX

    Scenario: Viewing all repositories in MDTX
        Given the user is connected to a GitHub or GitLab account in MDTX

        When the user opens the "My Repositories" view and all repositories section

        Then the app should display a section for all repositories
        And the user should be able to see a list of all the repositories they have access to within MDTX