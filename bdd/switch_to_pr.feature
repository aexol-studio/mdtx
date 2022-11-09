Feature: Switch to pull request mode

    User can switch between repositories and pull requests

    Scenario: User wants to switch to pull request mode from repository mode
        Given User is logged in
        And There is a tool to switch between repository and pull request modes

        When User interacts with this tool

        Then pull request mode should be activated
        And pull request should be displayed
        But user should be able to switch to repository mode again