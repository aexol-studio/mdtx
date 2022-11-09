Feature: Log out

    User can log out

    Scenario: User wants to log out 
        Given User is logged in
        And There is a tool to log out

        When User interacts with this tool

        Then User should be logged out
        And User should be redirected to landing page

