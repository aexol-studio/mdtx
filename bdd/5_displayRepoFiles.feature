Feature: Display repo files

    User can choose desired file in files tree in selected repo.
    Mdtx filter files and displays only .md files, images and directories

    Scenario: User wants to display "welcome.md" file from "ThinkPad" repository
        Given ThinkPad repository exists and it's added to mdtx
        And welcome.md files exists
        And There is a tool to display files tree
        And There is a tool to display file content

        When User interacts with these tools by selecting the proper file

        Then welcome.md should be displayed
        And This file should be ready for edit