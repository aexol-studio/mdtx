Feature: Switch repo branches

    After selecting repo user can switch between branches of this repository

    Scenario: User wants to switch to branch "libraries" in repo "city"
        Given User is logged in
        And repository "city" exists and has been added to mdtx
        And in the "city" repo there is branch "libraries"
        And there is a tool to switch between branches

        When user interacts with this tool

        Then Branch should be changed to "libraries"
        And files from this branch should be displayed
        And Theses files should be ready to edit
        But if the branch is empty then proper information should be displayed(empty state for example)