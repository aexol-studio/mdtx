Feature: Edit files and display changes live

    User can edit the file using the markdown syntax.
    Markdown files is rendered live and user can notice changes

    Background: Markdown tools
        Given There is a feature to add bold text
        And There is a feature to add italic text
        And There is a feature to add strikethrough text
        And There is a feature to insert HR
        And There is a feature to add title
        And There is a feature to add links
        And There is a feature to insert quotes
        And There is a feature to insert a code
        And There is a feature to insert code blocks
        And There is a feature to insert comments
        And There is a feature to insert images
        And There is a feature to add unordered lists
        And There is a feature to add ordered lists
        And There is a feature to add checked lists

    Background: User state 
        Given User is logged in
        And "Raspbian" repository is added to mdtx
        And There is a "rasp-guide.md" file

    Scenario: User wants to bold his text in file rasp-guide.md
        Given There is some text in file rasp-guide

        When User interacts with this tool 

        Then Proper markdown syntax should be inserted to rasp-guide.md file
        And Changed rasp-guide.md should be displayed
        But User can also add bold text by interacting with this tool and input his text

    Scenario: User wants to italicize his text in file rasp-guide.md
        Given There is some text in file rasp-guide

        When User interacts with this tool 

        Then Proper markdown syntax should be inserted to rasp-guide.md file
        And changed rasp-guide.md should be displayed
        But User can also add italic text by interacting with this tool and input his text

    Scenario: User wants to strikethrough his text in file rasp-guide.md
        Given There is some text in file rasp-guide

        When User interacts with this tool 

        Then Proper markdown syntax should be inserted to rasp-guide.md file
        And Changed rasp-guide.md should be displayed
        But User can also add strikethrough text by interacting with this tool and input his text

    Scenario: User wants to add HR between his text in file rasp-guide.md
        Given There is some text in file rasp-guide

        When User interacts with this tool 

        Then Proper markdown syntax should be inserted to rasp-guide.md file
        And changed rasp-guide.md should be displayed
        But User can also insert HR by interacting with this tool and input his text or params inside

    Scenario: User wants to add title to his text in file rasp-guide.md
        Given There is some text in file rasp-guide

        When User interacts with this tool 

        Then User should be able to choose title size
        And Proper markdown syntax should be inserted to rasp-guide.md file
        And Changed rasp-guide.md should be displayed
        But User can also add title text by interacting with this tool and input his text

    Scenario: User wants to add link to his text in file rasp-guide.md
        Given There is some text in file rasp-guide

        When User interacts with this tool 

        Then Proper markdown syntax should be inserted to rasp-guide.md file
        And Changed rasp-guide.md should be displayed
        But User can also add link to his text by interacting with this tool and input his text
    
    Scenario: User wants to insert quote to his text in file rasp-guide.md
        Given There is some text in file rasp-guide

        When User interacts with this tool 

        Then Proper markdown syntax should be inserted to rasp-guide.md file
        And changed rasp-guide.md should be displayed
        But User can also insert quoted text by interacting with this tool and input his text

    Scenario: User wants to insert code to his text in file rasp-guide.md
        Given There is some text in file rasp-guide

        When User interacts with this tool 

        Then Proper markdown syntax should be inserted to rasp-guide.md file
        And Changed rasp-guide.md should be displayed
        But User can also insert code by interacting with this tool and input his code

    Scenario: User wants to insert code block to his text in file rasp-guide.md
        Given There is some text in file rasp-guide

        When User interacts with this tool 

        Then Proper markdown syntax should be inserted to rasp-guide.md file
        And changed rasp-guide.md should be displayed
        But User can also insert code blocks by interacting with this tool and input his code

    Scenario: User wants to add comment to his text in file rasp-guide.md
        Given There is some text in file rasp-guide

        When User interacts with this tool 

        Then Proper markdown syntax should be inserted to rasp-guide.md file
        And Changed rasp-guide.md should be displayed
        But User can also add comments by interacting with this tool and input his text

    Scenario: User wants to add image to file rasp-guide.md
        Given There is url to image

        When User interacts with this tool 

        Then Proper markdown syntax should be inserted to rasp-guide.md file
        And Changed rasp-guide.md should be displayed
        But User can also add images by interacting with this tool and input his urls

    Scenario: User wants to add unordered list to his text in file rasp-guide.md
        Given There is some text in file rasp-guide

        When User interacts with this tool 

        Then Proper markdown syntax should be inserted to rasp-guide.md file
        And Changed rasp-guide.md should be displayed
        But User can also add unordered list to his text by interacting with this tool and input his text

    Scenario: User wants to add ordered list to his text in file rasp-guide.md
        Given There is some text in file rasp-guide

        When User interacts with this tool 

        Then Proper markdown syntax should be inserted to rasp-guide.md file
        And Changed rasp-guide.md should be displayed
        But User can also add ordered list to his text by interacting with this tool and input his text

    Scenario: User wants to add checked list to his text in file rasp-guide.md
        Given There is some text in file rasp-guide

        When User interacts with this tool 

        Then Proper markdown syntax should be inserted to rasp-guide.md file
        And Changed rasp-guide.md should be displayed
        But User can also add checked list to his text by interacting with this tool and input his text