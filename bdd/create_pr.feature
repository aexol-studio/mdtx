Feature: Create pull request

    User can create pull requests via mdtx

    Scenario: User wants to create pull request to "main" branch in "qase" repo with title "test" and commit message "ciekawe czy zadziala?" on new branch "tesciki" with pr message "123"
        Given qase repo exists and has been added to mdtx
        And There is main branch
        And There is a tool to creatin new branch
        And This tool has feature to adding pull request titles
        And This tool has feature to adding pull request messages
        And This tool has feature to adding commit messages

        When User interacts with this tool

        Then Pull request should be created from tesciki to main
        And commit name should be ciekawe czy zadziala?
        And Pull request title should be test
        And Pull request message should be 123
        And Information about created pull request should be displayed
        But if something is wrong, then proper error message should be displayed
