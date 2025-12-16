# Finish Task

An application to keep track of tasks to be done in order to achieve your goals or to reach the highest level of *Maslow's Hierarchy of Needs*

# Features
- Filter task based on its completion status
- Save tasks to localStorage for persistence
- Assign priority level to each task

# Folder Structure
```bash
└───src
    │─── App.jsx  # Source Code
    ├───components
    │   ─ ListItems.jsx # Todo Task Component
    │   ─ Modal.jsx     # Modal Component
    │
    ├───contexts
    │   ─ ThemeContext.jsx # Context for setting theme
    │
    └───hooks
        ─ useTasks.jsx # Set of functions associated with each todo e.g edit,add,delete
```

# License
MIT License