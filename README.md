# Generic Apex Service

A service component that allows developers to make straight CRUD operations
on your Salesforce database from any JavaScript application.

## Motivation

Custom applications on the Salesforce platform use modern JavaScript.
However, the Aura Components framework exposes an interface with a lot of
boilerplate code; the LWC framework tries to simplify that, but still, it
heavily depends on the Apex code. Testing could be a real nightmare for
distributed or small teams that have inherited an old codebase and are not
ready to adopt TDD. This project tries to ease that burden, taking
responsibility away from Apex code and delegating it to JavaScript modules.
