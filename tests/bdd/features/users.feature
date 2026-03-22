Feature: Users API
  As a QA engineer
  I want to validate the Users API
  So that I can ensure it meets the expected contract

  Background:
    Given the API base URL is configured

  Scenario: Get all users successfully
    When I send a GET request to "/users"
    Then the response status should be 200
    And the response should contain a list of users
    And each user should have properties "id", "name", "email"

  Scenario: Get a single user by ID
    When I send a GET request to "/users/2"
    Then the response status should be 200
    And the response should have property "id" with value "2"

  Scenario: Get a non-existent user
    When I send a GET request to "/users/9999"
    Then the response status should be 404

  Scenario: Create a new user
    Given I have a user payload with name "John Doe" and email "john@ensora.com"
    When I send a POST request to "/users"
    Then the response status should be 201
    And the response should have property "name" with value "John Doe"
    And the response body should contain an "id" field

  Scenario: Update an existing user
    Given I have a user payload with name "John Updated" and email "johnupdated@ensora.com"
    When I send a PUT request to "/users/2"
    Then the response status should be 200
    And the response should have property "name" with value "John Updated"

  Scenario: Delete a user
    When I send a DELETE request to "/users/2"
    Then the response status should be 200