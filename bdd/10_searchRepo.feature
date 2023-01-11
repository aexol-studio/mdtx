Feature: Search repository

    User can search through added repositories

    Scenario: User wants to search for a repo named "SupaHot"
        Given SupaHot repo exists
        And The user is logged in
        And There is tool for searching and displaying searched repositories
        
        When The user enters some letters that are at the beginning of the name of the repo he is looking for 
        
        Then SupaHot repo should be displayed
        But If the user enters other letters, then other repositories should be displayed

