TEMPLATE FOR RETROSPECTIVE (Team 17)
=====================================

The retrospective should include _at least_ the following
sections:

- [process measures](#process-measures)
- [quality measures](#quality-measures)
- [general assessment](#assessment)

## PROCESS MEASURES 

### Macro statistics

- Number of stories committed vs. done: 5 vs 4 
- Total points committed vs. done: 13 vs 18
- Nr of hours planned vs. spent (as a team): 52h vs 47h 28m

**Remember** a story is done ONLY if it fits the Definition of Done:

- Unit Tests passing
- Code review completed
- Code present on VCS
- End-to-End tests performed

> Please refine your DoD if required (you cannot remove items!) 

### Detailed statistics

| Story  | # Tasks | Points | Hours est. | Hours actual |
|--------|---------|--------|------------|--------------|
| _#0_   |    Initial Setup + Accounting    |       |      1h      |     1h         |
|_#0_      |   Scrum Meeting     |        |     15m       |       15m       |
|_#0_      |   Create Estimations Sheets      |        |     30m       |       30m       |
|_#0_      |   Study How to test in Node.js   |        |     1h       |        1h      |
|_#0_      |   Merge of UI of User Stories 3-5-4      |        |     1h       |       30m       |
|_#0_ | UI update |  | 30m | 30m |
|_#7_      |   Study socket.io in react and solve cors issue     |        |     3h       |       3h       |
|_#35_      |   Create table for service     |    3    |     30m       |       15m       |
|_#35_      |   Implementation of endpoint to Create and Read services     |   3     |     1h       |       1h       |
|_#35_      |   Implementation of UI to Create services|    3    |     3h       |       1h       |
|_#35_      |   Testing of User Story 35 |    3    |     2h       |       1h 30m       |
|_#35_      |   Code Review of User Story 35 |     3   |     1h       |       1h 50m       |
|_#1_      |   Create reservation table|     2   |     30m       |       18m       |
|_#1_      |   Implementation of endpoint for customer to select service |     2   |     1h      |       1h     |
|_#1_      |  Implementation UI for customers to select service and code update |     2   |     3h      |       1h     |
|_#1_      |  Testing of User Story 1 |     2   |     2h      |       45m     |
|_#1_      |  Code review of User Story 1 |     2   |     1h      |      2h 30m     |
|_#4_      |  Create counter-service table |     3   |     30m      |       20m     |
|_#4_      |  Implementation endpoint to associate service to counter |     3   |     1h      |       1h 15m    |
|_#4_      |  Implementation UI to associate service to counter + conflicts resolve |     3   |     3h      |       2h     |
|_#4_      |  Implementation of endpoint to define new counter |     3   |     1h      |       1h     |
|_#4_      |  Implementation of UI to define new counter |     3   |     3h      |       2h     |
|_#4_      |  Testing of User Story 4 |     3   |     2h      |       2h 15m     |
|_#4_ |  Code review of User Story 4 | 3 | 2h | 2h |
|_#6_ |  Implementation of endpoint to dequeue customer from awaiting list | 5 | 2h | 2h |
|_#6_ | Implementation of UI to dequeue customers from awaiting list  | 5 | 3h | 3h 30m |
|_#6_ | Testing of User Story 6 | 5 | 2h | 2h |
|_#6_ |  Code review of User Story 6 | 5 | 2h | 2h |
|_#7_ |  Implementation UI for customer notification | 5 | 3h | 3h |
|_#7_ |  Testing of User Story 7 | 5 | 1h | 1h |
|_#7_ | Code review of User Story 7 | 5 | 2h | 2h |


> place technical tasks corresponding to story `#0` and leave out story points (not applicable in this case)

- Hours per task average **47h 28m / 32 ≃  1h 29m**, standard deviation (estimate and actual) ≃ **(54.95, 50.145)**
- Total task estimation error ratio: sum of total hours estimation / sum of total hours spent - 1 = **(52h)/(47h 30m) - 1 ≃ -0.0947 = 9.47%**

  
## QUALITY MEASURES 

- Unit Testing:
  - Total hours estimated: 6h 40m
  - Total hours spent : 6h 20m
  - Nr of automated unit test cases: 12
  - Coverage (if available)
- E2E testing:
  - Total hours estimated: 3h 20m
  - Total hours spent: 3h 10m
- Code review 
  - Total hours estimated : 8h
  - Total hours spent : 10h 20m
  



## ASSESSMENT

- What caused your errors in estimation (if any)? 
<br/>We overestimated time spent in the UI implementation and undestimated time spent to learn how to test in Node js  

- What lessons did you learn (both positive and negative) in this sprint? <br/>Negative: our capability to commit to an high number of user stories<br/>
Positive: use of a well known technology (React and Node js)

- Which improvement goals set in the previous retrospective were you able to achieve? 
  
- Which ones you were not able to achieve? Why?

- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)
<br/>Improve tasks assignment to members of the team
<br/>

> Propose one or two

- One thing you are proud of as a Team!!
<br/>
Great spirit of cooperation