[Live demo][live]

[live]: drransom.github.io/Dominionator

# Dominionator
I didn't find any Dominion card selector apps that satisfied me, so I'm making my own.
This will be a browser-based, mobile-friendly app written in pure Javascript, HTML5,
and CSS3--no third party libraries, including jQuery.

### Implemented features

#### Basic functionality
[X] Includes all cards from all published sets
[X] Can select cards based on set
[X] Calculates Platinum/Colony and Shelter
[X] Veto cards once selected

#### Additional UI functionality
[X] Form can be used to select sets on an opt-in or opt-out basis
[X] Form regulates internal consistency by automatically updating form fields
[X] Can sort cards by multiple criteria (set, cost, name)
[X] Navigate back and forth between sets using browser history

#### Animations
[X] Vetoed cards slide in and out
[X] Card history slides in and out

### Un-Implemented Features:

[] Remember user preferences from session to session using cookies
[] Additional restrictions on card selections (e.g., no attacks)
[] Change animations to be left-to-right, carousel-style
[] Reverse veto
[] Improve page styling

### Libraries to remove:
I started by adding third-party libraries to get functionality working, and
have slowly been removing as they're no longer needed.

[X] Twitter Bootstrap
[X] jQuery
[] Underscore
[] Papa.parse
