Feature: Login by GitHub

    User can login by GitHub and only by GitHub

    Scenario: User wants to log in with his GitHub account, approves the tool permissions and selects repositories to be used in mdtx
        Given User has a gh account
        And There is a tool to select repositories to be used
        And This tool asks the user for permissions

        When The user selects repositories and give proper permissions via this tool

        Then repositories should be displayed in mdtx editor
        And User can interact with his repositories
        But If User has no github account, then he can't login
        And If User will does not grant proper permissions, then he should be redirect to login page 

