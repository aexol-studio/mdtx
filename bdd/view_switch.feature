Feature: View switcher

    User can switch between editor view, editor with live preview view, preview view and option to turn on fullscreen

    Scenario: User wants to change his view from editor view to preview view with fullscreen
        Given There is a tool to switch between views
        And This tool has feature of enabling fullscreen mode
        And User is logged in 

        When user interacts with this tool

        Then View shoul be changed to preview view
        And fullscreen mode should be enabled
        But user should disable fullscreen mode
        And change to different view