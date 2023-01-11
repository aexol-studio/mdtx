Feature: MDTX files tree for creating, moving and managing files and folders

    As a user of MDTX, I want to be able to create, move, and manage files and folders in a files tree within the app
    So that I can easily organize and navigate my code within the app

    Scenario: Creating a new file
        Given the user is connected to a GitHub or GitLab account in MDTX and has opened a repository

        When the user clicks on the "Add File" button in the files tree

        Then the app should open a dialog for the user to input the file name and extension
        And the user should be able to create a new file in the repository

    Scenario: Creating a new folder
        Given the user is connected to a GitHub or GitLab account in MDTX and has opened a repository

        When the user clicks on the "Add Folder" button in the files tree

        Then the app should open a dialog for the user to input the folder name
        And the user should be able to create a new folder in the repository

    Scenario: Moving a file
        Given the user has a file in a certain location within the files tree in MDTX

        When the user drags and drops the file to a new location

        Then the app should update the file's location within the repository
        And the user should be able to see the file in its new location within the files tree

    Scenario: Moving a folder
        Given the user has a folder in a certain location within the files tree in MDTX

        When the user drags and drops the folder to a new location

        Then the app should update the folder's location within the repository
        And the user should be able to see the folder in its new location within the files tree

    Scenario: Error message for invalid file/folder name
        Given the user is attempting to create a new file or folder in MDTX

        When the user inputs an invalid name for the file/folder (e.g. containing special characters, already existing in the same location)

        Then the app should display an error message
        And the user should be prompted to input a valid name before creating the file/folder

    Scenario: Renaming a file in MDTX
        Given the user has a file in a certain location within the files tree in MDTX

        When the user clicks on the "Rename" button on the file

        Then the app should open a dialog for the user to input the new file name
        And the user should be able to rename the file in the repository and the files tree

    Scenario: Renaming a folder in MDTX
        Given the user has a folder in a certain location within the files tree in MDTX

        When the user clicks on the "Rename" button on the folder

        Then the app should open a dialog for the user to input the new folder name
        And the user should be able to rename the folder in the repository and the files tree

    Scenario: Error message for invalid renamed file/folder name
        Given the user is attempting to rename a file or folder in MDTX

        When the user inputs an invalid name for the file/folder (e.g. containing special characters, already existing in the same location)

        Then the app should display an error message
        And the user should be prompted to input a valid name before renaming the file/folder