Simple Kanban API

This project is a web-service which exposes a REST API for a Kanban application: it allows Users to manage Tasks' progression through a Project.

Users can:

Create Projects
Add and edit Tasks
Invite other users to the team and remove them
A Project and its team can only be modified by their creator.

A team member, as well as the creator, can create and edit Tasks.

The creator User is not considered a team member.

API Specification
API Specification is provided in the ./swagger.yml file. It follows the Swagger 2.0 convention.
