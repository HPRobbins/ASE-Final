
GENERIC APIs
GET 
    Input: name of target collection
    Output: all data in the collection (filtering on the code side), and status response

POST
    Input: name of target collection, generic data
    Output: Status response

PUT
    Input: name of target collection, identifier of target, replacement document
    Output: Status Response
    Brief: Requests a target identifier in the way of {fieldname:'data'}. example: {firstname:'James'} 
    Replaces previous document with the passed in replacement document, data should be formatted for MongoDB prior to being sent over.

DELETE
    Input: name of target collection, ID Of target
    Output: Status Response
    Brief: Requires the _ID of target data document. Deletes target based off that id.


